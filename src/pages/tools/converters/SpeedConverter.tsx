
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
    id: 'mps', 
    name: 'Meters per second (m/s)', 
    toBase: (value) => value, 
    fromBase: (value) => value 
  },
  { 
    id: 'kph', 
    name: 'Kilometers per hour (km/h)', 
    toBase: (value) => value / 3.6, 
    fromBase: (value) => value * 3.6 
  },
  { 
    id: 'mph', 
    name: 'Miles per hour (mph)', 
    toBase: (value) => value * 0.44704, 
    fromBase: (value) => value / 0.44704 
  },
  { 
    id: 'fps', 
    name: 'Feet per second (ft/s)', 
    toBase: (value) => value * 0.3048, 
    fromBase: (value) => value / 0.3048 
  },
  { 
    id: 'knot', 
    name: 'Knots', 
    toBase: (value) => value * 0.514444, 
    fromBase: (value) => value / 0.514444 
  }
];

const SpeedConverter: React.FC = () => {
  const [sourceValue, setSourceValue] = useState<string>('');
  const [sourceUnit, setSourceUnit] = useState<string>('kph');
  const [targetUnit, setTargetUnit] = useState<string>('mph');
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
    
    // Convert source value to base unit (m/s), then to target unit
    const baseValue = sourceUnit.toBase(numValue);
    const result = targetUnit.fromBase(baseValue);
    
    // Format the result with appropriate precision
    const formattedResult = parseFloat(result.toPrecision(10).replace(/\.?0+$/, ''));
    setTargetValue(formattedResult.toString());
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
    
    // Convert target value to base unit (m/s), then to source unit
    const baseValue = targetUnit.toBase(numValue);
    const result = sourceUnit.fromBase(baseValue);
    
    // Format the result with appropriate precision
    const formattedResult = parseFloat(result.toPrecision(10).replace(/\.?0+$/, ''));
    setSourceValue(formattedResult.toString());
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
      title="Speed Converter"
      description="Convert between different units of speed"
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
                  setSourceUnit('kph');
                  setTargetUnit('mph');
                  setSourceValue('100');
                  setLastChanged('source');
                }}
              >
                100 km/h to mph
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('mph');
                  setTargetUnit('kph');
                  setSourceValue('60');
                  setLastChanged('source');
                }}
              >
                60 mph to km/h
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('mps');
                  setTargetUnit('kph');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 m/s to km/h
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('knot');
                  setTargetUnit('kph');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 Knot to km/h
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('fps');
                  setTargetUnit('mph');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 ft/s to mph
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSourceUnit('mph');
                  setTargetUnit('mps');
                  setSourceValue('1');
                  setLastChanged('source');
                }}
              >
                1 mph to m/s
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default SpeedConverter;
