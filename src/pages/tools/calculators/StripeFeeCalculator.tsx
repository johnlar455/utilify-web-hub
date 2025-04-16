
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Banknote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const receiverSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  country: z.string().default("us"),
  cardType: z.string().default("standard")
});

const senderSchema = z.object({
  desiredAmount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  country: z.string().default("us"),
  cardType: z.string().default("standard")
});

type ReceiverFormValues = z.infer<typeof receiverSchema>;
type SenderFormValues = z.infer<typeof senderSchema>;

// Define Stripe fee rates based on country and card type
interface FeeStructure {
  percentFee: number;
  fixedFee: number;
  currency: string;
}

const feeRates: Record<string, Record<string, FeeStructure>> = {
  us: {
    standard: { percentFee: 0.0299, fixedFee: 0.30, currency: "USD" },
    international: { percentFee: 0.0399, fixedFee: 0.30, currency: "USD" },
    amex: { percentFee: 0.0349, fixedFee: 0.30, currency: "USD" }
  },
  uk: {
    standard: { percentFee: 0.0199, fixedFee: 0.20, currency: "GBP" },
    international: { percentFee: 0.0299, fixedFee: 0.20, currency: "GBP" },
    amex: { percentFee: 0.0249, fixedFee: 0.20, currency: "GBP" }
  },
  eu: {
    standard: { percentFee: 0.0199, fixedFee: 0.25, currency: "EUR" },
    international: { percentFee: 0.0299, fixedFee: 0.25, currency: "EUR" },
    amex: { percentFee: 0.0249, fixedFee: 0.25, currency: "EUR" }
  },
  ca: {
    standard: { percentFee: 0.0299, fixedFee: 0.30, currency: "CAD" },
    international: { percentFee: 0.0399, fixedFee: 0.30, currency: "CAD" },
    amex: { percentFee: 0.0349, fixedFee: 0.30, currency: "CAD" }
  },
  au: {
    standard: { percentFee: 0.0199, fixedFee: 0.30, currency: "AUD" },
    international: { percentFee: 0.0299, fixedFee: 0.30, currency: "AUD" },
    amex: { percentFee: 0.0249, fixedFee: 0.30, currency: "AUD" }
  },
};

const StripeFeeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("receiver");
  const [receiverResult, setReceiverResult] = useState<{fee: number; netAmount: number; currency: string} | null>(null);
  const [senderResult, setSenderResult] = useState<{fee: number; grossAmount: number; currency: string} | null>(null);

  const receiverForm = useForm<ReceiverFormValues>({
    resolver: zodResolver(receiverSchema),
    defaultValues: {
      amount: 100,
      country: "us",
      cardType: "standard"
    }
  });

  const senderForm = useForm<SenderFormValues>({
    resolver: zodResolver(senderSchema),
    defaultValues: {
      desiredAmount: 100,
      country: "us",
      cardType: "standard"
    }
  });

  const calculateReceiverFee = (data: ReceiverFormValues) => {
    const { amount, country, cardType } = data;
    const feeStructure = feeRates[country][cardType];
    
    const fee = amount * feeStructure.percentFee + feeStructure.fixedFee;
    const netAmount = amount - fee;
    
    setReceiverResult({
      fee: Number(fee.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
      currency: feeStructure.currency
    });
  };

  const calculateSenderFee = (data: SenderFormValues) => {
    const { desiredAmount, country, cardType } = data;
    const feeStructure = feeRates[country][cardType];
    
    // Formula to calculate gross amount needed to receive desired amount after fees
    // desiredAmount = grossAmount - (grossAmount * percentFee + fixedFee)
    // desiredAmount = grossAmount * (1 - percentFee) - fixedFee
    // desiredAmount + fixedFee = grossAmount * (1 - percentFee)
    // (desiredAmount + fixedFee) / (1 - percentFee) = grossAmount
    
    const grossAmount = (desiredAmount + feeStructure.fixedFee) / (1 - feeStructure.percentFee);
    const fee = grossAmount - desiredAmount;
    
    setSenderResult({
      fee: Number(fee.toFixed(2)),
      grossAmount: Number(grossAmount.toFixed(2)),
      currency: feeStructure.currency
    });
  };

  return (
    <ToolLayout
      title="Stripe Fee Calculator"
      description="Calculate Stripe payment processing fees for different countries and card types"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select whether you're receiving money (fee deducted from amount) or sending money (fee added to amount)</li>
          <li>Enter the transaction amount</li>
          <li>Select your country and card type</li>
          <li>View the calculated fees and final amount</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            <strong>Note:</strong> Stripe charges different fees based on your country, card type, and other factors.
            This calculator uses standard published Stripe fees which may vary based on your specific agreement with Stripe.
            For the most accurate information, please refer to your Stripe dashboard.
          </p>
        </div>

        <Tabs defaultValue="receiver" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="receiver">Receiving Money</TabsTrigger>
            <TabsTrigger value="sender">Sending Money</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receiver" className="pt-4">
            <Form {...receiverForm}>
              <form onSubmit={receiverForm.handleSubmit(calculateReceiverFee)} className="space-y-4">
                <FormField
                  control={receiverForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount You're Charging</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={receiverForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="eu">Europe (Eurozone)</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={receiverForm.control}
                    name="cardType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard Credit/Debit</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Banknote className="mr-2 h-4 w-4" />
                  Calculate Fees
                </Button>
              </form>
            </Form>

            {receiverResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Fee Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Gross Amount</p>
                    <p className="text-xl font-bold">{receiverResult.currency} {receiverForm.getValues().amount.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Stripe Fee</p>
                    <p className="text-xl font-bold text-destructive">- {receiverResult.currency} {receiverResult.fee}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Net Amount</p>
                    <p className="text-xl font-bold text-green-600">{receiverResult.currency} {receiverResult.netAmount}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sender" className="pt-4">
            <Form {...senderForm}>
              <form onSubmit={senderForm.handleSubmit(calculateSenderFee)} className="space-y-4">
                <FormField
                  control={senderForm.control}
                  name="desiredAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount You Want to Receive</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={senderForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="eu">Europe (Eurozone)</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={senderForm.control}
                    name="cardType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard Credit/Debit</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Banknote className="mr-2 h-4 w-4" />
                  Calculate Total to Charge
                </Button>
              </form>
            </Form>

            {senderResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Fee Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">You Want to Receive</p>
                    <p className="text-xl font-bold">{senderResult.currency} {senderForm.getValues().desiredAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Stripe Fee</p>
                    <p className="text-xl font-bold text-destructive">+ {senderResult.currency} {senderResult.fee}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Amount to Charge</p>
                    <p className="text-xl font-bold">{senderResult.currency} {senderResult.grossAmount}</p>
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

export default StripeFeeCalculator;
