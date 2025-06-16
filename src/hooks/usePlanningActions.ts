
import { useState } from "react";
import { ClientInfo, Assets, Income, Expenses, MedicalInfo, LivingInfo } from "@/services/types";
import api from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const usePlanningActions = (
  clientInfo: ClientInfo | null,
  assets: Assets | null, 
  income: Income | null,
  expenses: Expenses | null,
  medicalInfo: MedicalInfo | null,
  livingInfo: LivingInfo | null,
  planningResults: any | null,
  state: string,
  setEligibilityResults: React.Dispatch<React.SetStateAction<any | null>>,
  setPlanningResults: React.Dispatch<React.SetStateAction<any | null>>,
  setReportData: React.Dispatch<React.SetStateAction<any | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  
  const assessEligibility = async (overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    state?: string
  }): Promise<any | null> => {
    // Use provided data or fall back to context data
    const effectiveClientInfo = overrideData?.clientInfo || clientInfo;
    const effectiveAssets = overrideData?.assets || assets;
    const effectiveIncome = overrideData?.income || income;
    const effectiveState = overrideData?.state || clientInfo?.state || state;
    
    if (import.meta.env.DEV) {
      console.log("🔍 assessEligibility called with:", {
        hasOverrideData: !!overrideData,
        effectiveClientInfo,
        effectiveAssets,
        effectiveIncome,
        effectiveState
      });
    }
    
    if (!effectiveClientInfo || !effectiveAssets || !effectiveIncome || 
        !effectiveClientInfo.name || !effectiveClientInfo.age || !effectiveClientInfo.maritalStatus) {
      console.error("Missing required data for eligibility assessment:", { 
        clientInfo: effectiveClientInfo, 
        assets: effectiveAssets, 
        income: effectiveIncome, 
        state: effectiveState 
      });
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete all required fields before assessing eligibility.",
      });
      return null;
    }

    setLoading(true);
    try {
      // Ensure age is a number, not a string
      const clientAge = typeof effectiveClientInfo.age === 'string' 
        ? parseInt(effectiveClientInfo.age, 10) 
        : effectiveClientInfo.age;
      
      // Restructured payload to match backend expectations
      const payload = {
        clientInfo: {
          name: effectiveClientInfo.name,
          age: clientAge, // Ensure age is a number
          maritalStatus: effectiveClientInfo.maritalStatus,
          healthStatus: effectiveClientInfo.healthStatus || "stable",
          isCrisis: effectiveClientInfo.isCrisis || false,
        },
        state: effectiveState,
        assets: effectiveAssets,
        income: effectiveIncome,
      };
      
      if (import.meta.env.DEV) {
        console.log("Sending eligibility assessment payload:", JSON.stringify(payload, null, 2));
      }

      const response = await api.eligibility.assessEligibility(payload);
      if (import.meta.env.DEV) {
        console.log("Received eligibility response:", response);
        console.log("Response status:", response?.status);
        console.log("Response has data property:", 'data' in (response || {}));
      }
      
      if (!response || (response.status && response.status === 'error')) {
        throw new Error(response?.message || "Failed to assess eligibility");
      }

      // The backend returns the data directly in the response, not wrapped in a data property
      // Check if we have the eligibility fields directly in the response
      if (response && (response.isResourceEligible !== undefined || response.isIncomeEligible !== undefined)) {
        // The response IS the data
        setEligibilityResults(response);
        if (!import.meta.env.DEV) {
          toast({
            title: "Eligibility Assessed",
            description: "Your eligibility has been successfully assessed.",
          });
        }
        
        return response;
      } else if (response && response.data) {
        // In case the backend changes to wrap it in data
        setEligibilityResults(response.data);
        if (!import.meta.env.DEV) {
          toast({
            title: "Eligibility Assessed", 
            description: "Your eligibility has been successfully assessed.",
          });
        }
        
        return response.data;
      } else {
        console.error("No eligibility data in response:", response);
        throw new Error("No data received from eligibility assessment");
      }
      
    } catch (error: any) {
      console.error("Eligibility Assessment Error:", error);
      setEligibilityResults(null);
      toast({
        variant: "destructive",
        title: "Assessment Error",
        description: error?.message || "Unable to assess eligibility. Please try again later or check your network connection.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (planType: string = 'comprehensive', overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    expenses?: Expenses,
    medicalInfo?: MedicalInfo,
    livingInfo?: LivingInfo,
    state?: string
  }) => {
    // Use provided data or fall back to context data
    const effectiveClientInfo = overrideData?.clientInfo || clientInfo;
    const effectiveAssets = overrideData?.assets || assets;
    const effectiveIncome = overrideData?.income || income;
    const effectiveExpenses = overrideData?.expenses || expenses;
    const effectiveMedicalInfo = overrideData?.medicalInfo || medicalInfo;
    const effectiveLivingInfo = overrideData?.livingInfo || livingInfo;
    const effectiveState = overrideData?.state || clientInfo?.state || state;
    
    if (!effectiveClientInfo || !effectiveAssets || !effectiveIncome || 
        !effectiveClientInfo.name || !effectiveClientInfo.age || !effectiveClientInfo.maritalStatus) {
      console.error("Missing required data for plan generation:", { 
        clientInfo: effectiveClientInfo, 
        assets: effectiveAssets, 
        income: effectiveIncome, 
        state: effectiveState,
        missingFields: {
          hasClientInfo: !!effectiveClientInfo,
          hasName: !!effectiveClientInfo?.name,
          hasAge: !!effectiveClientInfo?.age,
          hasMaritalStatus: !!effectiveClientInfo?.maritalStatus,
          hasAssets: !!effectiveAssets,
          hasIncome: !!effectiveIncome
        }
      });
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete all required fields before generating a plan.",
      });
      return null;
    }

    setLoading(true);
    try {
      // Ensure clientInfo is properly structured with required fields
      const clientInfoPayload = {
        name: effectiveClientInfo?.name || '',
        email: effectiveClientInfo?.email || '', // Required field
        age: Number(effectiveClientInfo?.age || 0),
        maritalStatus: effectiveClientInfo?.maritalStatus || 'single',
        healthStatus: effectiveClientInfo?.healthStatus,
        isCrisis: effectiveClientInfo?.isCrisis || false,
        state: effectiveState,
      };
      
      // Validate required fields before sending (email temporarily optional for existing workflow)
      if (!clientInfoPayload.name || !clientInfoPayload.age || !clientInfoPayload.maritalStatus) {
        throw new Error(`Missing required clientInfo fields: name=${clientInfoPayload.name}, age=${clientInfoPayload.age}, maritalStatus=${clientInfoPayload.maritalStatus}`);
      }
      
      // If no email provided, use a temporary placeholder to maintain backend compatibility
      if (!clientInfoPayload.email) {
        clientInfoPayload.email = `temp.${Date.now()}@medicaid-planning-demo.com`;
        console.warn('No email provided by user, using temporary email for demo purposes');
      }
      
      // Restructured payload to match backend expectations (camelCase)
      const payload = {
        clientInfo: clientInfoPayload,
        assets: effectiveAssets || {},
        income: effectiveIncome || {},
        expenses: effectiveExpenses || {},
        medicalInfo: effectiveMedicalInfo || {},
        livingInfo: effectiveLivingInfo || {},
        state: effectiveState,
      };
      
      if (import.meta.env.DEV) {
        console.log("🔍 Planning request details:");
        console.log("📦 effectiveClientInfo:", effectiveClientInfo);
        console.log("📦 effectiveAssets:", effectiveAssets);
        console.log("📦 effectiveIncome:", effectiveIncome);
        console.log("📦 effectiveState:", effectiveState);
        console.log("📦 Final payload:", JSON.stringify(payload, null, 2));
      }
      
      const response = await api.planning.comprehensivePlanning(payload);
      
      if (import.meta.env.DEV) {
        console.log("Received planning response:", response);
      }
      
      if (response.status === 'error') {
        throw new Error(response.message || `Failed to generate ${planType} plan`);
      }

      // Handle both response.data and direct response format
      const planningData = response.data || response;
      setPlanningResults(planningData);
      if (!import.meta.env.DEV) {
        toast({
          title: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Generated`,
          description: `Your ${planType} plan has been successfully generated.`,
        });
      }
      
      return planningData;
      
    } catch (error: any) {
      console.error(`${planType} Planning Error:`, error);
      setPlanningResults(null);
      toast({
        variant: "destructive",
        title: "Planning Error",
        description: error?.message || `Unable to generate ${planType} plan. Please check your network connection or try again later.`,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const runComprehensivePlanning = async (overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    expenses?: Expenses,
    medicalInfo?: MedicalInfo,
    livingInfo?: LivingInfo,
    state?: string
  }) => {
    const result = await generatePlan('comprehensive', overrideData);
    if (result) {
      // Navigate to results only if we have data
      navigate('/results');
    }
    return result;
  };

  const generateComprehensivePlan = async (overrideData?: {
    clientInfo?: ClientInfo,
    assets?: Assets,
    income?: Income,
    expenses?: Expenses,
    medicalInfo?: MedicalInfo,
    livingInfo?: LivingInfo,
    state?: string
  }) => {
    // Same as runComprehensivePlanning but without auto-navigation
    return await generatePlan('comprehensive', overrideData);
  };

  const generateReport = async (reportType: string = 'detailed', format: string = 'pdf'): Promise<void> => {
    setLoading(true);
    try {
      if (!clientInfo || !planningResults) {
        throw new Error("Missing client information or planning results required for report generation");
      }

      if (import.meta.env.DEV) {
        console.log("Sending report generation request with data:", {
          clientInfo,
          planningResults,
          reportType,
          outputFormat: format,
          state: clientInfo?.state || state
        });
      }

      const response = await api.report.generateReport({
        clientInfo: clientInfo,
        planningResults: planningResults,
        reportType: reportType as "detailed" | "summary" | "professional" | "client-friendly",
        outputFormat: format as "markdown" | "plain" | "html",
        state: clientInfo?.state || state
      });
      
      if (response.status === 'error') {
        throw new Error(response.message || "Failed to generate report");
      }

      setReportData(response.data);
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been successfully generated.`,
      });
      
    } catch (error: any) {
      console.error("Report Generation Error:", error);
      setReportData(null);
      toast({
        variant: "destructive",
        title: "Report Error",
        description: error?.message || "Unable to generate report. Please check your network connection or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    assessEligibility,
    generatePlan,
    runComprehensivePlanning,
    generateComprehensivePlan,
    generateReport
  };
};
