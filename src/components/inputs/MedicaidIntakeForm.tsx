
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
      // Set the client info data in the planning context
      setClientInfo({
        name: formData.applicantName,
        age: calculateAge(formData.applicantBirthDate || new Date()),
        maritalStatus: formData.maritalStatus,
        healthStatus: formData.medicalStatus,
        email: formData.email,
        phone: formData.cellPhone || formData.homePhone,
        state: formData.state
      });
      
      // Set income data in context
      setIncome({
        socialSecurity: {
          applicant: parseFloat(formData.applicantSocialSecurity) || 0,
          spouse: parseFloat(formData.spouseSocialSecurity) || 0
        },
        pension: {
          applicant: parseFloat(formData.applicantPension) || 0,
          spouse: parseFloat(formData.spousePension) || 0
        },
        other: {
          annuity: parseFloat(formData.annuityIncome) || 0,
          rental: parseFloat(formData.rentalIncome) || 0,
          investment: parseFloat(formData.investmentIncome) || 0
        },
        summary: {
          totalMonthlyIncome: parseFloat(formData.totalMonthlyIncome) || 0
        }
      });
      
      // Set assets data in context
      setAssets({
        checking: {
          total: parseFloat(formData.totalChecking) || 0
        },
        savings: {
          total: parseFloat(formData.totalSavings) || 0
        },
        investments: {
          moneyMarket: parseFloat(formData.moneyMarket) || 0,
          cds: parseFloat(formData.cds) || 0,
          stocksBonds: parseFloat(formData.stocksBonds) || 0,
          retirementAccounts: parseFloat(formData.retirementAccounts) || 0
        },
        property: {
          homeValue: parseFloat(formData.homeValue) || 0,
          mortgageValue: parseFloat(formData.outstandingMortgage) || 0,
          otherRealEstate: parseFloat(formData.otherRealEstate) || 0
        },
        summary: {
          totalAssetValue: parseFloat(formData.totalAssetValue) || 0
        }
      });
      
      // Set expenses data in context
      const housingExpenseTotal = parseFloat(formData.housingExpenseTotal) || 0;
      const medicalExpenseTotal = parseFloat(formData.medicalExpenseTotal) || 0;
      const personalExpenseTotal = parseFloat(formData.personalExpenseTotal) || 0;
      
      setExpenses({
        housing: {
          rentMortgage: parseFloat(formData.rentMortgage) || 0,
          taxes: parseFloat(formData.realEstateTaxes) || 0,
          utilities: parseFloat(formData.utilities) || 0,
          insurance: parseFloat(formData.homeownersInsurance) || 0,
          maintenance: parseFloat(formData.housingMaintenance) || 0,
          total: housingExpenseTotal
        },
        personal: {
          food: parseFloat(formData.food) || 0,
          transportation: parseFloat(formData.transportation) || 0,
          clothing: parseFloat(formData.clothing) || 0,
          total: personalExpenseTotal
        },
        medical: {
          nonReimbursed: parseFloat(formData.medicalNonReimbursed) || 0,
          premiums: parseFloat(formData.healthInsurancePremiums) || 0,
          extraordinary: parseFloat(formData.extraordinaryMedical) || 0,
          total: medicalExpenseTotal
        },
        summary: {
          totalMonthlyExpenses: parseFloat(formData.totalMonthlyExpenses) || 0
        }
      });
      
      // Generate planning results and navigate to results page
      await generatePlan('comprehensive');
      navigate('/results');
      
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
