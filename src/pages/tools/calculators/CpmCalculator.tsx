
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartBar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const cpmSchema = z.object({
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  impressions: z.coerce.number().int().min(1, "Impressions must be at least 1")
});

const budgetSchema = z.object({
  cpm: z.coerce.number().min(0, "CPM must be a positive number"),
  impressions: z.coerce.number().int().min(1, "Impressions must be at least 1")
});

const impressionsSchema = z.object({
  cpm: z.coerce.number().min(0, "CPM must be a positive number"),
  budget: z.coerce.number().min(0, "Budget must be a positive number")
});

type CpmFormValues = z.infer<typeof cpmSchema>;
type BudgetFormValues = z.infer<typeof budgetSchema>;
type ImpressionsFormValues = z.infer<typeof impressionsSchema>;

const CpmCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("calculate-cpm");
  const [cpmResult, setCpmResult] = useState<number | null>(null);
  const [budgetResult, setBudgetResult] = useState<number | null>(null);
  const [impressionsResult, setImpressionsResult] = useState<number | null>(null);

  const cpmForm = useForm<CpmFormValues>({
    resolver: zodResolver(cpmSchema),
    defaultValues: {
      cost: 0,
      impressions: 1000
    }
  });

  const budgetForm = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      cpm: 0,
      impressions: 1000
    }
  });

  const impressionsForm = useForm<ImpressionsFormValues>({
    resolver: zodResolver(impressionsSchema),
    defaultValues: {
      cpm: 0,
      budget: 0
    }
  });

  const calculateCPM = (data: CpmFormValues) => {
    const { cost, impressions } = data;
    const cpm = (cost / impressions) * 1000;
    setCpmResult(Number(cpm.toFixed(2)));
  };

  const calculateBudget = (data: BudgetFormValues) => {
    const { cpm, impressions } = data;
    const budget = (cpm * impressions) / 1000;
    setBudgetResult(Number(budget.toFixed(2)));
  };

  const calculateImpressions = (data: ImpressionsFormValues) => {
    const { cpm, budget } = data;
    // Avoid division by zero
    if (cpm === 0) {
      setImpressionsResult(0);
      return;
    }
    
    const impressions = (budget / cpm) * 1000;
    setImpressionsResult(Math.round(impressions));
  };

  return (
    <ToolLayout
      title="CPM Calculator"
      description="Calculate Cost Per Thousand Impressions for advertising campaigns"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select what you want to calculate: CPM, Budget, or Impressions</li>
          <li>Enter the known values</li>
          <li>Click calculate to see the result</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            <strong>CPM</strong> (Cost Per Mille/Thousand) is a common metric in advertising that represents the cost 
            to reach 1,000 impressions or views of an advertisement. This calculator helps you determine CPM, 
            budget needed, or estimated impressions for your campaigns.
          </p>
        </div>

        <Tabs defaultValue="calculate-cpm" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="calculate-cpm">Calculate CPM</TabsTrigger>
            <TabsTrigger value="calculate-budget">Calculate Budget</TabsTrigger>
            <TabsTrigger value="calculate-impressions">Calculate Impressions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculate-cpm" className="pt-4">
            <Form {...cpmForm}>
              <form onSubmit={cpmForm.handleSubmit(calculateCPM)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={cpmForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Ad Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cpmForm.control}
                    name="impressions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Impressions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <ChartBar className="mr-2 h-4 w-4" />
                  Calculate CPM
                </Button>
              </form>
            </Form>

            {cpmResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">CPM Result:</h3>
                <p className="text-2xl font-bold">${cpmResult}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your Cost Per Thousand Impressions (CPM) is ${cpmResult}.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calculate-budget" className="pt-4">
            <Form {...budgetForm}>
              <form onSubmit={budgetForm.handleSubmit(calculateBudget)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={budgetForm.control}
                    name="cpm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPM Rate ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={budgetForm.control}
                    name="impressions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Impressions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <ChartBar className="mr-2 h-4 w-4" />
                  Calculate Budget
                </Button>
              </form>
            </Form>

            {budgetResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Budget Result:</h3>
                <p className="text-2xl font-bold">${budgetResult}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your required budget for {budgetForm.getValues().impressions.toLocaleString()} impressions 
                  at a CPM of ${budgetForm.getValues().cpm} is ${budgetResult}.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calculate-impressions" className="pt-4">
            <Form {...impressionsForm}>
              <form onSubmit={impressionsForm.handleSubmit(calculateImpressions)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={impressionsForm.control}
                    name="cpm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPM Rate ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={impressionsForm.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <ChartBar className="mr-2 h-4 w-4" />
                  Calculate Impressions
                </Button>
              </form>
            </Form>

            {impressionsResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Impressions Result:</h3>
                <p className="text-2xl font-bold">{impressionsResult.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  With a budget of ${impressionsForm.getValues().budget} at a CPM of ${impressionsForm.getValues().cpm}, 
                  you can expect approximately {impressionsResult.toLocaleString()} impressions.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default CpmCalculator;
