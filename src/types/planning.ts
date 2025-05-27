
import { ClientInfo, Assets, Income, Expenses, MedicalInfo, LivingInfo } from "@/services/api";

export interface PlanningState {
  clientInfo: ClientInfo | null;
  assets: Assets | null;
  income: Income | null;
  expenses: Expenses | null;
  medicalInfo: MedicalInfo | null;
  livingInfo: LivingInfo | null;
  planningResults: any | null;
  eligibilityResults: any | null;
  loading: boolean;
  state: string;
  reportData: any | null;
}

export interface PlanningContextProps extends PlanningState {
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo | null>>;
  setAssets: React.Dispatch<React.SetStateAction<Assets | null>>;
  setIncome: React.Dispatch<React.SetStateAction<Income | null>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expenses | null>>;
  setMedicalInfo: React.Dispatch<React.SetStateAction<MedicalInfo | null>>;
  setLivingInfo: React.Dispatch<React.SetStateAction<LivingInfo | null>>;
  setPlanningResults: React.Dispatch<React.SetStateAction<any | null>>;
  setEligibilityResults: React.Dispatch<React.SetStateAction<any | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
  setReportData: React.Dispatch<React.SetStateAction<any | null>>;
  assessEligibility: (overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    state?: string
  }) => Promise<any | null>;
  runComprehensivePlanning: (overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    expenses?: Expenses,
    medicalInfo?: MedicalInfo,
    livingInfo?: LivingInfo,
    state?: string
  }) => Promise<any | null>;
  generatePlan: (planType: string, overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    expenses?: Expenses,
    medicalInfo?: MedicalInfo,
    livingInfo?: LivingInfo,
    state?: string
  }) => Promise<any | null>;
  generateReport: (reportType: string, format: string) => Promise<void>;
}
