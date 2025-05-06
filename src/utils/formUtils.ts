
/**
 * Calculate age from birth date
 * @param birthDate The date of birth
 * @returns The calculated age
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get initial form data with empty values
 * @returns Empty form data object
 */
export const getInitialFormData = () => {
  return {
    // Client Information
    clientDate: undefined,
    homePhone: "",
    cellPhone: "",
    email: "",
    firstName: "",
    lastName: "",
    applicantName: "", // Added missing required property
    spouseName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: undefined,
    applicantBirthDate: undefined, // Added missing required property
    spouseBirthDate: undefined,
    applicantCitizen: false,
    spouseCitizen: false,
    veteranStatus: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    
    // Medical Data
    primaryDiagnosis: "",
    facilityName: "",
    facilityEntryDate: undefined,
    medicalStatus: "",
    recentHospitalStay: false,
    hospitalStayDuration: "",
    longTermCareInsurance: false,
    insuranceDetails: "",
    
    // Income
    applicantSocialSecurity: "",
    spouseSocialSecurity: "",
    applicantPension: "",
    spousePension: "",
    annuityIncome: "",
    rentalIncome: "",
    investmentIncome: "",
    otherIncomeSources: "",
    applicantIncomeTotal: "0.00",
    spouseIncomeTotal: "0.00",
    otherIncomeTotal: "0.00",
    totalMonthlyIncome: "0.00",
    
    // Expenses
    rentMortgage: "",
    realEstateTaxes: "",
    utilities: "",
    homeownersInsurance: "",
    housingMaintenance: "",
    food: "",
    medicalNonReimbursed: "",
    healthInsurancePremiums: "",
    transportation: "",
    clothing: "",
    extraordinaryMedical: "",
    housingExpenseTotal: "0.00",
    personalExpenseTotal: "0.00",
    medicalExpenseTotal: "0.00",
    totalMonthlyExpenses: "0.00",
    
    // Assets
    totalChecking: "",
    totalSavings: "",
    moneyMarket: "",
    cds: "",
    stocksBonds: "",
    retirementAccounts: "",
    lifeInsuranceFaceValue: "",
    lifeInsuranceCashValue: "",
    homeValue: "",
    outstandingMortgage: "",
    otherRealEstate: "",
    intentToReturnHome: false,
    householdProperty: "",
    vehicleValue: "",
    otherAssets: "",
    burialPlots: false,
    totalBankAssets: "0.00",
    totalInvestmentAssets: "0.00",
    totalInsuranceAssets: "0.00",
    totalPropertyAssets: "0.00",
    totalPersonalAssets: "0.00",
    totalAssetValue: "0.00",
    
    // Additional Info
    trustInfo: "",
    giftsTransfers: false,
    giftsDetails: "",
    powerOfAttorney: false,
    healthcareProxy: false,
    livingWill: false,
    lastWill: false,
    additionalNotes: ""
  };
};
