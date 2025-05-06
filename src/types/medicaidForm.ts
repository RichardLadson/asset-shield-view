
// Define the form data interface to match the API expectations
export interface MedicaidFormData {
  // Client Information
  clientDate: Date | undefined;
  homePhone: string;
  cellPhone: string;
  email: string;
  firstName: string;
  lastName: string;
  applicantName: string;
  spouseName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  applicantBirthDate: Date | undefined;
  spouseBirthDate: Date | undefined;
  dateOfBirth: Date | undefined; // Keep for backward compatibility
  applicantCitizen: boolean;
  spouseCitizen: boolean;
  veteranStatus: string;
  maritalStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Medical Data
  primaryDiagnosis: string;
  facilityName: string;
  facilityEntryDate: Date | undefined;
  medicalStatus: string;
  recentHospitalStay: boolean;
  hospitalStayDuration: string;
  longTermCareInsurance: boolean;
  insuranceDetails: string;
  
  // Income fields
  applicantSocialSecurity: string;
  spouseSocialSecurity: string;
  applicantPension: string;
  spousePension: string;
  annuityIncome: string;
  rentalIncome: string;
  investmentIncome: string;
  otherIncomeSources: string;
  applicantIncomeTotal: string;
  spouseIncomeTotal: string;
  otherIncomeTotal: string;
  totalMonthlyIncome: string;
  
  // Expenses fields
  rentMortgage: string;
  realEstateTaxes: string;
  utilities: string;
  homeownersInsurance: string;
  housingMaintenance: string;
  food: string;
  medicalNonReimbursed: string;
  healthInsurancePremiums: string;
  transportation: string;
  clothing: string;
  extraordinaryMedical: string;
  housingExpenseTotal: string;
  personalExpenseTotal: string;
  medicalExpenseTotal: string;
  totalMonthlyExpenses: string;
  
  // Assets fields
  totalChecking: string;
  totalSavings: string;
  moneyMarket: string;
  cds: string;
  stocksBonds: string;
  retirementAccounts: string;
  lifeInsuranceFaceValue: string;
  lifeInsuranceCashValue: string;
  homeValue: string;
  outstandingMortgage: string;
  otherRealEstate: string;
  intentToReturnHome: boolean;
  householdProperty: string;
  vehicleValue: string;
  otherAssets: string;
  burialPlots: boolean;
  totalBankAssets: string;
  totalInvestmentAssets: string;
  totalInsuranceAssets: string;
  totalPropertyAssets: string;
  totalPersonalAssets: string;
  totalAssetValue: string;
  
  // Additional Info
  trustInfo: string;
  giftsTransfers: boolean;
  giftsDetails: string;
  powerOfAttorney: boolean;
  healthcareProxy: boolean;
  livingWill: boolean;
  lastWill: boolean;
  additionalNotes: string;
}
