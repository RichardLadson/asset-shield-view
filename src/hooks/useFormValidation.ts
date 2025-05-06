
import { useState, useEffect } from "react";
import { MedicaidFormData } from "@/types/medicaidForm";

export const useFormValidation = (
  formData: MedicaidFormData,
  showValidation: boolean,
  hasInteracted: boolean
) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formValid, setFormValid] = useState<boolean>(false);

  // Validate form when data or validation settings change
  useEffect(() => {
    const errors: { [key: string]: string } = {};

    // Only validate if showValidation is true or user has interacted with form
    if (showValidation || hasInteracted) {
      // Required fields validation
      if (!formData.applicantName) {
        errors.applicantName = "Applicant name is required";
      }

      if (!formData.applicantBirthDate) {
        errors.applicantBirthDate = "Birth date is required";
      }

      if (!formData.state) {
        errors.state = "State selection is required";
      }

      if (!formData.maritalStatus) {
        errors.maritalStatus = "Marital status is required";
      }

      // Email validation if provided
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email address is invalid";
      }

      // Phone validation if provided
      const phoneRegex = /^\d{10}$|^\(\d{3}\)\s*\d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$/;
      if (formData.cellPhone && !phoneRegex.test(formData.cellPhone.replace(/\s/g, ''))) {
        errors.cellPhone = "Cell phone number is invalid";
      }
      if (formData.homePhone && !phoneRegex.test(formData.homePhone.replace(/\s/g, ''))) {
        errors.homePhone = "Home phone number is invalid";
      }

      // Zip code validation if provided
      if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        errors.zipCode = "Zip code is invalid";
      }
    }

    setFormErrors(errors);
    setFormValid(Object.keys(errors).length === 0);
  }, [formData, showValidation, hasInteracted]);

  return { formValid, formErrors };
};
