import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Currency data with static exchange rates for demo purposes
// In a real app, these would come from an API
type Currency = {
  id: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD (1 USD = X of this currency)
};

const currencies: Currency[] = [
  { id: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { id: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { id: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
  { id: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 150.44 },
  { id: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.37 },
  { id: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  { id: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.91 },
  { id: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { id: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.42 },
  { id: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.06 },
  { id: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 92.79 },
  { id: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1369.71 },
  { id: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rate: 16.75 },
  { id: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  { id: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.64 },
];

const CurrencyConverter: React.FC = () => {
  const [sourceValue, setSourceValue] = useState<string>('');
  const [sourceUnit, setSourceUnit] = useState<string>('USD');
  const [targetUnit, setTargetUnit] = useState<string>('EUR');
  const [targetValue, setTargetValue] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'source' | 'target'>('source');

  // Function to find a currency by its ID
  const findCurrency = (id: string): Currency => {
    return currencies.find(currency => currency.id === id) || currencies[0];
  };

  // Convert from source to target
  const convertSourceToTarget = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setTargetValue('');
      return;
    }
    
    const sourceCurrency = findCurrency(from);
    const targetCurrency = findCurrency(to);
    
    // Convert source to USD, then USD to target
    const usdValue = numValue / sourceCurrency.rate;
    const result = usdValue * targetCurrency.rate;
    
    // Format the result with appropriate precision for currency
    const formattedResult = result.toFixed(2);
    setTargetValue(formattedResult);
  };

  // Convert from target to source
  const convertTargetToSource = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setSourceValue('');
      return;
    }
    
    const targetCurrency = findCurrency(from);
    const sourceCurrency = findCurrency(to);
    
    // Convert target to USD, then USD to source
    const usdValue = numValue / targetCurrency.rate;
    const result = usdValue * sourceCurrency.rate;
    
    // Format the result with appropriate precision for currency
    const formattedResult = result.toFixed(2);
    setSourceValue(formattedResult);
  };

  // Handle change in source value
  const handleSourceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(e.target.value);
    setLastChanged('source');
  };

  // Handle change in target value
  const handleTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(e.target.value);
    setLastChanged('target');
  };

  // Handle change in source unit
  const handleSourceUnitChange = (value: string) => {
    setSourceUnit(value);
    setLastChanged('target');
  };

  // Handle change in target unit
  const handleTargetUnitChange = (value: string) => {
    setTargetUnit(value);
    setLastChanged('source');
  };

  // Swap source and target units and values
  const handleSwap = () => {
    setSourceUnit(targetUnit);
    setTargetUnit(sourceUnit);
    setSourceValue(targetValue);
    setTargetValue(sourceValue);
  };

  // Perform conversion whenever a value or unit changes
  useEffect(() => {
    if (lastChanged === 'source') {
      convertSourceToTarget(sourceValue, sourceUnit, targetUnit);
    } else {
      convertTargetToSource(targetValue, targetUnit, sourceUnit);
    }
  }, [sourceValue, targetValue, sourceUnit, targetUnit, lastChanged]);

  return (
    <ToolLayout
      title="Currency Converter"
      description="Convert between different currencies"
      category="Unit Converter Tools"
      categoryColor="converterTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter a value in either input field</li>
          <li>Select your source and target currencies</li>
          <li>See the converted result automatically</li>
          <li>Use the swap button to reverse the conversion</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Static exchange rates</AlertTitle>
          <AlertDescription>
            This demo uses static exchange rates for illustration. In a production environment, 
            real-time rates from an API would be used.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Source Currency Section */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="sourceValue">From:</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">
                      {findCurrency(sourceUnit).symbol}
                    </span>
                  </div>
                  <Input
                    id="sourceValue"
                    type="text"
                    inputMode="decimal"
                    value={sourceValue}
                    onChange={handleSourceValueChange}
                    placeholder="Enter value"
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceUnit">Source Currency</Label>
                <Select value={sourceUnit} onValueChange={handleSourceUnitChange}>
                  <SelectTrigger id="sourceUnit">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.id} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button - Centered between inputs on mobile */}
            <div className="flex md:hidden justify-center my-2">
              <Button variant="outline" size="icon" onClick={handleSwap}>
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Target Currency Section */}
            <div className="space-y-3 relative">
              {/* Swap Button - Positioned to the left of target input on larger screens */}
              <div className="hidden md:block absolute -left-10 top-8">
                <Button variant="outline" size="icon" onClick={handleSwap}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetValue">To:</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">
                      {findCurrency(targetUnit).symbol}
                    </span>
                  </div>
                  <Input
                    id="targetValue"
                    type="text"
                    inputMode="decimal"
                    value={targetValue}
                    onChange={handleTargetValueChange}
                    placeholder="Converted value"
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUnit">Target Currency</Label>
                <Select value={targetUnit} onValueChange={handleTargetUnitChange}>
                  <SelectTrigger id="targetUnit">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.id} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Common Conversions */}
          <div className="space-y-2 mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Common Conversions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('USD');
                  setTargetUnit('EUR');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 USD to EUR
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('EUR');
                  setTargetUnit('USD');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 EUR to USD
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('USD');
                  setTargetUnit('GBP');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 USD to GBP
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('USD');
                  setTargetUnit('JPY');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 USD to JPY
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('GBP');
                  setTargetUnit('EUR');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 GBP to EUR
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('EUR');
                  setTargetUnit('JPY');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 EUR to JPY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CurrencyConverter;
