
// src/components/results/ResultsDashboard.tsx
import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, Share2, DollarSign, Clock, TrendingDown, TrendingUp, Shield, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlanningContext } from "@/context/PlanningContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResultsDashboardSkeleton } from "./ResultsDashboardSkeleton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ResultsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { 
    clientInfo,
    assets,
    income,
    expenses,
    eligibilityResults,
    planningResults,
    reportData,
    loading,
    generateReport
  } = usePlanningContext();

  // Check if we have results, if not redirect to form
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("🔍 ResultsDashboard mounted");
      console.log("📊 eligibilityResults:", eligibilityResults);
      console.log("📊 planningResults:", planningResults);
      console.log("📊 assets:", assets);
      console.log("📊 income:", income);
      console.log("📊 clientInfo:", clientInfo);
      console.log("⏳ loading:", loading);
    }
    
    // Add a small delay to allow context to update after navigation
    const checkTimer = setTimeout(() => {
      setIsInitialLoad(false);
      if (!loading && !eligibilityResults && !planningResults) {
        if (import.meta.env.DEV) {
          console.log("❌ No results available after delay, redirecting to form");
        }
        toast({
          title: "No Results Available",
          description: "Please complete the form to see your results.",
          variant: "destructive",
        });
        navigate("/asset-input");
      }
    }, 500); // 500ms delay to allow context to update
    
    return () => clearTimeout(checkTimer);
  }, [eligibilityResults, planningResults, loading, navigate]);

  // Show skeleton while loading
  if (loading || isInitialLoad) {
    return <ResultsDashboardSkeleton />;
  }

  // Get actual values from eligibility results and context
  const actualCountableAssets = eligibilityResults?.countableAssets || assets?.countable || 0;
  const actualNonCountableAssets = eligibilityResults?.nonCountableAssets || assets?.nonCountable || 0;
  const actualTotalIncome = eligibilityResults?.totalIncome || income?.socialSecurity || 0;
  
  // Get state-specific limits from API response
  // If API didn't return limits, show error message instead of guessing
  const actualResourceLimit = eligibilityResults?.resourceLimit;
  const actualIncomeLimit = eligibilityResults?.incomeLimit;
  
  // Check if we have valid limits from the API
  const hasValidLimits = actualResourceLimit !== null && actualResourceLimit !== undefined && 
                        actualIncomeLimit !== null && actualIncomeLimit !== undefined;
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log("📊 Dashboard Data Debug:", {
      eligibilityResults,
      actualCountableAssets,
      actualTotalIncome,
      actualResourceLimit,
      actualIncomeLimit,
      assets,
      income
    });
  }
  
  // Calculate total monthly expenses - this should include ALL expenses, not just medical
  const totalMonthlyExpenses = 
    (expenses?.housing || 0) +
    (expenses?.utilities || 0) +
    (expenses?.food || 0) +
    (expenses?.transportation || 0) +
    (expenses?.clothing || 0) +
    (expenses?.medicalTotal || expenses?.medical || 0) +
    (expenses?.healthInsurance || 0);
  
  // Use total monthly expenses for depletion calculation, with fallback to default nursing home cost
  const actualMonthlyBurnRate = totalMonthlyExpenses || planningResults?.monthlyCareCost || 9500;
  
  if (import.meta.env.DEV) {
    console.log("📊 Monthly Expenses Debug:", {
      expenses: expenses,
      totalMonthlyExpenses: totalMonthlyExpenses,
      defaultCost: 9500,
      actualBurnRate: actualMonthlyBurnRate
    });
  }
  
  // Prepare key metrics data based on the results from API
  const keyMetrics = hasValidLimits ? {
    // Asset metrics
    assetsAtRisk: actualCountableAssets,
    monthlyLTCCost: actualMonthlyBurnRate,
    monthsUntilDepleted: actualMonthlyBurnRate > 0 ? Math.round(actualCountableAssets / actualMonthlyBurnRate) : 0,
    protectableAssets: Math.min(actualCountableAssets * 0.5, 400000), // Example: can protect up to 50% or $400k
    totalAssetSavings: Math.min(actualCountableAssets * 0.5, 400000),
    
    // Income metrics
    clientMonthlyIncome: actualTotalIncome,
    medicaidIncomeLimit: actualIncomeLimit,
    monthlyIncomeAtRisk: Math.max(0, actualTotalIncome - actualIncomeLimit),
    protectableIncome: Math.min(Math.max(0, actualTotalIncome - actualIncomeLimit), 1350), // Can protect up to $1350/month
    
    // Medicaid requirements
    medicaidAssetLimit: actualResourceLimit,
    assetSpendDownRequired: eligibilityResults?.excessResources ?? Math.max(0, actualCountableAssets - actualResourceLimit),
    
    // Additional data from eligibility results
    isResourceEligible: eligibilityResults?.isResourceEligible || false,
    isIncomeEligible: eligibilityResults?.isIncomeEligible || false,
    urgency: eligibilityResults?.urgency || "Medium",
  } : {
    // Fallback if no valid limits from API
    assetsAtRisk: actualCountableAssets,
    monthlyLTCCost: actualMonthlyBurnRate,
    monthsUntilDepleted: actualMonthlyBurnRate > 0 ? Math.round(actualCountableAssets / actualMonthlyBurnRate) : 0,
    protectableAssets: 0,
    totalAssetSavings: 0,
    clientMonthlyIncome: actualTotalIncome,
    medicaidIncomeLimit: 0,
    monthlyIncomeAtRisk: 0,
    protectableIncome: 0,
    medicaidAssetLimit: 0,
    assetSpendDownRequired: 0,
    isResourceEligible: false,
    isIncomeEligible: false,
    urgency: "Unknown - Unable to determine state-specific limits",
  };
  
  if (import.meta.env.DEV) {
    console.log("📊 Key Metrics Calculated:", keyMetrics);
  }
  
  // Prepare asset data for charts - simplified for current data structure
  const assetData = [
    {
      name: "Countable Assets",
      value: actualCountableAssets,
      protected: keyMetrics.protectableAssets || 0
    },
    {
      name: "Non-Countable Assets", 
      value: actualNonCountableAssets,
      protected: actualNonCountableAssets // Non-countable assets are already protected
    }
  ].filter(item => item.value > 0);
  
  // Calculate total assets and protected assets
  const totalAssets = actualCountableAssets + actualNonCountableAssets;
  const totalProtected = keyMetrics.protectableAssets + actualNonCountableAssets;
  const protectionPercentage = totalAssets > 0 ? Math.round((totalProtected / totalAssets) * 100) : 0;
  
  // Debug the protection calculation
  if (import.meta.env.DEV) {
    console.log("📊 Protection Calculation Debug:", {
      totalAssets,
      totalProtected,
      protectableAssets: keyMetrics.protectableAssets,
      nonCountableAssets: actualNonCountableAssets,
      percentage: protectionPercentage
    });
  }

  // Prepare data for eligibility charts
  const eligibilityData = [
    { 
      name: "Without Strategy", 
      unprotected: keyMetrics.assetsAtRisk, 
      threshold: keyMetrics.medicaidAssetLimit 
    },
    { 
      name: "With Strategy", 
      unprotected: keyMetrics.assetsAtRisk - keyMetrics.protectableAssets, 
      threshold: keyMetrics.medicaidAssetLimit 
    },
  ];

  const incomeEligibilityData = [
    { 
      name: "Without Strategy", 
      income: keyMetrics.clientMonthlyIncome, 
      threshold: keyMetrics.medicaidIncomeLimit 
    },
    { 
      name: "With Strategy", 
      income: keyMetrics.clientMonthlyIncome - keyMetrics.protectableIncome, 
      threshold: keyMetrics.medicaidIncomeLimit 
    },
  ];

  // Transform enhanced API strategies to frontend format
  const transformEnhancedStrategies = (apiStrategies: any[]) => {
    return apiStrategies.map((strategy) => ({
      id: strategy.id,
      name: strategy.friendlyName || strategy.formalName || strategy.name,
      formalName: strategy.formalName || strategy.name,
      friendlyName: strategy.friendlyName || strategy.name,
      timingCategory: strategy.timingCategory,
      badgeText: strategy.badgeText,
      savingsDescription: strategy.savingsDescription,
      emotionalHook: strategy.emotionalHook,
      plainEnglishExplanation: strategy.plainEnglishExplanation || strategy.description,
      realBenefits: strategy.realBenefits || (strategy.pros ? strategy.pros.map((pro: string) => ({ title: pro })) : []),
      whatToKnow: strategy.whatToKnow || strategy.cons || ["Consult with professional for implementation details"],
      effectivenessMetrics: strategy.effectivenessMetrics || {
        successRate: strategy.effectivenessScore ? `${strategy.effectivenessScore}/10` : "N/A",
        protectionAmount: "Varies",
        timeToImplement: "Varies"
      },
      bottomLine: strategy.bottomLine,
      effectivenessScore: strategy.effectivenessScore,
      // Legacy fields for compatibility
      description: strategy.plainEnglishExplanation || strategy.description,
      pros: strategy.realBenefits ? strategy.realBenefits.map((benefit: any) => benefit.title || benefit.description || benefit) : ["Recommended by analysis"],
      cons: strategy.whatToKnow || ["Consult with professional for implementation details"],
      effectiveness: strategy.effectivenessScore ? `${strategy.effectivenessScore}/10` : "Recommended",
      timing: strategy.effectivenessMetrics?.timeToImplement || strategy.timing || "As recommended by analysis"
    }));
  };

  // Transform legacy API strategies (array of strings) to frontend format (array of objects)
  const transformLegacyStrategies = (apiStrategies: string[]) => {
    return apiStrategies.map((strategy, index) => ({
      id: index + 1,
      name: strategy,
      description: strategy,
      pros: ["Recommended by Medicaid planning analysis"],
      cons: ["Consult with professional for implementation details"],
      effectiveness: "Recommended",
      timing: "As recommended by analysis"
    }));
  };

  // Get strategies from API response or fallback to mock data
  const apiStrategies = eligibilityResults?.strategies || eligibilityResults?.data?.strategies || planningResults?.strategies || planningResults?.data?.strategies;
  
  // Transform strategies based on their format
  let strategies = [];
  if (apiStrategies && Array.isArray(apiStrategies)) {
    if (typeof apiStrategies[0] === 'string') {
      // Legacy string format
      strategies = transformLegacyStrategies(apiStrategies);
    } else if (apiStrategies[0] && typeof apiStrategies[0] === 'object') {
      // Enhanced object format
      strategies = transformEnhancedStrategies(apiStrategies);
    }
  }
  
  // If no strategies or transformation failed, use fallback
  if (!strategies || strategies.length === 0) {
    strategies = [
    { 
      id: 1, 
      name: "Irrevocable Trust",
      description: "Transfer assets to an irrevocable trust to remove them from Medicaid countable assets.",
      pros: ["Assets protected from Medicaid spend-down", "Potentially avoids estate recovery", "Provides legacy planning"],
      cons: ["Loss of direct control over assets", "5-year look-back period applies", "Cannot modify trust terms"],
      effectiveness: "High",
      timing: "Implement at least 5 years before anticipated need"
    },
    { 
      id: 2, 
      name: "Spousal Transfer",
      description: "Transfer assets to a community spouse to protect them while qualifying for Medicaid.",
      pros: ["No look-back period for transfers between spouses", "Community spouse retains control", "Immediate protection"],
      cons: ["Only applicable if married", "Community spouse subject to resource limits", "State variations in allowances"],
      effectiveness: "Medium-High",
      timing: "Can be implemented close to application time"
    },
    { 
      id: 3, 
      name: "Spend-Down with Exemptions",
      description: "Strategically spend resources on exempt assets to reduce countable assets.",
      pros: ["Immediate effect on eligibility", "Retain benefit of assets", "No look-back period concerns"],
      cons: ["Assets must be used, not preserved", "Limited to specific exempt categories", "May not protect all assets"],
      effectiveness: "Medium",
      timing: "Implement before application"
    }
    ];
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate HTML report
  const generateHTMLReport = (reportType: string) => {
    const isDetailed = reportType === 'detailed' || reportType === 'professional';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Medicaid Planning Report - ${clientInfo?.name || 'Client'}</title>
  <style>
    @page { size: letter; margin: 0.75in; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      margin: 0;
      color: #333;
      font-size: 11pt;
    }
    h1 { 
      color: #0C3B5E; 
      font-size: 24pt;
      margin-bottom: 10px;
      border-bottom: 3px solid #0C3B5E;
      padding-bottom: 10px;
    }
    h2 { 
      color: #0C3B5E; 
      margin-top: 30px;
      font-size: 16pt;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 5px;
    }
    h3 {
      color: #0C3B5E;
      font-size: 14pt;
      margin-top: 20px;
    }
    .header {
      margin-bottom: 30px;
    }
    .section { 
      margin-bottom: 30px; 
      page-break-inside: avoid;
    }
    .metric { 
      background: #f8f9fa; 
      padding: 15px; 
      margin: 10px 0; 
      border-radius: 5px;
      border: 1px solid #e9ecef;
      page-break-inside: avoid;
    }
    .warning { color: #dc2626; font-weight: bold; }
    .success { color: #16a34a; font-weight: bold; }
    .info { color: #0C3B5E; font-weight: bold; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
      page-break-inside: avoid;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 10px 8px; 
      text-align: left; 
    }
    th { 
      background-color: #0C3B5E; 
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) { background-color: #f8f9fa; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 10pt;
      color: #666;
    }
    @media print { 
      body { margin: 0; }
      .metric { background: #f8f9fa !important; }
      th { background-color: #0C3B5E !important; color: white !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Medicaid Planning Report</h1>
    <table style="border: none; margin-top: 20px;">
      <tr>
        <td style="border: none; padding: 5px 0;"><strong>Client:</strong></td>
        <td style="border: none; padding: 5px 0;">${clientInfo?.name || 'N/A'}</td>
        <td style="border: none; padding: 5px 0; padding-left: 40px;"><strong>Report Type:</strong></td>
        <td style="border: none; padding: 5px 0;">${reportType === 'professional' ? 'Professional' : 'Detailed'}</td>
      </tr>
      <tr>
        <td style="border: none; padding: 5px 0;"><strong>Date:</strong></td>
        <td style="border: none; padding: 5px 0;">${new Date().toLocaleDateString()}</td>
        <td style="border: none; padding: 5px 0; padding-left: 40px;"><strong>State:</strong></td>
        <td style="border: none; padding: 5px 0;">${clientInfo?.state || 'N/A'}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <p>Based on your financial assessment, qualifying for Medicaid without proper planning would require you to spend down 
    <span class="warning">${formatCurrency(keyMetrics.assetSpendDownRequired)}</span> of your assets.</p>
    
    <p>With proper Medicaid planning strategies, you can protect approximately 
    <span class="success">${formatCurrency(keyMetrics.protectableAssets)}</span> of your assets 
    (${protectionPercentage}% of total assets) while still qualifying for benefits.</p>
  </div>
  
  <div class="section">
    <h2>Current Financial Situation</h2>
    <div class="metric">
      <strong>Total Countable Assets:</strong> ${formatCurrency(actualCountableAssets)}<br>
      <strong>Total Monthly Income:</strong> ${formatCurrency(actualTotalIncome)}<br>
      <strong>Total Monthly Expenses:</strong> ${formatCurrency(keyMetrics.monthlyLTCCost)}<br>
      <strong>Time Until Asset Depletion:</strong> ${keyMetrics.monthsUntilDepleted} months
    </div>
  </div>
  
  <div class="section">
    <h2>Medicaid Eligibility Analysis</h2>
    <table>
      <tr>
        <th>Criteria</th>
        <th>Your Situation</th>
        <th>Medicaid Limit</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Asset Limit</td>
        <td>${formatCurrency(actualCountableAssets)}</td>
        <td>${formatCurrency(keyMetrics.medicaidAssetLimit)}</td>
        <td class="${keyMetrics.isResourceEligible ? 'success' : 'warning'}">
          ${keyMetrics.isResourceEligible ? 'Eligible' : `${formatCurrency(keyMetrics.assetSpendDownRequired)} over limit`}
        </td>
      </tr>
      <tr>
        <td>Income Limit</td>
        <td>${formatCurrency(actualTotalIncome)}</td>
        <td>${formatCurrency(keyMetrics.medicaidIncomeLimit)}</td>
        <td class="${keyMetrics.isIncomeEligible ? 'success' : 'warning'}">
          ${keyMetrics.isIncomeEligible ? 'Eligible' : `${formatCurrency(keyMetrics.monthlyIncomeAtRisk)} over limit`}
        </td>
      </tr>
    </table>
  </div>
  
  ${isDetailed ? `
  <div class="section">
    <h2>Recommended Strategies</h2>
    ${strategies.map((strategy: any) => `
      <div class="metric">
        <h3>${strategy.name}</h3>
        <p>${strategy.description}</p>
        <p><strong>Effectiveness:</strong> ${strategy.effectiveness}</p>
        <p><strong>Timing:</strong> ${strategy.timing}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <div class="footer">
    <p><strong>Disclaimer:</strong> This report is for informational purposes only and does not constitute legal or financial advice. 
    Medicaid rules are complex and vary by state. Please consult with a qualified Medicaid planning attorney or elder law specialist 
    for personalized advice tailored to your specific situation.</p>
    <p style="margin-top: 10px; text-align: center;">
      <em>Generated by Shield Your Assets Medicaid Planning System</em>
    </p>
  </div>
</body>
</html>
    `;
  };

  // Check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Download report as HTML fallback for mobile
  const downloadAsHTML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Generate PDF using jsPDF
  const generatePDFWithJsPDF = async (reportType: string) => {
    const filename = `medicaid-plan-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up fonts and colors
      const primaryColor = [12, 59, 94]; // Shield Navy color
      const successColor = [22, 163, 74];
      const warningColor = [220, 38, 38];
      
      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Medicaid Planning Report', 20, 30);
      
      // Add detailed client info
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      let yPos = 45;
      
      pdf.setFont(undefined, 'bold');
      pdf.text('Client Information', 20, yPos);
      pdf.setFont(undefined, 'normal');
      yPos += 8;
      
      // Basic Info
      pdf.text(`Name: ${clientInfo?.name || 'N/A'}`, 20, yPos);
      pdf.text(`Age: ${clientInfo?.age || 'N/A'}`, 120, yPos);
      yPos += 6;
      
      pdf.text(`State: ${clientInfo?.state || 'N/A'}`, 20, yPos);
      pdf.text(`Marital Status: ${clientInfo?.maritalStatus || 'N/A'}`, 120, yPos);
      yPos += 6;
      
      pdf.text(`Health Status: ${clientInfo?.healthStatus || 'N/A'}`, 20, yPos);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 120, yPos);
      yPos += 6;
      
      pdf.text(`Report Type: ${reportType === 'professional' ? 'Professional' : 'Detailed'}`, 20, yPos);
      yPos += 10;
      
      // Assets Summary
      pdf.setFont(undefined, 'bold');
      pdf.text('Assets Summary', 20, yPos);
      pdf.setFont(undefined, 'normal');
      yPos += 6;
      
      pdf.text(`Total Countable Assets: $${actualCountableAssets.toLocaleString()}`, 20, yPos);
      pdf.text(`Non-Countable Assets: $${actualNonCountableAssets.toLocaleString()}`, 120, yPos);
      yPos += 6;
      
      if (assets?.checking || assets?.savings || assets?.moneyMarket) {
        pdf.text(`Cash Assets: $${((assets?.checking || 0) + (assets?.savings || 0) + (assets?.moneyMarket || 0)).toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (assets?.homeValue) {
        pdf.text(`Home Value: $${assets.homeValue.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (assets?.vehicles) {
        pdf.text(`Vehicles: $${assets.vehicles.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      yPos += 5;
      
      // Income Summary
      pdf.setFont(undefined, 'bold');
      pdf.text('Income Summary', 20, yPos);
      pdf.setFont(undefined, 'normal');
      yPos += 6;
      
      pdf.text(`Total Monthly Income: $${actualTotalIncome.toLocaleString()}`, 20, yPos);
      yPos += 5;
      
      if (income?.socialSecurity) {
        pdf.text(`Social Security: $${income.socialSecurity.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (income?.pension) {
        pdf.text(`Pension: $${income.pension.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (income?.annuity || income?.rental || income?.investment) {
        const otherIncome = (income?.annuity || 0) + (income?.rental || 0) + (income?.investment || 0);
        pdf.text(`Other Income: $${otherIncome.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      // Expenses Summary
      pdf.setFont(undefined, 'bold');
      pdf.text('Monthly Expenses Summary', 20, yPos);
      pdf.setFont(undefined, 'normal');
      yPos += 6;
      
      if (expenses?.housing) {
        pdf.text(`Housing: $${expenses.housing.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (expenses?.medical || expenses?.healthInsurance) {
        const totalMedical = (expenses?.medical || 0) + (expenses?.healthInsurance || 0) + (expenses?.medicalTotal || 0);
        pdf.text(`Medical Expenses: $${totalMedical.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (expenses?.food) {
        pdf.text(`Food: $${expenses.food.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (expenses?.utilities) {
        pdf.text(`Utilities: $${expenses.utilities.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      if (expenses?.transportation) {
        pdf.text(`Transportation: $${expenses.transportation.toLocaleString()}`, 20, yPos);
        yPos += 5;
      }
      
      yPos += 10;
      
      // Add executive summary
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFont(undefined, 'bold');
      pdf.text('Executive Summary', 20, yPos);
      pdf.setFont(undefined, 'normal');
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const summaryText = `Based on your financial assessment, qualifying for Medicaid without proper planning would require you to spend down $${keyMetrics.assetSpendDownRequired.toLocaleString()} of your assets.`;
      const lines = pdf.splitTextToSize(summaryText, 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 5 + 5;
      
      pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
      const savingsText = `With proper Medicaid planning strategies, you can protect approximately $${keyMetrics.protectableAssets.toLocaleString()} of your assets (${protectionPercentage}% of total assets) while still qualifying for benefits.`;
      const savingsLines = pdf.splitTextToSize(savingsText, 170);
      pdf.text(savingsLines, 20, yPos);
      yPos += savingsLines.length * 5 + 10;
      
      // Add financial situation
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFont(undefined, 'bold');
      pdf.text('Current Financial Situation', 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      
      // Financial metrics table
      const financialData = [
        ['Total Countable Assets:', `$${actualCountableAssets.toLocaleString()}`],
        ['Total Monthly Income:', `$${actualTotalIncome.toLocaleString()}`],
        ['Total Monthly Expenses:', `$${keyMetrics.monthlyLTCCost.toLocaleString()}`],
        ['Time Until Asset Depletion:', `${keyMetrics.monthsUntilDepleted} months`]
      ];
      
      financialData.forEach(([label, value]) => {
        pdf.text(label, 20, yPos);
        pdf.text(value, 100, yPos);
        yPos += 6;
      });
      yPos += 10;
      
      // Add eligibility analysis
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFont(undefined, 'bold');
      pdf.text('Medicaid Eligibility Analysis', 20, yPos);
      yPos += 10;
      
      // Simple table for eligibility
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      // Table headers
      pdf.setFont(undefined, 'bold');
      pdf.text('Criteria', 20, yPos);
      pdf.text('Your Situation', 60, yPos);
      pdf.text('Medicaid Limit', 100, yPos);
      pdf.text('Status', 140, yPos);
      yPos += 6;
      
      // Draw line under headers
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPos - 2, 190, yPos - 2);
      
      // Asset row
      pdf.setFont(undefined, 'normal');
      pdf.text('Asset Limit', 20, yPos);
      pdf.text(`$${actualCountableAssets.toLocaleString()}`, 60, yPos);
      pdf.text(`$${keyMetrics.medicaidAssetLimit.toLocaleString()}`, 100, yPos);
      const resourceColor = keyMetrics.isResourceEligible ? successColor : warningColor;
      pdf.setTextColor(resourceColor[0], resourceColor[1], resourceColor[2]);
      pdf.text(keyMetrics.isResourceEligible ? 'Eligible' : `$${keyMetrics.assetSpendDownRequired.toLocaleString()} over`, 140, yPos);
      yPos += 6;
      
      // Income row
      pdf.setTextColor(0, 0, 0);
      pdf.text('Income Limit', 20, yPos);
      pdf.text(`$${actualTotalIncome.toLocaleString()}`, 60, yPos);
      pdf.text(`$${keyMetrics.medicaidIncomeLimit.toLocaleString()}`, 100, yPos);
      const incomeColor = keyMetrics.isIncomeEligible ? successColor : warningColor;
      pdf.setTextColor(incomeColor[0], incomeColor[1], incomeColor[2]);
      pdf.text(keyMetrics.isIncomeEligible ? 'Eligible' : `$${keyMetrics.monthlyIncomeAtRisk.toLocaleString()} over`, 140, yPos);
      yPos += 15;
      
      // Add strategies if professional report
      if ((reportType === 'professional' || reportType === 'detailed') && yPos < 250) {
        pdf.setFontSize(14);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFont(undefined, 'bold');
        pdf.text('Recommended Strategies', 20, yPos);
        yPos += 8;
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
        
        strategies.slice(0, 2).forEach((strategy: any) => {
          if (yPos > 250) {
            pdf.addPage();
            yPos = 30;
          }
          
          pdf.setFont(undefined, 'bold');
          pdf.text(strategy.name, 20, yPos);
          pdf.setFont(undefined, 'normal');
          yPos += 6;
          
          const descLines = pdf.splitTextToSize(strategy.description, 170);
          pdf.text(descLines, 20, yPos);
          yPos += descLines.length * 5 + 8;
        });
      }
      
      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Generated by Shield Your Assets Medicaid Planning System', 105, 285, { align: 'center' });
        pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(filename);
      
      toast({
        title: "PDF Downloaded",
        description: `Your ${reportType} report has been downloaded as ${filename}`,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to HTML method
      generatePDF(reportType);
    }
  };
  
  // Original browser print dialog method (fallback)
  const generatePDF = (reportType: string) => {
    const reportHtml = generateHTMLReport(reportType);
    const filename = `medicaid-plan-${reportType}-${new Date().toISOString().split('T')[0]}`;
    
    // For mobile devices, download as HTML
    if (isMobileDevice()) {
      downloadAsHTML(reportHtml, `${filename}.html`);
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded as an HTML file that can be opened in any browser.",
      });
      return;
    }
    
    // For desktop, use print dialog
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      
      // Add print styles for PDF generation
      const style = printWindow.document.createElement('style');
      style.textContent = `
        @media print {
          @page { margin: 0.5in; }
          body { margin: 0; }
        }
      `;
      printWindow.document.head.appendChild(style);
      
      // Trigger print dialog after content loads
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close window after print dialog
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 250);
      };
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Generate the PDF report
  const handleGenerateReport = async (reportType: string = 'detailed') => {
    try {
      // Use jsPDF for direct PDF generation
      await generatePDFWithJsPDF(reportType);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state while waiting for data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-shield-navy animate-spin mb-4" />
        <h2 className="text-2xl font-semibold text-shield-navy">Loading your results...</h2>
        <p className="text-gray-500 mt-2">We're analyzing your information and preparing your personalized plan.</p>
      </div>
    );
  }

  // Show message if no results available
  if (!eligibilityResults && !planningResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="h-16 w-16 text-shield-navy mb-4" />
        <h2 className="text-2xl font-semibold text-shield-navy">No Results Available</h2>
        <p className="text-gray-500 mt-2">Please complete the Medicaid planning intake form to see your results.</p>
        <Button 
          className="mt-6 bg-shield-navy hover:bg-shield-navy/90"
          onClick={() => navigate('/asset-input')}
        >
          Go to Intake Form
        </Button>
      </div>
    );
  }

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-shield-navy mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }
  
  // Also show loading if we don't have eligibility results yet
  if (!eligibilityResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-shield-navy mb-4" />
          <p className="text-gray-600">Preparing your results...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          /* Hide navigation and buttons when printing */
          nav, .no-print { display: none !important; }
          /* Adjust margins for print */
          .container { margin: 0 !important; padding: 20px !important; }
          /* Ensure charts print properly */
          .recharts-wrapper { page-break-inside: avoid; }
          /* Force color printing */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
      {!hasValidLimits && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            ⚠️ Unable to retrieve state-specific Medicaid limits for {clientInfo?.state || 'your state'}.
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            The calculations below may not be accurate. Please verify the current Medicaid limits for your state.
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-shield-navy">Asset Protection Results</h1>
          <p className="text-gray-600 mt-2">
            Based on your asset and income information, here's how you can qualify for Medicaid without going broke.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 no-print">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleGenerateReport('detailed')}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button 
            className="flex items-center gap-2 bg-shield-navy hover:bg-shield-navy/90"
            onClick={() => handleGenerateReport('professional')}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Full Report</span>
          </Button>
        </div>
      </div>

      {/* The Problem: What's at Stake */}
      <Card className="mb-8 border-red-200 bg-red-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-shield-navy flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            The Problem: What You Stand to Lose
          </CardTitle>
          <CardDescription>
            Without proper planning, qualifying for Medicaid requires depleting your assets and income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Requirement</TableHead>
                <TableHead>What You Have</TableHead>
                <TableHead>Medicaid Allows</TableHead>
                <TableHead className="text-right">What You Risk Losing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Assets</TableCell>
                <TableCell>{formatCurrency(keyMetrics.assetsAtRisk)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell className="text-right">
                  {keyMetrics.assetSpendDownRequired > 0 
                    ? <span className="text-red-600 font-medium">{formatCurrency(keyMetrics.assetSpendDownRequired)} must be spent</span>
                    : <span className="text-green-600 font-medium">✓ Already qualified</span>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Income</TableCell>
                <TableCell>{formatCurrency(keyMetrics.clientMonthlyIncome)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit)}</TableCell>
                <TableCell className="text-right">
                  {keyMetrics.monthlyIncomeAtRisk > 0
                    ? <span className="text-red-600 font-medium">{formatCurrency(keyMetrics.monthlyIncomeAtRisk)} over limit</span>
                    : <span className="text-green-600 font-medium">✓ Already qualified</span>}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* The Solution: What Can Be Protected */}
      <Card className="mb-8 border-green-200 bg-green-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-shield-navy flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            The Solution: What You Can Protect
          </CardTitle>
          <CardDescription>
            With proper Medicaid planning strategies, you can qualify for benefits while preserving your wealth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Category</TableHead>
                <TableHead>With Planning</TableHead>
                <TableHead>Without Planning</TableHead>
                <TableHead className="text-right">Total Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Assets Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.protectableAssets)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {formatCurrency(keyMetrics.protectableAssets - keyMetrics.medicaidAssetLimit)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Income Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit + keyMetrics.protectableIncome)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit)}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {formatCurrency(keyMetrics.protectableIncome)} per month
                </TableCell>
              </TableRow>
              <TableRow className="bg-green-100/50">
                <TableCell className="font-bold">Total Value Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.protectableAssets)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell className="text-right text-green-600 font-bold">
                  {formatCurrency(keyMetrics.totalAssetSavings)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Countdown - Create Urgency */}
      <Card className="mb-8 border-red-300 bg-red-50/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-red-700 flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-600" />
            Your Financial Countdown
          </CardTitle>
          <CardDescription className="text-red-600 font-medium">
            At {formatCurrency(keyMetrics.monthlyLTCCost)}/month in care costs:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-2xl font-bold text-red-700">{keyMetrics.monthsUntilDepleted} months until your life savings are gone</div>
                <div className="text-sm text-red-600">({Math.floor(keyMetrics.monthsUntilDepleted/12)} years, {keyMetrics.monthsUntilDepleted % 12} months)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div className="text-lg text-red-700">
                That's <span className="font-bold">
                  {new Date(Date.now() + keyMetrics.monthsUntilDepleted * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div className="text-lg text-red-700">
                <span className="font-bold">{formatCurrency(keyMetrics.assetSpendDownRequired)}</span> will disappear forever
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced tab navigation - more prominent styling */}
      <div className="relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-r from-shield-navy/10 via-shield-teal/20 to-shield-navy/10 rounded-lg -z-10"></div>
        <Tabs 
          defaultValue="overview" 
          className="w-full" 
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full grid grid-cols-3 p-1 bg-transparent gap-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-shield-teal data-[state=active]:text-white py-3 text-sm sm:text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="strategies" 
              className="data-[state=active]:bg-shield-teal data-[state=active]:text-white py-3 text-sm sm:text-base"
            >
              Recommended Strategies
            </TabsTrigger>
            <TabsTrigger 
              value="eligibility" 
              className="data-[state=active]:bg-shield-teal data-[state=active]:text-white py-3 text-sm sm:text-base"
            >
              Medicaid Eligibility
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of your assets by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protected vs. Unprotected</CardTitle>
                  <CardDescription>
                    Comparison of protected and unprotected assets by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assetData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="protected" name="Protected" fill="#5BC2A8" />
                      <Bar dataKey="value" name="Total Value" fill="#0C3B5E" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Your Medicaid Asset Protection Report */}
            <Card className="mt-6">
              <CardHeader className="text-center border-b-4 border-shield-navy pb-4">
                <CardTitle className="text-2xl text-shield-navy">Your Medicaid Asset Protection Report</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Protect Your Life's Work While Qualifying for Benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Emotional Hook */}
                  <div className="bg-gray-50 p-6 border-l-4 border-shield-navy text-gray-700 text-lg leading-relaxed">
                    <strong>You've worked your entire life to build financial security.</strong> You've saved, invested, and planned for the future. Now, with care costs of {formatCurrency(keyMetrics.monthlyLTCCost)} per month threatening to wipe out everything you've built, you're facing an impossible choice: get the care you need or preserve your legacy.
                    <br /><br />
                    <strong>But here's what most people don't know:</strong> There's a completely legal way to protect your assets AND qualify for Medicaid benefits.
                  </div>

                  {/* Countdown Warning */}
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
                    <div className="text-yellow-800 text-xl font-bold mb-4">⚠️ Your Financial Countdown</div>
                    <div className="space-y-3 text-yellow-800">
                      <div className="text-lg">
                        <span className="text-2xl mr-3">💰</span>Current care costs: <strong>{formatCurrency(keyMetrics.monthlyLTCCost)}/month</strong>
                      </div>
                      <div className="text-lg">
                        <span className="text-2xl mr-3">⏰</span>Time until savings depleted: <strong>{keyMetrics.monthsUntilDepleted} months</strong>
                      </div>
                      <div className="text-lg">
                        <span className="text-2xl mr-3">📅</span>That's <strong>
                          {new Date(Date.now() + keyMetrics.monthsUntilDepleted * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </strong>
                      </div>
                      <div className="text-lg">
                        <span className="text-2xl mr-3">🔥</span>Total at risk: <strong className="text-red-600">{formatCurrency(keyMetrics.assetSpendDownRequired)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Path Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
                      <div className="text-red-900 text-xl font-bold mb-4">Path 1: Do Nothing</div>
                      <div className="text-3xl font-bold text-red-600 my-4">LOSE {formatCurrency(keyMetrics.assetSpendDownRequired)}</div>
                      <p className="text-red-700">Watch your life savings disappear<br />in less than 2 years</p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                      <div className="text-green-900 text-xl font-bold mb-4">Path 2: Protect Your Assets</div>
                      <div className="text-3xl font-bold text-green-600 my-4">SAVE {formatCurrency(keyMetrics.protectableAssets)}</div>
                      <p className="text-green-700">Keep {protectionPercentage}% of your assets<br />AND qualify for Medicaid</p>
                    </div>
                  </div>

                  {/* What Protection Provides */}
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
                    <div className="text-green-900 text-2xl font-bold text-center mb-6">What Medicaid Planning Protects For You</div>
                    <div className="space-y-4">
                      <div className="flex items-start text-green-800 text-lg">
                        <span className="text-green-500 text-xl mr-3">✓</span>
                        <span><strong>{formatCurrency(keyMetrics.protectableAssets)} protected</strong> - Your financial cushion remains intact</span>
                      </div>
                      <div className="flex items-start text-green-800 text-lg">
                        <span className="text-green-500 text-xl mr-3">✓</span>
                        <span><strong>Your monthly income</strong> - Keep receiving {formatCurrency(keyMetrics.clientMonthlyIncome)}/month</span>
                      </div>
                      <div className="flex items-start text-green-800 text-lg">
                        <span className="text-green-500 text-xl mr-3">✓</span>
                        <span><strong>Your home</strong> - May be protected for your spouse or family</span>
                      </div>
                      <div className="flex items-start text-green-800 text-lg">
                        <span className="text-green-500 text-xl mr-3">✓</span>
                        <span><strong>Your legacy</strong> - Leave something meaningful to loved ones</span>
                      </div>
                      <div className="flex items-start text-green-800 text-lg">
                        <span className="text-green-500 text-xl mr-3">✓</span>
                        <span><strong>Your dignity</strong> - Qualify for benefits without becoming destitute</span>
                      </div>
                    </div>
                  </div>

                  {/* Legal Assurance */}
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 text-center">
                    <div className="text-blue-800 text-xl font-bold mb-3">🛡️ This is 100% Legal</div>
                    <p className="text-blue-700">
                      Medicaid planning uses government-approved strategies that have been available for decades. You're not hiding assets or doing anything wrong - you're simply using the same rules that wealthy families have used to protect their legacies while qualifying for benefits.
                    </p>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-shield-navy text-white rounded-lg p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Your Next Step to Financial Protection</h3>
                    <p className="text-lg mb-6">In our upcoming strategy call, we'll discuss:</p>
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <div className="text-lg">✓ Which specific strategies work best for YOUR situation</div>
                      <div className="text-lg">✓ How quickly we can start protecting your assets</div>
                      <div className="text-lg">✓ What documents you'll need to get started</div>
                      <div className="text-lg">✓ Your personalized protection timeline</div>
                    </div>
                    <p className="text-base mt-6 mb-6">
                      After our call, you'll have the option to meet with our specialized Medicaid planning attorney who can implement your customized protection plan.
                    </p>
                    <Button className="bg-white text-shield-navy hover:bg-gray-100 text-lg px-8 py-3 font-bold">
                      Ready to Protect Your Assets
                    </Button>
                  </div>

                  {/* Final Warning */}
                  <div className="text-center text-gray-600 mt-8">
                    <p className="text-lg">
                      <strong>Don't wait.</strong> Every month you delay costs you {formatCurrency(keyMetrics.monthlyLTCCost)} from your life savings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies Tab Content */}
          <TabsContent value="strategies" className="mt-6">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="text-center mb-10 pb-6 border-b-4 border-shield-navy">
                <h1 className="text-3xl font-bold text-shield-navy mb-3">Your Personalized Protection Strategies</h1>
                <p className="text-lg text-gray-600">
                  Based on your situation, here are the best ways to protect your {formatCurrency(keyMetrics.protectableAssets)}
                </p>
              </div>

              {/* Intro Box */}
              <div className="bg-gray-50 p-6 rounded-lg text-lg leading-relaxed">
                <strong>Good news!</strong> You have multiple strategies available that can protect your assets while qualifying for Medicaid. We've identified the most effective approaches for your situation, organized by how quickly they can help you. The strategies marked in <span className="text-green-600 font-bold">green</span> can be implemented immediately with no waiting period.
              </div>

              {/* Enhanced Strategy Cards - Organized by Legal vs Financial */}
              {(() => {
                // Categorize strategies into Legal vs Financial
                const legalStrategies = [
                  'Irrevocable Trust Planning',
                  'Spousal Transfer Strategy', 
                  'Primary Residence Protection Strategy',
                  'Caregiver Child Exception Strategy',
                  'Half-a-Loaf Strategy'
                ];

                const categorizeStrategy = (strategy: any) => {
                  return legalStrategies.includes(strategy.formalName) ? 'legal' : 'financial';
                };

                const legalStrategiesList = strategies.filter(s => categorizeStrategy(s) === 'legal');
                const financialStrategiesList = strategies.filter(s => categorizeStrategy(s) === 'financial');

                // Strategy Card Renderer Function
                const renderStrategyCard = (strategy: any) => {
                  // Determine strategy type and styling based on timing category
                  const getStrategyType = (timingCategory: string) => {
                    switch (timingCategory) {
                      case 'immediate':
                        return {
                          containerClass: 'border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300',
                          headerClass: 'bg-green-50 border-b-2 border-green-500',
                          titleClass: 'text-green-800',
                          badgeClass: 'bg-green-500 text-white',
                          badgeText: '🟢 IMMEDIATE - No Waiting!'
                        };
                      case 'long_term':
                        return {
                          containerClass: 'border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300',
                          headerClass: 'bg-yellow-50 border-b-2 border-yellow-500',
                          titleClass: 'text-yellow-800',
                          badgeClass: 'bg-yellow-500 text-white',
                          badgeText: '🟡 LONG-TERM - Plan Ahead'
                        };
                      default:
                        return {
                          containerClass: 'border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300',
                          headerClass: 'bg-blue-50 border-b-2 border-blue-500',
                          titleClass: 'text-blue-800',
                          badgeClass: 'bg-blue-500 text-white',
                          badgeText: '🔵 SPECIALIZED - Custom Solution'
                        };
                    }
                  };

                  const strategyType = getStrategyType(strategy.timingCategory || strategy.timing);

                  return (
                    <div key={strategy.id} className={`rounded-lg overflow-hidden ${strategyType.containerClass} mb-6`}>
                      {/* Strategy Header */}
                      <div className={`p-6 relative ${strategyType.headerClass}`}>
                        <div className="absolute top-4 right-5">
                          <span className={`px-4 py-1 rounded-full text-sm font-bold ${strategyType.badgeClass}`}>
                            {strategyType.badgeText}
                          </span>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${strategyType.titleClass} pr-48`}>
                          {strategy.friendlyName || strategy.name}
                        </h2>
                        <div className="text-sm text-gray-600 italic mb-4">
                          What attorneys call it: {strategy.formalName}
                        </div>
                        <div className="text-xl font-bold flex items-center gap-3">
                          <span>💰</span>
                          <span>What This Saves You: {strategy.savingsDescription || `Up to ${formatCurrency(keyMetrics.protectableAssets)}`}</span>
                        </div>
                      </div>

                      {/* Strategy Body */}
                      <div className="p-6">
                        {/* Emotional Hook */}
                        <div className="text-lg italic text-gray-700 mb-6 pl-5 border-l-4 border-shield-navy">
                          "{strategy.emotionalHook || strategy.description}"
                        </div>

                        {/* Plain English Explanation */}
                        <div className="bg-gray-50 p-5 rounded-lg mb-6">
                          <div className="font-bold text-shield-navy mb-3">How It Works in Plain English:</div>
                          <p className="text-gray-700">
                            {strategy.plainEnglishExplanation || strategy.description}
                          </p>
                        </div>

                        {/* Benefits Section */}
                        <div className="mb-6">
                          <div className="text-lg font-bold text-shield-navy mb-4">Real Benefits for Your Family:</div>
                          <div className="space-y-3">
                            {(strategy.realBenefits || strategy.pros || []).map((benefit: any, index: number) => (
                              <div key={index} className="flex items-start gap-3 text-base">
                                <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                                <span>
                                  <strong>{typeof benefit === 'object' ? benefit.title : benefit}</strong>
                                  {typeof benefit === 'object' && benefit.description && (
                                    <span className="text-gray-600"> - {benefit.description}</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Limitations Section */}
                        <div className="bg-gray-50 p-5 rounded-lg mb-6">
                          <div className="font-bold text-gray-700 mb-3">What to Know:</div>
                          <div className="space-y-2">
                            {(strategy.whatToKnow || strategy.cons || []).map((limitation: string, index: number) => (
                              <div key={index} className="text-gray-600 text-sm pl-5 relative">
                                <span className="absolute left-1">•</span>
                                {limitation}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Effectiveness Box */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">Success Rate</div>
                            <div className="text-xl font-bold text-shield-navy">
                              {strategy.effectivenessMetrics?.successRate || `${strategy.effectivenessScore || 8}/10`}
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">Protection Amount</div>
                            <div className="text-xl font-bold text-shield-navy">
                              {strategy.effectivenessMetrics?.protectionAmount || strategy.savingsDescription || 'Varies'}
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">Time to Implement</div>
                            <div className="text-xl font-bold text-shield-navy">
                              {strategy.effectivenessMetrics?.timeToImplement || strategy.timing || 'Varies'}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Line */}
                        <div className="bg-shield-navy text-white p-5 rounded-lg text-lg font-bold text-center mb-5">
                          💡 The Bottom Line: {strategy.bottomLine || 'This strategy provides significant protection for your assets while maintaining Medicaid eligibility.'}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                          <Button className="bg-white text-shield-navy border-2 border-shield-navy hover:bg-shield-navy hover:text-white text-base px-8 py-3 font-bold transition-all duration-300">
                            Learn More About This Strategy
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {/* Legal Strategies Section */}
                    {legalStrategiesList.length > 0 && (
                      <>
                        <div className="mt-8 mb-6">
                          <h2 className="text-2xl font-bold text-shield-navy mb-2">⚖️ Legal Protection Strategies</h2>
                          <p className="text-gray-600">These strategies use legal structures and rules to protect your assets</p>
                        </div>
                        {legalStrategiesList.map((strategy: any) => renderStrategyCard(strategy))}
                      </>
                    )}

                    {/* Financial Strategies Section */}
                    {financialStrategiesList.length > 0 && (
                      <>
                        <div className="mt-8 mb-6">
                          <h2 className="text-2xl font-bold text-shield-navy mb-2">💰 Financial Protection Strategies</h2>
                          <p className="text-gray-600">These strategies use financial products and conversions to protect your wealth</p>
                        </div>
                        {financialStrategiesList.map((strategy: any) => renderStrategyCard(strategy))}
                      </>
                    )}
                  </>
                );
              })()}

              {/* Summary Box */}
              <div className="bg-shield-navy text-white p-8 rounded-lg text-center mt-10">
                <h2 className="text-2xl font-bold mb-4">Your Next Step to Protecting {formatCurrency(keyMetrics.protectableAssets)}</h2>
                <p className="text-lg mb-4">
                  These are just {strategies.length} of the strategies available to protect your assets. On our call, we'll review which combination works best for your specific situation and answer all your questions.
                </p>
                <p className="text-xl font-bold">
                  Remember: Every month you wait costs you {formatCurrency(keyMetrics.monthlyLTCCost)} from your savings.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Eligibility Tab Content */}
          <TabsContent value="eligibility" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Eligibility Impact</CardTitle>
                  <CardDescription>
                    Comparison of asset eligibility before and after implementing strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eligibilityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="unprotected" name="Countable Assets" fill="#FF8042" />
                      <Bar dataKey="threshold" name="Medicaid Threshold" fill="#0C3B5E" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Eligibility Impact</CardTitle>
                  <CardDescription>
                    Comparison of income eligibility before and after implementing strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={incomeEligibilityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="income" name="Monthly Income" fill="#FF8042" />
                      <Bar dataKey="threshold" name="Medicaid Threshold" fill="#0C3B5E" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
                <CardDescription>
                  Understanding Medicaid eligibility criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enhanced HTML Report (if available) */}
                {eligibilityResults?.enhancedReport ? (
                  <div 
                    className="enhanced-eligibility-report"
                    style={{
                      /* Reset any inherited styles */
                      all: 'initial',
                      /* Restore some essential display properties */
                      display: 'block',
                      width: '100%',
                      fontFamily: 'inherit',
                      lineHeight: 'inherit',
                      color: 'inherit'
                    }}
                    dangerouslySetInnerHTML={{ __html: eligibilityResults.enhancedReport }}
                  />
                ) : (
                  /* Fallback to basic eligibility display */
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Below are the specific Medicaid eligibility requirements for your state and situation. These are the actual values used in your assessment:
                    </p>
                    
                    <div className="space-y-4 mt-4">
                      {/* State-Specific Data Section */}
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-shield-navy mb-2">Your State-Specific Requirements:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">State:</span>
                            <span className="ml-2">{clientInfo?.state || eligibilityResults?.state || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Marital Status:</span>
                            <span className="ml-2">{clientInfo?.maritalStatus || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Asset Limit (Your Category):</span>
                            <span className="ml-2">{formatCurrency(eligibilityResults?.resourceLimit || 0)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Income Limit (Your Category):</span>
                            <span className="ml-2">{formatCurrency(eligibilityResults?.incomeLimit || 0)} per month</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-shield-navy">Asset Limits:</h4>
                        <ul className="list-disc pl-5 mt-1">
                          <li className="text-gray-700">
                            Your applicable limit: {formatCurrency(eligibilityResults?.resourceLimit || keyMetrics.medicaidAssetLimit)} in countable assets
                          </li>
                          <li className="text-gray-700">
                            Current countable assets: {formatCurrency(eligibilityResults?.countableAssets || 0)}
                          </li>
                          <li className="text-gray-700">
                            Status: {eligibilityResults?.isResourceEligible ? 
                              <span className="text-green-600 font-medium">✓ Eligible</span> : 
                              <span className="text-red-600 font-medium">✗ Exceeds limit by {formatCurrency(eligibilityResults?.excessResources || 0)}</span>
                            }
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-shield-navy">Income Limits:</h4>
                        <ul className="list-disc pl-5 mt-1">
                          <li className="text-gray-700">
                            Your applicable limit: {formatCurrency(eligibilityResults?.incomeLimit || keyMetrics.medicaidIncomeLimit)} per month
                          </li>
                          <li className="text-gray-700">
                            Current monthly income: {formatCurrency(eligibilityResults?.totalIncome || 0)}
                          </li>
                          <li className="text-gray-700">
                            Status: {eligibilityResults?.isIncomeEligible ? 
                              <span className="text-green-600 font-medium">✓ Eligible</span> : 
                              <span className="text-red-600 font-medium">✗ Exceeds limit</span>
                            }
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-shield-navy">Look-Back Period:</h4>
                        <p className="text-gray-700 mt-1">
                          Medicaid examines all financial transactions during the 5-year period prior to application to identify potentially disqualifying transfers.
                        </p>
                      </div>

                      {/* Debug Section for Development */}
                      {import.meta.env.DEV && eligibilityResults && (
                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                          <h4 className="font-medium text-yellow-800 mb-2">🔍 Debug: All API Data</h4>
                          <pre className="text-xs text-yellow-700 overflow-auto max-h-40">
                            {JSON.stringify(eligibilityResults, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-shield-lightBlue p-4 rounded-md mt-4">
                      <p className="text-shield-navy font-medium">Next Steps:</p>
                      <p className="text-gray-700 mt-1">
                        Schedule a detailed consultation with our Medicaid planning specialist to create a personalized eligibility timeline and implementation plan.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default ResultsDashboard;
