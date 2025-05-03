// src/context/PlanningContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import api, { 
  ClientInfo, 
  Assets, 
  Income, 
  Expenses, 
  MedicalInfo, 
  LivingInfo,
  ApiResponse
} from '@/services/api';

// Define the context state type
interface PlanningContextState {
  // Client information
  clientInfo: ClientInfo;
  setClientInfo: (info: ClientInfo) => void;
  
  // Financial data
  assets: Assets;
  setAssets: (assets: Assets) => void;
  income: Income;
  setIncome: (income: Income) => void;
  expenses: Expenses;
  setExpenses: (expenses: Expenses) => void;
  
  // Health and living data
  medicalInfo: MedicalInfo;
  setMedicalInfo: (info: MedicalInfo) => void;
  livingInfo: LivingInfo;
  setLivingInfo: (info: LivingInfo) => void;
  
  // Planning state
  state: string;
  setState: (state: string) => void;
  
  // Assessment results
  eligibilityResults: any | null;
  planningResults: any | null;
  reportData: any | null;
  
  // Loading states
  isLoading: boolean;
  
  // Action methods
  assessEligibility: () => Promise<void>;
  generatePlan: (planType: string) => Promise<void>;
  generateReport: (reportType: string, outputFormat: string) => Promise<void>;
  
  // Reset methods
  resetForm: () => void;
  resetResults: () => void;
}

// Create the initial context values
const initialState: PlanningContextState = {
  clientInfo: {
    name: '',
    age: 0,
    maritalStatus: 'single',
  },
  setClientInfo: () => {},
  
  assets: {},
  setAssets: () => {},
  income: {},
  setIncome: () => {},
  expenses: {},
  setExpenses: () => {},
  
  medicalInfo: {},
  setMedicalInfo: () => {},
  livingInfo: {},
  setLivingInfo: () => {},
  
  state: '',
  setState: () => {},
  
  eligibilityResults: null,
  planningResults: null,
  reportData: null,
  
  isLoading: false,
  
  assessEligibility: async () => {},
  generatePlan: async () => {},
  generateReport: async () => {},
  
  resetForm: () => {},
  resetResults: () => {},
};

// Create the context
const PlanningContext = createContext<PlanningContextState>(initialState);

// Create a custom hook to use the context
export const usePlanningContext = () => useContext(PlanningContext);

// Provider component
export const PlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // State for client info
  const [clientInfo, setClientInfo] = useState<ClientInfo>(initialState.clientInfo);
  
  // State for financial data
  const [assets, setAssets] = useState<Assets>({});
  const [income, setIncome] = useState<Income>({});
  const [expenses, setExpenses] = useState<Expenses>({});
  
  // State for health and living info
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({});
  const [livingInfo, setLivingInfo] = useState<LivingInfo>({});
  
  // State for planning location
  const [state, setState] = useState<string>('');
  
  // State for results
  const [eligibilityResults, setEligibilityResults] = useState<any | null>(null);
  const [planningResults, setPlanningResults] = useState<any | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Assess eligibility
  const assessEligibility = async () => {
    try {
      setIsLoading(true);
      
      const data = {
        assets,
        income,
        maritalStatus: clientInfo.maritalStatus,
        state,
        age: clientInfo.age,
        healthStatus: clientInfo.healthStatus,
        isCrisis: false  // Can be dynamic in the future
      };
      
      const response = await api.eligibility.assessEligibility(data);
      
      if (response.status === 'error') {
        toast({
          title: 'Error',
          description: response.message || 'Failed to assess eligibility',
          variant: 'destructive',
        });
        return;
      }
      
      setEligibilityResults(response);
      
      toast({
        title: 'Success',
        description: 'Eligibility assessment completed',
      });
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error in assessEligibility:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate plan
  const generatePlan = async (planType: string) => {
    try {
      setIsLoading(true);
      
      let response: ApiResponse<any>;
      
      switch (planType) {
        case 'comprehensive':
          response = await api.planning.comprehensivePlanning({
            clientInfo,
            assets,
            income,
            expenses,
            medicalInfo,
            livingInfo,
            state,
          });
          break;
          
        case 'asset':
          response = await api.planning.assetPlanning({
            clientInfo,
            assets,
            state,
          });
          break;
          
        case 'income':
          response = await api.planning.incomePlanning({
            clientInfo,
            income,
            state,
          });
          break;
          
        case 'trust':
          if (!eligibilityResults) {
            toast({
              title: 'Error',
              description: 'Eligibility assessment required before trust planning',
              variant: 'destructive',
            });
            return;
          }
          
          response = await api.planning.trustPlanning({
            clientInfo,
            assets,
            income,
            eligibilityResults,
            state,
          });
          break;
          
        case 'annuity':
          response = await api.planning.annuityPlanning({
            clientInfo,
            assets,
            state,
          });
          break;
          
        case 'divestment':
          response = await api.planning.divestmentPlanning({
            clientInfo,
            assets,
            state,
          });
          break;
          
        case 'care':
          response = await api.planning.carePlanning({
            clientInfo,
            medicalInfo,
            livingInfo,
            state,
          });
          break;
          
        case 'community-spouse':
          response = await api.planning.communitySpousePlanning({
            clientInfo,
            assets,
            income,
            expenses,
            state,
          });
          break;
          
        case 'post-eligibility':
          response = await api.planning.postEligibilityPlanning({
            clientInfo,
            assets,
            income,
            state,
          });
          break;
          
        default:
          toast({
            title: 'Error',
            description: `Unknown planning type: ${planType}`,
            variant: 'destructive',
          });
          return;
      }
      
      if (response.status === 'error') {
        toast({
          title: 'Error',
          description: response.message || `Failed to generate ${planType} plan`,
          variant: 'destructive',
        });
        return;
      }
      
      setPlanningResults(response);
      
      toast({
        title: 'Success',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} plan generated successfully`,
      });
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error(`Error in generatePlan (${planType}):`, error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate report
  const generateReport = async (reportType: string = 'summary', outputFormat: string = 'html') => {
    try {
      setIsLoading(true);
      
      if (!planningResults) {
        toast({
          title: 'Error',
          description: 'Planning results required to generate a report',
          variant: 'destructive',
        });
        return;
      }
      
      const data = {
        planningResults,
        clientInfo,
        reportType: reportType as 'summary' | 'detailed' | 'professional' | 'client-friendly',
        outputFormat: outputFormat as 'markdown' | 'plain' | 'html',
        state,
      };
      
      const response = await api.report.generateReport(data);
      
      if (response.status === 'error') {
        toast({
          title: 'Error',
          description: response.message || 'Failed to generate report',
          variant: 'destructive',
        });
        return;
      }
      
      setReportData(response);
      
      toast({
        title: 'Success',
        description: 'Report generated successfully',
      });
    } catch (error) {
      console.error('Error in generateReport:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setClientInfo(initialState.clientInfo);
    setAssets({});
    setIncome({});
    setExpenses({});
    setMedicalInfo({});
    setLivingInfo({});
    setState('');
  };
  
  // Reset results
  const resetResults = () => {
    setEligibilityResults(null);
    setPlanningResults(null);
    setReportData(null);
  };
  
  const contextValue: PlanningContextState = {
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
    state,
    setState,
    eligibilityResults,
    planningResults,
    reportData,
    isLoading,
    assessEligibility,
    generatePlan,
    generateReport,
    resetForm,
    resetResults,
  };
  
  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};

export default PlanningProvider;