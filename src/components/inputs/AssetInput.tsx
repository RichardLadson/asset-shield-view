
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon, Home, Briefcase, Car, Coins, Plus, Minus,
  Phone, Mail, User, MapPin, FileText, Heart, DollarSign,
  Check, X, Users, Building, Hospital, Timer, Utensils, Droplet,
  Bolt, Shirt, Bank, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// US States list for the dropdown
const states = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" }
];

const assetFormSchema = z.object({
  // Client Information
  date: z.date({
    required_error: "Date is required.",
  }),
  fileNo: z.string().optional(),
  homePhone: z.string().optional(),
  cellPhone: z.string().optional(),
  businessPhone: z.string().optional(),
  faxNo: z.string().optional(),
  emailAddress: z.string().email({ message: "Invalid email address" }).optional(),
  fullNameApplicant: z.string().min(2, { message: "Applicant name must be at least 2 characters." }),
  fullNameSpouse: z.string().optional(),
  streetAddress: z.string().min(2, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "Valid zip code is required." }),
  birthDateApplicant: z.date({
    required_error: "Applicant birth date is required.",
  }),
  birthDateSpouse: z.date().optional(),
  ssnApplicant: z.string().optional(),
  ssnSpouse: z.string().optional(),
  usCitizenApplicant: z.boolean().optional(),
  usCitizenSpouse: z.boolean().optional(),
  veteranStatus: z.enum(["None", "Applicant", "Spouse", "Both"]).optional(),
  maritalStatus: z.enum(["Single", "Married", "Widowed", "Divorced"], {
    required_error: "Marital status is required.",
  }),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // Medical Data
  primaryDiagnosis: z.string().optional(),
  nursingHomeName: z.string().optional(),
  dateEnteredNursingHome: z.date().optional(),
  medicalStatus: z.enum(["Well", "Declining", "Critical"]).optional(),
  recentHospitalStay: z.boolean().optional(),
  hospitalStayDuration: z.string().optional(),
  hasLongTermCareInsurance: z.boolean().optional(),
  insuranceDetails: z.string().optional(),
  
  // Monthly Income
  ssBenefitsApplicant: z.string().optional(),
  ssBenefitsSpouse: z.string().optional(),
  pensionApplicant: z.string().optional(),
  pensionSpouse: z.string().optional(),
  annuityIncome: z.string().optional(),
  rentalIncome: z.string().optional(),
  investmentIncome: z.string().optional(),
  otherIncomeSource: z.string().optional(),
  otherIncomeAmount: z.string().optional(),
  
  // Monthly Expenses
  rentMortgage: z.string().optional(),
  realEstateTaxes: z.string().optional(),
  utilities: z.string().optional(),
  homeownersInsurance: z.string().optional(),
  housingMaintenance: z.string().optional(),
  food: z.string().optional(),
  medicalNonReimbursed: z.string().optional(),
  healthInsurancePremiums: z.string().optional(),
  transportation: z.string().optional(),
  clothingPersonalNeeds: z.string().optional(),
  extraordinaryMedical: z.string().optional(),
  
  // Assets and Liabilities
  checkingAccounts: z.array(
    z.object({
      owner: z.enum(["Applicant", "Spouse", "Joint"]),
      institution: z.string().min(1, { message: "Institution is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
  savingsAccounts: z.array(
    z.object({
      owner: z.enum(["Applicant", "Spouse", "Joint"]),
      institution: z.string().min(1, { message: "Institution is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
  moneyMarketAccounts: z.string().optional(),
  certificatesOfDeposit: z.string().optional(),
  stocksBondsMutualFunds: z.string().optional(),
  lifeInsurance: z.array(
    z.object({
      company: z.string().min(1, { message: "Company is required" }),
      policyNumber: z.string().min(1, { message: "Policy number is required" }),
      faceValue: z.string().min(1, { message: "Face value is required" }),
      cashValue: z.string().min(1, { message: "Cash surrender value is required" }),
    })
  ),
  homeValue: z.string().optional(),
  homeMortgage: z.string().optional(),
  intentToReturnHome: z.boolean().optional(),
  householdProperty: z.string().optional(),
  exemptVehicleValue: z.string().optional(),
  hasBurialPlots: z.boolean().optional(),
  
  // Vehicle Information
  vehicles: z.array(
    z.object({
      make: z.string().min(1, { message: "Make is required" }),
      model: z.string().min(1, { message: "Model is required" }),
      year: z.string().min(1, { message: "Year is required" }),
      value: z.string().min(1, { message: "Value is required" }),
      purpose: z.enum(["Personal Use", "Medical Transport", "Other"]),
    })
  ),
  
  // Retirement Accounts
  retirementAccounts: z.array(
    z.object({
      type: z.enum(["IRA", "401(k)", "Other"]),
      value: z.string().min(1, { message: "Value is required" }),
      inPayoutStatus: z.boolean().optional(),
      monthlyPayout: z.string().optional(),
    })
  ),
  
  // Annuities and Trusts
  annuities: z.array(
    z.object({
      issuer: z.string().min(1, { message: "Issuer is required" }),
      startDate: z.date(),
      endDate: z.date(),
      currentValue: z.string().min(1, { message: "Current value is required" }),
      monthlyPayout: z.string().min(1, { message: "Monthly payout is required" }),
      medicaidCompliant: z.boolean().optional(),
    })
  ),
  trusts: z.array(
    z.object({
      type: z.enum(["Revocable", "Irrevocable"]),
      dateEstablished: z.date(),
      value: z.string().min(1, { message: "Value is required" }),
      trusteeName: z.string().min(1, { message: "Trustee name is required" }),
    })
  ),
  
  // Gifts and Transfers
  hasGiftsPast60Months: z.boolean().optional(),
  gifts: z.array(
    z.object({
      recipient: z.string().min(1, { message: "Recipient is required" }),
      date: z.date(),
      amount: z.string().min(1, { message: "Amount is required" }),
      reason: z.string().min(1, { message: "Reason is required" }),
    })
  ),
  
  // Children Information
  children: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      birthDate: z.date(),
      isCaregiver: z.boolean().optional(),
      isFinanciallyDependent: z.boolean().optional(),
    })
  ),
  
  // Legal Documents
  hasPowerOfAttorney: z.boolean().optional(),
  hasHealthcareProxy: z.boolean().optional(),
  hasLivingWill: z.boolean().optional(),
  hasLastWillAndTestament: z.boolean().optional(),
  documentVerificationStatus: z.enum(["Verified", "Pending", "Missing"]).optional(),
  
  // Additional Notes
  additionalNotes: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const defaultValues: AssetFormValues = {
  date: new Date(),
  fileNo: "",
  homePhone: "",
  cellPhone: "",
  businessPhone: "",
  faxNo: "",
  emailAddress: "",
  fullNameApplicant: "",
  fullNameSpouse: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  birthDateApplicant: new Date(),
  birthDateSpouse: undefined,
  ssnApplicant: "",
  ssnSpouse: "",
  usCitizenApplicant: true,
  usCitizenSpouse: undefined,
  veteranStatus: "None",
  maritalStatus: "Single",
  emergencyContactName: "",
  emergencyContactPhone: "",
  
  primaryDiagnosis: "",
  nursingHomeName: "",
  dateEnteredNursingHome: undefined,
  medicalStatus: undefined,
  recentHospitalStay: false,
  hospitalStayDuration: "",
  hasLongTermCareInsurance: false,
  insuranceDetails: "",
  
  ssBenefitsApplicant: "",
  ssBenefitsSpouse: "",
  pensionApplicant: "",
  pensionSpouse: "",
  annuityIncome: "",
  rentalIncome: "",
  investmentIncome: "",
  otherIncomeSource: "",
  otherIncomeAmount: "",
  
  rentMortgage: "",
  realEstateTaxes: "",
  utilities: "",
  homeownersInsurance: "",
  housingMaintenance: "",
  food: "",
  medicalNonReimbursed: "",
  healthInsurancePremiums: "",
  transportation: "",
  clothingPersonalNeeds: "",
  extraordinaryMedical: "",
  
  checkingAccounts: [{ owner: "Applicant", institution: "", value: "" }],
  savingsAccounts: [{ owner: "Applicant", institution: "", value: "" }],
  moneyMarketAccounts: "",
  certificatesOfDeposit: "",
  stocksBondsMutualFunds: "",
  lifeInsurance: [{ company: "", policyNumber: "", faceValue: "", cashValue: "" }],
  homeValue: "",
  homeMortgage: "",
  intentToReturnHome: true,
  householdProperty: "",
  exemptVehicleValue: "",
  hasBurialPlots: false,
  
  vehicles: [{ make: "", model: "", year: "", value: "", purpose: "Personal Use" }],
  retirementAccounts: [{ type: "IRA", value: "", inPayoutStatus: false, monthlyPayout: "" }],
  
  annuities: [{ 
    issuer: "", 
    startDate: new Date(), 
    endDate: new Date(), 
    currentValue: "", 
    monthlyPayout: "", 
    medicaidCompliant: false 
  }],
  
  trusts: [{ 
    type: "Revocable", 
    dateEstablished: new Date(), 
    value: "", 
    trusteeName: "" 
  }],
  
  hasGiftsPast60Months: false,
  gifts: [{ 
    recipient: "", 
    date: new Date(), 
    amount: "", 
    reason: "" 
  }],
  
  children: [{ 
    name: "", 
    birthDate: new Date(), 
    isCaregiver: false, 
    isFinanciallyDependent: false 
  }],
  
  hasPowerOfAttorney: false,
  hasHealthcareProxy: false,
  hasLivingWill: false,
  hasLastWillAndTestament: false,
  documentVerificationStatus: "Pending",
  
  additionalNotes: "",
};

const AssetInput = () => {
  const { toast } = useToast();
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues,
  });

  // Calculate total monthly income
  const calculateTotalIncome = () => {
    const values = form.getValues();
    const incomeValues = [
      values.ssBenefitsApplicant,
      values.ssBenefitsSpouse,
      values.pensionApplicant,
      values.pensionSpouse,
      values.annuityIncome,
      values.rentalIncome,
      values.investmentIncome,
      values.otherIncomeAmount
    ];
    
    return incomeValues
      .map(val => parseFloat(val || "0"))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0)
      .toFixed(2);
  };

  // Calculate total monthly expenses
  const calculateTotalExpenses = () => {
    const values = form.getValues();
    const expenseValues = [
      values.rentMortgage,
      values.realEstateTaxes,
      values.utilities,
      values.homeownersInsurance,
      values.housingMaintenance,
      values.food,
      values.medicalNonReimbursed,
      values.healthInsurancePremiums,
      values.transportation,
      values.clothingPersonalNeeds,
      values.extraordinaryMedical
    ];
    
    return expenseValues
      .map(val => parseFloat(val || "0"))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0)
      .toFixed(2);
  };

  function onSubmit(data: AssetFormValues) {
    console.log("Form submitted:", data);
    toast({
      title: "Intake information saved",
      description: "Your Medicaid planning intake information has been successfully saved.",
    });
  }

  // Generic function to add item to an array field
  const addItem = (fieldName: keyof AssetFormValues, defaultItem: any) => {
    const currentItems = form.getValues(fieldName) as any[];
    form.setValue(fieldName, [...currentItems, defaultItem], { shouldValidate: true });
  };

  // Generic function to remove item from an array field
  const removeItem = (fieldName: keyof AssetFormValues, index: number) => {
    const currentItems = form.getValues(fieldName) as any[];
    if (currentItems.length > 1) {
      form.setValue(
        fieldName,
        currentItems.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-shield-navy mb-6">Medicaid Planning Intake Form</h1>
        <p className="text-gray-600 mb-8">
          Please complete this comprehensive form to help us develop your personalized Medicaid planning strategy.
          All information provided is confidential and will be used solely for Medicaid qualification planning.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <User className="mr-2 h-5 w-5 text-shield-teal" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fileNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File No.</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="homePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cellPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cell Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="faxNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax No.</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullNameApplicant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (Applicant)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fullNameSpouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (Spouse)</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="birthDateApplicant"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Birth Date (Applicant)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthDateSpouse"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Birth Date (Spouse)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ssnApplicant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Number (Applicant)</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX-XX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ssnSpouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Number (Spouse)</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX-XX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="usCitizenApplicant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>U.S. Citizen (Applicant)</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="usCitizenSpouse"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>U.S. Citizen (Spouse)</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="veteranStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veteran Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Applicant">Applicant</SelectItem>
                            <SelectItem value="Spouse">Spouse</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Medical Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Hospital className="mr-2 h-5 w-5 text-shield-teal" />
                  Medical Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="primaryDiagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Diagnosis</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium text-lg mb-4">Nursing Home Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nursingHomeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of Facility</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateEnteredNursingHome"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date Entered Nursing Home</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="medicalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medical Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Well">Well</SelectItem>
                            <SelectItem value="Declining">Declining</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recentHospitalStay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recent Hospital Stay</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hospitalStayDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Stay Duration (days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            disabled={!form.watch("recentHospitalStay")} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hasLongTermCareInsurance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Long-Term Care Insurance</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="insuranceDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Provider and Policy Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            disabled={!form.watch("hasLongTermCareInsurance")} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3. Monthly Income */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-shield-teal" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ssBenefitsApplicant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Benefits (Applicant)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ssBenefitsSpouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Benefits (Spouse)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pensionApplicant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension - Gross (Applicant)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pensionSpouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension - Gross (Spouse)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="annuityIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annuity Income</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rentalIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rental Income</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="investmentIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Income</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="otherIncomeSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Income Source</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="otherIncomeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Income Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-slate-100 p-4 rounded-md flex justify-between items-center">
                  <div className="font-semibold">Total Monthly Income:</div>
                  <div className="text-lg font-bold">${calculateTotalIncome()}</div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Monthly Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-shield-teal" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-medium text-lg mb-4">Shelter Expenses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="rentMortgage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rent/Mortgage</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="realEstateTaxes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Real Estate Taxes</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="utilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Utilities (water, sewer, electric)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="homeownersInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Homeowners Insurance Premium</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="housingMaintenance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Housing Maintenance Costs</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Non-Shelter Expenses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="food"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalNonReimbursed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical (Non-Reimbursed)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="healthInsurancePremiums"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Insurance Premiums</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="transportation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transportation</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clothingPersonalNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clothing, Other Personal Needs</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="extraordinaryMedical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extraordinary Medical Expenses</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-slate-100 p-4 rounded-md flex justify-between items-center">
                  <div className="font-semibold">Total Monthly Expenses:</div>
                  <div className="text-lg font-bold">${calculateTotalExpenses()}</div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Assets and Liabilities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Bank className="mr-2 h-5 w-5 text-shield-teal" />
                  Countable and Non-Countable Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Bank Accounts</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("checkingAccounts", { owner: "Applicant", institution: "", value: "" })}
                      className="h-8 text-shield-navy border-shield-navy"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Checking Account
                    </Button>
                  </div>
                  
                  {form.watch("checkingAccounts").map((_, index) => (
                    <div key={`checking-${index}`} className="p-4 border rounded-lg relative mb-4">
                      {form.watch("checkingAccounts").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem("checkingAccounts", index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-3">Checking Account {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`checkingAccounts.${index}.owner`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select owner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Applicant">Applicant</SelectItem>
                                  <SelectItem value="Spouse">Spouse</SelectItem>
                                  <SelectItem value="Joint">Joint</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`checkingAccounts.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="Bank name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`checkingAccounts.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center mb-4 mt-6">
                    <h3 className="font-medium text-lg">Savings Accounts</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("savingsAccounts", { owner: "Applicant", institution: "", value: "" })}
                      className="h-8 text-shield-navy border-shield-navy"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Savings Account
                    </Button>
                  </div>
                  
                  {form.watch("savingsAccounts").map((_, index) => (
                    <div key={`savings-${index}`} className="p-4 border rounded-lg relative mb-4">
                      {form.watch("savingsAccounts").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem("savingsAccounts", index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-3">Savings Account {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`savingsAccounts.${index}.owner`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select owner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Applicant">Applicant</SelectItem>
                                  <SelectItem value="Spouse">Spouse</SelectItem>
                                  <SelectItem value="Joint">Joint</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`savingsAccounts.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="Bank name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`savingsAccounts.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="moneyMarketAccounts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Money Market Accounts</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certificatesOfDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificates of Deposit (CDs)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stocksBondsMutualFunds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stocks, Bonds, Mutual Funds</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Life Insurance</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("lifeInsurance", { company: "", policyNumber: "", faceValue: "", cashValue: "" })}
                      className="h-8 text-shield-navy border-shield-navy"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Life Insurance
                    </Button>
                  </div>
                  
                  {form.watch("lifeInsurance").map((_, index) => (
                    <div key={`insurance-${index}`} className="p-4 border rounded-lg relative mb-4">
                      {form.watch("lifeInsurance").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem("lifeInsurance", index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-3">Life Insurance Policy {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`lifeInsurance.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Company</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`lifeInsurance.${index}.policyNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Policy Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`lifeInsurance.${index}.faceValue`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Face Value</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`lifeInsurance.${index}.cashValue`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cash Surrender Value (countable)</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Primary Residence Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="homeValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Value of Home</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="homeMortgage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outstanding Mortgage (if any)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="intentToReturnHome"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Intent to Return Home</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6 mb-4">Non-Countable Assets</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="householdProperty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Household Personal Property</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="exemptVehicleValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>One Vehicle (Exempt)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasBurialPlots"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Burial Plots</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. Vehicle Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Car className="mr-2 h-5 w-5 text-shield-teal" />
                  Vehicle Information
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("vehicles", { make: "", model: "", year: "", value: "", purpose: "Personal Use" })}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("vehicles").map((_, index) => (
                  <div key={`vehicle-${index}`} className="p-4 border rounded-lg relative">
                    {form.watch("vehicles").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("vehicles", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Vehicle {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.make`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="Toyota" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="Camry" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder="2020" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.purpose`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purpose</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Personal Use">Personal Use</SelectItem>
                                <SelectItem value="Medical Transport">Medical Transport</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 7. Retirement and Life Insurance Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-shield-teal" />
                  Retirement Accounts
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("retirementAccounts", { type: "IRA", value: "", inPayoutStatus: false, monthlyPayout: "" })}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Retirement Account
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("retirementAccounts").map((_, index) => (
                  <div key={`retirement-${index}`} className="p-4 border rounded-lg relative">
                    {form.watch("retirementAccounts").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("retirementAccounts", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Retirement Account {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`retirementAccounts.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="IRA">IRA</SelectItem>
                                <SelectItem value="401(k)">401(k)</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`retirementAccounts.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Value</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`retirementAccounts.${index}.inPayoutStatus`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>In Payout Status</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`retirementAccounts.${index}.monthlyPayout`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Payout Amount</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0.00" 
                                {...field} 
                                disabled={!form.watch(`retirementAccounts.${index}.inPayoutStatus`)} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 8. Annuities and Trust Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-shield-teal" />
                  Annuities and Trusts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Annuities</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("annuities", { 
                        issuer: "", 
                        startDate: new Date(), 
                        endDate: new Date(), 
                        currentValue: "", 
                        monthlyPayout: "", 
                        medicaidCompliant: false 
                      })}
                      className="h-8 text-shield-navy border-shield-navy"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Annuity
                    </Button>
                  </div>
                  
                  {form.watch("annuities").map((_, index) => (
                    <div key={`annuity-${index}`} className="p-4 border rounded-lg relative mb-4">
                      {form.watch("annuities").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem("annuities", index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-3">Annuity {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.issuer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issuer</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.currentValue`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Value</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.monthlyPayout`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Payout</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`annuities.${index}.medicaidCompliant`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Medicaid-Compliant</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Trusts</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("trusts", { 
                        type: "Revocable", 
                        dateEstablished: new Date(), 
                        value: "", 
                        trusteeName: "" 
                      })}
                      className="h-8 text-shield-navy border-shield-navy"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Trust
                    </Button>
                  </div>
                  
                  {form.watch("trusts").map((_, index) => (
                    <div key={`trust-${index}`} className="p-4 border rounded-lg relative mb-4">
                      {form.watch("trusts").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem("trusts", index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <h4 className="font-medium mb-3">Trust {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`trusts.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trust Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Revocable">Revocable</SelectItem>
                                  <SelectItem value="Irrevocable">Irrevocable</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`trusts.${index}.dateEstablished`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date Established</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`trusts.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value of Assets in Trust</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`trusts.${index}.trusteeName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trustee Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 9. Gifts and Transfers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Gift className="mr-2 h-5 w-5 text-shield-teal" />
                  Gifts and Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="hasGiftsPast60Months"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Gifts/Transfers in Past 60 Months (Look-Back Period)</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch("hasGiftsPast60Months") && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">Gift Details</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem("gifts", { 
                          recipient: "", 
                          date: new Date(), 
                          amount: "", 
                          reason: "" 
                        })}
                        className="h-8 text-shield-navy border-shield-navy"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Gift
                      </Button>
                    </div>
                    
                    {form.watch("gifts").map((_, index) => (
                      <div key={`gift-${index}`} className="p-4 border rounded-lg relative mb-4">
                        {form.watch("gifts").length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem("gifts", index)}
                            className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                        <h4 className="font-medium mb-3">Gift {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`gifts.${index}.recipient`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recipient</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`gifts.${index}.date`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date > new Date()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`gifts.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`gifts.${index}.reason`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason for Gift/Transfer</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 10. Children's Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Users className="mr-2 h-5 w-5 text-shield-teal" />
                  Children's Information
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("children", { 
                    name: "", 
                    birthDate: new Date(), 
                    isCaregiver: false, 
                    isFinanciallyDependent: false 
                  })}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Child
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("children").map((_, index) => (
                  <div key={`child-${index}`} className="p-4 border rounded-lg relative">
                    {form.watch("children").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("children", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Child {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`children.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`children.${index}.birthDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name={`children.${index}.isCaregiver`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Caregiver Status</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`children.${index}.isFinanciallyDependent`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Financial Dependence on Applicant</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 11. Legal Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-shield-teal" />
                  Legal Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hasPowerOfAttorney"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Power of Attorney</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hasHealthcareProxy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Healthcare Proxy</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hasLivingWill"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Living Will</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hasLastWillAndTestament"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Last Will and Testament</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="documentVerificationStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Missing">Missing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 13. Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-shield-teal" />
                  Additional Notes and Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Relevant Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[150px]"
                            placeholder="Enter any additional information that may be relevant to the Medicaid planning process..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="border-shield-navy text-shield-navy"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                className="bg-shield-navy hover:bg-shield-navy/90"
              >
                Submit Intake Information
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssetInput;
