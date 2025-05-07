
import { useNavigate } from "react-router-dom";
import { MedicaidFormData } from "@/types/medicaidForm";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { useContextUpdater } from "./useContextUpdater";

export const useFormSubmitter = () => {
  const navigate = useNavigate();
  const { assessEligibility, generatePlan, eligibilityResults, setClientInfo, setAssets, setIncome, clientInfo, assets, income } = usePlanningContext();
  const { updateContextFromFormData } = useContextUpdater();

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
    
    console.log("Form submission initiated - checking validity:", { formValid });
    
    // Check if form is valid before proceeding
    if (!formValid) {
      console.error("Form validation failed - stopping submission");
      toast({
        title: "Form Validation Error",
        description: "Please fill out all required fields correctly before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields explicitly
    if (!formData.applicantName || !formData.state || 
        !formData.applicantBirthDate || !formData.maritalStatus) {
      console.error("Missing required fields:", {
        applicantName: !!formData.applicantName,
        state: !!formData.state,
        birthDate: !!formData.applicantBirthDate,
        maritalStatus: !!formData.maritalStatus
      });
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields (name, birth date, state, and marital status).",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Ensure dateOfBirth is set from applicantBirthDate for backward compatibility
      if (formData.applicantBirthDate && !formData.dateOfBirth) {
        formData.dateOfBirth = formData.applicantBirthDate;
      }
      
      // Calculate the age from birth date and log it for debugging
      const applicantAge = formData.applicantBirthDate ? calculateAge(formData.applicantBirthDate) : 0;
      
      // Add console logs to debug form data
      console.log("Form is valid - submitting with data:", {
        clientInfo: {
          name: formData.applicantName,
          age: applicantAge,
          maritalStatus: formData.maritalStatus,
          state: formData.state
        },
        totalAssets: formData.totalAssetValue,
        totalIncome: formData.totalMonthlyIncome
      });
      
      // Update context with form data FIRST before making API calls
      console.log("Updating context with form data...");
      updateContextFromFormData(formData, calculateAge);
      
      // Show toast notification for successful form submission
      toast({
        title: "Form Submitted",
        description: "Processing your Medicaid Planning information...",
      });
      
      // Wait a short time to ensure context is updated before proceeding
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("Starting eligibility assessment...");
      // Generate an eligibility assessment
      await assessEligibility();
      console.log("Eligibility assessment completed");
      
      // Check if we have updated context values
      if (!clientInfo?.name || !assets || !income) {
        console.warn("Context may not be fully updated yet. Setting direct values from form data.");
        
        // Directly set required context values if they're missing
        setClientInfo({
          name: formData.applicantName,
          age: applicantAge,
          maritalStatus: formData.maritalStatus,
          healthStatus: formData.healthStatus || "",
          email: formData.email || "",
          phone: formData.phone || "",
          state: formData.state
        });
        
        // Create assets object from form data
        setAssets({
          checking: {
            applicant: parseFloat(formData.totalChecking || '0'),
            spouse: 0,
            joint: 0
          },
          savings: {
            applicant: parseFloat(formData.totalSavings || '0'),
            spouse: 0,
            joint: 0
          },
          property: {
            homeValue: parseFloat(formData.homeValue || '0'),
            mortgageValue: parseFloat(formData.outstandingMortgage || '0'),
            intentToReturnHome: formData.intentToReturnHome || false
          },
          investments: {
            moneyMarket: parseFloat(formData.moneyMarket || '0'),
            cds: parseFloat(formData.cds || '0'),
            stocksBonds: parseFloat(formData.stocksBonds || '0'),
            retirementAccounts: parseFloat(formData.retirementAccounts || '0')
          }
        });
        
        // Create income object from form data
        setIncome({
          socialSecurity: {
            applicant: parseFloat(formData.socialSecurityIncome || '0'),
            spouse: 0
          },
          pension: {
            applicant: parseFloat(formData.pensionIncome || '0'),
            spouse: 0
          },
          other: {
            annuity: parseFloat(formData.annuityIncome || '0'),
            rental: parseFloat(formData.rentalIncome || '0'),
            investment: parseFloat(formData.investmentIncome || '0')
          }
        });
      }
      
      console.log("Starting plan generation...");
      // Generate a comprehensive plan
      await generatePlan('comprehensive');
      console.log("Plan generation completed");
      
      // Navigate to results page
      console.log("Navigating to results page...");
      navigate('/results');
      
    } catch (error: any) {
      console.error("Error during form submission:", error);
      toast({
        title: "Submission Error",
        description: error?.message || "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};
