
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const marginSchema = z.object({
  cost: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  margin: z.coerce.number().min(0, "Margin must be a positive number").max(100, "Margin cannot exceed 100%")
});

const markupSchema = z.object({
  cost: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  markup: z.coerce.number().min(0, "Markup must be a positive number")
});

const revenueSchema = z.object({
  cost: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  revenue: z.coerce.number().min(0.01, "Revenue must be greater than 0")
});

type MarginFormValues = z.infer<typeof marginSchema>;
type MarkupFormValues = z.infer<typeof markupSchema>;
type RevenueFormValues = z.infer<typeof revenueSchema>;

const MarginCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("margin-calculator");
  const [marginResults, setMarginResults] = useState<{sellingPrice: number; profit: number; markup: number} | null>(null);
  const [markupResults, setMarkupResults] = useState<{sellingPrice: number; profit: number; margin: number} | null>(null);
  const [revenueResults, setRevenueResults] = useState<{margin: number; profit: number; markup: number} | null>(null);

  const marginForm = useForm<MarginFormValues>({
    resolver: zodResolver(marginSchema),
    defaultValues: {
      cost: 0,
      margin: 0
    }
  });

  const markupForm = useForm<MarkupFormValues>({
    resolver: zodResolver(markupSchema),
    defaultValues: {
      cost: 0,
      markup: 0
    }
  });

  const revenueForm = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      cost: 0,
      revenue: 0
    }
  });

  const calculateFromMargin = (data: MarginFormValues) => {
    const { cost, margin } = data;
    
    // Calculate selling price using margin
    // Formula: Cost / (1 - (Margin / 100))
    const sellingPrice = cost / (1 - (margin / 100));
    const profit = sellingPrice - cost;
    const markup = (profit / cost) * 100;
    
    setMarginResults({
      sellingPrice: Number(sellingPrice.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      markup: Number(markup.toFixed(2))
    });
  };

  const calculateFromMarkup = (data: MarkupFormValues) => {
    const { cost, markup } = data;
    
    // Calculate selling price using markup
    // Formula: Cost * (1 + (Markup / 100))
    const sellingPrice = cost * (1 + (markup / 100));
    const profit = sellingPrice - cost;
    const margin = (profit / sellingPrice) * 100;
    
    setMarkupResults({
      sellingPrice: Number(sellingPrice.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      margin: Number(margin.toFixed(2))
    });
  };

  const calculateFromRevenue = (data: RevenueFormValues) => {
    const { cost, revenue } = data;
    
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = (profit / cost) * 100;
    
    setRevenueResults({
      margin: Number(margin.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      markup: Number(markup.toFixed(2))
    });
  };

  return (
    <ToolLayout
      title="Margin Calculator"
      description="Calculate profit margins, markups, and selling prices"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Choose the calculation method (margin, markup, or revenue)</li>
          <li>Enter the cost amount and either the margin, markup, or selling price</li>
          <li>View the calculated results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            <strong>Margin</strong> is the percentage of selling price that is profit (Profit ÷ Revenue).<br/>
            <strong>Markup</strong> is the percentage of cost that is added to create the selling price (Profit ÷ Cost).
          </p>
        </div>

        <Tabs defaultValue="margin-calculator" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="margin-calculator">Margin to Price</TabsTrigger>
            <TabsTrigger value="markup-calculator">Markup to Price</TabsTrigger>
            <TabsTrigger value="revenue-calculator">Revenue to Margin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="margin-calculator" className="pt-4">
            <Form {...marginForm}>
              <form onSubmit={marginForm.handleSubmit(calculateFromMargin)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={marginForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={marginForm.control}
                    name="margin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Margin (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Percent className="mr-2 h-4 w-4" />
                  Calculate Selling Price
                </Button>
              </form>
            </Form>

            {marginResults && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Selling Price</p>
                    <p className="text-xl font-bold">${marginResults.sellingPrice}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="text-xl font-bold">${marginResults.profit}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Markup</p>
                    <p className="text-xl font-bold">{marginResults.markup}%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="markup-calculator" className="pt-4">
            <Form {...markupForm}>
              <form onSubmit={markupForm.handleSubmit(calculateFromMarkup)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={markupForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={markupForm.control}
                    name="markup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Markup (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Percent className="mr-2 h-4 w-4" />
                  Calculate Selling Price
                </Button>
              </form>
            </Form>

            {markupResults && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Selling Price</p>
                    <p className="text-xl font-bold">${markupResults.sellingPrice}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="text-xl font-bold">${markupResults.profit}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Margin</p>
                    <p className="text-xl font-bold">{markupResults.margin}%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="revenue-calculator" className="pt-4">
            <Form {...revenueForm}>
              <form onSubmit={revenueForm.handleSubmit(calculateFromRevenue)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={revenueForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={revenueForm.control}
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue/Selling Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Percent className="mr-2 h-4 w-4" />
                  Calculate Margin & Markup
                </Button>
              </form>
            </Form>

            {revenueResults && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="text-xl font-bold">${revenueResults.profit}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Margin</p>
                    <p className="text-xl font-bold">{revenueResults.margin}%</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Markup</p>
                    <p className="text-xl font-bold">{revenueResults.markup}%</p>
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

export default MarginCalculator;
