
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Home, Briefcase, Car, Coins, Plus, Minus } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const assetFormSchema = z.object({
  clientName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  maritalStatus: z.enum(["Single", "Married", "Widowed", "Divorced"], {
    required_error: "Please select a marital status.",
  }),
  realEstate: z.array(
    z.object({
      type: z.string().min(1, { message: "Property type is required" }),
      value: z.string().min(1, { message: "Property value is required" }),
      address: z.string().min(1, { message: "Address is required" }),
    })
  ),
  bankAccounts: z.array(
    z.object({
      type: z.string().min(1, { message: "Account type is required" }),
      institution: z.string().min(1, { message: "Institution is required" }),
      value: z.string().min(1, { message: "Account value is required" }),
    })
  ),
  vehicles: z.array(
    z.object({
      make: z.string().min(1, { message: "Make is required" }),
      model: z.string().min(1, { message: "Model is required" }),
      year: z.string().min(1, { message: "Year is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
  investments: z.array(
    z.object({
      type: z.string().min(1, { message: "Investment type is required" }),
      institution: z.string().min(1, { message: "Institution is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const defaultValues: AssetFormValues = {
  clientName: "",
  dob: new Date(),
  maritalStatus: "Single",
  realEstate: [{ type: "", value: "", address: "" }],
  bankAccounts: [{ type: "", institution: "", value: "" }],
  vehicles: [{ make: "", model: "", year: "", value: "" }],
  investments: [{ type: "", institution: "", value: "" }],
};

const AssetInput = () => {
  const { toast } = useToast();
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues,
  });

  function onSubmit(data: AssetFormValues) {
    console.log("Form submitted:", data);
    toast({
      title: "Asset information saved",
      description: "Your asset information has been successfully saved.",
    });
  }

  const addItem = (
    fieldName: "realEstate" | "bankAccounts" | "vehicles" | "investments"
  ) => {
    const currentItems = form.getValues(fieldName);
    
    if (fieldName === "realEstate") {
      form.setValue(fieldName, [...currentItems, { type: "", value: "", address: "" }]);
    } else if (fieldName === "bankAccounts") {
      form.setValue(fieldName, [...currentItems, { type: "", institution: "", value: "" }]);
    } else if (fieldName === "vehicles") {
      form.setValue(fieldName, [...currentItems, { make: "", model: "", year: "", value: "" }]);
    } else if (fieldName === "investments") {
      form.setValue(fieldName, [...currentItems, { type: "", institution: "", value: "" }]);
    }
  };

  const removeItem = (
    fieldName: "realEstate" | "bankAccounts" | "vehicles" | "investments",
    index: number
  ) => {
    const currentItems = form.getValues(fieldName);
    if (currentItems.length > 1) {
      form.setValue(
        fieldName,
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-shield-navy mb-6">Asset Information</h1>
        <p className="text-gray-600 mb-8">
          Please provide detailed information about your assets. This will help us create a comprehensive Medicaid planning strategy for you.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-shield-navy">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your full legal name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used for Medicaid eligibility calculation.
                      </FormDescription>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Your marital status affects Medicaid planning strategies.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Home className="mr-2 h-5 w-5 text-shield-teal" />
                  Real Estate
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("realEstate")}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Property
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("realEstate").map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    {form.watch("realEstate").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("realEstate", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Property {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`realEstate.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Primary Residence" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`realEstate.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Value</FormLabel>
                            <FormControl>
                              <Input placeholder="250000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`realEstate.${index}.address`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-shield-teal" />
                  Bank Accounts
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("bankAccounts")}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Account
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("bankAccounts").map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    {form.watch("bankAccounts").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("bankAccounts", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Account {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Checking" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="Chase Bank" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Balance</FormLabel>
                            <FormControl>
                              <Input placeholder="15000" {...field} />
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Car className="mr-2 h-5 w-5 text-shield-teal" />
                  Vehicles
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("vehicles")}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("vehicles").map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                              <Input placeholder="15000" {...field} />
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-shield-navy flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-shield-teal" />
                  Investments
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem("investments")}
                  className="h-8 text-shield-navy border-shield-navy"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Investment
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("investments").map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    {form.watch("investments").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem("investments", index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-3">Investment {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`investments.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Type</FormLabel>
                            <FormControl>
                              <Input placeholder="401(k)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`investments.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="Fidelity" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`investments.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Value</FormLabel>
                            <FormControl>
                              <Input placeholder="250000" {...field} />
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
                Submit Asset Information
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssetInput;
