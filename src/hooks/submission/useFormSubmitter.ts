
import { useNavigate } from "react-router-dom";
import { MedicaidFormData } from "@/types/medicaidForm";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { useContextUpdater } from "./useContextUpdater";

export const useFormSubmitter = () => {
  const navigate = useNavigate();
  const { assessEligibility, generatePlan, eligibilityResults } = usePlanningContext();
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
      
      // Update context with form data
      console.log("Updating context with form data...");
      updateContextFromFormData(formData, calculateAge);
      
      // Show toast notification for successful form submission
      toast({
        title: "Form Submitted",
        description: "Processing your Medicaid Planning information...",
      });
      
      console.log("Starting eligibility assessment...");
      // Generate an eligibility assessment - don't check the return value directly
      await assessEligibility();
      console.log("Eligibility assessment completed");
      
      console.log("Starting plan generation...");
      // Generate a comprehensive plan
      await generatePlan('comprehensive');
      console.log("Plan generation completed");
      
      // Navigate to results page without relying on the return values
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
