
import { useEffect } from "react";
import { MedicaidFormData } from "@/types/medicaidForm";
import { usePlanningContext } from "@/context/PlanningContext";
import { calculateAge } from "@/utils/formUtils";

export const useContextSync = (
  formData: MedicaidFormData, 
  setFormData: React.Dispatch<React.SetStateAction<MedicaidFormData>>
) => {
  const { clientInfo, state, setState, setClientInfo } = usePlanningContext();

  // Sync form data with context when it changes
  useEffect(() => {
    // Make sure clientInfo is not null before accessing its properties
    if (clientInfo && clientInfo.name) {
      // Split the name into first and last name (assuming format is "First Last")
      const nameParts = clientInfo.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
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
  }, [clientInfo, state, setFormData]);

  // Handlers for updating context
  const updateContextMaritalStatus = (maritalStatus: string) => {
    setClientInfo(prevClientInfo => ({
      ...prevClientInfo!,
      maritalStatus
    }));
  };

  const updateContextState = (stateValue: string) => {
    setState(stateValue);
  };

  const updateContextAge = (dateOfBirth: Date) => {
    const age = calculateAge(dateOfBirth);

    setClientInfo(prevClientInfo => ({
      ...prevClientInfo!,
      age
    }));
  };

  return {
    updateContextMaritalStatus,
    updateContextState,
    updateContextAge
  };
};
