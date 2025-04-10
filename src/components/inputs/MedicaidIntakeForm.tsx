
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  User, 
  Users, 
  Home, 
  Phone, 
  Mail, 
  FileText, 
  Heart, 
  DollarSign,
  Building,
  Car,
  ShieldCheck,
  Gift,
  FileCheck,
  ScrollText,
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define the schema for the form
const formSchema = z.object({
  // Client Information
  date: z.date({
    required_error: "Please select a date.",
  }),
  fileNo: z.string().optional(),
  homePhone: z.string().optional(),
  cellPhone: z.string().optional(),
  businessPhone: z.string().optional(),
  faxNo: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  applicantName: z.string().min(2, { message: "Applicant name must be at least 2 characters." }),
  spouseName: z.string().optional(),
  streetAddress: z.string().min(2, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(1, { message: "Please select a state." }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters." }),
  applicantBirthDate: z.date({
    required_error: "Please select applicant's birth date.",
  }),
  spouseBirthDate: z.date().optional(),
  applicantSSN: z.string().optional(),
  spouseSSN: z.string().optional(),
  applicantCitizen: z.boolean().default(false),
  spouseCitizen: z.boolean().default(false),
  veteranStatus: z.string().optional(),
  maritalStatus: z.string().min(1, { message: "Please select marital status." }),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // Medical Data
  primaryDiagnosis: z.string().optional(),
  facilityName: z.string().optional(),
  dateEnteredNursingHome: z.date().optional(),
  medicalStatus: z.string().optional(),
  recentHospitalStay: z.boolean().default(false),
  hospitalStayDuration: z.number().min(0).optional(),
  longTermCareInsurance: z.boolean().default(false),
  insuranceDetails: z.string().optional(),
  
  // Monthly Income
  applicantSocialSecurity: z.number().min(0).default(0),
  spouseSocialSecurity: z.number().min(0).default(0),
  applicantPension: z.number().min(0).default(0),
  spousePension: z.number().min(0).default(0),
  annuityIncome: z.number().min(0).default(0),
  rentalIncome: z.number().min(0).default(0),
  investmentIncome: z.number().min(0).default(0),
  otherIncomeSources: z.string().optional(),
  otherIncomeAmount: z.number().min(0).default(0),
  
  // Monthly Expenses
  rentMortgage: z.number().min(0).default(0),
  realEstateTaxes: z.number().min(0).default(0),
  utilities: z.number().min(0).default(0),
  homeownersInsurance: z.number().min(0).default(0),
  housingMaintenance: z.number().min(0).default(0),
  food: z.number().min(0).default(0),
  medicalNonReimbursed: z.number().min(0).default(0),
  healthInsurancePremiums: z.number().min(0).default(0),
  transportation: z.number().min(0).default(0),
  clothing: z.number().min(0).default(0),
  extraordinaryMedical: z.number().min(0).default(0),
  
  // Assets and Liabilities
  checkingApplicant: z.number().min(0).default(0),
  checkingSpouse: z.number().min(0).default(0),
  checkingJoint: z.number().min(0).default(0),
  savingsApplicant: z.number().min(0).default(0),
  savingsSpouse: z.number().min(0).default(0),
  savingsJoint: z.number().min(0).default(0),
  moneyMarket: z.number().min(0).default(0),
  cds: z.number().min(0).default(0),
  investments: z.number().min(0).default(0),
  retirementAccounts: z.number().min(0).default(0),
  lifeInsuranceFaceValue: z.number().min(0).default(0),
  lifeInsuranceCashValue: z.number().min(0).default(0),
  homeValue: z.number().min(0).default(0),
  mortgageOutstanding: z.number().min(0).default(0),
  intentToReturnHome: z.boolean().default(true),
  personalProperty: z.number().min(0).default(0),
  exemptVehicleValue: z.number().min(0).default(0),
  burialPlots: z.boolean().default(false),
  
  // Additional Notes
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  date: new Date(),
  applicantCitizen: true,
  spouseCitizen: true,
  recentHospitalStay: false,
  longTermCareInsurance: false,
  intentToReturnHome: true,
  burialPlots: false,
  applicantSocialSecurity: 0,
  spouseSocialSecurity: 0,
  applicantPension: 0,
  spousePension: 0,
  annuityIncome: 0,
  rentalIncome: 0,
  investmentIncome: 0,
  otherIncomeAmount: 0,
};

const MedicaidIntakeForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("client-info");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const calculateTotalIncome = () => {
    const values = form.getValues();
    return (
      (values.applicantSocialSecurity || 0) +
      (values.spouseSocialSecurity || 0) +
      (values.applicantPension || 0) +
      (values.spousePension || 0) +
      (values.annuityIncome || 0) +
      (values.rentalIncome || 0) +
      (values.investmentIncome || 0) +
      (values.otherIncomeAmount || 0)
    );
  };

  const calculateShelterExpenses = () => {
    const values = form.getValues();
    return (
      (values.rentMortgage || 0) +
      (values.realEstateTaxes || 0) +
      (values.utilities || 0) +
      (values.homeownersInsurance || 0) +
      (values.housingMaintenance || 0)
    );
  };

  const calculateNonShelterExpenses = () => {
    const values = form.getValues();
    return (
      (values.food || 0) +
      (values.medicalNonReimbursed || 0) +
      (values.healthInsurancePremiums || 0) +
      (values.transportation || 0) +
      (values.clothing || 0) +
      (values.extraordinaryMedical || 0)
    );
  };

  const calculateTotalExpenses = () => {
    return calculateShelterExpenses() + calculateNonShelterExpenses();
  };

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    toast({
      title: "Form Submitted",
      description: "Your Medicaid planning intake form has been submitted.",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-shield-navy">
            Medicaid Planning Intake Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="medical-data">Medical Data</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>

                {/* Client Information Tab */}
                <TabsContent value="client-info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    "pl-3 text-left font-normal",
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
                                className="pointer-events-auto"
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
                            <Input placeholder="File number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicantName"
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
                      name="spouseName"
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AL">Alabama</SelectItem>
                              <SelectItem value="AK">Alaska</SelectItem>
                              <SelectItem value="AZ">Arizona</SelectItem>
                              <SelectItem value="AR">Arkansas</SelectItem>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="CO">Colorado</SelectItem>
                              <SelectItem value="CT">Connecticut</SelectItem>
                              <SelectItem value="DE">Delaware</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="GA">Georgia</SelectItem>
                              <SelectItem value="HI">Hawaii</SelectItem>
                              <SelectItem value="ID">Idaho</SelectItem>
                              <SelectItem value="IL">Illinois</SelectItem>
                              <SelectItem value="IN">Indiana</SelectItem>
                              <SelectItem value="IA">Iowa</SelectItem>
                              <SelectItem value="KS">Kansas</SelectItem>
                              <SelectItem value="KY">Kentucky</SelectItem>
                              <SelectItem value="LA">Louisiana</SelectItem>
                              <SelectItem value="ME">Maine</SelectItem>
                              <SelectItem value="MD">Maryland</SelectItem>
                              <SelectItem value="MA">Massachusetts</SelectItem>
                              <SelectItem value="MI">Michigan</SelectItem>
                              <SelectItem value="MN">Minnesota</SelectItem>
                              <SelectItem value="MS">Mississippi</SelectItem>
                              <SelectItem value="MO">Missouri</SelectItem>
                              <SelectItem value="MT">Montana</SelectItem>
                              <SelectItem value="NE">Nebraska</SelectItem>
                              <SelectItem value="NV">Nevada</SelectItem>
                              <SelectItem value="NH">New Hampshire</SelectItem>
                              <SelectItem value="NJ">New Jersey</SelectItem>
                              <SelectItem value="NM">New Mexico</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="NC">North Carolina</SelectItem>
                              <SelectItem value="ND">North Dakota</SelectItem>
                              <SelectItem value="OH">Ohio</SelectItem>
                              <SelectItem value="OK">Oklahoma</SelectItem>
                              <SelectItem value="OR">Oregon</SelectItem>
                              <SelectItem value="PA">Pennsylvania</SelectItem>
                              <SelectItem value="RI">Rhode Island</SelectItem>
                              <SelectItem value="SC">South Carolina</SelectItem>
                              <SelectItem value="SD">South Dakota</SelectItem>
                              <SelectItem value="TN">Tennessee</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="UT">Utah</SelectItem>
                              <SelectItem value="VT">Vermont</SelectItem>
                              <SelectItem value="VA">Virginia</SelectItem>
                              <SelectItem value="WA">Washington</SelectItem>
                              <SelectItem value="WV">West Virginia</SelectItem>
                              <SelectItem value="WI">Wisconsin</SelectItem>
                              <SelectItem value="WY">Wyoming</SelectItem>
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

                    <FormField
                      control={form.control}
                      name="applicantBirthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Birth Date (Applicant)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
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
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spouseBirthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Birth Date (Spouse)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
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
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="homePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Home Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
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
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="faxNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicantSSN"
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
                      name="spouseSSN"
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

                    <FormField
                      control={form.control}
                      name="applicantCitizen"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              U.S. Citizen (Applicant)
                            </FormLabel>
                            <FormDescription>
                              Is the applicant a U.S. citizen?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spouseCitizen"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              U.S. Citizen (Spouse)
                            </FormLabel>
                            <FormDescription>
                              Is the spouse a U.S. citizen?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="veteranStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veteran Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select veteran status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="applicant">Applicant</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
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
                            <Input placeholder="Emergency contact name" {...field} />
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
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("medical-data")}
                    >
                      Next: Medical Data
                    </Button>
                  </div>
                </TabsContent>

                {/* Medical Data Tab */}
                <TabsContent value="medical-data" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryDiagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Diagnosis</FormLabel>
                          <FormControl>
                            <Input placeholder="Primary diagnosis" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facilityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of Facility</FormLabel>
                          <FormControl>
                            <Input placeholder="Facility name" {...field} />
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
                                    "pl-3 text-left font-normal",
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
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medicalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medical Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="well">Well</SelectItem>
                              <SelectItem value="declining">Declining</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
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
                            <FormLabel>
                              Recent Hospital Stay
                            </FormLabel>
                            <FormDescription>
                              Indicate if there was a recent hospital stay
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("recentHospitalStay") && (
                      <FormField
                        control={form.control}
                        name="hospitalStayDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="longTermCareInsurance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Long-Term Care Insurance
                            </FormLabel>
                            <FormDescription>
                              Does the applicant have long-term care insurance?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("longTermCareInsurance") && (
                      <FormField
                        control={form.control}
                        name="insuranceDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider and Policy Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter details about the insurance provider and policy" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("client-info")}
                    >
                      Previous: Client Info
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("income")}
                    >
                      Next: Income
                    </Button>
                  </div>
                </TabsContent>

                {/* Monthly Income Tab */}
                <TabsContent value="income" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="applicantSocialSecurity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Security Benefits (Applicant)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spouseSocialSecurity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Security Benefits (Spouse)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicantPension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pension (Gross) - Applicant</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spousePension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pension (Gross) - Spouse</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="annuityIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annuity Income</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Other Income Sources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="otherIncomeSources"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Other income source" {...field} />
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
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="pl-7"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Monthly Income:</span>
                      <span className="font-semibold">${calculateTotalIncome().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("medical-data")}
                    >
                      Previous: Medical Data
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("expenses")}
                    >
                      Next: Expenses
                    </Button>
                  </div>
                </TabsContent>

                {/* Monthly Expenses Tab */}
                <TabsContent value="expenses" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="text-lg font-medium mb-2">Shelter Expenses</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="rentMortgage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rent/Mortgage</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Utilities (water, sewer, electric)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 md:col-span-2 mt-4">
                      <h3 className="text-lg font-medium mb-2">Non-Shelter Expenses</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="food"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transportation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transportation</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clothing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clothing, Other Personal Needs</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            E.g., surgeries, specialist visits
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Shelter Expenses:</span>
                      <span>${calculateShelterExpenses().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Non-Shelter Expenses:</span>
                      <span>${calculateNonShelterExpenses().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Total Monthly Expenses:</span>
                      <span className="font-semibold">${calculateTotalExpenses().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("income")}
                    >
                      Previous: Income
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("assets")}
                    >
                      Next: Assets
                    </Button>
                  </div>
                </TabsContent>

                {/* Assets Tab */}
                <TabsContent value="assets" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="text-lg font-medium mb-2">Bank Accounts</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="checkingApplicant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Checking Account - Applicant</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkingSpouse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Checking Account - Spouse</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkingJoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Checking Account - Joint</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="savingsApplicant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Savings Account - Applicant</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="savingsSpouse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Savings Account - Spouse</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="savingsJoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Savings Account - Joint</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 md:col-span-2 mt-4">
                      <h3 className="text-lg font-medium mb-2">Other Financial Assets</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="moneyMarket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Money Market Accounts</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificates of Deposit (CDs)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stocks, Bonds, Mutual Funds</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="retirementAccounts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retirement Accounts (IRAs, 401k)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lifeInsuranceFaceValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Life Insurance - Face Value</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lifeInsuranceCashValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Life Insurance - Cash Surrender Value</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            This is considered a countable asset
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 md:col-span-2 mt-4">
                      <h3 className="text-lg font-medium mb-2">Primary Residence</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="homeValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Value of Home</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mortgageOutstanding"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outstanding Mortgage (if any)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
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
                            <FormLabel>
                              Intent to Return Home
                            </FormLabel>
                            <FormDescription>
                              Does the applicant intend to return to their primary residence?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 md:col-span-2 mt-4">
                      <h3 className="text-lg font-medium mb-2">Non-Countable Assets</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="personalProperty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Household Personal Property</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Estimated value
                          </FormDescription>
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
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="burialPlots"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Burial Plots
                            </FormLabel>
                            <FormDescription>
                              Does the applicant own burial plots?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("expenses")}
                    >
                      Previous: Expenses
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("additional")}
                    >
                      Next: Additional Info
                    </Button>
                  </div>
                </TabsContent>

                {/* Additional Info Tab */}
                <TabsContent value="additional" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes and Documentation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter any additional relevant information..." 
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include any other information that might be relevant to the Medicaid planning process.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("assets")}
                    >
                      Previous: Assets
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                      onClick={() => setActiveTab("review")}
                    >
                      Next: Review
                    </Button>
                  </div>
                </TabsContent>

                {/* Review Tab */}
                <TabsContent value="review" className="space-y-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="client-info">
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>Client Information</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Applicant Name</dt>
                                  <dd>{form.getValues().applicantName || "Not provided"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Spouse Name</dt>
                                  <dd>{form.getValues().spouseName || "Not provided"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                                  <dd>
                                    {form.getValues().streetAddress}, {form.getValues().city}, {form.getValues().state} {form.getValues().zipCode}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                                  <dd>{form.getValues().maritalStatus || "Not provided"}</dd>
                                </div>
                              </dl>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="medical-data">
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <Heart className="mr-2 h-4 w-4" />
                                <span>Medical Data</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Primary Diagnosis</dt>
                                  <dd>{form.getValues().primaryDiagnosis || "Not provided"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Facility Name</dt>
                                  <dd>{form.getValues().facilityName || "Not provided"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Medical Status</dt>
                                  <dd>{form.getValues().medicalStatus || "Not provided"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Long-Term Care Insurance</dt>
                                  <dd>{form.getValues().longTermCareInsurance ? "Yes" : "No"}</dd>
                                </div>
                              </dl>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="income">
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <DollarSign className="mr-2 h-4 w-4" />
                                <span>Monthly Income</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Social Security (Applicant)</dt>
                                  <dd>${form.getValues().applicantSocialSecurity?.toFixed(2) || "0.00"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Social Security (Spouse)</dt>
                                  <dd>${form.getValues().spouseSocialSecurity?.toFixed(2) || "0.00"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Total Monthly Income</dt>
                                  <dd className="font-medium">${calculateTotalIncome().toFixed(2)}</dd>
                                </div>
                              </dl>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="expenses">
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <Building className="mr-2 h-4 w-4" />
                                <span>Monthly Expenses</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Shelter Expenses</dt>
                                  <dd>${calculateShelterExpenses().toFixed(2)}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Non-Shelter Expenses</dt>
                                  <dd>${calculateNonShelterExpenses().toFixed(2)}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Total Monthly Expenses</dt>
                                  <dd className="font-medium">${calculateTotalExpenses().toFixed(2)}</dd>
                                </div>
                              </dl>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="assets">
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <Car className="mr-2 h-4 w-4" />
                                <span>Assets</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Home Value</dt>
                                  <dd>${form.getValues().homeValue?.toFixed(2) || "0.00"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Checking Accounts (Total)</dt>
                                  <dd>
                                    ${(
                                      (form.getValues().checkingApplicant || 0) + 
                                      (form.getValues().checkingSpouse || 0) + 
                                      (form.getValues().checkingJoint || 0)
                                    ).toFixed(2)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Savings Accounts (Total)</dt>
                                  <dd>
                                    ${(
                                      (form.getValues().savingsApplicant || 0) + 
                                      (form.getValues().savingsSpouse || 0) + 
                                      (form.getValues().savingsJoint || 0)
                                    ).toFixed(2)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Investments</dt>
                                  <dd>${form.getValues().investments?.toFixed(2) || "0.00"}</dd>
                                </div>
                              </dl>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("additional")}
                    >
                      Previous: Additional Info
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-shield-teal hover:bg-shield-teal/90"
                    >
                      Submit Form
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicaidIntakeForm;
