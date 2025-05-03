import React, { createContext, useState, useContext, ReactNode } from "react";
import { ClientInfo, Assets, Income, Expenses, MedicalInfo, LivingInfo } from "@/services/api";
import { PlanningContextProps, PlanningState } from "@/types/planning";
import { usePlanningActions } from "@/hooks/usePlanningActions";

// Create a context with default values
const PlanningContext = createContext<PlanningContextProps>({
  clientInfo: null,
  setClientInfo: () => {},
  assets: null,
  setAssets: () => {},
  income: null,
  setIncome: () => {},
  expenses: null,
  setExpenses: () => {},
  medicalInfo: null,
  setMedicalInfo: () => {},
  livingInfo: null,
  setLivingInfo: () => {},
  planningResults: null,
  setPlanningResults: () => {},
  eligibilityResults: null,
  setEligibilityResults: () => {},
  loading: false,
  setLoading: () => {},
  state: "",
  setState: () => {},
  reportData: null,
  setReportData: () => {},
  assessEligibility: async () => {},
  runComprehensivePlanning: async () => {},
  generatePlan: async () => {},
  generateReport: async () => {},
});

// Create a provider component
interface PlanningProviderProps {
  children: ReactNode;
}

export const PlanningProvider: React.FC<PlanningProviderProps> = ({ children }) => {
  // Initialize clientInfo with a default structure to prevent "Cannot read properties of null" errors
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>({
    name: "",
    age: 0,
    maritalStatus: "",
    healthStatus: "",
    email: "",
    phone: "",
    state: ""
  });
  
  const [assets, setAssets] = useState<Assets | null>(null);
  const [income, setIncome] = useState<Income | null>(null);
  const [expenses, setExpenses] = useState<Expenses | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [livingInfo, setLivingInfo] = useState<LivingInfo | null>(null);
  const [planningResults, setPlanningResults] = useState<any | null>(null);
  const [eligibilityResults, setEligibilityResults] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<string>("");
  const [reportData, setReportData] = useState<any | null>(null);

  // Use our custom hook for all planning actions
  const actions = usePlanningActions(
    clientInfo,
    assets,
    income,
    expenses,
    medicalInfo,
    livingInfo,
    planningResults,
    state,
    setEligibilityResults,
    setPlanningResults,
    setReportData,
    setLoading
  );

  const value: PlanningContextProps = {
    clientInfo,
    setClientInfo,
    assets,
    setAssets,
    income,
    setIncome,
    expenses,
    setExpenses,
    medicalInfo,
    setMedicalInfo,
    livingInfo,
    setLivingInfo,
    planningResults,
    setPlanningResults,
    eligibilityResults,
    setEligibilityResults,
    loading,
    setLoading,
    state,
    setState,
    reportData,
    setReportData,
    ...actions
  };

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePlanningContext = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanningContext must be used within a PlanningProvider");
  }
  return context;
};

// Keep the old function name as an alias for backward compatibility
export const usePlanning = usePlanningContext;
