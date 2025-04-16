
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const loanSchema = z.object({
  loanAmount: z.coerce.number().min(1, "Loan amount must be greater than 0"),
  interestRate: z.coerce.number().min(0, "Interest rate must be positive").max(100, "Interest rate cannot exceed 100%"),
  loanTerm: z.coerce.number().min(1, "Loan term must be at least 1"),
  termUnit: z.enum(["years", "months"]),
  paymentFrequency: z.enum(["monthly", "biweekly", "weekly"])
});

type LoanFormValues = z.infer<typeof loanSchema>;

interface AmortizationEntry {
  period: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

const LoanCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("loan-calculator");
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortizationSchedule: AmortizationEntry[];
  } | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanAmount: 10000,
      interestRate: 5,
      loanTerm: 5,
      termUnit: "years",
      paymentFrequency: "monthly"
    }
  });

  const calculateLoan = (data: LoanFormValues) => {
    const { loanAmount, interestRate, loanTerm, termUnit, paymentFrequency } = data;
    
    // Convert everything to monthly terms
    const periodsPerYear = paymentFrequency === "monthly" ? 12 : paymentFrequency === "biweekly" ? 26 : 52;
    const periodsPerMonth = periodsPerYear / 12;
    
    // Calculate total number of payment periods
    const totalPeriods = termUnit === "years" 
      ? loanTerm * periodsPerYear 
      : loanTerm * (periodsPerYear / 12);
    
    // Calculate periodic interest rate
    const periodicInterestRate = (interestRate / 100) / periodsPerYear;
    
    // Calculate payment amount using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // Where P = payment, L = loan amount, c = periodic interest rate, n = number of payments
    let paymentAmount;
    if (interestRate === 0) {
      paymentAmount = loanAmount / totalPeriods;
    } else {
      paymentAmount = loanAmount * (periodicInterestRate * Math.pow(1 + periodicInterestRate, totalPeriods)) / (Math.pow(1 + periodicInterestRate, totalPeriods) - 1);
    }
    
    // Calculate total payment and total interest
    const totalPayment = paymentAmount * totalPeriods;
    const totalInterest = totalPayment - loanAmount;
    
    // Generate amortization schedule
    const amortizationSchedule: AmortizationEntry[] = [];
    let remainingBalance = loanAmount;
    
    for (let period = 1; period <= totalPeriods; period++) {
      const interestForPeriod = remainingBalance * periodicInterestRate;
      const principalForPeriod = paymentAmount - interestForPeriod;
      remainingBalance -= principalForPeriod;
      
      // Fix potential negative balance from rounding errors in the last payment
      if (period === totalPeriods) {
        remainingBalance = 0;
      }
      
      amortizationSchedule.push({
        period,
        paymentAmount,
        principalPaid: principalForPeriod,
        interestPaid: interestForPeriod,
        remainingBalance
      });
    }
    
    setResults({
      monthlyPayment: Number(paymentAmount.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      amortizationSchedule
    });
  };

  // Get schedule entries to display based on showFullSchedule state
  const getScheduleToDisplay = () => {
    if (!results) return [];
    
    const { amortizationSchedule } = results;
    
    if (showFullSchedule || amortizationSchedule.length <= 24) {
      return amortizationSchedule;
    }
    
    // Show first year, last year, and some mid points
    const firstYear = amortizationSchedule.slice(0, 12);
    const lastYear = amortizationSchedule.slice(-12);
    
    const midPoint = Math.floor(amortizationSchedule.length / 2);
    const midEntries = amortizationSchedule.slice(midPoint - 1, midPoint + 1);
    
    return [
      ...firstYear, 
      { period: -1, paymentAmount: 0, principalPaid: 0, interestPaid: 0, remainingBalance: 0 }, // Separator
      ...midEntries, 
      { period: -2, paymentAmount: 0, principalPaid: 0, interestPaid: 0, remainingBalance: 0 }, // Separator
      ...lastYear
    ];
  };
  
  return (
    <ToolLayout
      title="Loan Calculator"
      description="Calculate loan payments, interest, and generate amortization schedules"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your loan amount, interest rate, and term</li>
          <li>Select term unit (years or months) and payment frequency</li>
          <li>View calculated monthly payment, total payment, and total interest</li>
          <li>Explore the amortization schedule to see how your loan is paid off over time</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This loan calculator helps you estimate monthly payments, total interest, 
            and provides a detailed amortization schedule for various loan types.
          </p>
        </div>

        <Tabs defaultValue="loan-calculator" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="loan-calculator">Loan Calculator</TabsTrigger>
            <TabsTrigger value="amortization-schedule" disabled={!results}>Amortization Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="loan-calculator" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(calculateLoan)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loanTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select term unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Frequency</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Banknote className="mr-2 h-4 w-4" />
                  Calculate Loan
                </Button>
              </form>
            </Form>

            {results && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Loan Calculation Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">
                      {form.getValues().paymentFrequency === "monthly" ? "Monthly" : 
                       form.getValues().paymentFrequency === "biweekly" ? "Bi-weekly" : "Weekly"} Payment
                    </p>
                    <p className="text-xl font-bold">${results.monthlyPayment}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Total Interest</p>
                    <p className="text-xl font-bold">${results.totalInterest}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Total Payment</p>
                    <p className="text-xl font-bold">${results.totalPayment}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="amortization-schedule" className="pt-4">
            {results && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Amortization Schedule</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                  >
                    {showFullSchedule ? "Show Summary" : "Show Full Schedule"}
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Period</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Remaining Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getScheduleToDisplay().map((entry, index) => (
                        entry.period < 0 ? (
                          <TableRow key={index}>
                            <TableCell colSpan={5} className="text-center">...</TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={index}>
                            <TableCell>{entry.period}</TableCell>
                            <TableCell>${entry.paymentAmount.toFixed(2)}</TableCell>
                            <TableCell>${entry.principalPaid.toFixed(2)}</TableCell>
                            <TableCell>${entry.interestPaid.toFixed(2)}</TableCell>
                            <TableCell>${entry.remainingBalance.toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default LoanCalculator;
