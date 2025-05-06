
import { useNavigate } from "react-router-dom";
import { MedicaidFormData } from "@/types/medicaidForm";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { useContextUpdater } from "./useContextUpdater";

export const useFormSubmitter = () => {
  const navigate = useNavigate();
  const { assessEligibility, generatePlan } = usePlanningContext();
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
    
    // Ensure dateOfBirth is set from applicantBirthDate for backward compatibility
    if (formData.applicantBirthDate && !formData.dateOfBirth) {
      formData.dateOfBirth = formData.applicantBirthDate;
    }
    
    // Set applicantName from firstName and lastName for backward compatibility
    formData.applicantName = `${formData.firstName} ${formData.lastName}`.trim();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.state || 
        !formData.applicantBirthDate || !formData.maritalStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields (first name, last name, birth date, state, and marital status).",
        variant: "destructive",
      });
      return;
    }
    
    // Add console logs to debug form data
    console.log("Submitting form with data:", {
      clientInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.applicantName,
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
        console.log("Starting eligibility assessment...");
        // Generate an eligibility assessment
        const eligibilityResponse = await assessEligibility();
        console.log("Eligibility assessment completed:", eligibilityResponse);
        
        console.log("Starting plan generation...");
        // Generate a comprehensive plan
        const planResponse = await generatePlan('comprehensive');
        console.log("Plan generation completed:", planResponse);
        
        // Navigate to results page
        console.log("Navigating to results page...");
        navigate('/results');
      } catch (error: any) {
        console.error("Error during form submission:", error);
        toast({
          title: "Error",
          description: error?.message || "There was an error submitting your information. Please try again.",
          variant: "destructive",
        });
      }
    }, 100);
  };

  return { handleSubmit };
};
