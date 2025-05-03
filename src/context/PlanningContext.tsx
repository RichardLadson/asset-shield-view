import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  ClientInfo,
  Assets,
  Income,
  Expenses,
  MedicalInfo,
  LivingInfo,
} from "@/services/api";
import api from "@/services/api";
import { toast } from "@/components/ui/use-toast";

// Define the shape of our context
interface PlanningContextProps {
  clientInfo: ClientInfo | null;
  setClientInfo: Dispatch<SetStateAction<ClientInfo | null>>;
  assets: Assets | null;
  setAssets: Dispatch<SetStateAction<Assets | null>>;
  income: Income | null;
  setIncome: Dispatch<SetStateAction<Income | null>>;
  expenses: Expenses | null;
  setExpenses: Dispatch<SetStateAction<Expenses | null>>;
  medicalInfo: MedicalInfo | null;
  setMedicalInfo: Dispatch<SetStateAction<MedicalInfo | null>>;
  livingInfo: LivingInfo | null;
  setLivingInfo: Dispatch<SetStateAction<LivingInfo | null>>;
  planningResults: any | null;
  setPlanningResults: Dispatch<SetStateAction<any | null>>;
  eligibilityResults: any | null;
  setEligibilityResults: Dispatch<SetStateAction<any | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  assessEligibility: () => Promise<void>;
  runComprehensivePlanning: () => Promise<void>;
}

// Create a context with a default value (null for non-primitive types)
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
  assessEligibility: async () => {},
  runComprehensivePlanning: async () => {},
});

// Create a provider component
interface PlanningProviderProps {
  children: ReactNode;
}

const PlanningProvider: React.FC<PlanningProviderProps> = ({ children }) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [income, setIncome] = useState<Income | null>(null);
  const [expenses, setExpenses] = useState<Expenses | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [livingInfo, setLivingInfo] = useState<LivingInfo | null>(null);
  const [planningResults, setPlanningResults] = useState<any | null>(null);
  const [eligibilityResults, setEligibilityResults] = useState<any | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const assessEligibility = async () => {
    if (!clientInfo || !assets || !income) return;

    setLoading(true);
    try {
      const { data } = await api.eligibility.assessEligibility({
        assets: assets,
        income: income,
        state: clientInfo.state,
        maritalStatus: clientInfo.maritalStatus,
        age: clientInfo.age,
        healthStatus: clientInfo.healthStatus,
        isCrisis: clientInfo.isCrisis,
      });

      setEligibilityResults(data);
      toast({
        title: "Eligibility Assessed",
        description: "Your eligibility has been successfully assessed.",
      });
    } catch (error: any) {
      console.error("Eligibility Assessment Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message ||
          "Failed to assess eligibility. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const runComprehensivePlanning = async () => {
    if (!clientInfo || !assets || !income) return;

    setLoading(true);
    try {
      const { data } = await api.planning.comprehensivePlanning({
        clientInfo: clientInfo,
        assets: assets,
        income: income,
        expenses: expenses,
        medicalInfo: medicalInfo,
        livingInfo: livingInfo,
        state: clientInfo.state,
      });

      setPlanningResults(data);
      toast({
        title: "Comprehensive Plan Generated",
        description: "Your comprehensive plan has been successfully generated.",
      });
    } catch (error: any) {
      console.error("Comprehensive Planning Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message ||
          "Failed to generate comprehensive plan. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

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
    assessEligibility,
    runComprehensivePlanning,
  };

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
};

// Create a custom hook to use the context
const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within a PlanningProvider");
  }
  return context;
};

export { PlanningProvider, usePlanning };
