import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MedicaidFormData } from "./useMedicaidFormData";
import { usePlanningContext } from "@/context/PlanningContext";
import { useNavigate } from "react-router-dom";

export const useMedicaidFormSubmission = () => {
  const { 
    setClientInfo, 
    setAssets, 
    setIncome, 
    setExpenses, 
    setMedicalInfo, 
    setLivingInfo,
    setState,
    assessEligibility,
    generatePlan
  } = usePlanningContext();

  const [activeSection, setActiveSection] = useState<string>("client-info");
  const navigate = useNavigate();

  // Function to update context with form data
  const updateContextFromFormData = (formData: MedicaidFormData, calculateAge: (birthDate: Date) => number) => {
    // Log the values before updating context to verify what's being passed
    console.log("Updating context with form values:", {
      name: formData.applicantName,
      age: formData.applicantBirthDate 
        ? calculateAge(formData.applicantBirthDate)
        : 0,
      state: formData.state
    });
    
    // Update client info
    setClientInfo({
      name: formData.applicantName,
      age: formData.applicantBirthDate 
        ? calculateAge(formData.applicantBirthDate)
        : 0,
      maritalStatus: formData.maritalStatus,
      healthStatus: formData.medicalStatus,
      email: formData.email,
      phone: formData.cellPhone || formData.homePhone,
      state: formData.state
    });

    // Update assets
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
        retirementAccounts: parseFloat(formData.retirementAccounts) || 0
      },
      lifeInsurance: {
        faceValue: parseFloat(formData.lifeInsuranceFaceValue) || 0,
        cashValue: parseFloat(formData.lifeInsuranceCashValue) || 0
      },
      property: {
        homeValue: parseFloat(formData.homeValue) || 0,
        mortgageValue: parseFloat(formData.outstandingMortgage) || 0,
        otherRealEstate: parseFloat(formData.otherRealEstate) || 0,
        intentToReturnHome: formData.intentToReturnHome
      },
      exempt: {
        householdProperty: parseFloat(formData.householdProperty) || 0,
        vehicleValue: parseFloat(formData.vehicleValue) || 0,
        burialPlots: formData.burialPlots,
        otherAssets: parseFloat(formData.otherAssets) || 0
      },
      summary: {
        totalAssetValue: parseFloat(formData.totalAssetValue) || 0
      }
    });

    // Update income
    setIncome({
      socialSecurity: {
        applicant: parseFloat(formData.applicantSocialSecurity) || 0,
        spouse: parseFloat(formData.spouseSocialSecurity) || 0
      },
      pension: {
        applicant: parseFloat(formData.applicantPension) || 0,
        spouse: parseFloat(formData.spousePension) || 0
      },
      other: {
        annuity: parseFloat(formData.annuityIncome) || 0,
        rental: parseFloat(formData.rentalIncome) || 0,
        investment: parseFloat(formData.investmentIncome) || 0,
        other: formData.otherIncomeSources
      },
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
  
  const handleSubmit = async (
    e: React.FormEvent,
    formData: MedicaidFormData,
    formValid: boolean,
    calculateAge: (birthDate: Date) => number,
    setShowValidation: (show: boolean) => void
  ) => {
    e.preventDefault();
    
    // Set showValidation to true to display any validation errors
    setShowValidation(true);
    
    // Validate required fields
    if (!formData.applicantName || !formData.state || !formData.applicantBirthDate || !formData.maritalStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields (name, birth date, state, and marital status).",
        variant: "destructive",
      });
      return;
    }
    
    // Add console logs to debug form data
    console.log("Submitting form with data:", {
      clientInfo: {
        name: formData.applicantName,
        age: formData.applicantBirthDate ? calculateAge(formData.applicantBirthDate) : 0,
        maritalStatus: formData.maritalStatus,
        state: formData.state
      },
      totalAssets: formData.totalAssetValue,
      totalIncome: formData.totalMonthlyIncome
    });
    
    // Update context with form data
    updateContextFromFormData(formData, calculateAge);
    
    // Wait for state updates to propagate before proceeding
    setTimeout(async () => {
      // Log what was sent to context
      console.log("Updated context data after timeout:", {
        clientInfo: "currentClientInfo",
        assets: "currentAssets",
        income: "currentIncome",
        state: formData.state
      });
      
      // Show toast notification
      toast({
        title: "Form Submitted",
        description: "Your Medicaid Planning information has been saved successfully.",
      });
      
      try {
        // Generate an eligibility assessment
        await assessEligibility();
        
        // Generate a comprehensive plan
        await generatePlan('comprehensive');
        
        // Navigate to results page
        navigate('/results');
      } catch (error) {
        console.error("Error during form submission:", error);
        toast({
          title: "Error",
          description: "There was an error submitting your information. Please try again.",
          variant: "destructive",
        });
      }
    }, 100);
  };

  return {
    activeSection,
    setActiveSection,
    handleSubmit,
    updateContextFromFormData
  };
};