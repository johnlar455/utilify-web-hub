
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Unit = {
  id: string;
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

const units: Unit[] = [
  { 
    id: 'c', 
    name: 'Celsius (°C)', 
    toBase: (value) => value, 
    fromBase: (value) => value 
  },
  { 
    id: 'f', 
    name: 'Fahrenheit (°F)', 
    toBase: (value) => (value - 32) * 5/9, 
    fromBase: (value) => value * 9/5 + 32 
  },
  { 
    id: 'k', 
    name: 'Kelvin (K)', 
    toBase: (value) => value - 273.15, 
    fromBase: (value) => value + 273.15 
  },
  { 
    id: 'r', 
    name: 'Rankine (°R)', 
    toBase: (value) => (value - 491.67) * 5/9, 
    fromBase: (value) => value * 9/5 + 491.67 
  }
];

const TemperatureConverter: React.FC = () => {
  const [sourceValue, setSourceValue] = useState<string>('');
  const [sourceUnit, setSourceUnit] = useState<string>('c');
  const [targetUnit, setTargetUnit] = useState<string>('f');
  const [targetValue, setTargetValue] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'source' | 'target'>('source');

  // Function to find a unit by its ID
  const findUnit = (id: string): Unit => {
    return units.find(unit => unit.id === id) || units[0];
  };

  // Convert from source to target
  const convertSourceToTarget = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setTargetValue('');
      return;
    }
    
    const sourceUnit = findUnit(from);
    const targetUnit = findUnit(to);
    
    // Convert source value to base unit (Celsius), then to target unit
    const baseValue = sourceUnit.toBase(numValue);
    const result = targetUnit.fromBase(baseValue);
    
    // Format the result with appropriate precision
    const formattedResult = parseFloat(result.toFixed(2)).toString();
    setTargetValue(formattedResult);
  };

  // Convert from target to source
  const convertTargetToSource = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setSourceValue('');
      return;
    }
    
    const targetUnit = findUnit(from);
    const sourceUnit = findUnit(to);
    
    // Convert target value to base unit (Celsius), then to source unit
    const baseValue = targetUnit.toBase(numValue);
    const result = sourceUnit.fromBase(baseValue);
    
    // Format the result with appropriate precision
    const formattedResult = parseFloat(result.toFixed(2)).toString();
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
      title="Temperature Converter"
      description="Convert between different temperature units"
      category="Unit Converter Tools"
      categoryColor="converterTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter a value in either input field</li>
          <li>Select your source and target units</li>
          <li>See the converted result automatically</li>
          <li>Use the swap button to reverse the conversion</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Source Unit Section */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="sourceValue">From:</Label>
                <Input
                  id="sourceValue"
                  type="text"
                  inputMode="decimal"
                  value={sourceValue}
                  onChange={handleSourceValueChange}
                  placeholder="Enter value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceUnit">Source Unit</Label>
                <Select value={sourceUnit} onValueChange={handleSourceUnitChange}>
                  <SelectTrigger id="sourceUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
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

            {/* Target Unit Section */}
            <div className="space-y-3 relative">
              {/* Swap Button - Positioned to the left of target input on larger screens */}
              <div className="hidden md:block absolute -left-10 top-8">
                <Button variant="outline" size="icon" onClick={handleSwap}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetValue">To:</Label>
                <Input
                  id="targetValue"
                  type="text"
                  inputMode="decimal"
                  value={targetValue}
                  onChange={handleTargetValueChange}
                  placeholder="Converted value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUnit">Target Unit</Label>
                <Select value={targetUnit} onValueChange={handleTargetUnitChange}>
                  <SelectTrigger id="targetUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
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
                  setSourceUnit('c');
                  setTargetUnit('f');
                  setSourceValue('0');
                  setLastChanged('source');
                }}
              >
                0°C to °F (Freezing Point)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('c');
                  setTargetUnit('f');
                  setSourceValue('100');
                  setLastChanged('source');
                }}
              >
                100°C to °F (Boiling Point)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('f');
                  setTargetUnit('c');
                  setSourceValue('32');
                  setLastChanged('source');
                }}
              >
                32°F to °C (Freezing Point)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('f');
                  setTargetUnit('c');
                  setSourceValue('212');
                  setLastChanged('source');
                }}
              >
                212°F to °C (Boiling Point)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('c');
                  setTargetUnit('k');
                  setSourceValue('0');
                  setLastChanged('source');
                }}
              >
                0°C to K
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('f');
                  setTargetUnit('k');
                  setSourceValue('32');
                  setLastChanged('source');
                }}
              >
                32°F to K
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TemperatureConverter;
