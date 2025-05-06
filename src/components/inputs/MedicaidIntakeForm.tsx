import React, { useEffect } from "react";
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
    formErrors,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleDateChange,
    calculateAge,
    setFormData,
    showValidation,
    setShowValidation,
    hasInteracted,
    setHasInteracted
  } = useMedicaidFormData();
  
  const {
    activeSection,
    setActiveSection,
    handleSubmit,
    updateContextFromFormData
  } = useMedicaidFormSubmission();
  
  // Log form validation state on load and when it changes
  useEffect(() => {
    console.log("Form state:", { 
      formValid, 
      hasErrors: Object.keys(formErrors).length > 0, 
      errors: formErrors,
      requiredFields: {
        firstName: !!formData.firstName,
        lastName: !!formData.lastName,
        state: !!formData.state,
        birthDate: !!formData.applicantBirthDate,
        maritalStatus: !!formData.maritalStatus
      }
    });
  }, [formValid, formErrors, formData]);
  
  // Create a submission handler that passes our form data
  const onSubmit = async (e: React.FormEvent) => {
    console.log("Form submission triggered");
    setHasInteracted(true);
    
    // Use the handleSubmit function from useMedicaidFormSubmission
    handleSubmit(
      e,
      formData,
      formValid,
      calculateAge,
      setShowValidation
    );
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
              {formErrors.firstName && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.firstName}</p>
              )}
              {formErrors.lastName && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.lastName}</p>
              )}
              {formErrors.state && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.state}</p>
              )}
              {formErrors.applicantBirthDate && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.applicantBirthDate}</p>
              )}
              {formErrors.maritalStatus && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.maritalStatus}</p>
              )}
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
                
                {!formValid && showValidation && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                    <h3 className="text-red-700 font-medium mb-2">Please correct the following errors:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(formErrors).map(([field, error]) => (
                        <li key={field} className="text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
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
