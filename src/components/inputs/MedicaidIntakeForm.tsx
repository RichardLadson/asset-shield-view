import React, { useEffect, useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import { LoadingButton } from "../ui/loading-button";
import { ProgressModal } from "../ui/progress-modal";
import { usePlanningContext } from "@/context/PlanningContext";
import { useMedicaidFormData } from "@/hooks/useMedicaidFormData";
import { useMedicaidFormSubmission } from "@/hooks/useMedicaidFormSubmission";
import { useFormPersistence, useAutoSave } from "@/hooks/useFormPersistence";
import { DraftRecoveryBanner } from "../ui/draft-recovery-banner";
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
  
  // Form persistence state
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const { loadDraft, clearDraft, hasDraft, getDraftAge } = useFormPersistence();
  
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
    progressTracking
  } = useMedicaidFormSubmission();
  
  // Auto-save form data
  useAutoSave(formData, !loading);
  
  // Check for draft on component mount
  useEffect(() => {
    if (hasDraft() && !hasInteracted) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, hasInteracted]);
  
  // Draft recovery handlers
  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData({ ...formData, ...draft });
      setShowDraftBanner(false);
      toast({
        title: "Draft Restored",
        description: "Your previous form data has been restored.",
      });
    }
  };
  
  const handleClearDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
    toast({
      title: "Draft Cleared",
      description: "Starting with a fresh form.",
    });
  };
  
  const handleDismissBanner = () => {
    setShowDraftBanner(false);
  };
  
  // Clear draft on successful submission - we'll handle this in the existing onSubmit
  const clearDraftOnSuccess = () => {
    clearDraft();
  };
  
  // Log form validation state on load and when it changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Form state:", { 
        formValid, 
        hasErrors: Object.keys(formErrors).length > 0, 
        errors: formErrors,
        requiredFields: {
          applicantName: !!formData.applicantName,
          state: !!formData.state,
          birthDate: !!formData.applicantBirthDate,
          maritalStatus: !!formData.maritalStatus
        }
      });
    }
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
      
      {/* Progress Modal */}
      <ProgressModal
        open={loading}
        steps={progressTracking.steps}
        progress={progressTracking.progress}
        message={progressTracking.message}
      />
      
      {/* Draft Recovery Banner */}
      {showDraftBanner && (
        <DraftRecoveryBanner
          draftAge={getDraftAge() || 0}
          onRestore={handleRestoreDraft}
          onDismiss={handleDismissBanner}
          onClear={handleClearDraft}
        />
      )}
      
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
              {formErrors.applicantName && showValidation && (
                <p className="text-red-500 mt-1">{formErrors.applicantName}</p>
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
                  <LoadingButton 
                    type="submit" 
                    className="w-full sm:w-auto bg-shield-navy hover:bg-shield-navy/90"
                    loading={loading}
                    loadingText="Processing your application..."
                  >
                    Submit Medicaid Planning Form
                  </LoadingButton>
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
