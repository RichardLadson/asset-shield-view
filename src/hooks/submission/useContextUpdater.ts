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

  const updateContextFromFormData = (formData: MedicaidFormData, calculateAge: (birthDate: Date) => number) => {
    const birthDate = formData.applicantBirthDate || formData.dateOfBirth;
    const age = birthDate ? calculateAge(birthDate) : 0;
    
    console.log("📋 Updating context from form data...");
    console.log("Form data received:", {
      name: formData.applicantName,
      age: age,
      state: formData.state,
      maritalStatus: formData.maritalStatus,
      hasAssetData: !!(formData.totalChecking || formData.totalSavings),
      hasIncomeData: !!(formData.applicantSocialSecurity || formData.applicantPension)
    });
    
    // Update client info
    setClientInfo({
      name: formData.applicantName || '',
      age: age,
      maritalStatus: formData.maritalStatus || 'single',
      healthStatus: formData.medicalStatus || 'stable',
      email: formData.email || '',
      phone: formData.cellPhone || formData.homePhone || '',
      state: formData.state || '',
      isCrisis: formData.medicalStatus === 'critical'
    });

    // Calculate and set assets in the format the backend expects
    const countableAssets = 
      parseFloat(formData.totalChecking || '0') +
      parseFloat(formData.totalSavings || '0') +
      parseFloat(formData.moneyMarket || '0') +
      parseFloat(formData.cds || '0') +
      parseFloat(formData.stocksBonds || '0') +
      parseFloat(formData.lifeInsuranceCashValue || '0');

    const nonCountableAssets = 
      parseFloat(formData.homeValue || '0') +
      parseFloat(formData.vehicleValue || '0') +
      parseFloat(formData.householdProperty || '0') +
      parseFloat(formData.retirementAccounts || '0');

    console.log("📊 Setting assets:", { countable: countableAssets, nonCountable: nonCountableAssets });
    
    // Set assets in the simple format expected by backend
    setAssets({
      countable: countableAssets,
      nonCountable: nonCountableAssets
    });

    // Calculate and set income in the format the backend expects
    const totalIncome = {
      socialSecurity: parseFloat(formData.applicantSocialSecurity || '0') + parseFloat(formData.spouseSocialSecurity || '0'),
      pension: parseFloat(formData.applicantPension || '0') + parseFloat(formData.spousePension || '0'),
      annuity: parseFloat(formData.annuityIncome || '0'),
      rental: parseFloat(formData.rentalIncome || '0'),
      investment: parseFloat(formData.investmentIncome || '0')
    };

    console.log("📊 Setting income:", totalIncome);
    
    setIncome(totalIncome);

    // Set expenses
    const totalExpenses = {
      housing: parseFloat(formData.rentMortgage || '0'),
      utilities: parseFloat(formData.utilities || '0'),
      food: parseFloat(formData.food || '0'),
      medical: parseFloat(formData.medicalNonReimbursed || '0'),
      healthInsurance: parseFloat(formData.healthInsurancePremiums || '0'),
      transportation: parseFloat(formData.transportation || '0'),
      clothing: parseFloat(formData.clothing || '0')
    };

    console.log("📊 Setting expenses:", totalExpenses);
    
    setExpenses(totalExpenses);

    // Update state
    setState(formData.state || '');

    // Set medical info if provided
    if (formData.primaryDiagnosis || formData.facilityName) {
      setMedicalInfo({
        diagnosis: formData.primaryDiagnosis || '',
        facility: formData.facilityName || '',
        facilityEntryDate: formData.facilityEntryDate,
        status: formData.medicalStatus || 'stable',
        recentHospitalization: formData.recentHospitalStay || false,
        hospitalizationDuration: formData.hospitalStayDuration || 0,
        longTermCareInsurance: formData.longTermCareInsurance || false,
        insuranceDetails: formData.insuranceDetails || ''
      });
    }

    // Set living info if provided
    if (formData.address || formData.emergencyContactName) {
      setLivingInfo({
        homeAddress: `${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`.trim(),
        willReturnHome: formData.intentToReturnHome || false,
        emergencyContact: {
          name: formData.emergencyContactName || '',
          phone: formData.emergencyContactPhone || ''
        }
      });
    }
  };

  return { updateContextFromFormData };
};