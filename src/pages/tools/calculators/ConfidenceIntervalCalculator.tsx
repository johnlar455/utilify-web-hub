
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CirclePercent } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  mean: z.coerce.number().min(0, "Mean must be a positive number"),
  standardDeviation: z.coerce.number().min(0, "Standard deviation must be a positive number"),
  sampleSize: z.coerce.number().int().min(1, "Sample size must be at least 1"),
  confidenceLevel: z.string()
});

type FormValues = z.infer<typeof formSchema>;

const ConfidenceIntervalCalculator: React.FC = () => {
  const [result, setResult] = useState<{ lower: number; upper: number } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mean: 0,
      standardDeviation: 0,
      sampleSize: 30,
      confidenceLevel: "0.95"
    }
  });

  const calculateConfidenceInterval = (data: FormValues) => {
    const { mean, standardDeviation, sampleSize, confidenceLevel } = data;
    const level = parseFloat(confidenceLevel);
    
    // Z-scores for common confidence levels
    const zScores: Record<string, number> = {
      "0.90": 1.645,
      "0.95": 1.96,
      "0.99": 2.576
    };
    
    const zScore = zScores[confidenceLevel];
    const marginOfError = zScore * (standardDeviation / Math.sqrt(sampleSize));
    
    setResult({
      lower: Number((mean - marginOfError).toFixed(4)),
      upper: Number((mean + marginOfError).toFixed(4))
    });
  };

  const onSubmit = (data: FormValues) => {
    calculateConfidenceInterval(data);
  };

  return (
    <ToolLayout
      title="Confidence Interval Calculator"
      description="Calculate statistical confidence intervals for population means"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter the sample mean</li>
          <li>Enter the standard deviation</li>
          <li>Enter the sample size</li>
          <li>Select your desired confidence level</li>
          <li>Click "Calculate" to see the confidence interval</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            A confidence interval gives a range of plausible values for a population parameter. 
            It is calculated from sample data and provides a measure of the uncertainty in the estimate.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mean"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Mean</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="standardDeviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Standard Deviation</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sampleSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Size</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidenceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidence Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select confidence level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0.90">90%</SelectItem>
                        <SelectItem value="0.95">95%</SelectItem>
                        <SelectItem value="0.99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              <CirclePercent className="mr-2 h-4 w-4" />
              Calculate Confidence Interval
            </Button>
          </form>
        </Form>

        {result && (
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2">Confidence Interval Result:</h3>
            <p className="text-lg font-semibold">
              {result.lower} to {result.upper}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This means we are {form.getValues().confidenceLevel === "0.90" ? "90%" : form.getValues().confidenceLevel === "0.95" ? "95%" : "99%"} confident that the true population mean 
              falls within this interval.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ConfidenceIntervalCalculator;
