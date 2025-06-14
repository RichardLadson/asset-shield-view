
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { MedicaidFormData } from "@/types/medicaidForm";
import { useProgressTracking } from "@/hooks/useProgressTracking";

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
    // Assets now contain individual fields, not just countable/nonCountable totals
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
    assessEligibility,
    generateComprehensivePlan,
    setLoading
  } = usePlanningContext();
  
  const [activeSection, setActiveSection] = useState<string>("client-info");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const progressSteps = [
    { id: 'validate', label: 'Validating form data' },
    { id: 'prepare', label: 'Preparing application' },
    { id: 'assess', label: 'Assessing eligibility' },
    { id: 'generate', label: 'Generating comprehensive plan' },
    { id: 'complete', label: 'Finalizing results' }
  ];
  
  const progressTracking = useProgressTracking(progressSteps);

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
      // Set both loading states to show progress modal
      setLoading(true);
      setIsProcessing(true);
      
      // Start progress tracking - Step 1: Validating (starts as active)
      progressTracking.reset();
      
      if (import.meta.env.DEV) {
        console.log("🔄 Step 1: Validating form data (active)");
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Calculate age from birth date
      const birthDate = formData.applicantBirthDate || formData.dateOfBirth;
      const age = birthDate ? calculateAge(birthDate) : 0;
      
      if (import.meta.env.DEV) {
        console.log("📋 Form submission started for:", formData.applicantName);
      }
      
      // Complete validation step and move to preparation
      progressTracking.nextStep();
      if (import.meta.env.DEV) {
        console.log("✅ Step 1: Validating (completed)");
        console.log("🔄 Step 2: Preparing application (active)");
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Prepare client info
      const clientInfo = {
        name: formData.applicantName || '',
        age: age,
        maritalStatus: formData.maritalStatus || 'single',
        healthStatus: formData.medicalStatus || 'good',
        email: formData.email || '',
        phone: formData.cellPhone || formData.homePhone || '',
        state: formData.state || '',
        isCrisis: formData.medicalStatus === 'critical'
      };
      
      // Calculate assets with individual fields for backend
      console.log("🔍 DEBUG: Form data fields for assets:", {
        totalChecking: formData.totalChecking,
        totalSavings: formData.totalSavings,
        moneyMarket: formData.moneyMarket,
        cds: formData.cds,
        stocksBonds: formData.stocksBonds,
        lifeInsuranceCashValue: formData.lifeInsuranceCashValue,
        otherRealEstate: formData.otherRealEstate,
        otherAssets: formData.otherAssets,
        homeValue: formData.homeValue,
        outstandingMortgage: formData.outstandingMortgage,
        householdProperty: formData.householdProperty,
        vehicleValue: formData.vehicleValue,
        retirementAccounts: formData.retirementAccounts
      });
      
      const assets = {
        // Countable assets (individual fields)
        bank_accounts: parseFloat(formData.totalChecking || '0') + parseFloat(formData.totalSavings || '0'),
        investments: parseFloat(formData.moneyMarket || '0') + parseFloat(formData.cds || '0') + parseFloat(formData.stocksBonds || '0'),
        life_insurance_cash_value: parseFloat(formData.lifeInsuranceCashValue || '0'),
        other_real_estate: parseFloat(formData.otherRealEstate || '0'), // COUNTABLE: Second properties, etc.
        other_assets: parseFloat(formData.otherAssets || '0'),
        
        // Non-countable assets (using backend field names)
        primary_residence: parseFloat(formData.homeValue || '0') - parseFloat(formData.outstandingMortgage || '0'), // Net equity only
        personal_effects: parseFloat(formData.householdProperty || '0'),
        automobile_primary: parseFloat(formData.vehicleValue || '0'),
        retirement_accounts: parseFloat(formData.retirementAccounts || '0')
      };
      
      console.log("💰 DEBUG: Calculated assets object:", assets);
      const totalCountable = assets.bank_accounts + assets.investments + assets.life_insurance_cash_value + assets.other_real_estate + assets.other_assets;
      const totalNonCountable = assets.primary_residence + assets.personal_effects + assets.automobile_primary + assets.retirement_accounts;
      console.log("📊 DEBUG: Asset totals:", {
        totalCountable,
        totalNonCountable,
        grandTotal: totalCountable + totalNonCountable
      });
      
      // Calculate income
      const income = {
        socialSecurity: parseFloat(formData.applicantSocialSecurity || '0') + parseFloat(formData.spouseSocialSecurity || '0'),
        pension: parseFloat(formData.applicantPension || '0') + parseFloat(formData.spousePension || '0'),
        annuity: parseFloat(formData.annuityIncome || '0'),
        rental: parseFloat(formData.rentalIncome || '0'),
        investment: parseFloat(formData.investmentIncome || '0')
      };
      
      // Calculate expenses
      const medicalTotal = parseFloat(formData.medicalExpenseTotal || '0') || 
                          (parseFloat(formData.medicalNonReimbursed || '0') + 
                           parseFloat(formData.healthInsurancePremiums || '0') + 
                           parseFloat(formData.extraordinaryMedical || '0'));
      
      const expenses = {
        housing: parseFloat(formData.rentMortgage || '0'),
        utilities: parseFloat(formData.utilities || '0'),
        food: parseFloat(formData.food || '0'),
        medical: parseFloat(formData.medicalNonReimbursed || '0'),
        healthInsurance: parseFloat(formData.healthInsurancePremiums || '0'),
        transportation: parseFloat(formData.transportation || '0'),
        clothing: parseFloat(formData.clothing || '0'),
        medicalTotal: medicalTotal
      };
      
      if (import.meta.env.DEV) {
        console.log("📊 Data prepared for submission");
      }
      
      // Prepare the data that will be sent to the API
      const apiData = {
        clientInfo,
        assets,
        income,
        state: formData.state || ''
      };
      
      // Validate data structure before sending
      const validation = validateDataStructure(apiData);
      
      if (!validation.isValid) {
        console.error("❌ Data validation failed:", validation.errors);
        if (import.meta.env.DEV) {
          console.error("📦 Data that failed validation:", apiData);
        }
        toast({
          title: "Data Validation Error",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }
      
      if (import.meta.env.DEV) {
        console.log("✅ Data validation passed");
      }
      
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
      
      // Complete preparation step and move to assessment
      progressTracking.nextStep();
      if (import.meta.env.DEV) {
        console.log("✅ Step 2: Preparing (completed)");
        console.log("🔄 Step 3: Assessing eligibility (active)");
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Call assessEligibility with the prepared data directly
      if (import.meta.env.DEV) {
        console.log("🚀 Calling assessEligibility...");
      }
      
      let eligibilityResult: any;
      try {
        eligibilityResult = await assessEligibility(apiData);
        
        if (import.meta.env.DEV) {
          console.log("✅ Assessment completed");
        }
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
      
      // Complete assessment step and move to generation
      progressTracking.nextStep();
      if (import.meta.env.DEV) {
        console.log("✅ Step 3: Assessing (completed)");
        console.log("🔄 Step 4: Generating comprehensive plan (active)");
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Now run comprehensive planning to get strategies
      if (import.meta.env.DEV) {
        console.log("🚀 Running comprehensive planning...");
      }
      
      // Ensure we have all required fields for comprehensive planning API
      const planningData = {
        clientInfo: {
          name: clientInfo?.name || formData.applicantName || '',
          age: Number(clientInfo?.age || (birthDate ? calculateAge(birthDate) : 0)),
          maritalStatus: clientInfo?.maritalStatus || formData.maritalStatus || 'single',
          healthStatus: clientInfo?.healthStatus || formData.medicalStatus || 'good',
          isCrisis: clientInfo?.isCrisis || false
        },
        assets: assets && Object.keys(assets).length > 0 ? assets : { countable: 0 },
        income: income && Object.keys(income).length > 0 ? income : { socialSecurity: 0 },
        expenses: expenses || {},
        medicalInfo: formData.primaryDiagnosis || formData.facilityName ? {
          diagnosis: formData.primaryDiagnosis || '',
          facility: formData.facilityName || '',
          facilityEntryDate: formData.facilityEntryDate,
          status: formData.medicalStatus || 'stable',
          recentHospitalization: formData.recentHospitalStay || false,
          hospitalizationDuration: formData.hospitalStayDuration || 0,
          longTermCareInsurance: formData.longTermCareInsurance || false,
          insuranceDetails: formData.insuranceDetails || ''
        } : {},
        livingInfo: formData.address || formData.emergencyContactName ? {
          homeAddress: `${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`.trim(),
          willReturnHome: formData.intentToReturnHome || false,
          emergencyContact: {
            name: formData.emergencyContactName || '',
            phone: formData.emergencyContactPhone || ''
          }
        } : {},
        state: formData.state || ''
      };
      
      if (import.meta.env.DEV) {
        console.log("📤 Planning data prepared");
      }
      
      let planningResult: any = null;
      try {
        planningResult = await generateComprehensivePlan(planningData);
        
        if (import.meta.env.DEV) {
          console.log("✅ Comprehensive planning completed");
        }
      } catch (planningError) {
        console.error("❌ Error during comprehensive planning:", planningError);
        // Don't fail the entire process if planning fails, but log it
        if (!import.meta.env.DEV) {
          toast({
            title: "Planning Warning",
            description: "Eligibility assessment completed, but some planning features may be limited.",
            variant: "default",
          });
        }
      }
      
      // Complete generation step and move to finalization
      progressTracking.nextStep();
      if (import.meta.env.DEV) {
        console.log("✅ Step 4: Generating (completed)");
        console.log("🔄 Step 5: Finalizing results (active)");
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      if (import.meta.env.DEV) {
        console.log("📍 Preparing to navigate to results page...");
      }
      
      // Only show success toast in production
      if (!import.meta.env.DEV) {
        toast({
          title: "Success!",
          description: "Your Medicaid planning form has been submitted successfully.",
        });
      }
      
      // Complete the final step
      progressTracking.nextStep();
      
      if (import.meta.env.DEV) {
        console.log("✅ Step 5: Finalizing (completed)");
        console.log("✅ All steps completed!");
        console.log("⏳ Waiting for user to click 'View Results'...");
      }
      
      // IMPORTANT: Don't navigate automatically or set loading to false
      // The ProgressModal's "View Results" button will handle navigation
      // and the loading state will be cleared when the component unmounts
      
    } catch (error) {
      console.error("❌ Error during form submission:", error);
      progressTracking.setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      // Set loading to false on error
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return {
    activeSection,
    setActiveSection,
    handleSubmit,
    progressTracking,
    isProcessing,
    setIsProcessing
  };
};
