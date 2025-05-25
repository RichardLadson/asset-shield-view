
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { usePlanningContext } from "@/context/PlanningContext";
import { MedicaidFormData } from "@/types/medicaidForm";

export const useMedicaidFormSubmission = () => {
  const navigate = useNavigate();
  const { 
    setClientInfo, 
    setAssets, 
    setIncome, 
    setExpenses,
    setMedicalInfo,
    setLivingInfo,
    setState,
    assessEligibility 
  } = usePlanningContext();
  
  const [activeSection, setActiveSection] = useState<string>("client-info");

  const handleSubmit = async (
    e: React.FormEvent,
    formData: MedicaidFormData,
    formValid: boolean,
    calculateAge: (birthDate: Date) => number,
    setShowValidation: (show: boolean) => void
  ) => {
    e.preventDefault();
    
    if (!formValid) {
      setShowValidation(true);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate age from birth date
      const birthDate = formData.applicantBirthDate || formData.dateOfBirth;
      const age = birthDate ? calculateAge(birthDate) : 0;
      
      console.log("📋 Preparing data for submission...");
      console.log("Form data name:", formData.applicantName);
      console.log("Calculated age:", age);
      
      // Prepare client info
      const clientInfo = {
        name: formData.applicantName || '',
        age: age,
        maritalStatus: formData.maritalStatus || 'single',
        healthStatus: formData.medicalStatus || 'stable',
        email: formData.email || '',
        phone: formData.cellPhone || formData.homePhone || '',
        state: formData.state || '',
        isCrisis: formData.medicalStatus === 'critical'
      };
      
      // Calculate assets
      const countableAssets = 
        parseFloat(formData.totalChecking || '0') +
        parseFloat(formData.totalSavings || '0') +
        parseFloat(formData.moneyMarket || '0') +
        parseFloat(formData.cds || '0') +
        parseFloat(formData.stocksBonds || '0') +
        parseFloat(formData.lifeInsuranceCashValue || '0');

      const nonCountableAssets = 
        parseFloat(formData.homeValue || '0') +
        parseFloat(formData.vehicleValue || '0') +
        parseFloat(formData.householdProperty || '0') +
        parseFloat(formData.retirementAccounts || '0');

      const assets = {
        countable: countableAssets,
        non_countable: nonCountableAssets
      };
      
      // Calculate income
      const income = {
        social_security: parseFloat(formData.applicantSocialSecurity || '0') + parseFloat(formData.spouseSocialSecurity || '0'),
        pension: parseFloat(formData.applicantPension || '0') + parseFloat(formData.spousePension || '0'),
        annuity: parseFloat(formData.annuityIncome || '0'),
        rental: parseFloat(formData.rentalIncome || '0'),
        investment: parseFloat(formData.investmentIncome || '0')
      };
      
      // Calculate expenses
      const expenses = {
        housing: parseFloat(formData.rentMortgage || '0'),
        utilities: parseFloat(formData.utilities || '0'),
        food: parseFloat(formData.food || '0'),
        medical: parseFloat(formData.medicalNonReimbursed || '0'),
        health_insurance: parseFloat(formData.healthInsurancePremiums || '0'),
        transportation: parseFloat(formData.transportation || '0'),
        clothing: parseFloat(formData.clothing || '0')
      };
      
      console.log("📊 Prepared data for submission:", {
        clientInfo,
        assets,
        income,
        expenses,
        state: formData.state
      });
      
      // Update context with prepared data (for future use)
      setClientInfo(clientInfo);
      setAssets(assets);
      setIncome(income);
      setExpenses(expenses);
      setState(formData.state || '');
      
      // Update medical info if provided
      if (formData.primaryDiagnosis || formData.facilityName) {
        const medicalInfo = {
          diagnosis: formData.primaryDiagnosis || '',
          facility: formData.facilityName || '',
          facilityEntryDate: formData.facilityEntryDate,
          status: formData.medicalStatus || 'stable',
          recentHospitalization: formData.recentHospitalStay || false,
          hospitalizationDuration: formData.hospitalStayDuration || 0,
          longTermCareInsurance: formData.longTermCareInsurance || false,
          insuranceDetails: formData.insuranceDetails || ''
        };
        setMedicalInfo(medicalInfo);
      }
      
      // Update living info if provided
      if (formData.address || formData.emergencyContactName) {
        const livingInfo = {
          homeAddress: `${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`.trim(),
          willReturnHome: formData.intentToReturnHome || false,
          emergencyContact: {
            name: formData.emergencyContactName || '',
            phone: formData.emergencyContactPhone || ''
          }
        };
        setLivingInfo(livingInfo);
      }
      
      // Call assessEligibility with the prepared data directly instead of relying on context updates
      console.log("🚀 Calling assessEligibility with prepared data...");
      const result = await assessEligibility({
        clientInfo,
        assets,
        income,
        state: formData.state || ''
      });
      
      // Navigate to results if assessment was successful
      if (result) {
        navigate('/results');
      }
      
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    activeSection,
    setActiveSection,
    handleSubmit
  };
};
