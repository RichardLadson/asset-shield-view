import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";

interface MonthlyIncomeSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthlyIncomeSection: React.FC<MonthlyIncomeSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Card>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Security Benefits */}
        <div className="space-y-2">
          <Label htmlFor="applicantSocialSecurity">Social Security Benefits (Applicant)</Label>
          <Input 
            id="applicantSocialSecurity" 
            name="applicantSocialSecurity" 
            type="text" 
            value={formData.applicantSocialSecurity} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseSocialSecurity">Social Security Benefits (Spouse)</Label>
          <Input 
            id="spouseSocialSecurity" 
            name="spouseSocialSecurity" 
            type="text" 
            value={formData.spouseSocialSecurity} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        {/* Pension */}
        <div className="space-y-2">
          <Label htmlFor="applicantPension">Pension (Gross) - Applicant</Label>
          <Input 
            id="applicantPension" 
            name="applicantPension" 
            type="text" 
            value={formData.applicantPension} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spousePension">Pension (Gross) - Spouse</Label>
          <Input 
            id="spousePension" 
            name="spousePension" 
            type="text" 
            value={formData.spousePension} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        {/* Other Income */}
        <div className="space-y-2">
          <Label htmlFor="annuityIncome">Annuity Income</Label>
          <Input 
            id="annuityIncome" 
            name="annuityIncome" 
            type="text" 
            value={formData.annuityIncome} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rentalIncome">Rental Income</Label>
          <Input 
            id="rentalIncome" 
            name="rentalIncome" 
            type="text" 
            value={formData.rentalIncome} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentIncome">Investment Income</Label>
          <Input 
            id="investmentIncome" 
            name="investmentIncome" 
            type="text" 
            value={formData.investmentIncome} 
            onChange={handleInputChange} 
            placeholder="$0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherIncomeSources">Other Income Sources</Label>
          <Input 
            id="otherIncomeSources" 
            name="otherIncomeSources" 
            value={formData.otherIncomeSources} 
            onChange={handleInputChange} 
            placeholder="Description and amount"
          />
        </div>

        {/* Total (calculated) */}
        <div className="col-span-full pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium">Total Monthly Income:</Label>
            <span className="text-lg font-bold">
              {/* Example calculation - in a real app, would parse values and calculate */}
              $0.00
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyIncomeSection;
