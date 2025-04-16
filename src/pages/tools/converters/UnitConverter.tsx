
import React from 'react';
import { Link } from 'react-router-dom';
import ToolLayout from '@/components/ToolLayout';
import { 
  Ruler, 
  Square, 
  Weight, 
  Beaker, 
  Thermometer, 
  Clock, 
  HardDrive, 
  Gauge, 
  Wind, 
  Zap, 
  Battery, 
  RotateCcw,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ConverterType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  implemented: boolean;
}

const converterTypes: ConverterType[] = [
  {
    id: 'length',
    title: 'Length Converter',
    description: 'Convert between different units of length (meters, feet, etc.)',
    icon: Ruler,
    path: '/tools/converters/length-converter',
    implemented: true,
  },
  {
    id: 'area',
    title: 'Area Converter',
    description: 'Convert between different units of area (square meters, acres, etc.)',
    icon: Square,
    path: '/tools/converters/area-converter',
    implemented: true,
  },
  {
    id: 'weight',
    title: 'Weight Converter',
    description: 'Convert between different units of weight (kilograms, pounds, etc.)',
    icon: Weight,
    path: '/tools/converters/weight-converter',
    implemented: true,
  },
  {
    id: 'volume',
    title: 'Volume Converter',
    description: 'Convert between different units of volume (liters, gallons, etc.)',
    icon: Beaker,
    path: '/tools/converters/volume-converter',
    implemented: true,
  },
  {
    id: 'temperature',
    title: 'Temperature Converter',
    description: 'Convert between different temperature units (Celsius, Fahrenheit, etc.)',
    icon: Thermometer,
    path: '/tools/converters/temperature-converter',
    implemented: true,
  },
  {
    id: 'time',
    title: 'Time Converter',
    description: 'Convert between different units of time (seconds, hours, days, etc.)',
    icon: Clock,
    path: '/tools/converters/time-converter',
    implemented: true,
  },
  {
    id: 'digital',
    title: 'Digital Converter',
    description: 'Convert between different digital units (bytes, kilobytes, etc.)',
    icon: HardDrive,
    path: '/tools/converters/digital-converter',
    implemented: true,
  },
  {
    id: 'speed',
    title: 'Speed Converter',
    description: 'Convert between different units of speed (mph, km/h, etc.)',
    icon: Gauge,
    path: '/tools/converters/speed-converter',
    implemented: true,
  },
  {
    id: 'pressure',
    title: 'Pressure Converter',
    description: 'Convert between different pressure units (pascal, bar, psi, etc.)',
    icon: Wind,
    path: '/tools/converters/pressure-converter',
    implemented: true,
  },
  {
    id: 'power',
    title: 'Power Converter',
    description: 'Convert between different power units (watts, horsepower, etc.)',
    icon: Zap,
    path: '/tools/converters/power-converter',
    implemented: true,
  },
  {
    id: 'energy',
    title: 'Energy Converter',
    description: 'Convert between different energy units (joules, calories, etc.)',
    icon: Battery,
    path: '/tools/converters/energy-converter',
    implemented: true,
  },
  {
    id: 'angle',
    title: 'Angle Converter',
    description: 'Convert between different angle units (degrees, radians, etc.)',
    icon: RotateCcw,
    path: '/tools/converters/angle-converter',
    implemented: true,
  },
  {
    id: 'currency',
    title: 'Currency Converter',
    description: 'Convert between different currencies (USD, EUR, etc.)',
    icon: DollarSign,
    path: '/tools/converters/currency-converter',
    implemented: true,
  },
];

const UnitConverter: React.FC = () => {
  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert values between different measurement units"
      category="Unit Converter Tools"
      categoryColor="converterTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the type of converter you want to use</li>
          <li>Enter your value and select your source and target units</li>
          <li>See the converted result automatically</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {converterTypes.map((converter) => (
            <div key={converter.id} className="flex flex-col h-full">
              {converter.implemented ? (
                <Link 
                  to={converter.path}
                  className="h-full"
                >
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start mb-2 pt-4">
                        <div className="p-2 rounded-md bg-converterTool/10 text-converterTool mr-3">
                          <converter.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium">{converter.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{converter.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="h-full bg-muted/30 opacity-60 cursor-not-allowed">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex items-start mb-2 pt-4">
                      <div className="p-2 rounded-md bg-converterTool/10 text-converterTool mr-3">
                        <converter.icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{converter.title}</h3>
                        <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Coming soon</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{converter.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
};

export default UnitConverter;
