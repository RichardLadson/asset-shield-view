
import { useState } from "react";
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
import { Download, FileText, Printer, Share2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const assetData = [
  { name: "Real Estate", value: 320000, protected: 300000 },
  { name: "Bank Accounts", value: 85000, protected: 35000 },
  { name: "Vehicles", value: 25000, protected: 25000 },
  { name: "Investments", value: 150000, protected: 110000 },
];

// Key metrics data
const keyMetrics = {
  assetsAtRisk: 580000,
  monthlyLTCCost: 9500,
  monthsUntilDepleted: 61, // 580000 / 9500 = ~61 months
  protectableAssets: 470000,
  totalSavings: 470000, // amount protected
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const eligibilityData = [
  { name: "Without Strategy", unprotected: 580000, threshold: 2000 },
  { name: "With Strategy", unprotected: 110000, threshold: 2000 },
];

const strategies = [
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

const ResultsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total assets and protected assets
  const totalAssets = assetData.reduce((sum, item) => sum + item.value, 0);
  const totalProtected = assetData.reduce((sum, item) => sum + item.protected, 0);
  const protectionPercentage = Math.round((totalProtected / totalAssets) * 100);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-shield-navy">Asset Protection Results</h1>
          <p className="text-gray-600 mt-2">
            Based on your asset information, here are our recommended protection strategies.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button className="flex items-center gap-2 bg-shield-navy hover:bg-shield-navy/90">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Full Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-shield-navy">Financial Impact Summary</CardTitle>
          <CardDescription>
            Key metrics about your assets and long-term care planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Assets At Risk</TableCell>
                <TableCell>{formatCurrency(keyMetrics.assetsAtRisk)}</TableCell>
                <TableCell className="text-right text-gray-500">Total countable assets for Medicaid</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Long-Term Care Cost</TableCell>
                <TableCell>{formatCurrency(keyMetrics.monthlyLTCCost)}</TableCell>
                <TableCell className="text-right text-gray-500">Average cost in your area</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Months Until Assets Depleted</TableCell>
                <TableCell>{keyMetrics.monthsUntilDepleted} months ({Math.floor(keyMetrics.monthsUntilDepleted/12)} years, {keyMetrics.monthsUntilDepleted % 12} months)</TableCell>
                <TableCell className="text-right text-gray-500">Without Medicaid planning</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Assets That Can Be Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.protectableAssets)}</TableCell>
                <TableCell className="text-right text-gray-500">Using recommended strategies</TableCell>
              </TableRow>
              <TableRow className="bg-shield-lightBlue/30">
                <TableCell className="font-bold">Total Potential Savings</TableCell>
                <TableCell className="font-bold text-shield-navy">{formatCurrency(keyMetrics.totalSavings)}</TableCell>
                <TableCell className="text-right text-gray-600">With proper Medicaid planning</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Assets</CardTitle>
            <CardDescription>Current value of all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-navy">{formatCurrency(totalAssets)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Protected Assets</CardTitle>
            <CardDescription>With recommended strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-teal">{formatCurrency(totalProtected)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Protection Rate</CardTitle>
            <CardDescription>Percentage of assets protected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-navy">{protectionPercentage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-shield-teal h-2.5 rounded-full" 
                style={{ width: `${protectionPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Recommended Strategies</TabsTrigger>
          <TabsTrigger value="eligibility">Medicaid Eligibility</TabsTrigger>
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
                      {assetData.map((entry, index) => (
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
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="protected" name="Protected" fill="#5BC2A8" />
                    <Bar dataKey="value" name="Total Value" fill="#0C3B5E" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Summary of Recommendations</CardTitle>
              <CardDescription>
                Based on your specific financial situation, we recommend the following protection strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our analysis indicates that you can protect approximately <span className="font-semibold text-shield-navy">{protectionPercentage}%</span> of your assets through strategic Medicaid planning. The recommendations below are tailored to your specific situation.
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Real Estate Protection:</span> Utilize an irrevocable trust to protect your primary residence while maintaining the right to live there.
                  </li>
                  <li>
                    <span className="font-medium">Liquid Assets:</span> Convert some countable assets to exempt assets and establish a spend-down strategy for non-exempt funds.
                  </li>
                  <li>
                    <span className="font-medium">Investments:</span> Restructure retirement accounts to maximize spousal protections and consider annuity conversions for single applicants.
                  </li>
                  <li>
                    <span className="font-medium">Personal Property:</span> Document and preserve exempt assets like vehicles and personal belongings.
                  </li>
                </ul>
                
                <div className="bg-shield-lightBlue p-4 rounded-md mt-4">
                  <p className="text-shield-navy font-medium">Important Timeline Consideration:</p>
                  <p className="text-gray-700 mt-1">
                    For maximum protection, these strategies should be implemented at least 5 years before applying for Medicaid due to the look-back period. Please consult with our advisors to create a detailed implementation timeline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab Content */}
        <TabsContent value="strategies" className="mt-6">
          <div className="space-y-6">
            {strategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-shield-navy mb-2">Benefits</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {strategy.pros.map((pro, index) => (
                          <li key={index} className="text-gray-700">{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-shield-navy mb-2">Limitations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {strategy.cons.map((con, index) => (
                          <li key={index} className="text-gray-700">{con}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium text-shield-navy mb-1">Effectiveness</h4>
                        <div className="flex items-center">
                          <div className={`h-2.5 rounded-full w-full ${
                            strategy.effectiveness === "High" 
                              ? "bg-green-500" 
                              : strategy.effectiveness === "Medium-High"
                              ? "bg-teal-500"
                              : "bg-yellow-500"
                          }`}></div>
                          <span className="ml-2 text-sm text-gray-700">{strategy.effectiveness}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-shield-navy mb-1">Timing</h4>
                        <p className="text-sm text-gray-700">{strategy.timing}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button className="bg-shield-navy hover:bg-shield-navy/90">
                      Learn More About This Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Eligibility Tab Content */}
        <TabsContent value="eligibility" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Medicaid Eligibility Impact</CardTitle>
                <CardDescription>
                  Comparison of eligibility before and after implementing strategies
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
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
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
                <CardTitle>Eligibility Requirements</CardTitle>
                <CardDescription>
                  Understanding Medicaid eligibility criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    To qualify for Medicaid long-term care benefits, you must meet both financial and medical eligibility requirements. These requirements vary by state, but generally include:
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium text-shield-navy">Asset Limits:</h4>
                      <ul className="list-disc pl-5 mt-1">
                        <li className="text-gray-700">Single applicant: $2,000 in countable assets</li>
                        <li className="text-gray-700">Married couples (if one spouse needs care): Community spouse may keep between $29,724 and $148,620 (2023 figures)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-shield-navy">Income Limits:</h4>
                      <ul className="list-disc pl-5 mt-1">
                        <li className="text-gray-700">Varies by state, typically up to 300% of SSI federal benefit rate</li>
                        <li className="text-gray-700">Some states have "medically needy" programs for those with higher incomes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-shield-navy">Look-Back Period:</h4>
                      <p className="text-gray-700 mt-1">
                        Medicaid examines all financial transactions during the 5-year period prior to application to identify potentially disqualifying transfers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-shield-lightBlue p-4 rounded-md mt-4">
                    <p className="text-shield-navy font-medium">Next Steps:</p>
                    <p className="text-gray-700 mt-1">
                      Schedule a detailed consultation with our Medicaid planning specialist to create a personalized eligibility timeline and implementation plan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDashboard;
