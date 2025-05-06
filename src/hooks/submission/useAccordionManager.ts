
import { useState } from "react";

export const useAccordionManager = () => {
  const [activeSection, setActiveSection] = useState<string>("client-info");
  
  return {
    activeSection,
    setActiveSection
  };
};
