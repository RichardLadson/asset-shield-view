import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Separator } from "../../ui/separator";

interface AssetsSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// Reusable component for asset categories
const AssetCategory = ({ 
  title, 
  description,
  children 
}: { 
  title: string; 
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="border rounded-md p-4 mb-6">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    {description && <p className="text-gray-500 text-sm mb-4">{description}</p>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

// Component for asset input with placeholder and description
const AssetInput = ({
  id,
  name,
  label,
  value,
  onChange,
  description
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input 
      id={id} 
      name={name} 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder="$0.00"
    />
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

const AssetsSection: React.FC<AssetsSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  // Calculate total assets
  const [totalAssets, setTotalAssets] = useState(0);
  
  useEffect(() => {
    // Parse all the asset values and calculate the total
    const bankAssets = 
      parseFloat(formData.totalChecking || '0') +
      parseFloat(formData.totalSavings || '0') +
      parseFloat(formData.moneyMarket || '0') +
      parseFloat(formData.cds || '0');
      
    const investmentAssets =
      parseFloat(formData.stocksBonds || '0') +
      parseFloat(formData.retirementAccounts || '0');
      
    const insuranceAssets =
      parseFloat(formData.lifeInsuranceCashValue || '0');
      
    const propertyAssets =
      parseFloat(formData.homeValue || '0') - 
      parseFloat(formData.outstandingMortgage || '0') +
      parseFloat(formData.otherRealEstate || '0');
      
    const personalAssets =
      parseFloat(formData.householdProperty || '0') +
      parseFloat(formData.vehicleValue || '0') +
      parseFloat(formData.otherAssets || '0');
    
    const calculatedTotal = 
      bankAssets + 
      investmentAssets + 
      insuranceAssets + 
      propertyAssets + 
      personalAssets;
    
    setTotalAssets(calculatedTotal);
    
    // Update form data with calculated total
    setFormData(prev => ({
      ...prev,
      totalBankAssets: bankAssets.toFixed(2),
      totalInvestmentAssets: investmentAssets.toFixed(2),
      totalInsuranceAssets: insuranceAssets.toFixed(2),
      totalPropertyAssets: propertyAssets.toFixed(2),
      totalPersonalAssets: personalAssets.toFixed(2),
      totalAssetValue: calculatedTotal.toFixed(2)
    }));
    
  }, [
    formData.totalChecking, formData.totalSavings, formData.moneyMarket, formData.cds,
    formData.stocksBonds, formData.retirementAccounts,
    formData.lifeInsuranceCashValue,
    formData.homeValue, formData.outstandingMortgage, formData.otherRealEstate,
    formData.householdProperty, formData.vehicleValue, formData.otherAssets,
    setFormData
  ]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-6">Asset Information</h3>
        <p className="text-gray-600 mb-6">
          Please enter the total values for each asset category. For jointly owned assets, 
          include the full value. Medicaid planning strategies will take ownership into account.
        </p>
        
        {/* Bank Accounts */}
        <AssetCategory 
          title="Bank Accounts" 
          description="Enter the total value of all accounts in each category."
        >
          <AssetInput
            id="totalChecking"
            name="totalChecking"
            label="Checking Accounts"
            value={formData.totalChecking || ''}
            onChange={handleInputChange}
            description="Total of all checking accounts"
          />
          
          <AssetInput
            id="totalSavings"
            name="totalSavings"
            label="Savings Accounts"
            value={formData.totalSavings || ''}
            onChange={handleInputChange}
            description="Total of all savings accounts"
          />
          
          <AssetInput
            id="moneyMarket"
            name="moneyMarket"
            label="Money Market Accounts"
            value={formData.moneyMarket || ''}
            onChange={handleInputChange}
          />
          
          <AssetInput
            id="cds"
            name="cds"
            label="Certificates of Deposit (CDs)"
            value={formData.cds || ''}
            onChange={handleInputChange}
          />
        </AssetCategory>
        
        {/* Investments */}
        <AssetCategory 
          title="Investments" 
          description="Enter the current market value of investment assets."
        >
          <AssetInput
            id="stocksBonds"
            name="stocksBonds"
            label="Stocks, Bonds, Mutual Funds"
            value={formData.stocksBonds || ''}
            onChange={handleInputChange}
          />
          
          <AssetInput
            id="retirementAccounts"
            name="retirementAccounts"
            label="Retirement Accounts (IRA, 401k)"
            value={formData.retirementAccounts || ''}
            onChange={handleInputChange}
          />
        </AssetCategory>
        
        {/* Life Insurance */}
        <AssetCategory title="Life Insurance">
          <AssetInput
            id="lifeInsuranceFaceValue"
            name="lifeInsuranceFaceValue"
            label="Face Value"
            value={formData.lifeInsuranceFaceValue || ''}
            onChange={handleInputChange}
            description="Total face value of all policies"
          />
          
          <AssetInput
            id="lifeInsuranceCashValue"
            name="lifeInsuranceCashValue"
            label="Cash Surrender Value"
            value={formData.lifeInsuranceCashValue || ''}
            onChange={handleInputChange}
            description="Current cash value if cashed out today"
          />
        </AssetCategory>
        
        {/* Real Estate */}
        <AssetCategory title="Real Estate">
          <AssetInput
            id="homeValue"
            name="homeValue"
            label="Primary Residence Value"
            value={formData.homeValue || ''}
            onChange={handleInputChange}
            description="Current market value"
          />
          
          <AssetInput
            id="outstandingMortgage"
            name="outstandingMortgage"
            label="Outstanding Mortgage"
            value={formData.outstandingMortgage || ''}
            onChange={handleInputChange}
            description="Remaining mortgage balance"
          />
          
          <div className="col-span-2 my-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="intentToReturnHome" 
                name="intentToReturnHome" 
                checked={formData.intentToReturnHome}
                onCheckedChange={(checked) => 
                  setFormData({...formData, intentToReturnHome: checked as boolean})
                } 
              />
              <Label htmlFor="intentToReturnHome">
                Intent to Return Home (important for Medicaid eligibility)
              </Label>
            </div>
          </div>
          
          <AssetInput
            id="otherRealEstate"
            name="otherRealEstate"
            label="Other Real Estate Value"
            value={formData.otherRealEstate || ''}
            onChange={handleInputChange}
            description="Value of additional properties"
          />
        </AssetCategory>
        
        {/* Personal Property */}
        <AssetCategory title="Personal Property">
          <AssetInput
            id="vehicleValue"
            name="vehicleValue"
            label="Vehicle Value"
            value={formData.vehicleValue || ''}
            onChange={handleInputChange}
            description="Current market value of vehicles"
          />
          
          <AssetInput
            id="householdProperty"
            name="householdProperty"
            label="Household Property Value"
            value={formData.householdProperty || ''}
            onChange={handleInputChange}
            description="Estimated value of household goods"
          />
          
          <div className="col-span-2 my-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="burialPlots" 
                name="burialPlots" 
                checked={formData.burialPlots}
                onCheckedChange={(checked) => 
                  setFormData({...formData, burialPlots: checked as boolean})
                } 
              />
              <Label htmlFor="burialPlots">
                Burial Plots Owned (exempt from Medicaid calculations)
              </Label>
            </div>
          </div>
          
          <AssetInput
            id="otherAssets"
            name="otherAssets"
            label="Other Assets"
            value={formData.otherAssets || ''}
            onChange={handleInputChange}
            description="Any other assets not listed above"
          />
        </AssetCategory>
        
        {/* Summary Section */}
        <div className="bg-slate-50 p-4 rounded-md mt-6">
          <h4 className="font-medium text-lg mb-4">Asset Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Bank Assets:</span>
              <span className="font-medium">${parseFloat(formData.totalBankAssets || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Investments:</span>
              <span className="font-medium">${parseFloat(formData.totalInvestmentAssets || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Insurance Value:</span>
              <span className="font-medium">${parseFloat(formData.totalInsuranceAssets || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Property Value:</span>
              <span className="font-medium">${parseFloat(formData.totalPropertyAssets || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Personal Property:</span>
              <span className="font-medium">${parseFloat(formData.totalPersonalAssets || '0').toLocaleString()}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Asset Value:</span>
              <span className="text-shield-navy">${totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsSection;