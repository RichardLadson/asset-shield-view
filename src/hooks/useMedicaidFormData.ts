
import { useState } from "react";
import { MedicaidFormData } from "@/types/medicaidForm";
import { getInitialFormData, calculateAge } from "@/utils/formUtils";
import { useFormValidation } from "./useFormValidation";
import { useFormHandlers } from "./useFormHandlers";

export const useMedicaidFormData = () => {
  const [formData, setFormData] = useState<MedicaidFormData>(getInitialFormData());
  const [showValidation, setShowValidation] = useState<boolean>(false);
  
  // Use our custom hooks for form management
  const {
    hasInteracted,
    setHasInteracted,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
  } = useFormHandlers(formData, setFormData);
  
  const { formValid, formErrors } = useFormValidation(formData, showValidation, hasInteracted);

  return {
    formData,
    setFormData,
    formValid,
    formErrors,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
    hasInteracted,
    setHasInteracted,
    showValidation,
    setShowValidation,
    calculateAge
  };
};
