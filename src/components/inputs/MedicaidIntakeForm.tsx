import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "@/hooks/use-toast";

const MedicaidIntakeForm = () => {
  const [formData, setFormData] = useState({
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
          <AccordionItem value="client-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">1. Client Information</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="clientDate">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.clientDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.clientDate ? (
                            format(formData.clientDate, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.clientDate}
                          onSelect={(date) => handleDateChange("clientDate", date)}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* File No. */}
                  <div className="space-y-2">
                    <Label htmlFor="fileNo">File No.</Label>
                    <Input 
                      id="fileNo" 
                      name="fileNo" 
                      value={formData.fileNo} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Phone Numbers */}
                  <div className="space-y-2">
                    <Label htmlFor="homePhone">Home Phone No.</Label>
                    <Input 
                      id="homePhone" 
                      name="homePhone" 
                      value={formData.homePhone} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cellPhone">Cell Phone No.</Label>
                    <Input 
                      id="cellPhone" 
                      name="cellPhone" 
                      value={formData.cellPhone} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone No.</Label>
                    <Input 
                      id="businessPhone" 
                      name="businessPhone" 
                      value={formData.businessPhone} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faxNo">Fax No.</Label>
                    <Input 
                      id="faxNo" 
                      name="faxNo" 
                      value={formData.faxNo} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Names */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Full Name (Applicant)</Label>
                    <Input 
                      id="applicantName" 
                      name="applicantName" 
                      value={formData.applicantName} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseName">Full Name (Spouse)</Label>
                    <Input 
                      id="spouseName" 
                      name="spouseName" 
                      value={formData.spouseName} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(value) => handleSelectChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        {/* More states would be added here */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Birth Dates */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantBirthDate">Birth Date (Applicant)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.applicantBirthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.applicantBirthDate ? (
                            format(formData.applicantBirthDate, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.applicantBirthDate}
                          onSelect={(date) => handleDateChange("applicantBirthDate", date)}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseBirthDate">Birth Date (Spouse)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.spouseBirthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.spouseBirthDate ? (
                            format(formData.spouseBirthDate, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.spouseBirthDate}
                          onSelect={(date) => handleDateChange("spouseBirthDate", date)}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* SSN */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantSSN">Social Security Number (Applicant)</Label>
                    <Input 
                      id="applicantSSN" 
                      name="applicantSSN" 
                      value={formData.applicantSSN} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseSSN">Social Security Number (Spouse)</Label>
                    <Input 
                      id="spouseSSN" 
                      name="spouseSSN" 
                      value={formData.spouseSSN} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Citizenship */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="applicantCitizen" 
                      name="applicantCitizen" 
                      checked={formData.applicantCitizen}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, applicantCitizen: checked as boolean})
                      } 
                    />
                    <Label htmlFor="applicantCitizen">U.S. Citizen (Applicant)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="spouseCitizen" 
                      name="spouseCitizen" 
                      checked={formData.spouseCitizen}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, spouseCitizen: checked as boolean})
                      } 
                    />
                    <Label htmlFor="spouseCitizen">U.S. Citizen (Spouse)</Label>
                  </div>

                  {/* Veteran Status */}
                  <div className="space-y-2">
                    <Label htmlFor="veteranStatus">Veteran Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("veteranStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="applicant">Applicant</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("maritalStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input 
                      id="emergencyContactName" 
                      name="emergencyContactName" 
                      value={formData.emergencyContactName} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone Number</Label>
                    <Input 
                      id="emergencyContactPhone" 
                      name="emergencyContactPhone" 
                      value={formData.emergencyContactPhone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Medical Data */}
          <AccordionItem value="medical-data" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">2. Medical Data</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Diagnosis */}
                  <div className="space-y-2">
                    <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                    <Input 
                      id="primaryDiagnosis" 
                      name="primaryDiagnosis" 
                      value={formData.primaryDiagnosis} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Nursing Home */}
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">Name of Facility</Label>
                    <Input 
                      id="facilityName" 
                      name="facilityName" 
                      value={formData.facilityName} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facilityEntryDate">Date Entered Nursing Home</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.facilityEntryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.facilityEntryDate ? (
                            format(formData.facilityEntryDate, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.facilityEntryDate}
                          onSelect={(date) => handleDateChange("facilityEntryDate", date)}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Medical Status */}
                  <div className="space-y-2">
                    <Label htmlFor="medicalStatus">Current Medical Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("medicalStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="well">Well</SelectItem>
                        <SelectItem value="declining">Declining</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recent Hospital Stay */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recentHospitalStay" 
                        name="recentHospitalStay" 
                        checked={formData.recentHospitalStay}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, recentHospitalStay: checked as boolean})
                        } 
                      />
                      <Label htmlFor="recentHospitalStay">Recent Hospital Stay</Label>
                    </div>
                    {formData.recentHospitalStay && (
                      <div className="mt-2">
                        <Label htmlFor="hospitalStayDuration">Duration (days)</Label>
                        <Input 
                          id="hospitalStayDuration" 
                          name="hospitalStayDuration" 
                          type="number" 
                          value={formData.hospitalStayDuration} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Long-Term Care Insurance */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="longTermCareInsurance" 
                        name="longTermCareInsurance" 
                        checked={formData.longTermCareInsurance}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, longTermCareInsurance: checked as boolean})
                        } 
                      />
                      <Label htmlFor="longTermCareInsurance">Long-Term Care Insurance</Label>
                    </div>
                    {formData.longTermCareInsurance && (
                      <div className="mt-2">
                        <Label htmlFor="insuranceDetails">Insurance Provider and Policy Details</Label>
                        <Input 
                          id="insuranceDetails" 
                          name="insuranceDetails" 
                          value={formData.insuranceDetails} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Monthly Income */}
          <AccordionItem value="monthly-income" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">3. Monthly Income</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Social Security Benefits */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantSocialSecurity">Social Security Benefits (Applicant)</Label>
                    <Input 
                      id="applicantSocialSecurity" 
                      name="applicantSocialSecurity" 
                      type="text" 
                      value={formData.applicantSocialSecurity} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseSocialSecurity">Social Security Benefits (Spouse)</Label>
                    <Input 
                      id="spouseSocialSecurity" 
                      name="spouseSocialSecurity" 
                      type="text" 
                      value={formData.spouseSocialSecurity} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  {/* Pension */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantPension">Pension (Gross) - Applicant</Label>
                    <Input 
                      id="applicantPension" 
                      name="applicantPension" 
                      type="text" 
                      value={formData.applicantPension} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spousePension">Pension (Gross) - Spouse</Label>
                    <Input 
                      id="spousePension" 
                      name="spousePension" 
                      type="text" 
                      value={formData.spousePension} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  {/* Other Income */}
                  <div className="space-y-2">
                    <Label htmlFor="annuityIncome">Annuity Income</Label>
                    <Input 
                      id="annuityIncome" 
                      name="annuityIncome" 
                      type="text" 
                      value={formData.annuityIncome} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rentalIncome">Rental Income</Label>
                    <Input 
                      id="rentalIncome" 
                      name="rentalIncome" 
                      type="text" 
                      value={formData.rentalIncome} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentIncome">Investment Income</Label>
                    <Input 
                      id="investmentIncome" 
                      name="investmentIncome" 
                      type="text" 
                      value={formData.investmentIncome} 
                      onChange={handleInputChange} 
                      placeholder="$0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherIncomeSources">Other Income Sources</Label>
                    <Input 
                      id="otherIncomeSources" 
                      name="otherIncomeSources" 
                      value={formData.otherIncomeSources} 
                      onChange={handleInputChange} 
                      placeholder="Description and amount"
                    />
                  </div>

                  {/* Total (calculated) */}
                  <div className="col-span-full pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-medium">Total Monthly Income:</Label>
                      <span className="text-lg font-bold">
                        {/* Example calculation - in a real app, would parse values and calculate */}
                        $0.00
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Monthly Expenses */}
          <AccordionItem value="monthly-expenses" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">4. Monthly Expenses</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
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
            </AccordionContent>
          </AccordionItem>

          {/* 5. Assets and Liabilities */}
          <AccordionItem value="assets" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">5. Assets and Liabilities</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Countable and Non-Countable Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Checking Accounts */}
                    <div className="space-y-2">
                      <Label htmlFor="applicantChecking">Checking Accounts (Applicant)</Label>
                      <Input 
                        id="applicantChecking" 
                        name="applicantChecking" 
                        type="text" 
                        value={formData.applicantChecking} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spouseChecking">Checking Accounts (Spouse)</Label>
                      <Input 
                        id="spouseChecking" 
                        name="spouseChecking" 
                        type="text" 
                        value={formData.spouseChecking} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jointChecking">Checking Accounts (Joint)</Label>
                      <Input 
                        id="jointChecking" 
                        name="jointChecking" 
                        type="text" 
                        value={formData.jointChecking} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    {/* Savings Accounts */}
                    <div className="space-y-2">
                      <Label htmlFor="applicantSavings">Savings Accounts (Applicant)</Label>
                      <Input 
                        id="applicantSavings" 
                        name="applicantSavings" 
                        type="text" 
                        value={formData.applicantSavings} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spouseSavings">Savings Accounts (Spouse)</Label>
                      <Input 
                        id="spouseSavings" 
                        name="spouseSavings" 
                        type="text" 
                        value={formData.spouseSavings} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jointSavings">Savings Accounts (Joint)</Label>
                      <Input 
                        id="jointSavings" 
                        name="jointSavings" 
                        type="text" 
                        value={formData.jointSavings} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    {/* Other Assets */}
                    <div className="space-y-2">
                      <Label htmlFor="moneyMarket">Money Market Accounts</Label>
                      <Input 
                        id="moneyMarket" 
                        name="moneyMarket" 
                        type="text" 
                        value={formData.moneyMarket} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cds">Certificates of Deposit (CDs)</Label>
                      <Input 
                        id="cds" 
                        name="cds" 
                        type="text" 
                        value={formData.cds} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stocksBonds">Stocks, Bonds, Mutual Funds</Label>
                      <Input 
                        id="stocksBonds" 
                        name="stocksBonds" 
                        type="text" 
                        value={formData.stocksBonds} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retirementAccounts">Retirement Accounts (IRAs, 401k)</Label>
                      <Input 
                        id="retirementAccounts" 
                        name="retirementAccounts" 
                        type="text" 
                        value={formData.retirementAccounts} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    {/* Life Insurance */}
                    <div className="space-y-2">
                      <Label htmlFor="lifeInsuranceFaceValue">Life Insurance - Face Value</Label>
                      <Input 
                        id="lifeInsuranceFaceValue" 
                        name="lifeInsuranceFaceValue" 
                        type="text" 
                        value={formData.lifeInsuranceFaceValue} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lifeInsuranceCashValue">Life Insurance - Cash Surrender Value</Label>
                      <Input 
                        id="lifeInsuranceCashValue" 
                        name="lifeInsuranceCashValue" 
                        type="text" 
                        value={formData.lifeInsuranceCashValue} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>
                  </div>

                  {/* Primary Residence */}
                  <h3 className="text-lg font-medium mb-4">Primary Residence Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="homeValue">Estimated Value of Home</Label>
                      <Input 
                        id="homeValue" 
                        name="homeValue" 
                        type="text" 
                        value={formData.homeValue} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outstandingMortgage">Outstanding Mortgage (if any)</Label>
                      <Input 
                        id="outstandingMortgage" 
                        name="outstandingMortgage" 
                        type="text" 
                        value={formData.outstandingMortgage} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="intentToReturnHome" 
                        name="intentToReturnHome" 
                        checked={formData.intentToReturnHome}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, intentToReturnHome: checked as boolean})
                        } 
                      />
                      <Label htmlFor="intentToReturnHome">Intent to Return Home</Label>
                    </div>
                  </div>

                  {/* Non-Countable Assets */}
                  <h3 className="text-lg font-medium mb-4">Non-Countable Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="householdProperty">Household Personal Property</Label>
                      <Input 
                        id="householdProperty" 
                        name="householdProperty" 
                        type="text" 
                        value={formData.householdProperty} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleValue">One Vehicle (Exempt)</Label>
                      <Input 
                        id="vehicleValue" 
                        name="vehicleValue" 
                        type="text" 
                        value={formData.vehicleValue} 
                        onChange={handleInputChange} 
                        placeholder="$0.00"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="burialPlots" 
                        name="burialPlots" 
                        checked={formData.burialPlots}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, burialPlots: checked as boolean})
                        } 
                      />
                      <Label htmlFor="burialPlots">Burial Plots</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Additional Information */}
          <AccordionItem value="additional-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">6. Additional Information</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6">
                  {/* Trusts */}
                  <h3 className="text-lg font-medium mb-4">Trusts and Transfers</h3>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="trustInfo">Trust Information</Label>
                      <Input 
                        id="trustInfo" 
                        name="trustInfo" 
                        value={formData.trustInfo} 
                        onChange={handleInputChange} 
                        placeholder="Details about any trust arrangements"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="giftsTransfers" 
                          name="giftsTransfers" 
                          checked={formData.giftsTransfers}
                          onCheckedChange={(checked) => 
                            setFormData({...formData, giftsTransfers: checked as boolean})
                          } 
                        />
                        <Label htmlFor="giftsTransfers">Gifts/Transfers in Past 60 Months</Label>
                      </div>
                      {formData.giftsTransfers && (
                        <div className="mt-2">
                          <Label htmlFor="giftsDetails">Gift/Transfer Details</Label>
                          <Input 
                            id="giftsDetails" 
                            name="giftsDetails" 
                            value={formData.giftsDetails} 
                            onChange={handleInputChange} 
                            placeholder="Recipient, date, amount, reason"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Legal Documents */}
                  <h3 className="text-lg font-medium mb-4">Legal Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="powerOfAttorney" 
                        name="powerOfAttorney" 
                        checked={formData.powerOfAttorney}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, powerOfAttorney: checked as boolean})
                        } 
                      />
                      <Label htmlFor="powerOfAttorney">Power of Attorney</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="healthcareProxy" 
                        name="healthcareProxy" 
                        checked={formData.healthcareProxy}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, healthcareProxy: checked as boolean})
                        } 
                      />
                      <Label htmlFor="healthcareProxy">Healthcare Proxy</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="livingWill" 
                        name="livingWill" 
                        checked={formData.livingWill}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, livingWill: checked as boolean})
                        } 
                      />
                      <Label htmlFor="livingWill">Living Will</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lastWill" 
                        name="lastWill" 
                        checked={formData.lastWill}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, lastWill: checked as boolean})
                        } 
                      />
                      <Label htmlFor="lastWill">Last Will and Testament</Label>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Other Relevant Information</Label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Any other information that may be relevant..."
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* 7. Review and Submit */}
          <AccordionItem value="review" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100">
              <h2 className="text-xl font-semibold">7. Review and Submit</h2>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Form Summary</h3>
                      <p className="text-gray-600">
                        Please review all the information you've provided before submitting.
                        All fields marked with an asterisk (*) are required.
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check className="h-4 w-4" />
                      </div>
                      <p>All required personal information is complete.</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <Button type="submit" className="w-full sm:w-auto">
                        Submit Medicaid Planning Intake Form
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
};

export default MedicaidIntakeForm;
