
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
    id: 'pa', 
    name: 'Pascal (Pa)', 
    toBase: (value) => value, 
    fromBase: (value) => value 
  },
  { 
    id: 'kpa', 
    name: 'Kilopascal (kPa)', 
    toBase: (value) => value * 1000, 
    fromBase: (value) => value / 1000 
  },
  { 
    id: 'mpa', 
    name: 'Megapascal (MPa)', 
    toBase: (value) => value * 1000000, 
    fromBase: (value) => value / 1000000 
  },
  { 
    id: 'bar', 
    name: 'Bar', 
    toBase: (value) => value * 100000, 
    fromBase: (value) => value / 100000 
  },
  { 
    id: 'atm', 
    name: 'Atmosphere (atm)', 
    toBase: (value) => value * 101325, 
    fromBase: (value) => value / 101325 
  },
  { 
    id: 'mmhg', 
    name: 'Millimeter of mercury (mmHg)', 
    toBase: (value) => value * 133.322, 
    fromBase: (value) => value / 133.322 
  },
  { 
    id: 'psi', 
    name: 'Pound per square inch (psi)', 
    toBase: (value) => value * 6894.76, 
    fromBase: (value) => value / 6894.76 
  },
  { 
    id: 'torr', 
    name: 'Torr', 
    toBase: (value) => value * 133.322, 
    fromBase: (value) => value / 133.322 
  }
];

const PressureConverter: React.FC = () => {
  const [sourceValue, setSourceValue] = useState<string>('');
  const [sourceUnit, setSourceUnit] = useState<string>('bar');
  const [targetUnit, setTargetUnit] = useState<string>('psi');
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
    
    // Convert source value to base unit (Pascal), then to target unit
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
    
    // Convert target value to base unit (Pascal), then to source unit
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
      title="Pressure Converter"
      description="Convert between different units of pressure"
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
                  setSourceUnit('bar');
                  setTargetUnit('psi');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Bar to PSI
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('atm');
                  setTargetUnit('bar');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Atmosphere to Bar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('psi');
                  setTargetUnit('kpa');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 PSI to kPa
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('mmhg');
                  setTargetUnit('kpa');
                  setSourceValue('760');
                  setLastChanged('source');
                }}
              >
                760 mmHg to kPa
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('psi');
                  setTargetUnit('bar');
                  setSourceValue('14.5038');
                  setLastChanged('source');
                }}
              >
                14.5038 PSI to Bar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('kpa');
                  setTargetUnit('psi');
                  setSourceValue('101.325');
                  setLastChanged('source');
                }}
              >
                101.325 kPa to PSI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PressureConverter;
