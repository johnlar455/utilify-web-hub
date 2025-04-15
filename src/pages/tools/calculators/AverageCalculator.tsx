
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CalculationResult {
  mean: number;
  median: number;
  mode: string;
  sum: number;
  count: number;
  min: number;
  max: number;
  range: number;
}

const AverageCalculator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [separator, setSeparator] = useState<string>(',');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  // Calculate statistics whenever input or separator changes
  useEffect(() => {
    if (!inputText.trim()) {
      setResult(null);
      setError('');
      return;
    }

    try {
      // Split the input by the selected separator and parse as numbers
      const values = inputText
        .split(separator === 'newline' ? /\n/ : separator)
        .map(value => value.trim())
        .filter(value => value !== '')
        .map(value => {
          const parsed = parseFloat(value);
          if (isNaN(parsed)) {
            throw new Error(`"${value}" is not a valid number`);
          }
          return parsed;
        });

      if (values.length === 0) {
        setResult(null);
        setError('No valid numbers found');
        return;
      }

      // Sort values for median and other calculations
      const sortedValues = [...values].sort((a, b) => a - b);
      
      // Calculate mean (average)
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      
      // Calculate median
      const middle = Math.floor(values.length / 2);
      const median = values.length % 2 === 0 
        ? (sortedValues[middle - 1] + sortedValues[middle]) / 2 
        : sortedValues[middle];
      
      // Calculate mode (most frequent value)
      const frequencies: Record<number, number> = {};
      values.forEach(value => {
        frequencies[value] = (frequencies[value] || 0) + 1;
      });
      
      let maxFrequency = 0;
      let modes: number[] = [];
      
      for (const [value, frequency] of Object.entries(frequencies)) {
        const numValue = parseFloat(value);
        if (frequency > maxFrequency) {
          maxFrequency = frequency;
          modes = [numValue];
        } else if (frequency === maxFrequency) {
          modes.push(numValue);
        }
      }
      
      const modeText = modes.length === Object.keys(frequencies).length 
        ? 'No mode' 
        : modes.join(', ');
      
      // Calculate range
      const min = sortedValues[0];
      const max = sortedValues[sortedValues.length - 1];
      const range = max - min;
      
      setResult({
        mean,
        median,
        mode: modeText,
        sum,
        count: values.length,
        min,
        max,
        range
      });
      
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while calculating the average');
      }
      setResult(null);
    }
  }, [inputText, separator]);

  return (
    <ToolLayout
      title="Average Calculator"
      description="Calculate mean, median, mode and other statistics from a set of numbers"
      category="Calculators"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your numbers, separated by commas, spaces, or new lines</li>
          <li>Choose your preferred separator</li>
          <li>View the calculated statistics in real-time</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numbers">Enter Numbers</Label>
              <Textarea
                id="numbers"
                placeholder="Enter numbers separated by your chosen delimiter..."
                className="min-h-[200px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Separator</Label>
              <RadioGroup 
                value={separator}
                onValueChange={setSeparator}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="," id="comma" />
                  <Label htmlFor="comma" className="cursor-pointer">Comma (,)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value=" " id="space" />
                  <Label htmlFor="space" className="cursor-pointer">Space</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value=";" id="semicolon" />
                  <Label htmlFor="semicolon" className="cursor-pointer">Semicolon (;)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newline" id="newline" />
                  <Label htmlFor="newline" className="cursor-pointer">New Line</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div>
            {error ? (
              <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            ) : result ? (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 border-r pr-4">
                      <p className="text-sm text-muted-foreground">Mean (Average)</p>
                      <p className="text-2xl font-bold">{result.mean.toFixed(4)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Median</p>
                      <p className="text-2xl font-bold">{result.median.toFixed(4)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 border-r pr-4">
                      <p className="text-sm text-muted-foreground">Mode</p>
                      <p className="text-xl font-bold">{result.mode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Range</p>
                      <p className="text-xl font-bold">{result.range.toFixed(4)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 border-t pt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sum</p>
                      <p className="font-medium">{result.sum.toFixed(4)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Count</p>
                      <p className="font-medium">{result.count}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Min / Max</p>
                      <p className="font-medium">{result.min.toFixed(2)} / {result.max.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full border rounded-md p-6 bg-muted/30">
                <p className="text-muted-foreground text-center">
                  Enter numbers to see statistics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default AverageCalculator;
