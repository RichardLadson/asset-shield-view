import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";

interface MonthlyExpensesSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// Helper component for expense inputs
const ExpenseInput = ({
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

const MonthlyExpensesSection: React.FC<MonthlyExpensesSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
}) => {
  // For parsed numeric values
  const [totals, setTotals] = useState({
    housingTotal: 0,
    personalTotal: 0,
    medicalTotal: 0,
    grandTotal: 0
  });

  // Calculate totals whenever expense values change
  useEffect(() => {
    // Calculate housing expenses
    const housingTotal = 
      parseFloat(formData.rentMortgage || '0') +
      parseFloat(formData.realEstateTaxes || '0') +
      parseFloat(formData.utilities || '0') +
      parseFloat(formData.homeownersInsurance || '0') +
      parseFloat(formData.housingMaintenance || '0');
    
    // Calculate personal expenses
    const personalTotal =
      parseFloat(formData.food || '0') +
      parseFloat(formData.transportation || '0') +
      parseFloat(formData.clothing || '0');
    
    // Calculate medical expenses
    const medicalTotal =
      parseFloat(formData.medicalNonReimbursed || '0') +
      parseFloat(formData.healthInsurancePremiums || '0') +
      parseFloat(formData.extraordinaryMedical || '0');
    
    // Calculate grand total
    const grandTotal = housingTotal + personalTotal + medicalTotal;
    
    // Update state with calculated totals
    setTotals({
      housingTotal,
      personalTotal,
      medicalTotal,
      grandTotal
    });
    
    // Update form data with calculated totals
    setFormData(prev => ({
      ...prev,
      housingExpenseTotal: housingTotal.toFixed(2),
      personalExpenseTotal: personalTotal.toFixed(2),
      medicalExpenseTotal: medicalTotal.toFixed(2),
      totalMonthlyExpenses: grandTotal.toFixed(2)
    }));
  }, [
    formData.rentMortgage, formData.realEstateTaxes, formData.utilities, 
    formData.homeownersInsurance, formData.housingMaintenance,
    formData.food, formData.transportation, formData.clothing,
    formData.medicalNonReimbursed, formData.healthInsurancePremiums, 
    formData.extraordinaryMedical, setFormData
  ]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-6">Monthly Expenses</h3>
        <p className="text-gray-600 mb-6">
          Please enter your average monthly expenses in each category. These figures help determine 
          Medicaid eligibility and planning strategies for maintaining quality of life.
        </p>
        
        {/* Housing Expenses */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Housing Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExpenseInput
              id="rentMortgage"
              name="rentMortgage"
              label="Rent/Mortgage Payment"
              value={formData.rentMortgage || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="realEstateTaxes"
              name="realEstateTaxes"
              label="Real Estate Taxes"
              value={formData.realEstateTaxes || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="utilities"
              name="utilities"
              label="Utilities (Electric, Gas, Water)"
              value={formData.utilities || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="homeownersInsurance"
              name="homeownersInsurance"
              label="Homeowners/Renters Insurance"
              value={formData.homeownersInsurance || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="housingMaintenance"
              name="housingMaintenance"
              label="Home Maintenance"
              value={formData.housingMaintenance || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Housing" amount={totals.housingTotal} />
          </div>
        </div>
        
        {/* Personal Expenses */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Personal Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExpenseInput
              id="food"
              name="food"
              label="Food and Groceries"
              value={formData.food || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="transportation"
              name="transportation"
              label="Transportation"
              value={formData.transportation || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="clothing"
              name="clothing"
              label="Clothing"
              value={formData.clothing || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Personal" amount={totals.personalTotal} />
          </div>
        </div>
        
        {/* Medical Expenses */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Medical Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExpenseInput
              id="medicalNonReimbursed"
              name="medicalNonReimbursed"
              label="Non-Reimbursed Medical Expenses"
              value={formData.medicalNonReimbursed || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="healthInsurancePremiums"
              name="healthInsurancePremiums"
              label="Health Insurance Premiums"
              value={formData.healthInsurancePremiums || ''}
              onChange={handleInputChange}
            />
            
            <ExpenseInput
              id="extraordinaryMedical"
              name="extraordinaryMedical"
              label="Extraordinary Medical Expenses"
              value={formData.extraordinaryMedical || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 bg-slate-50 p-2 rounded">
            <SubtotalDisplay label="Medical" amount={totals.medicalTotal} />
          </div>
        </div>
        
        {/* Expense Summary */}
        <div className="bg-shield-lightBlue p-4 rounded-md mt-6">
          <h4 className="font-medium text-lg mb-4 text-shield-navy">Monthly Expense Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Housing Expenses:</span>
              <span className="font-medium">${totals.housingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Personal Expenses:</span>
              <span className="font-medium">${totals.personalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Medical Expenses:</span>
              <span className="font-medium">${totals.medicalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Monthly Expenses:</span>
              <span className="text-shield-navy">${totals.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-shield-navy">
              <strong>Note:</strong> Medical expenses may be deductible for Medicaid eligibility purposes, 
              potentially allowing you to keep more monthly income.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesSection;