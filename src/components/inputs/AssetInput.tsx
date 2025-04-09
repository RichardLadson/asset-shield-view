
import React from 'react';
import { Wallet } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Define form schema with Zod
const assetFormSchema = z.object({
  name: z.string().min(2, { message: "Asset name must be at least 2 characters." }),
  assetType: z.string({
    required_error: "Please select an asset type.",
  }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }).optional(),
  notes: z.string().optional(),
  isJointlyOwned: z.boolean().default(false),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const defaultValues: Partial<AssetFormValues> = {
  name: "",
  assetType: "bankAccount",
  value: 0,
  location: "",
  notes: "",
  isJointlyOwned: false,
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
      title: "Asset Saved",
      description: `${data.name} has been added to your assets.`,
    });
    form.reset(defaultValues);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Wallet className="mr-3 text-shield-navy" />
          Medicaid Planning Asset Input
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Primary Checking Account" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive name for this asset.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Type */}
              <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bankAccount">Bank Account</SelectItem>
                        <SelectItem value="realEstate">Real Estate</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="retirement">Retirement Account</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="personalProperty">Personal Property</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best describes this asset.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Value */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Estimated current market value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., First National Bank" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where is this asset held or located?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Joint Ownership */}
              <FormField
                control={form.control}
                name="isJointlyOwned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Jointly Owned</FormLabel>
                      <FormDescription>
                        Is this asset jointly owned with a spouse or other individual?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about this asset..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any relevant details or information about this asset.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                Clear
              </Button>
              <Button type="submit" className="bg-shield-teal hover:bg-shield-teal/90">
                Save Asset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssetInput;
