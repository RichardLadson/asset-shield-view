
import { useAccordionManager } from "./submission/useAccordionManager";
import { useFormSubmitter } from "./submission/useFormSubmitter";
import { useContextUpdater } from "./submission/useContextUpdater";

export const useMedicaidFormSubmission = () => {
  const { activeSection, setActiveSection } = useAccordionManager();
  const { handleSubmit } = useFormSubmitter();
  const { updateContextFromFormData } = useContextUpdater();

  return {
    activeSection,
    setActiveSection,
    handleSubmit,
    updateContextFromFormData
  };
};
