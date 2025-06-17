
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanningContext } from "@/context/PlanningContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Home,
  FileText,
  TrendingUp,
  Shield
} from "lucide-react";
import { ResultsDashboardSkeleton } from "./ResultsDashboardSkeleton";

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const { 
    eligibilityResults, 
    planningResults, 
    assets, 
    income, 
    clientInfo, 
    loading 
  } = usePlanningContext();
  
  const [hasCheckedForResults, setHasCheckedForResults] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("🔍 ResultsDashboard mounted");
    console.log("📊 eligibilityResults:", eligibilityResults);
    console.log("📊 planningResults:", planningResults);
    console.log("📊 assets:", assets);
    console.log("📊 income:", income);
    console.log("📊 clientInfo:", clientInfo);
    console.log("⏳ loading:", loading);
  }, [eligibilityResults, planningResults, assets, income, clientInfo, loading]);

  // Check if we have results after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!eligibilityResults && !planningResults && !loading) {
        console.log("❌ No results available after delay, redirecting to form");
        navigate('/asset-input');
      }
      setHasCheckedForResults(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [eligibilityResults, planningResults, loading, navigate]);

  // Show loading state
  if (loading || !hasCheckedForResults) {
    return <ResultsDashboardSkeleton />;
  }

  // Show message if no results
  if (!eligibilityResults && !planningResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No results available. Please complete the assessment first.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/asset-input')} className="mt-4">
          Start Assessment
        </Button>
      </div>
    );
  }

  // Common card styling classes
  const cardClasses = "h-full";
  const cardHeaderClasses = "pb-4";
  const cardContentClasses = "space-y-4";
  const sectionTitleClasses = "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2";
  const metricClasses = "flex justify-between items-center py-2 border-b border-gray-100 last:border-0";
  const metricLabelClasses = "text-sm font-medium text-gray-600";
  const metricValueClasses = "text-sm font-semibold text-gray-900";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medicaid Planning Results
        </h1>
        <p className="text-gray-600">
          Comprehensive analysis of your Medicaid eligibility and planning recommendations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="overview" className="text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="strategies" className="text-sm font-medium">
            Recommended Strategies
          </TabsTrigger>
          <TabsTrigger value="eligibility" className="text-sm font-medium">
            Medicaid Eligibility
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Summary Card */}
            <Card className={cardClasses}>
              <CardHeader className={cardHeaderClasses}>
                <CardTitle className={sectionTitleClasses}>
                  <Users className="h-5 w-5 text-blue-600" />
                  Client Summary
                </CardTitle>
              </CardHeader>
              <CardContent className={cardContentClasses}>
                <div className="space-y-3">
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>Name</span>
                    <span className={metricValueClasses}>{clientInfo?.name || 'N/A'}</span>
                  </div>
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>Age</span>
                    <span className={metricValueClasses}>{clientInfo?.age || 'N/A'}</span>
                  </div>
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>Marital Status</span>
                    <span className={metricValueClasses}>{clientInfo?.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>State</span>
                    <span className={metricValueClasses}>{clientInfo?.state || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview Card */}
            <Card className={cardClasses}>
              <CardHeader className={cardHeaderClasses}>
                <CardTitle className={sectionTitleClasses}>
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className={cardContentClasses}>
                <div className="space-y-3">
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>Total Assets</span>
                    <span className={metricValueClasses}>
                      ${assets?.totalValue?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className={metricClasses}>
                    <span className={metricLabelClasses}>Monthly Income</span>
                    <span className={metricValueClasses}>
                      ${income?.totalMonthly?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  {eligibilityResults?.data && (
                    <>
                      <div className={metricClasses}>
                        <span className={metricLabelClasses}>Resource Limit</span>
                        <span className={metricValueClasses}>
                          ${eligibilityResults.data.resourceLimit?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className={metricClasses}>
                        <span className={metricLabelClasses}>Income Limit</span>
                        <span className={metricValueClasses}>
                          ${eligibilityResults.data.incomeLimit?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eligibility Status Card */}
          {eligibilityResults?.data && (
            <Card className={cardClasses}>
              <CardHeader className={cardHeaderClasses}>
                <CardTitle className={sectionTitleClasses}>
                  <Shield className="h-5 w-5 text-purple-600" />
                  Eligibility Status
                </CardTitle>
              </CardHeader>
              <CardContent className={cardContentClasses}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    {eligibilityResults.data.isResourceEligible ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Resource Eligibility</p>
                      <p className="text-sm text-gray-600">
                        {eligibilityResults.data.isResourceEligible ? 'Eligible' : 'Not Eligible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    {eligibilityResults.data.isIncomeEligible ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Income Eligibility</p>
                      <p className="text-sm text-gray-600">
                        {eligibilityResults.data.isIncomeEligible ? 'Eligible' : 'Not Eligible'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <Card className={cardClasses}>
            <CardHeader className={cardHeaderClasses}>
              <CardTitle className={sectionTitleClasses}>
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recommended Planning Strategies
              </CardTitle>
              <CardDescription>
                Customized recommendations based on your financial situation and Medicaid requirements
              </CardDescription>
            </CardHeader>
            <CardContent className={cardContentClasses}>
              {eligibilityResults?.data?.strategies && eligibilityResults.data.strategies.length > 0 ? (
                <div className="space-y-4">
                  {eligibilityResults.data.strategies.map((strategy: string, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-gray-700 leading-relaxed">{strategy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No specific strategies available. Complete the full assessment for personalized recommendations.
                  </AlertDescription>
                </Alert>
              )}

              {planningResults?.data?.recommendations && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Recommendations</h3>
                    {planningResults.data.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                            {rec.priority || 'Medium'}
                          </Badge>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{rec.title}</p>
                            <p className="text-sm text-gray-700">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eligibility Tab */}
        <TabsContent value="eligibility" className="space-y-6">
          {eligibilityResults?.data ? (
            <div className="space-y-6">
              {/* Detailed Eligibility Analysis */}
              <Card className={cardClasses}>
                <CardHeader className={cardHeaderClasses}>
                  <CardTitle className={sectionTitleClasses}>
                    <FileText className="h-5 w-5 text-purple-600" />
                    Detailed Eligibility Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of your Medicaid eligibility status
                  </CardDescription>
                </CardHeader>
                <CardContent className={cardContentClasses}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resource Analysis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Resource Analysis</h3>
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className={metricClasses}>
                          <span className={metricLabelClasses}>Current Resources</span>
                          <span className={metricValueClasses}>
                            ${eligibilityResults.data.resourceAmount?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div className={metricClasses}>
                          <span className={metricLabelClasses}>Resource Limit</span>
                          <span className={metricValueClasses}>
                            ${eligibilityResults.data.resourceLimit?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        {eligibilityResults.data.excessResources > 0 && (
                          <div className={metricClasses}>
                            <span className={metricLabelClasses}>Excess Resources</span>
                            <span className="text-sm font-semibold text-red-600">
                              ${eligibilityResults.data.excessResources?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                        )}
                        <div className="pt-2">
                          <Badge 
                            variant={eligibilityResults.data.isResourceEligible ? "default" : "destructive"}
                            className="w-full justify-center"
                          >
                            {eligibilityResults.data.isResourceEligible ? 'Resource Eligible' : 'Resource Ineligible'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Income Analysis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Income Analysis</h3>
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className={metricClasses}>
                          <span className={metricLabelClasses}>Monthly Income</span>
                          <span className={metricValueClasses}>
                            ${eligibilityResults.data.incomeAmount?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div className={metricClasses}>
                          <span className={metricLabelClasses}>Income Limit</span>
                          <span className={metricValueClasses}>
                            ${eligibilityResults.data.incomeLimit?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div className="pt-2">
                          <Badge 
                            variant={eligibilityResults.data.isIncomeEligible ? "default" : "destructive"}
                            className="w-full justify-center"
                          >
                            {eligibilityResults.data.isIncomeEligible ? 'Income Eligible' : 'Income Ineligible'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Status */}
                  <Separator className="my-6" />
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex justify-center mb-4">
                      {eligibilityResults.data.isResourceEligible && eligibilityResults.data.isIncomeEligible ? (
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Overall Medicaid Eligibility
                    </h3>
                    <p className="text-lg font-semibold">
                      {eligibilityResults.data.isResourceEligible && eligibilityResults.data.isIncomeEligible 
                        ? 'Eligible for Medicaid' 
                        : 'Not Currently Eligible for Medicaid'
                      }
                    </p>
                    {eligibilityResults.data.reasoning && (
                      <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
                        {eligibilityResults.data.reasoning}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className={cardClasses}>
              <CardContent className="flex items-center justify-center py-12">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No eligibility data available. Please complete the assessment to see detailed results.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDashboard;
