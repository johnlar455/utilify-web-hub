
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
  paymentType: z.string().default("goods"),
  country: z.string().default("us")
});

const senderSchema = z.object({
  desiredAmount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentType: z.string().default("goods"),
  country: z.string().default("us")
});

type ReceiverFormValues = z.infer<typeof receiverSchema>;
type SenderFormValues = z.infer<typeof senderSchema>;

// Define PayPal fee rates based on country and payment type
interface FeeStructure {
  fixedFee: number;
  percentFee: number;
  currency: string;
}

const feeRates: Record<string, Record<string, FeeStructure>> = {
  us: {
    goods: { fixedFee: 0.30, percentFee: 0.0299, currency: "USD" },
    personal: { fixedFee: 0, percentFee: 0, currency: "USD" }
  },
  uk: {
    goods: { fixedFee: 0.20, percentFee: 0.0299, currency: "GBP" },
    personal: { fixedFee: 0, percentFee: 0, currency: "GBP" }
  },
  ca: {
    goods: { fixedFee: 0.30, percentFee: 0.0299, currency: "CAD" },
    personal: { fixedFee: 0, percentFee: 0, currency: "CAD" }
  },
  eu: {
    goods: { fixedFee: 0.35, percentFee: 0.0349, currency: "EUR" },
    personal: { fixedFee: 0, percentFee: 0, currency: "EUR" }
  },
  au: {
    goods: { fixedFee: 0.30, percentFee: 0.0299, currency: "AUD" },
    personal: { fixedFee: 0, percentFee: 0, currency: "AUD" }
  },
};

const PaypalFeeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("receiver");
  const [receiverResult, setReceiverResult] = useState<{fee: number; netAmount: number; currency: string} | null>(null);
  const [senderResult, setSenderResult] = useState<{fee: number; grossAmount: number; currency: string} | null>(null);

  const receiverForm = useForm<ReceiverFormValues>({
    resolver: zodResolver(receiverSchema),
    defaultValues: {
      amount: 100,
      paymentType: "goods",
      country: "us"
    }
  });

  const senderForm = useForm<SenderFormValues>({
    resolver: zodResolver(senderSchema),
    defaultValues: {
      desiredAmount: 100,
      paymentType: "goods",
      country: "us"
    }
  });

  const calculateReceiverFee = (data: ReceiverFormValues) => {
    const { amount, paymentType, country } = data;
    const feeStructure = feeRates[country][paymentType];
    
    const fee = amount * feeStructure.percentFee + feeStructure.fixedFee;
    const netAmount = amount - fee;
    
    setReceiverResult({
      fee: Number(fee.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
      currency: feeStructure.currency
    });
  };

  const calculateSenderFee = (data: SenderFormValues) => {
    const { desiredAmount, paymentType, country } = data;
    const feeStructure = feeRates[country][paymentType];
    
    // If personal payment with no fees
    if (paymentType === "personal") {
      setSenderResult({
        fee: 0,
        grossAmount: desiredAmount,
        currency: feeStructure.currency
      });
      return;
    }
    
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
      title="PayPal Fee Calculator"
      description="Calculate PayPal transaction fees for different countries and payment types"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select whether you're receiving money (fee deducted from amount) or sending money (fee added to amount)</li>
          <li>Enter the transaction amount</li>
          <li>Select the payment type (goods/services or personal)</li>
          <li>Select your country</li>
          <li>View the calculated fees and final amount</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            <strong>Note:</strong> For Goods & Services payments, PayPal charges a fee to the receiver. 
            Personal payments are typically free in most countries but have limitations.
            This calculator uses current PayPal fee structures which may change.
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
                      <FormLabel>Amount You're Receiving</FormLabel>
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
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="goods">Goods & Services</SelectItem>
                            <SelectItem value="personal">Friends & Family</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="eu">Europe (Eurozone)</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
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
                    <p className="text-sm text-muted-foreground">PayPal Fee</p>
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
                      <FormLabel>Amount You Want Recipient to Receive</FormLabel>
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
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="goods">Goods & Services</SelectItem>
                            <SelectItem value="personal">Friends & Family</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="eu">Europe (Eurozone)</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Banknote className="mr-2 h-4 w-4" />
                  Calculate Total to Send
                </Button>
              </form>
            </Form>

            {senderResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Fee Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Recipient Gets</p>
                    <p className="text-xl font-bold">{senderResult.currency} {senderForm.getValues().desiredAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">PayPal Fee</p>
                    <p className="text-xl font-bold text-destructive">+ {senderResult.currency} {senderResult.fee}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">You Pay</p>
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

export default PaypalFeeCalculator;
