
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const PercentageCalculator: React.FC = () => {
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [percent, setPercent] = useState<string>('');
  const [result1, setResult1] = useState<string>('');
  const [result2, setResult2] = useState<string>('');
  const [result3, setResult3] = useState<string>('');

  const calculateResults = (val1: string, val2: string, pct: string) => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    const percentage = parseFloat(pct);

    // Calculate X% of Y
    if (!isNaN(percentage) && !isNaN(num1)) {
      setResult1(`${percentage}% of ${num1} is ${(percentage / 100 * num1).toFixed(2)}`);
    }

    // Calculate X is what % of Y
    if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
      setResult2(`${num1} is ${((num1 / num2) * 100).toFixed(2)}% of ${num2}`);
    }

    // Calculate percentage increase/decrease
    if (!isNaN(num1) && !isNaN(num2) && num1 !== 0) {
      const change = ((num2 - num1) / num1) * 100;
      const type = change >= 0 ? 'increase' : 'decrease';
      setResult3(`From ${num1} to ${num2} is a ${Math.abs(change).toFixed(2)}% ${type}`);
    }
  };

  const handleInputChange = (value: string, setter: (value: string) => void) => {
    setter(value);
    calculateResults(value1, value2, percent);
  };

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages, ratios, and percentage changes"
      category="Calculators"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter numbers in the input fields</li>
          <li>Results will update automatically</li>
          <li>Use different calculators for different percentage operations</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="percent">Percentage</Label>
                  <Input
                    id="percent"
                    type="number"
                    placeholder="Enter percentage"
                    value={percent}
                    onChange={(e) => handleInputChange(e.target.value, setPercent)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="value1">Value</Label>
                  <Input
                    id="value1"
                    type="number"
                    placeholder="Enter value"
                    value={value1}
                    onChange={(e) => handleInputChange(e.target.value, setValue1)}
                  />
                </div>
              </div>
              {result1 && <div className="text-sm font-medium">{result1}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="value1compare">Value 1</Label>
                  <Input
                    id="value1compare"
                    type="number"
                    placeholder="Enter first value"
                    value={value1}
                    onChange={(e) => handleInputChange(e.target.value, setValue1)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="value2">Value 2</Label>
                  <Input
                    id="value2"
                    type="number"
                    placeholder="Enter second value"
                    value={value2}
                    onChange={(e) => handleInputChange(e.target.value, setValue2)}
                  />
                </div>
              </div>
              {result2 && <div className="text-sm font-medium">{result2}</div>}
              {result3 && <div className="text-sm font-medium">{result3}</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PercentageCalculator;
