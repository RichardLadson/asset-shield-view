import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { MedicaidFormData } from "@/types/medicaidForm";

// Validation function to ensure data structure matches API expectations
const validateDataStructure = (data: {
  clientInfo: any;
  assets: any;
  income: any;
  state: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check clientInfo fields
  if (!data.clientInfo) {
    errors.push("clientInfo object is missing");
  } else {
    if (!data.clientInfo.name) errors.push("clientInfo.name is missing");
    if (data.clientInfo.age === undefined || data.clientInfo.age === null) errors.push("clientInfo.age is missing");
    if (!data.clientInfo.maritalStatus) errors.push("clientInfo.maritalStatus is missing");
    
    // Check for snake_case fields that shouldn't exist
    if ('health_status' in data.clientInfo) errors.push("clientInfo contains snake_case field 'health_status' (should be 'healthStatus')");
    if ('is_crisis' in data.clientInfo) errors.push("clientInfo contains snake_case field 'is_crisis' (should be 'isCrisis')");
  }
  
  // Check assets fields
  if (!data.assets) {
    errors.push("assets object is missing");
  } else {
    if (data.assets.countable === undefined) errors.push("assets.countable is missing");
    if (data.assets.nonCountable === undefined) errors.push("assets.nonCountable is missing");
    
    // Check for snake_case fields
    if ('non_countable' in data.assets) errors.push("assets contains snake_case field 'non_countable' (should be 'nonCountable')");
  }
  
  // Check income fields
  if (!data.income) {
    errors.push("income object is missing");
  } else {
    // Check for snake_case fields
    if ('social_security' in data.income) errors.push("income contains snake_case field 'social_security' (should be 'socialSecurity')");
  }
  
  // Check state
  if (!data.state) {
    errors.push("state is missing");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const useMedicaidFormSubmission = () => {
  const navigate = useNavigate();
  const { 
    setClientInfo, 
    setAssets, 
    setIncome, 
    setExpenses,
    setMedicalInfo,
    setLivingInfo,
    setState,
    assessEligibility 
  } = usePlanningContext();
  
  const [activeSection, setActiveSection] = useState<string>("client-info");

  const handleSubmit = async (
    e: React.FormEvent,
    formData: MedicaidFormData,
    formValid: boolean,
    calculateAge: (birthDate: Date) => number,
    setShowValidation: (show: boolean) => void
  ) => {
    e.preventDefault();
    
    if (!formValid) {
      setShowValidation(true);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate age from birth date
      const birthDate = formData.applicantBirthDate || formData.dateOfBirth;
      const age = birthDate ? calculateAge(birthDate) : 0;
      
      // Enhanced logging for debugging
      console.log("🔍 === FORM SUBMISSION DEBUG START ===");
      console.log("📋 Raw form data received:", {
        applicantName: formData.applicantName,
        dateOfBirth: formData.applicantBirthDate || formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        state: formData.state,
        totalAssets: {
          checking: formData.totalChecking,
          savings: formData.totalSavings,
          moneyMarket: formData.moneyMarket,
          homeValue: formData.homeValue
        },
        income: {
          applicantSS: formData.applicantSocialSecurity,
          spouseSS: formData.spouseSocialSecurity,
          pension: formData.applicantPension
        }
      });
      
      console.log("📋 Preparing data for submission...");
      console.log("Form data name:", formData.applicantName);
      console.log("Calculated age:", age);
      
      // Prepare client info
      const clientInfo = {
        name: formData.applicantName || '',
        age: age,
        maritalStatus: formData.maritalStatus || 'single',
        healthStatus: formData.medicalStatus || 'stable',
        email: formData.email || '',
        phone: formData.cellPhone || formData.homePhone || '',
        state: formData.state || '',
        isCrisis: formData.medicalStatus === 'critical'
      };
      
      // Calculate assets
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

      const assets = {
        countable: countableAssets,
        nonCountable: nonCountableAssets  // Changed from non_countable to nonCountable
      };
      
      // Calculate income
      const income = {
        socialSecurity: parseFloat(formData.applicantSocialSecurity || '0') + parseFloat(formData.spouseSocialSecurity || '0'),  // Changed from social_security
        pension: parseFloat(formData.applicantPension || '0') + parseFloat(formData.spousePension || '0'),
        annuity: parseFloat(formData.annuityIncome || '0'),
        rental: parseFloat(formData.rentalIncome || '0'),
        investment: parseFloat(formData.investmentIncome || '0')
      };
      
      // Calculate expenses
      const expenses = {
        housing: parseFloat(formData.rentMortgage || '0'),
        utilities: parseFloat(formData.utilities || '0'),
        food: parseFloat(formData.food || '0'),
        medical: parseFloat(formData.medicalNonReimbursed || '0'),
        healthInsurance: parseFloat(formData.healthInsurancePremiums || '0'),  // Changed from health_insurance
        transportation: parseFloat(formData.transportation || '0'),
        clothing: parseFloat(formData.clothing || '0')
      };
      
      console.log("📊 Prepared data for submission:", {
        clientInfo,
        assets,
        income,
        expenses,
        state: formData.state
      });
      
      // Prepare the data that will be sent to the API
      const apiData = {
        clientInfo,
        assets,
        income,
        state: formData.state || ''
      };
      
      // Validate data structure before sending
      console.log("🔍 Validating data structure...");
      const validation = validateDataStructure(apiData);
      
      if (!validation.isValid) {
        console.error("❌ Data validation failed:", validation.errors);
        console.error("📦 Data that failed validation:", apiData);
        toast({
          title: "Data Validation Error",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }
      
      console.log("✅ Data validation passed!");
      console.log("📦 === DATA BEING SENT TO API ===");
      console.log(JSON.stringify(apiData, null, 2));
      console.log("📦 === END DATA ===");
      
      // Update context with prepared data (for state persistence)
      setClientInfo(clientInfo);
      setAssets(assets);
      setIncome(income);
      setExpenses(expenses);
      setState(formData.state || '');
      
      // Update medical info if provided
      if (formData.primaryDiagnosis || formData.facilityName) {
        const medicalInfo = {
          diagnosis: formData.primaryDiagnosis || '',
          facility: formData.facilityName || '',
          facilityEntryDate: formData.facilityEntryDate,
          status: formData.medicalStatus || 'stable',
          recentHospitalization: formData.recentHospitalStay || false,
          hospitalizationDuration: formData.hospitalStayDuration || 0,
          longTermCareInsurance: formData.longTermCareInsurance || false,
          insuranceDetails: formData.insuranceDetails || ''
        };
        setMedicalInfo(medicalInfo);
      }
      
      // Update living info if provided
      if (formData.address || formData.emergencyContactName) {
        const livingInfo = {
          homeAddress: `${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`.trim(),
          willReturnHome: formData.intentToReturnHome || false,
          emergencyContact: {
            name: formData.emergencyContactName || '',
            phone: formData.emergencyContactPhone || ''
          }
        };
        setLivingInfo(livingInfo);
      }
      
      // Wait a moment for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Call assessEligibility with the prepared data directly to avoid async state issues
      console.log("🚀 Calling assessEligibility with override data...");
      console.log("📤 Final API payload:", JSON.stringify(apiData, null, 2));
      
      let eligibilityResult;
      try {
        eligibilityResult = await assessEligibility(apiData);
        console.log("✅ Assessment completed");
        console.log("📊 Eligibility result:", eligibilityResult);
        console.log("📊 Result type:", typeof eligibilityResult);
        console.log("📊 Result keys:", eligibilityResult ? Object.keys(eligibilityResult) : 'null');
      } catch (assessError) {
        console.error("❌ Error during assessEligibility:", assessError);
        throw assessError;
      }
      
      // Check if assessEligibility returned null (error case)
      if (!eligibilityResult) {
        console.error("❌ assessEligibility returned null - likely an error occurred");
        toast({
          title: "Assessment Failed",
          description: "Unable to process your eligibility assessment. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("📍 Navigating to results page...");
      console.log("🧭 Navigate function exists?", typeof navigate);
      console.log("🧭 Navigate function:", navigate);
      
      toast({
        title: "Success!",
        description: "Your Medicaid planning form has been submitted successfully.",
      });
      
      // Add a small delay to ensure the toast is shown
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("🚀 Actually calling navigate now...");
      
      try {
        navigate('/results');
        console.log("✅ Navigate called successfully");
      } catch (navError) {
        console.error("❌ Navigation error:", navError);
        console.error("Navigation error stack:", navError instanceof Error ? navError.stack : 'No stack trace');
      }
      
    } catch (error) {
      console.error("❌ Error during form submission:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    activeSection,
    setActiveSection,
    handleSubmit
  };
};