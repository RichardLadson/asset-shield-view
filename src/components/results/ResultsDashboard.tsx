
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
import { Download, FileText, Printer, Share2, DollarSign, Clock, TrendingDown, TrendingUp, Shield } from "lucide-react";
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
  // Asset metrics
  assetsAtRisk: 580000,
  monthlyLTCCost: 9500,
  monthsUntilDepleted: 61, // 580000 / 9500 = ~61 months
  protectableAssets: 470000,
  totalAssetSavings: 470000, // amount protected
  
  // Income metrics
  clientMonthlyIncome: 4200,
  medicaidIncomeLimit: 2742, // Example 2023 figure for some states (300% of SSI)
  monthlyIncomeAtRisk: 1458, // Difference between income and limit
  protectableIncome: 1350, // Example amount that can be protected
  
  // Medicaid requirements
  medicaidAssetLimit: 2000, // Typical single person asset limit
  assetSpendDownRequired: 578000, // assetsAtRisk - medicaidAssetLimit
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const eligibilityData = [
  { name: "Without Strategy", unprotected: 580000, threshold: 2000 },
  { name: "With Strategy", unprotected: 110000, threshold: 2000 },
];

const incomeEligibilityData = [
  { name: "Without Strategy", income: 4200, threshold: 2742 },
  { name: "With Strategy", income: 2650, threshold: 2742 },
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
            Based on your asset and income information, here's how you can qualify for Medicaid without going broke.
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
                <TableHead className="w-[300px]">Requirement</TableHead>
                <TableHead>Your Situation</TableHead>
                <TableHead>Medicaid Limit</TableHead>
                <TableHead className="text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Asset Limit</TableCell>
                <TableCell>{formatCurrency(keyMetrics.assetsAtRisk)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell className="text-right text-red-600 font-medium">
                  {formatCurrency(keyMetrics.assetSpendDownRequired)} spend-down required
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Income Limit</TableCell>
                <TableCell>{formatCurrency(keyMetrics.clientMonthlyIncome)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit)}</TableCell>
                <TableCell className="text-right text-red-600 font-medium">
                  {formatCurrency(keyMetrics.monthlyIncomeAtRisk)} monthly income at risk
                </TableCell>
              </TableRow>
              <TableRow className="bg-red-100/50">
                <TableCell className="font-bold">Time Until Assets Depleted</TableCell>
                <TableCell colSpan={2}>
                  Paying {formatCurrency(keyMetrics.monthlyLTCCost)} per month for long-term care
                </TableCell>
                <TableCell className="text-right text-red-600 font-bold">
                  {keyMetrics.monthsUntilDepleted} months ({Math.floor(keyMetrics.monthsUntilDepleted/12)} years, {keyMetrics.monthsUntilDepleted % 12} months)
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
                <TableHead>Without Planning</TableHead>
                <TableHead>With Planning</TableHead>
                <TableHead className="text-right">Total Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Assets Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.protectableAssets)}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {formatCurrency(keyMetrics.protectableAssets - keyMetrics.medicaidAssetLimit)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Income Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidIncomeLimit + keyMetrics.protectableIncome)}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {formatCurrency(keyMetrics.protectableIncome)} per month
                </TableCell>
              </TableRow>
              <TableRow className="bg-green-100/50">
                <TableCell className="font-bold">Total Value Protected</TableCell>
                <TableCell>{formatCurrency(keyMetrics.medicaidAssetLimit)}</TableCell>
                <TableCell>{formatCurrency(keyMetrics.protectableAssets)}</TableCell>
                <TableCell className="text-right text-green-600 font-bold">
                  {formatCurrency(keyMetrics.totalAssetSavings)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-shield-navy" />
              Total Assets
            </CardTitle>
            <CardDescription>Current value of all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-navy">{formatCurrency(totalAssets)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-4 w-4 text-shield-teal" />
              Protected Assets
            </CardTitle>
            <CardDescription>With recommended strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-teal">{formatCurrency(totalProtected)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-shield-navy" />
              Time Before Assets Depleted
            </CardTitle>
            <CardDescription>Without Medicaid planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-shield-navy">{keyMetrics.monthsUntilDepleted} months</div>
            <div className="text-sm text-gray-500">({Math.floor(keyMetrics.monthsUntilDepleted/12)} years, {keyMetrics.monthsUntilDepleted % 12} months)</div>
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
              <CardTitle>Your Medicaid Planning Story</CardTitle>
              <CardDescription>
                Understanding the financial impact of Medicaid planning on your situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Based on your financial situation, qualifying for Medicaid without proper planning would require you to spend down <span className="font-semibold text-red-600">{formatCurrency(keyMetrics.assetSpendDownRequired)}</span> of your assets and reduce your monthly income by <span className="font-semibold text-red-600">{formatCurrency(keyMetrics.monthlyIncomeAtRisk)}</span>.
                </p>
                
                <p className="text-gray-700">
                  At your current level of assets ({formatCurrency(keyMetrics.assetsAtRisk)}), paying {formatCurrency(keyMetrics.monthlyLTCCost)} per month for long-term care would deplete your savings in approximately <span className="font-semibold text-red-600">{keyMetrics.monthsUntilDepleted} months</span>, leaving you financially vulnerable.
                </p>
                
                <div className="p-4 bg-green-50 rounded-md border border-green-200 my-6">
                  <h4 className="text-shield-navy font-semibold text-lg mb-2">The Medicaid Planning Advantage</h4>
                  <p className="text-gray-700">
                    With our recommended Medicaid planning strategies, you can protect approximately <span className="font-semibold text-green-600">{formatCurrency(keyMetrics.protectableAssets)}</span> of your assets and <span className="font-semibold text-green-600">{formatCurrency(keyMetrics.protectableIncome)}</span> of monthly income while still qualifying for Medicaid benefits.
                  </p>
                  <p className="text-gray-700 mt-2">
                    This means you can secure quality long-term care through Medicaid while preserving <span className="font-semibold text-green-600">{protectionPercentage}%</span> of your assets for your financial security and legacy.
                  </p>
                </div>
                
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
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
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
              <div className="space-y-4">
                <p className="text-gray-700">
                  To qualify for Medicaid long-term care benefits, you must meet both financial and medical eligibility requirements. These requirements vary by state, but generally include:
                </p>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium text-shield-navy">Asset Limits:</h4>
                    <ul className="list-disc pl-5 mt-1">
                      <li className="text-gray-700">Single applicant: {formatCurrency(keyMetrics.medicaidAssetLimit)} in countable assets</li>
                      <li className="text-gray-700">Married couples (if one spouse needs care): Community spouse may keep between $29,724 and $148,620 (2023 figures)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-shield-navy">Income Limits:</h4>
                    <ul className="list-disc pl-5 mt-1">
                      <li className="text-gray-700">Income limit: {formatCurrency(keyMetrics.medicaidIncomeLimit)} per month (300% of SSI federal benefit rate)</li>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDashboard;
