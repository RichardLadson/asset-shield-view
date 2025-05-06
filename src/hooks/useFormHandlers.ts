
import { useState } from "react";
import { MedicaidFormData } from "@/types/medicaidForm";
import { useContextSync } from "./useContextSync";
import { calculateAge } from "@/utils/formUtils";

export const useFormHandlers = (
  formData: MedicaidFormData,
  setFormData: React.Dispatch<React.SetStateAction<MedicaidFormData>>
) => {
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  
  const { updateContextMaritalStatus, updateContextState, updateContextAge } = useContextSync(formData, setFormData);

  // Handlers for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Mark that user has interacted with the form
    setHasInteracted(true);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Mark that user has interacted with the form
    setHasInteracted(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Mark that user has interacted with the form
    setHasInteracted(true);

    // Update context state value
    if (name === "state") {
      updateContextState(value);
    }

    // Update context marital status
    if (name === "maritalStatus") {
      updateContextMaritalStatus(value);
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date,
    });
    // Mark that user has interacted with the form
    setHasInteracted(true);

    // Handle age calculation if birth date changes
    if (name === "dateOfBirth" && date) {
      updateContextAge(date);
    }
  };
  
  return {
    hasInteracted,
    setHasInteracted,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
  };
};
