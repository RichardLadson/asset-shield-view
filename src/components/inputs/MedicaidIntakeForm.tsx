import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { usePlanningContext } from "@/context/PlanningContext";
import { useMedicaidFormData } from "@/hooks/useMedicaidFormData";
import { useMedicaidFormSubmission } from "@/hooks/useMedicaidFormSubmission";
import { useNavigate } from "react-router-dom";
import {
  ClientInfoSection,
  MedicalDataSection,
  MonthlyIncomeSection,
  MonthlyExpensesSection,
  AssetsSection,
  AdditionalInfoSection,
  ReviewSection
} from "./form-sections";
import { toast } from "@/hooks/use-toast";

const MedicaidIntakeForm = () => {
  const { loading, setClientInfo, setIncome, setAssets, setExpenses, generatePlan } = usePlanningContext();
  const navigate = useNavigate();
  
  // Use our custom hooks for form data management and submission
  const {
    formData,
    formValid,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
    calculateAge,
    setFormData,
    showValidation,
    setShowValidation
  } = useMedicaidFormData();
  
  const {
    activeSection,
    setActiveSection,
  } = useMedicaidFormSubmission();
  
  // Create a submission handler that passes our form data
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only show validation errors when the form is submitted
    setShowValidation(true);
    
    if (!formValid) {
      toast({
        variant: "destructive",
        title: "Form Error",
        description: "Please complete all required fields before submitting."
      });
      return;
    }
    
    try {
      // Set the form data in the planning context
      setClientInfo({
        name: formData.firstName + " " + formData.lastName,
        age: calculateAge(new Date(formData.dateOfBirth)),
        maritalStatus: formData.maritalStatus,
        healthStatus: formData.healthStatus,
        email: formData.email,
        phone: formData.phone,
        state: formData.state
      });
      
      // Set income data in context
      setIncome({
        socialSecurity: parseFloat(formData.monthlySocialSecurity) || 0,
        pension: parseFloat(formData.monthlyPension) || 0,
        otherIncome: parseFloat(formData.monthlyOtherIncome) || 0,
        summary: {
          totalMonthlyIncome: 
            (parseFloat(formData.monthlySocialSecurity) || 0) +
            (parseFloat(formData.monthlyPension) || 0) + 
            (parseFloat(formData.monthlyOtherIncome) || 0)
        }
      });
      
      // Set assets data in context
      setAssets({
        primaryResidence: {
          value: parseFloat(formData.primaryResidenceValue) || 0,
          mortgage: parseFloat(formData.primaryResidenceMortgage) || 0
        },
        bankAccounts: {
          checking: parseFloat(formData.checkingAccountValue) || 0,
          savings: parseFloat(formData.savingsAccountValue) || 0
        },
        investments: {
          stocks: parseFloat(formData.stocksValue) || 0,
          retirement: parseFloat(formData.retirementAccountsValue) || 0
        },
        summary: {
          totalAssetValue: 
            (parseFloat(formData.primaryResidenceValue) || 0) +
            (parseFloat(formData.checkingAccountValue) || 0) +
            (parseFloat(formData.savingsAccountValue) || 0) +
            (parseFloat(formData.stocksValue) || 0) +
            (parseFloat(formData.retirementAccountsValue) || 0)
        }
      });
      
      // Set expenses data in context
      setExpenses({
        housing: parseFloat(formData.monthlyHousingExpense) || 0,
        medical: parseFloat(formData.monthlyMedicalExpense) || 0,
        utilities: parseFloat(formData.monthlyUtilitiesExpense) || 0,
        other: parseFloat(formData.monthlyOtherExpenses) || 0,
        summary: {
          totalMonthlyExpenses:
            (parseFloat(formData.monthlyHousingExpense) || 0) +
            (parseFloat(formData.monthlyMedicalExpense) || 0) +
            (parseFloat(formData.monthlyUtilitiesExpense) || 0) +
            (parseFloat(formData.monthlyOtherExpenses) || 0)
        }
      });
      
      // Generate planning results
      await generatePlan('comprehensive');
      
      // Reset validation state
      setShowValidation(false);
      
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error?.message || "An error occurred while processing your information."
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Medicaid Planning Intake Form</h1>
      
      <form onSubmit={onSubmit}>
        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
          value={activeSection}
          onValueChange={setActiveSection}
        >
          
          {/* 1. Client Information */}
          <AccordionItem value="client-info" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">1. Client Information</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <ClientInfoSection 
                formData={formData}
                handleInputChange={handleInputChange}
                handleDateChange={handleDateChange}
                handleSelectChange={handleSelectChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 2. Medical Data */}
          <AccordionItem value="medical-data" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">2. Medical Data</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <MedicalDataSection 
                formData={formData}
                handleInputChange={handleInputChange}
                handleDateChange={handleDateChange}
                handleSelectChange={handleSelectChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 3. Monthly Income */}
          <AccordionItem value="monthly-income" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">3. Monthly Income</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <MonthlyIncomeSection 
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 4. Monthly Expenses */}
          <AccordionItem value="monthly-expenses" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">4. Monthly Expenses</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <MonthlyExpensesSection 
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 5. Assets and Liabilities */}
          <AccordionItem value="assets" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">5. Assets and Liabilities</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <AssetsSection 
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 6. Additional Information */}
          <AccordionItem value="additional-info" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">6. Additional Information</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <AdditionalInfoSection 
                formData={formData}
                handleInputChange={handleInputChange}
                handleTextareaChange={handleTextareaChange}
                setFormData={setFormData}
                showValidation={showValidation}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 7. Review and Submit */}
          <AccordionItem value="review" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">7. Review and Submit</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-6">
                <ReviewSection formData={formData} />
                
                <div className="border-t pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-shield-navy hover:bg-shield-navy/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      "Submit Medicaid Planning Form"
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
};

export default MedicaidIntakeForm;