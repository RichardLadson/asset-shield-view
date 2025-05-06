
import { useState } from "react";
import { MedicaidFormData } from "@/types/medicaidForm";
import { usePlanningContext } from "@/context/PlanningContext";

export const useContextUpdater = () => {
  const { 
    setClientInfo, 
    setAssets, 
    setIncome, 
    setExpenses, 
    setMedicalInfo, 
    setLivingInfo,
    setState
  } = usePlanningContext();

  // Function to update context with form data
  const updateContextFromFormData = (formData: MedicaidFormData, calculateAge: (birthDate: Date) => number) => {
    // Ensure we're using the correct birth date field
    const birthDate = formData.applicantBirthDate || formData.dateOfBirth;
    
    // Calculate age as a number
    const age = birthDate ? calculateAge(birthDate) : 0;
    
    // Log the values before updating context to verify what's being passed
    console.log("Updating context with form values:", {
      fullName: formData.applicantName,
      age: age,
      state: formData.state,
      maritalStatus: formData.maritalStatus
    });
    
    // Update client info with properly structured data
    setClientInfo({
      name: formData.applicantName,
      age: age, // Make sure age is a number
      maritalStatus: formData.maritalStatus,
      healthStatus: formData.medicalStatus || "stable",
      email: formData.email,
      phone: formData.cellPhone || formData.homePhone,
      state: formData.state,
      // Add additional properties that might be expected by the API
      isCrisis: formData.medicalStatus === 'critical' || false
    });

    // Update assets with a structure matching the API expectations
    setAssets({
      checking: {
        total: parseFloat(formData.totalChecking) || 0
      },
      savings: {
        total: parseFloat(formData.totalSavings) || 0
      },
      investments: {
        moneyMarket: parseFloat(formData.moneyMarket) || 0,
        cds: parseFloat(formData.cds) || 0,
        stocksBonds: parseFloat(formData.stocksBonds) || 0,
        retirementAccounts: parseFloat(formData.retirementAccounts) || 0,
        total: parseFloat(formData.totalInvestmentAssets) || 0
      },
      lifeInsurance: {
        faceValue: parseFloat(formData.lifeInsuranceFaceValue) || 0,
        cashValue: parseFloat(formData.lifeInsuranceCashValue) || 0
      },
      property: {
        homeValue: parseFloat(formData.homeValue) || 0,
        mortgageValue: parseFloat(formData.outstandingMortgage) || 0,
        otherRealEstate: parseFloat(formData.otherRealEstate) || 0,
        intentToReturnHome: formData.intentToReturnHome,
        primaryResidence: {
          value: parseFloat(formData.homeValue) || 0,
          exempt: true
        },
        otherProperties: parseFloat(formData.otherRealEstate) || 0
      },
      vehicles: {
        primaryVehicle: {
          value: parseFloat(formData.vehicleValue) || 0,
          exempt: true
        },
        additionalVehicles: 0
      },
      exempt: {
        householdProperty: parseFloat(formData.householdProperty) || 0,
        vehicleValue: parseFloat(formData.vehicleValue) || 0,
        burialPlots: formData.burialPlots,
        otherAssets: parseFloat(formData.otherAssets) || 0
      },
      personalProperty: parseFloat(formData.householdProperty) || 0,
      other: parseFloat(formData.otherAssets) || 0,
      summary: {
        totalAssetValue: parseFloat(formData.totalAssetValue) || 0
      }
    });

    // Update income with a structure matching the API expectations
    setIncome({
      socialSecurity: {
        applicant: parseFloat(formData.applicantSocialSecurity) || 0,
        spouse: parseFloat(formData.spouseSocialSecurity) || 0
      },
      pension: {
        applicant: parseFloat(formData.applicantPension) || 0,
        spouse: parseFloat(formData.spousePension) || 0
      },
      employment: {
        applicant: 0,
        spouse: 0
      },
      other: {
        annuity: parseFloat(formData.annuityIncome) || 0,
        rental: parseFloat(formData.rentalIncome) || 0,
        investment: parseFloat(formData.investmentIncome) || 0,
        other: formData.otherIncomeSources
      },
      rentalIncome: parseFloat(formData.rentalIncome) || 0,
      investmentIncome: parseFloat(formData.investmentIncome) || 0,
      summary: {
        totalMonthlyIncome: parseFloat(formData.totalMonthlyIncome) || 0
      }
    });

    // Update expenses
    setExpenses({
      housing: {
        rentMortgage: parseFloat(formData.rentMortgage) || 0,
        taxes: parseFloat(formData.realEstateTaxes) || 0,
        utilities: parseFloat(formData.utilities) || 0,
        insurance: parseFloat(formData.homeownersInsurance) || 0,
        maintenance: parseFloat(formData.housingMaintenance) || 0,
        total: parseFloat(formData.housingExpenseTotal) || 0
      },
      personal: {
        food: parseFloat(formData.food) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        clothing: parseFloat(formData.clothing) || 0,
        total: parseFloat(formData.personalExpenseTotal) || 0
      },
      medical: {
        nonReimbursed: parseFloat(formData.medicalNonReimbursed) || 0,
        premiums: parseFloat(formData.healthInsurancePremiums) || 0,
        extraordinary: parseFloat(formData.extraordinaryMedical) || 0,
        total: parseFloat(formData.medicalExpenseTotal) || 0
      },
      summary: {
        totalMonthlyExpenses: parseFloat(formData.totalMonthlyExpenses) || 0
      }
    });

    // Update medical info
    setMedicalInfo({
      diagnosis: formData.primaryDiagnosis,
      facility: formData.facilityName,
      facilityEntryDate: formData.facilityEntryDate,
      status: formData.medicalStatus,
      recentHospitalization: formData.recentHospitalStay,
      hospitalizationDuration: formData.hospitalStayDuration,
      longTermCareInsurance: formData.longTermCareInsurance,
      insuranceDetails: formData.insuranceDetails
    });

    // Update living info
    setLivingInfo({
      homeAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      willReturnHome: formData.intentToReturnHome,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone
      }
    });

    // Update state
    setState(formData.state);
  };

  return { updateContextFromFormData };
};
