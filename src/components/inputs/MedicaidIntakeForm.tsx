// src/components/inputs/MedicaidIntakeForm.tsx
import React, { useState, useEffect } from "react";
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
import { Button } from "../ui/button";
import { usePlanningContext } from "@/context/PlanningContext";
import { Loader2 } from "lucide-react";

const MedicaidIntakeForm = () => {
  const { 
    clientInfo, 
    setClientInfo,
    assets,
    setAssets,
    income,
    setIncome,
    expenses, 
    setExpenses,
    medicalInfo,
    setMedicalInfo,
    livingInfo,
    setLivingInfo,
    state,
    setState,
    loading,
    assessEligibility,
    generatePlan
  } = usePlanningContext();

  const [activeSection, setActiveSection] = useState<string>("client-info");
  const [formValid, setFormValid] = useState<boolean>(false);
  
  // Map our form data from context to the format expected by form components
  const [formData, setFormData] = useState({
    // Client Information
    clientDate: undefined as Date | undefined,
    homePhone: "",
    cellPhone: "",
    email: "",
    applicantName: "",
    spouseName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    applicantBirthDate: undefined as Date | undefined,
    spouseBirthDate: undefined as Date | undefined,
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
    applicantIncomeTotal: "0.00",
    spouseIncomeTotal: "0.00",
    otherIncomeTotal: "0.00",
    totalMonthlyIncome: "0.00",
    
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
    housingExpenseTotal: "0.00",
    personalExpenseTotal: "0.00",
    medicalExpenseTotal: "0.00",
    totalMonthlyExpenses: "0.00",
    
    // Assets
    // Bank accounts - simplified
    totalChecking: "",
    totalSavings: "",
    moneyMarket: "",
    cds: "",
    
    // Investments
    stocksBonds: "",
    retirementAccounts: "",
    
    // Insurance
    lifeInsuranceFaceValue: "",
    lifeInsuranceCashValue: "",
    
    // Property
    homeValue: "",
    outstandingMortgage: "",
    otherRealEstate: "",
    intentToReturnHome: false,
    
    // Personal property
    householdProperty: "",
    vehicleValue: "",
    otherAssets: "",
    burialPlots: false,
    
    // Asset totals
    totalBankAssets: "0.00",
    totalInvestmentAssets: "0.00",
    totalInsuranceAssets: "0.00",
    totalPropertyAssets: "0.00",
    totalPersonalAssets: "0.00",
    totalAssetValue: "0.00",
    
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

  // Sync form data with context
  useEffect(() => {
    if (clientInfo.name) {
      setFormData(prev => ({
        ...prev,
        applicantName: clientInfo.name,
        maritalStatus: clientInfo.maritalStatus
      }));
    }

    // Set state value from context
    if (state) {
      setFormData(prev => ({
        ...prev,
        state
      }));
    }
  }, [clientInfo, state]);

  // Validate form before submission
  useEffect(() => {
    // Basic validation - required fields
    const isValid = 
      formData.applicantName.trim() !== "" && 
      formData.state.trim() !== "" &&
      formData.applicantBirthDate !== undefined &&
      formData.maritalStatus !== "";
    
    setFormValid(isValid);
  }, [formData]);

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

    // Update context state value
    if (name === "state") {
      setState(value);
    }

    // Update context marital status
    if (name === "maritalStatus") {
      setClientInfo({
        ...clientInfo,
        maritalStatus: value
      });
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date,
    });

    // Handle age calculation if birth date changes
    if (name === "applicantBirthDate" && date) {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }

      setClientInfo({
        ...clientInfo,
        age
      });
    }
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const updateContextFromFormData = () => {
    // Update client info
    setClientInfo({
      name: formData.applicantName,
      age: formData.applicantBirthDate 
        ? calculateAge(formData.applicantBirthDate)
        : 0,
      maritalStatus: formData.maritalStatus,
      healthStatus: formData.medicalStatus,
      email: formData.email,
      phone: formData.cellPhone || formData.homePhone
    });

    // Update assets with simplified structure
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
      lifeInsurance: {
        faceValue: parseFloat(formData.lifeInsuranceFaceValue) || 0,
        cashValue: parseFloat(formData.lifeInsuranceCashValue) || 0
      },
      property: {
        homeValue: parseFloat(formData.homeValue) || 0,
        mortgageValue: parseFloat(formData.outstandingMortgage) || 0,
        otherRealEstate: parseFloat(formData.otherRealEstate) || 0,
        intentToReturnHome: formData.intentToReturnHome
      },
      exempt: {
        householdProperty: parseFloat(formData.householdProperty) || 0,
        vehicleValue: parseFloat(formData.vehicleValue) || 0,
        burialPlots: formData.burialPlots,
        otherAssets: parseFloat(formData.otherAssets) || 0
      },
      summary: {
        totalAssetValue: parseFloat(formData.totalAssetValue) || 0
      }
    });

    // Update income
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
        investment: parseFloat(formData.investmentIncome) || 0,
        other: formData.otherIncomeSources
      },
      summary: {
        totalMonthlyIncome: parseFloat(formData.totalMonthlyIncome) || 0
      }
    });

    // Update expenses
    setExpenses({
      housing: {
        rentMortgage: parseFloat(formData.rentMortgage) || 0,
        taxes: parseFloat(formData.realEstateTaxes) || 0,
        utilities: parseFloat(formData.utilities) || 0,
        insurance: parseFloat(formData.homeownersInsurance) || 0,
        maintenance: parseFloat(formData.housingMaintenance) || 0,
        total: parseFloat(formData.housingExpenseTotal) || 0
      },
      personal: {
        food: parseFloat(formData.food) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        clothing: parseFloat(formData.clothing) || 0,
        total: parseFloat(formData.personalExpenseTotal) || 0
      },
      medical: {
        nonReimbursed: parseFloat(formData.medicalNonReimbursed) || 0,
        premiums: parseFloat(formData.healthInsurancePremiums) || 0,
        extraordinary: parseFloat(formData.extraordinaryMedical) || 0,
        total: parseFloat(formData.medicalExpenseTotal) || 0
      },
      summary: {
        totalMonthlyExpenses: parseFloat(formData.totalMonthlyExpenses) || 0
      }
    });

    // Update medical info
    setMedicalInfo({
      diagnosis: formData.primaryDiagnosis,
      facility: formData.facilityName,
      facilityEntryDate: formData.facilityEntryDate,
      status: formData.medicalStatus,
      recentHospitalization: formData.recentHospitalStay,
      hospitalizationDuration: formData.hospitalStayDuration,
      longTermCareInsurance: formData.longTermCareInsurance,
      insuranceDetails: formData.insuranceDetails
    });

    // Update living info
    setLivingInfo({
      homeAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      willReturnHome: formData.intentToReturnHome,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone
      }
    });

    // Update state
    setState(formData.state);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.applicantName || !formData.state || !formData.applicantBirthDate || !formData.maritalStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields (name, birth date, state, and marital status).",
        variant: "destructive",
      });
      return;
    }
    
    // Add console logs to debug form data
    console.log("Submitting form with data:", {
      clientInfo: {
        name: formData.applicantName,
        age: formData.applicantBirthDate ? calculateAge(formData.applicantBirthDate) : 0,
        maritalStatus: formData.maritalStatus,
        state: formData.state
      },
      totalAssets: formData.totalAssetValue,
      totalIncome: formData.totalMonthlyIncome
    });
    
    // Update context with form data
    updateContextFromFormData();
    
    // Log what was sent to context
    console.log("Updated context data:", {
      clientInfo,
      assets,
      income,
      state
    });
    
    // Show toast notification
    toast({
      title: "Form Submitted",
      description: "Your Medicaid Planning information has been saved successfully.",
    });
    
    try {
      // Generate an eligibility assessment
      await assessEligibility();
      
      // Generate a comprehensive plan
      await generatePlan('comprehensive');
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Medicaid Planning Intake Form</h1>
      
      <form onSubmit={handleSubmit}>
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
                    disabled={loading || !formValid}
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
