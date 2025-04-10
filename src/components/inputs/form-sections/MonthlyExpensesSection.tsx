
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";

interface MonthlyExpensesSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthlyExpensesSection: React.FC<MonthlyExpensesSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Shelter Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="rentMortgage">Rent/Mortgage</Label>
            <Input 
              id="rentMortgage" 
              name="rentMortgage" 
              type="text" 
              value={formData.rentMortgage} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="realEstateTaxes">Real Estate Taxes</Label>
            <Input 
              id="realEstateTaxes" 
              name="realEstateTaxes" 
              type="text" 
              value={formData.realEstateTaxes} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utilities">Utilities (water, sewer, electric)</Label>
            <Input 
              id="utilities" 
              name="utilities" 
              type="text" 
              value={formData.utilities} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeownersInsurance">Homeowners Insurance Premium</Label>
            <Input 
              id="homeownersInsurance" 
              name="homeownersInsurance" 
              type="text" 
              value={formData.homeownersInsurance} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="housingMaintenance">Housing Maintenance Costs</Label>
            <Input 
              id="housingMaintenance" 
              name="housingMaintenance" 
              type="text" 
              value={formData.housingMaintenance} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4">Non-Shelter Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="food">Food</Label>
            <Input 
              id="food" 
              name="food" 
              type="text" 
              value={formData.food} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNonReimbursed">Medical (Non-Reimbursed)</Label>
            <Input 
              id="medicalNonReimbursed" 
              name="medicalNonReimbursed" 
              type="text" 
              value={formData.medicalNonReimbursed} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthInsurancePremiums">Health Insurance Premiums</Label>
            <Input 
              id="healthInsurancePremiums" 
              name="healthInsurancePremiums" 
              type="text" 
              value={formData.healthInsurancePremiums} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportation">Transportation</Label>
            <Input 
              id="transportation" 
              name="transportation" 
              type="text" 
              value={formData.transportation} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clothing">Clothing, Other Personal Needs</Label>
            <Input 
              id="clothing" 
              name="clothing" 
              type="text" 
              value={formData.clothing} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraordinaryMedical">Extraordinary Medical Expenses</Label>
            <Input 
              id="extraordinaryMedical" 
              name="extraordinaryMedical" 
              type="text" 
              value={formData.extraordinaryMedical} 
              onChange={handleInputChange} 
              placeholder="$0.00"
            />
          </div>
        </div>

        {/* Allowable Deductions (calculated) */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium">Allowable Deductions:</Label>
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

export default MonthlyExpensesSection;
