
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
    id: 'mm', 
    name: 'Millimeters (mm)', 
    toBase: (value) => value / 1000, 
    fromBase: (value) => value * 1000 
  },
  { 
    id: 'cm', 
    name: 'Centimeters (cm)', 
    toBase: (value) => value / 100, 
    fromBase: (value) => value * 100 
  },
  { 
    id: 'm', 
    name: 'Meters (m)', 
    toBase: (value) => value, 
    fromBase: (value) => value 
  },
  { 
    id: 'km', 
    name: 'Kilometers (km)', 
    toBase: (value) => value * 1000, 
    fromBase: (value) => value / 1000 
  },
  { 
    id: 'in', 
    name: 'Inches (in)', 
    toBase: (value) => value * 0.0254, 
    fromBase: (value) => value / 0.0254 
  },
  { 
    id: 'ft', 
    name: 'Feet (ft)', 
    toBase: (value) => value * 0.3048, 
    fromBase: (value) => value / 0.3048 
  },
  { 
    id: 'yd', 
    name: 'Yards (yd)', 
    toBase: (value) => value * 0.9144, 
    fromBase: (value) => value / 0.9144 
  },
  { 
    id: 'mi', 
    name: 'Miles (mi)', 
    toBase: (value) => value * 1609.344, 
    fromBase: (value) => value / 1609.344 
  },
  { 
    id: 'nm', 
    name: 'Nautical Miles (nm)', 
    toBase: (value) => value * 1852, 
    fromBase: (value) => value / 1852 
  }
];

const LengthConverter: React.FC = () => {
  const [sourceValue, setSourceValue] = useState<string>('');
  const [sourceUnit, setSourceUnit] = useState<string>('m');
  const [targetUnit, setTargetUnit] = useState<string>('ft');
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
    
    // Convert source value to base unit (meters), then to target unit
    const baseValue = sourceUnit.toBase(numValue);
    const result = targetUnit.fromBase(baseValue);
    
    // Format the result based on its magnitude
    let formattedResult: string;
    if (Math.abs(result) >= 1000000) {
      formattedResult = result.toExponential(6);
    } else if (Math.abs(result) < 0.000001 && result !== 0) {
      formattedResult = result.toExponential(6);
    } else {
      formattedResult = result.toPrecision(10).replace(/\.?0+$/, '');
    }
    
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
    
    // Convert target value to base unit (meters), then to source unit
    const baseValue = targetUnit.toBase(numValue);
    const result = sourceUnit.fromBase(baseValue);
    
    // Format the result based on its magnitude
    let formattedResult: string;
    if (Math.abs(result) >= 1000000) {
      formattedResult = result.toExponential(6);
    } else if (Math.abs(result) < 0.000001 && result !== 0) {
      formattedResult = result.toExponential(6);
    } else {
      formattedResult = result.toPrecision(10).replace(/\.?0+$/, '');
    }
    
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
      title="Length Converter"
      description="Convert between different units of length and distance"
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

            {/* Swap Button - Centered between inputs on desktop */}
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
                  setSourceUnit('m');
                  setTargetUnit('ft');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Meter to Feet
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('km');
                  setTargetUnit('mi');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Kilometer to Miles
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('in');
                  setTargetUnit('cm');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Inch to Centimeters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('ft');
                  setTargetUnit('m');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Foot to Meters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('mi');
                  setTargetUnit('km');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Mile to Kilometers
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('yd');
                  setTargetUnit('m');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Yard to Meters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default LengthConverter;
