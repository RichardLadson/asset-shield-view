import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";

interface AssetsSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AssetsSection: React.FC<AssetsSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Countable and Non-Countable Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Checking Accounts */}
          <div className="space-y-2">
            <Label htmlFor="applicantChecking">Checking Accounts (Applicant)</Label>
            <Input 
              id="applicantChecking" 
              name="applicantChecking" 
              type="text" 
              value={formData.applicantChecking} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouseChecking">Checking Accounts (Spouse)</Label>
            <Input 
              id="spouseChecking" 
              name="spouseChecking" 
              type="text" 
              value={formData.spouseChecking} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jointChecking">Checking Accounts (Joint)</Label>
            <Input 
              id="jointChecking" 
              name="jointChecking" 
              type="text" 
              value={formData.jointChecking} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          {/* Savings Accounts */}
          <div className="space-y-2">
            <Label htmlFor="applicantSavings">Savings Accounts (Applicant)</Label>
            <Input 
              id="applicantSavings" 
              name="applicantSavings" 
              type="text" 
              value={formData.applicantSavings} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouseSavings">Savings Accounts (Spouse)</Label>
            <Input 
              id="spouseSavings" 
              name="spouseSavings" 
              type="text" 
              value={formData.spouseSavings} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jointSavings">Savings Accounts (Joint)</Label>
            <Input 
              id="jointSavings" 
              name="jointSavings" 
              type="text" 
              value={formData.jointSavings} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          {/* Other Assets */}
          <div className="space-y-2">
            <Label htmlFor="moneyMarket">Money Market Accounts</Label>
            <Input 
              id="moneyMarket" 
              name="moneyMarket" 
              type="text" 
              value={formData.moneyMarket} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cds">Certificates of Deposit (CDs)</Label>
            <Input 
              id="cds" 
              name="cds" 
              type="text" 
              value={formData.cds} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stocksBonds">Stocks, Bonds, Mutual Funds</Label>
            <Input 
              id="stocksBonds" 
              name="stocksBonds" 
              type="text" 
              value={formData.stocksBonds} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retirementAccounts">Retirement Accounts (IRAs, 401k)</Label>
            <Input 
              id="retirementAccounts" 
              name="retirementAccounts" 
              type="text" 
              value={formData.retirementAccounts} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          {/* Life Insurance */}
          <div className="space-y-2">
            <Label htmlFor="lifeInsuranceFaceValue">Life Insurance - Face Value</Label>
            <Input 
              id="lifeInsuranceFaceValue" 
              name="lifeInsuranceFaceValue" 
              type="text" 
              value={formData.lifeInsuranceFaceValue} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifeInsuranceCashValue">Life Insurance - Cash Surrender Value</Label>
            <Input 
              id="lifeInsuranceCashValue" 
              name="lifeInsuranceCashValue" 
              type="text" 
              value={formData.lifeInsuranceCashValue} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>
        </div>

        {/* Primary Residence */}
        <h3 className="text-lg font-medium mb-4">Primary Residence Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="homeValue">Estimated Value of Home</Label>
            <Input 
              id="homeValue" 
              name="homeValue" 
              type="text" 
              value={formData.homeValue} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outstandingMortgage">Outstanding Mortgage (if any)</Label>
            <Input 
              id="outstandingMortgage" 
              name="outstandingMortgage" 
              type="text" 
              value={formData.outstandingMortgage} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="intentToReturnHome" 
              name="intentToReturnHome" 
              checked={formData.intentToReturnHome}
              onCheckedChange={(checked) => 
                setFormData({...formData, intentToReturnHome: checked as boolean})
              } 
            />
            <Label htmlFor="intentToReturnHome">Intent to Return Home</Label>
          </div>
        </div>

        {/* Non-Countable Assets */}
        <h3 className="text-lg font-medium mb-4">Non-Countable Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="householdProperty">Household Personal Property</Label>
            <Input 
              id="householdProperty" 
              name="householdProperty" 
              type="text" 
              value={formData.householdProperty} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleValue">One Vehicle (Exempt)</Label>
            <Input 
              id="vehicleValue" 
              name="vehicleValue" 
              type="text" 
              value={formData.vehicleValue} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="burialPlots" 
              name="burialPlots" 
              checked={formData.burialPlots}
              onCheckedChange={(checked) => 
                setFormData({...formData, burialPlots: checked as boolean})
              } 
            />
            <Label htmlFor="burialPlots">Burial Plots</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsSection;
