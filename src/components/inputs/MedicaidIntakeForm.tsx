
import React, { useState, ChangeEvent } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import { toast } from "@/hooks/use-toast";
import {
  ClientInfoSection,
  MedicalDataSection,
  MonthlyIncomeSection,
  MonthlyExpensesSection,
  AssetsSection,
  AdditionalInfoSection,
  ReviewSection
} from "./form-sections";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const MedicaidIntakeForm = () => {
  const [formData, setFormData] = useState({
    // Client Information
    clientDate: undefined as Date | undefined,
    fileNo: "",
    homePhone: "",
    cellPhone: "",
    businessPhone: "",
    faxNo: "",
    email: "",
    applicantName: "",
    spouseName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    applicantBirthDate: undefined as Date | undefined,
    spouseBirthDate: undefined as Date | undefined,
    applicantSSN: "",
    spouseSSN: "",
    applicantCitizen: false,
    spouseCitizen: false,
    veteranStatus: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    
    // Medical Data
    primaryDiagnosis: "",
    facilityName: "",
    facilityEntryDate: undefined as Date | undefined,
    medicalStatus: "",
    recentHospitalStay: false,
    hospitalStayDuration: "",
    longTermCareInsurance: false,
    insuranceDetails: "",
    
    // Income
    applicantSocialSecurity: "",
    spouseSocialSecurity: "",
    applicantPension: "",
    spousePension: "",
    annuityIncome: "",
    rentalIncome: "",
    investmentIncome: "",
    otherIncomeSources: "",
    
    // Expenses
    rentMortgage: "",
    realEstateTaxes: "",
    utilities: "",
    homeownersInsurance: "",
    housingMaintenance: "",
    food: "",
    medicalNonReimbursed: "",
    healthInsurancePremiums: "",
    transportation: "",
    clothing: "",
    extraordinaryMedical: "",
    
    // Assets
    applicantChecking: "",
    spouseChecking: "",
    jointChecking: "",
    applicantSavings: "",
    spouseSavings: "",
    jointSavings: "",
    moneyMarket: "",
    cds: "",
    stocksBonds: "",
    retirementAccounts: "",
    lifeInsuranceFaceValue: "",
    lifeInsuranceCashValue: "",
    homeValue: "",
    outstandingMortgage: "",
    intentToReturnHome: false,
    householdProperty: "",
    vehicleValue: "",
    burialPlots: false,
    
    // Additional Info
    trustInfo: "",
    giftsTransfers: false,
    giftsDetails: "",
    powerOfAttorney: false,
    healthcareProxy: false,
    livingWill: false,
    lastWill: false,
    additionalNotes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "Your Medicaid Planning Intake information has been saved successfully.",
    });
    console.log("Form data:", formData);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Medicaid Planning Intake Form</h1>
      
      <form onSubmit={handleSubmit}>
        <Accordion type="single" collapsible className="w-full space-y-4">
          
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
              <ReviewSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
};

export default MedicaidIntakeForm;
