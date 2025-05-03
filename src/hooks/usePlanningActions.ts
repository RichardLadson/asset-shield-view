
import { useState } from "react";
import { ClientInfo, Assets, Income, Expenses, MedicalInfo, LivingInfo } from "@/services/api";
import api from "@/services/api";
import { toast } from "@/hooks/use-toast";

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
  
  const assessEligibility = async () => {
    if (!clientInfo || !assets || !income) {
      console.error("Missing required data for eligibility assessment:", { 
        clientInfo, assets, income, state: clientInfo?.state || state 
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.eligibility.assessEligibility({
        assets: assets,
        income: income,
        state: clientInfo.state || state,
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

  const generatePlan = async (planType: string = 'comprehensive') => {
    if (!clientInfo || !assets || !income) {
      console.error("Missing required data for plan generation:", { 
        clientInfo, assets, income, state: clientInfo?.state || state 
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.planning.comprehensivePlanning({
        clientInfo: clientInfo,
        assets: assets,
        income: income,
        expenses: expenses,
        medicalInfo: medicalInfo,
        livingInfo: livingInfo,
        state: clientInfo.state || state,
      } as any); // Using type assertion to bypass strict typing for now

      setPlanningResults(data);
      toast({
        title: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Generated`,
        description: `Your ${planType} plan has been successfully generated.`,
      });
    } catch (error: any) {
      console.error(`${planType} Planning Error:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message ||
          `Failed to generate ${planType} plan. Please try again later.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const runComprehensivePlanning = async () => {
    await generatePlan('comprehensive');
  };

  const generateReport = async (reportType: string = 'detailed', format: string = 'pdf') => {
    setLoading(true);
    try {
      // Ensure reportType is one of the allowed values by using type assertion
      const { data } = await api.report.generateReport({
        clientInfo: clientInfo,
        planningResults: planningResults,
        reportType: reportType as "detailed" | "summary" | "professional" | "client-friendly",
        outputFormat: format as "markdown" | "plain" | "html",
        state: clientInfo?.state || state
      });

      setReportData(data);
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been successfully generated.`,
      });
      return data;
    } catch (error: any) {
      console.error("Report Generation Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message ||
          "Failed to generate report. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    assessEligibility,
    generatePlan,
    runComprehensivePlanning,
    generateReport
  };
};
