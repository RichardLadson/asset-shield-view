import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";

interface MonthlyIncomeSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// Helper component for income inputs
const IncomeInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "$0.00"
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input 
      id={id} 
      name={name} 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
    />
  </div>
);

// Component for category subtotal display
const SubtotalDisplay = ({
  label,
  amount
}: {
  label: string;
  amount: number;
}) => (
  <div className="flex justify-between items-center py-2 text-sm">
    <span className="font-medium">{label} Subtotal:</span>
    <span className="font-semibold">${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
  </div>
);

const MonthlyIncomeSection: React.FC<MonthlyIncomeSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  // For parsed numeric values
  const [totals, setTotals] = useState({
    applicantTotal: 0,
    spouseTotal: 0,
    otherTotal: 0,
    grandTotal: 0
  });

  // Calculate totals whenever income values change
  useEffect(() => {
    // Calculate applicant income
    const applicantTotal = 
      parseFloat(formData.applicantSocialSecurity || '0') +
      parseFloat(formData.applicantPension || '0');
    
    // Calculate spouse income
    const spouseTotal =
      parseFloat(formData.spouseSocialSecurity || '0') +
      parseFloat(formData.spousePension || '0');
    
    // Calculate other income
    const otherTotal =
      parseFloat(formData.annuityIncome || '0') +
      parseFloat(formData.rentalIncome || '0') +
      parseFloat(formData.investmentIncome || '0');
    
    // Calculate grand total
    const grandTotal = applicantTotal + spouseTotal + otherTotal;
    
    // Update state with calculated totals
    setTotals({
      applicantTotal,
      spouseTotal,
      otherTotal,
      grandTotal
    });
    
    // Update form data with calculated totals
    setFormData(prev => ({
      ...prev,
      applicantIncomeTotal: applicantTotal.toFixed(2),
      spouseIncomeTotal: spouseTotal.toFixed(2),
      otherIncomeTotal: otherTotal.toFixed(2),
      totalMonthlyIncome: grandTotal.toFixed(2)
    }));
  }, [
    formData.applicantSocialSecurity, formData.applicantPension,
    formData.spouseSocialSecurity, formData.spousePension,
    formData.annuityIncome, formData.rentalIncome, formData.investmentIncome,
    setFormData
  ]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-6">Monthly Income</h3>
        <p className="text-gray-600 mb-6">
          Please enter your average monthly income from all sources. These figures help determine 
          Medicaid eligibility and planning strategies.
        </p>
        
        {/* Applicant Income */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Applicant Income</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IncomeInput
              id="applicantSocialSecurity"
              name="applicantSocialSecurity"
              label="Social Security"
              value={formData.applicantSocialSecurity || ''}
              onChange={handleInputChange}
            />
            
            <IncomeInput
              id="applicantPension"
              name="applicantPension"
              label="Pension Income"
              value={formData.applicantPension || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Applicant Income" amount={totals.applicantTotal} />
          </div>
        </div>
        
        {/* Spouse Income */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Spouse Income (if applicable)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IncomeInput
              id="spouseSocialSecurity"
              name="spouseSocialSecurity"
              label="Social Security"
              value={formData.spouseSocialSecurity || ''}
              onChange={handleInputChange}
            />
            
            <IncomeInput
              id="spousePension"
              name="spousePension"
              label="Pension Income"
              value={formData.spousePension || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Spouse Income" amount={totals.spouseTotal} />
          </div>
        </div>
        
        {/* Other Income */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Other Income Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IncomeInput
              id="annuityIncome"
              name="annuityIncome"
              label="Annuity Income"
              value={formData.annuityIncome || ''}
              onChange={handleInputChange}
            />
            
            <IncomeInput
              id="rentalIncome"
              name="rentalIncome"
              label="Rental Income"
              value={formData.rentalIncome || ''}
              onChange={handleInputChange}
            />
            
            <IncomeInput
              id="investmentIncome"
              name="investmentIncome"
              label="Investment Income"
              value={formData.investmentIncome || ''}
              onChange={handleInputChange}
            />

            <div className="space-y-2">
              <Label htmlFor="otherIncomeSources">Other Income Sources (description)</Label>
              <Input 
                id="otherIncomeSources" 
                name="otherIncomeSources" 
                type="text" 
                value={formData.otherIncomeSources || ''} 
                onChange={handleInputChange} 
                placeholder="Description of other income"
              />
            </div>
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Other Income" amount={totals.otherTotal} />
          </div>
        </div>
        
        {/* Income Summary */}
        <div className="bg-shield-lightBlue p-4 rounded-md mt-6">
          <h4 className="font-medium text-lg mb-4 text-shield-navy">Monthly Income Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Applicant Income:</span>
              <span className="font-medium">${totals.applicantTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Spouse Income:</span>
              <span className="font-medium">${totals.spouseTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Income:</span>
              <span className="font-medium">${totals.otherTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Monthly Income:</span>
              <span className="text-shield-navy">${totals.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-shield-navy">
              <strong>Note:</strong> Monthly income above the Medicaid limit may require special planning 
              strategies such as Qualified Income Trusts (QITs) or spend-down provisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyIncomeSection;