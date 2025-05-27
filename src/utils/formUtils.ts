
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
  // For testing phase, prepopulate with test data
  const testMode = true; // Set to false to disable prepopulation
  
  if (testMode) {
    return getTestFormData();
  }
  
  return {
    // Client Information
    clientDate: undefined,
    homePhone: "",
    cellPhone: "",
    email: "",
    firstName: "",
    lastName: "",
    applicantName: "", // Calculated from firstName + lastName on submit
    spouseName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: undefined,
    applicantBirthDate: undefined,
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

/**
 * Get prepopulated test form data
 * @returns Form data with test values
 */
export const getTestFormData = () => {
  const birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - 78); // 78 years old (younger)
  
  return {
    // Client Information
    clientDate: new Date(),
    homePhone: "(305) 555-1234",
    cellPhone: "(305) 555-1234",
    email: "testclient@example.com",
    firstName: "Maria",
    lastName: "Rodriguez",
    applicantName: "Maria Rodriguez",
    spouseName: "", // Single/widowed
    address: "123 Ocean Drive",
    city: "Miami",
    state: "FL", // Florida instead of California
    zipCode: "33139",
    dateOfBirth: birthDate,
    applicantBirthDate: birthDate,
    spouseBirthDate: undefined,
    applicantCitizen: true,
    spouseCitizen: false,
    veteranStatus: "yes", // Veteran status
    maritalStatus: "widowed", // Different marital status
    emergencyContactName: "Carlos Rodriguez",
    emergencyContactPhone: "(305) 555-5678",
    
    // Medical Data
    primaryDiagnosis: "Parkinson's Disease", // Different diagnosis
    facilityName: "Sunrise Senior Living",
    facilityEntryDate: new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)), // 60 days ago
    medicalStatus: "declining", // Different health status
    recentHospitalStay: false, // No recent hospitalization
    hospitalStayDuration: "",
    longTermCareInsurance: true, // Has LTC insurance
    insuranceDetails: "MetLife LTC Policy - $150/day benefit, 3 year term",
    
    // Income - Lower income scenario
    applicantSocialSecurity: "1800",
    spouseSocialSecurity: "0", // No spouse
    applicantPension: "500",
    spousePension: "0",
    annuityIncome: "0", // No annuity
    rentalIncome: "1200", // Has rental income
    investmentIncome: "100",
    otherIncomeSources: "VA Benefits $200/mo",
    applicantIncomeTotal: "2300",
    spouseIncomeTotal: "0",
    otherIncomeTotal: "1500",
    totalMonthlyIncome: "3800", // Total under Florida's income limit
    
    // Expenses
    rentMortgage: "0",
    realEstateTaxes: "400",
    utilities: "250",
    homeownersInsurance: "150",
    housingMaintenance: "100",
    food: "800",
    medicalNonReimbursed: "8000",
    healthInsurancePremiums: "450",
    transportation: "300",
    clothing: "200",
    extraordinaryMedical: "0",
    housingExpenseTotal: "900",
    personalExpenseTotal: "1300",
    medicalExpenseTotal: "8450",
    totalMonthlyExpenses: "10650",
    
    // Assets - Much lower asset scenario
    totalChecking: "3000",
    totalSavings: "12000",
    moneyMarket: "0",
    cds: "25000",
    stocksBonds: "0", // No stocks
    retirementAccounts: "45000", // Lower retirement
    lifeInsuranceFaceValue: "25000",
    lifeInsuranceCashValue: "5000",
    homeValue: "275000", // Lower home value
    outstandingMortgage: "50000", // Still has mortgage
    otherRealEstate: "150000", // Rental property
    intentToReturnHome: true, // Intends to return home
    householdProperty: "10000",
    vehicleValue: "8000",
    otherAssets: "2000",
    burialPlots: true,
    totalBankAssets: "40000",
    totalInvestmentAssets: "45000",
    totalInsuranceAssets: "5000",
    totalPropertyAssets: "375000", // Home + rental
    totalPersonalAssets: "20000",
    totalAssetValue: "485000", // Much lower total
    
    // Additional Info
    trustInfo: "Revocable Living Trust established 2020",
    giftsTransfers: true,
    giftsDetails: "Gifted $50,000 to children in 2023",
    powerOfAttorney: true,
    healthcareProxy: true,
    livingWill: true,
    lastWill: true,
    additionalNotes: "Client needs Medicaid planning due to memory care costs. Spouse still living at home."
  };
};
