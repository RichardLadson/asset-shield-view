import { useState, useEffect } from "react";
import { usePlanningContext } from "@/context/PlanningContext";
import { toast } from "@/hooks/use-toast";

// Define the form data interface to improve type safety
export interface MedicaidFormData {
  // Client Information
  clientDate: Date | undefined;
  homePhone: string;
  cellPhone: string;
  email: string;
  applicantName: string;
  spouseName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  applicantBirthDate: Date | undefined;
  spouseBirthDate: Date | undefined;
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

export const useMedicaidFormData = () => {
  const { clientInfo, state, setState, setClientInfo } = usePlanningContext();
  
  // Initialize form state with empty values
  const [formData, setFormData] = useState<MedicaidFormData>({
    // Client Information
    clientDate: undefined,
    homePhone: "",
    cellPhone: "",
    email: "",
    applicantName: "",
    spouseName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
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
  });
  
  const [formValid, setFormValid] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MedicaidFormData, string>>>({});
  const [showValidation, setShowValidation] = useState<boolean>(false);

  // Sync form data with context when it changes
  useEffect(() => {
    // Make sure clientInfo is not null before accessing its properties
    if (clientInfo && clientInfo.name) {
      setFormData(prev => ({
        ...prev,
        applicantName: clientInfo.name,
        maritalStatus: clientInfo.maritalStatus || ""
      }));
    }

    // Set state value from context
    if (state) {
      setFormData(prev => ({
        ...prev,
        state
      }));
    }
  }, [clientInfo, state]);

  // Validate form data
  useEffect(() => {
    const errors: Partial<Record<keyof MedicaidFormData, string>> = {};

    // Required fields validation
    if (!formData.applicantName.trim()) {
      errors.applicantName = "Applicant name is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.applicantBirthDate) {
      errors.applicantBirthDate = "Applicant birth date is required";
    }
    if (!formData.maritalStatus) {
      errors.maritalStatus = "Marital status is required";
    }

    // Validate totalAssetValue
    const assetValue = parseFloat(formData.totalAssetValue);
    if (isNaN(assetValue)) {
      errors.totalAssetValue = "Total asset value must be a valid number";
    } else if (assetValue < 0) {
      errors.totalAssetValue = "Total asset value cannot be negative";
    }

    // Validate totalMonthlyIncome
    const monthlyIncome = parseFloat(formData.totalMonthlyIncome);
    if (isNaN(monthlyIncome)) {
      errors.totalMonthlyIncome = "Total monthly income must be a valid number";
    } else if (monthlyIncome < 0) {
      errors.totalMonthlyIncome = "Total monthly income cannot be negative";
    }

    setFormErrors(errors);

    // Form is valid if there are no errors
    const isValid = Object.keys(errors).length === 0;
    setFormValid(isValid);

    // Only show toast notifications for errors if showValidation is true
    if (!isValid && showValidation) {
      Object.values(errors).forEach(error => {
        toast({
          title: "Form Validation Error",
          description: error,
          variant: "destructive",
        });
      });
    }
  }, [formData, showValidation]);
  
  // Handlers for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update context state value
    if (name === "state") {
      setState(value);
    }

    // Update context marital status
    if (name === "maritalStatus") {
      setClientInfo(prevClientInfo => ({
        ...prevClientInfo!,
        maritalStatus: value
      }));
    }
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date,
    });

    // Handle age calculation if birth date changes
    if (name === "applicantBirthDate" && date) {
      const age = calculateAge(date);

      setClientInfo(prevClientInfo => ({
        ...prevClientInfo!,
        age
      }));
    }
  };
  
  return {
    formData,
    setFormData,
    formValid,
    formErrors,
    setFormValid,
    showValidation,
    setShowValidation,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
    calculateAge
  };
};
