
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MedicaidFormData } from "@/types/medicaidForm";

export const useFormValidation = (
  formData: MedicaidFormData, 
  showValidation: boolean,
  hasInteracted: boolean
) => {
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MedicaidFormData, string>>>({});
  const [formValid, setFormValid] = useState<boolean>(false);

  // Validate form data
  useEffect(() => {
    const errors: Partial<Record<keyof MedicaidFormData, string>> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Birth date is required";
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

    // Only show toast notifications for errors if showValidation is true AND user has interacted
    if (!isValid && showValidation && hasInteracted) {
      Object.values(errors).forEach(error => {
        toast({
          title: "Form Validation Error",
          description: error,
          variant: "destructive",
        });
      });
    }
  }, [formData, showValidation, hasInteracted]);

  return { formValid, formErrors };
};
