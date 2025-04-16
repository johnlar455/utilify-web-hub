
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const addGstSchema = z.object({
  priceExGst: z.coerce.number().min(0, "Price must be a positive number"),
  gstRate: z.coerce.number().min(0, "GST rate must be a positive number").max(100, "GST rate cannot exceed 100%"),
  country: z.string().optional()
});

const removeGstSchema = z.object({
  priceIncGst: z.coerce.number().min(0, "Price must be a positive number"),
  gstRate: z.coerce.number().min(0, "GST rate must be a positive number").max(100, "GST rate cannot exceed 100%"),
  country: z.string().optional()
});

type AddGstFormValues = z.infer<typeof addGstSchema>;
type RemoveGstFormValues = z.infer<typeof removeGstSchema>;

// Default GST/VAT rates for different countries
const countryRates: Record<string, number> = {
  australia: 10,
  newZealand: 15,
  canada: 5,
  singapore: 8,
  india: 18,
  uk: 20,
  eu: 21,
  custom: 0
};

const GstCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("add-gst");
  const [addGstResult, setAddGstResult] = useState<{gstAmount: number; totalPrice: number} | null>(null);
  const [removeGstResult, setRemoveGstResult] = useState<{gstAmount: number; priceExGst: number} | null>(null);

  const addGstForm = useForm<AddGstFormValues>({
    resolver: zodResolver(addGstSchema),
    defaultValues: {
      priceExGst: 0,
      gstRate: 10,
      country: 'australia'
    }
  });

  const removeGstForm = useForm<RemoveGstFormValues>({
    resolver: zodResolver(removeGstSchema),
    defaultValues: {
      priceIncGst: 0,
      gstRate: 10,
      country: 'australia'
    }
  });

  // Handle country change for Add GST form
  const handleAddGstCountryChange = (value: string) => {
    addGstForm.setValue('country', value);
    addGstForm.setValue('gstRate', countryRates[value]);
  };

  // Handle country change for Remove GST form
  const handleRemoveGstCountryChange = (value: string) => {
    removeGstForm.setValue('country', value);
    removeGstForm.setValue('gstRate', countryRates[value]);
  };

  const calculateAddGst = (data: AddGstFormValues) => {
    const { priceExGst, gstRate } = data;
    
    const gstAmount = priceExGst * (gstRate / 100);
    const totalPrice = priceExGst + gstAmount;
    
    setAddGstResult({
      gstAmount: Number(gstAmount.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2))
    });
  };

  const calculateRemoveGst = (data: RemoveGstFormValues) => {
    const { priceIncGst, gstRate } = data;
    
    // Formula to extract GST from an inclusive price:
    // Price Ex GST = Price Inc GST / (1 + (GST Rate / 100))
    const priceExGst = priceIncGst / (1 + (gstRate / 100));
    const gstAmount = priceIncGst - priceExGst;
    
    setRemoveGstResult({
      gstAmount: Number(gstAmount.toFixed(2)),
      priceExGst: Number(priceExGst.toFixed(2))
    });
  };

  return (
    <ToolLayout
      title="GST/VAT Calculator"
      description="Calculate Goods and Services Tax or Value Added Tax"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select whether you want to add or remove GST from a price</li>
          <li>Choose your country or custom GST rate</li>
          <li>Enter the price amount</li>
          <li>See the calculated results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            GST (Goods and Services Tax) and VAT (Value Added Tax) are consumption taxes added to the price of goods and services.
            This calculator helps you add or remove GST/VAT based on different country rates.
          </p>
        </div>

        <Tabs defaultValue="add-gst" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="add-gst">Add GST/VAT</TabsTrigger>
            <TabsTrigger value="remove-gst">Remove GST/VAT</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add-gst" className="pt-4">
            <Form {...addGstForm}>
              <form onSubmit={addGstForm.handleSubmit(calculateAddGst)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={addGstForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country/Region</FormLabel>
                        <Select 
                          onValueChange={handleAddGstCountryChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="australia">Australia (10%)</SelectItem>
                            <SelectItem value="newZealand">New Zealand (15%)</SelectItem>
                            <SelectItem value="canada">Canada (5%)</SelectItem>
                            <SelectItem value="singapore">Singapore (8%)</SelectItem>
                            <SelectItem value="india">India (18%)</SelectItem>
                            <SelectItem value="uk">UK (20%)</SelectItem>
                            <SelectItem value="eu">EU Average (21%)</SelectItem>
                            <SelectItem value="custom">Custom Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addGstForm.control}
                    name="gstRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST/VAT Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            max="100" 
                            {...field} 
                            readOnly={addGstForm.getValues().country !== 'custom'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addGstForm.control}
                  name="priceExGst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Excluding GST/VAT</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Percent className="mr-2 h-4 w-4" />
                  Calculate with GST/VAT
                </Button>
              </form>
            </Form>

            {addGstResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">GST/VAT Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Price Ex GST/VAT</p>
                    <p className="text-xl font-bold">${addGstForm.getValues().priceExGst.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">GST/VAT Amount</p>
                    <p className="text-xl font-bold">+ ${addGstResult.gstAmount}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold">${addGstResult.totalPrice}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="remove-gst" className="pt-4">
            <Form {...removeGstForm}>
              <form onSubmit={removeGstForm.handleSubmit(calculateRemoveGst)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={removeGstForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country/Region</FormLabel>
                        <Select 
                          onValueChange={handleRemoveGstCountryChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="australia">Australia (10%)</SelectItem>
                            <SelectItem value="newZealand">New Zealand (15%)</SelectItem>
                            <SelectItem value="canada">Canada (5%)</SelectItem>
                            <SelectItem value="singapore">Singapore (8%)</SelectItem>
                            <SelectItem value="india">India (18%)</SelectItem>
                            <SelectItem value="uk">UK (20%)</SelectItem>
                            <SelectItem value="eu">EU Average (21%)</SelectItem>
                            <SelectItem value="custom">Custom Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={removeGstForm.control}
                    name="gstRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST/VAT Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            max="100" 
                            {...field} 
                            readOnly={removeGstForm.getValues().country !== 'custom'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={removeGstForm.control}
                  name="priceIncGst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Including GST/VAT</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Percent className="mr-2 h-4 w-4" />
                  Calculate without GST/VAT
                </Button>
              </form>
            </Form>

            {removeGstResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">GST/VAT Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold">${removeGstForm.getValues().priceIncGst.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">GST/VAT Amount</p>
                    <p className="text-xl font-bold">- ${removeGstResult.gstAmount}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Price Ex GST/VAT</p>
                    <p className="text-xl font-bold">${removeGstResult.priceExGst}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default GstCalculator;
