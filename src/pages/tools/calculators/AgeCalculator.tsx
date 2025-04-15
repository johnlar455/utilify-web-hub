
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInYears, differenceInMonths, differenceInDays, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      setError('Please select a birth date');
      return;
    }

    if (!toDate) {
      setError('Please select an end date');
      return;
    }

    if (toDate < birthDate) {
      setError('End date cannot be earlier than birth date');
      return;
    }

    setError(null);

    // Calculate years, months, days
    const years = differenceInYears(toDate, birthDate);
    
    // Calculate remaining months after years
    const dateAfterYears = new Date(birthDate);
    dateAfterYears.setFullYear(dateAfterYears.getFullYear() + years);
    const months = differenceInMonths(toDate, dateAfterYears);
    
    // Calculate remaining days after months
    const dateAfterMonths = new Date(dateAfterYears);
    dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
    const days = differenceInDays(toDate, dateAfterMonths);

    // Calculate totals
    const totalDays = differenceInDays(toDate, birthDate);
    const totalMonths = differenceInMonths(toDate, birthDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    setAgeResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes
    });
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age or the time between two dates"
      category="Calculators"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select your birth date using the calendar</li>
          <li>By default, age is calculated to today's date (you can change it)</li>
          <li>Click "Calculate Age" to see detailed results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Birth Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date (defaults to today)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            
            <Button onClick={calculateAge} className="w-full">
              Calculate Age
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              {ageResult ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-lg">Age Result</h3>
                    <div className="text-3xl font-bold">
                      {ageResult.years} <span className="text-lg">years</span> {ageResult.months} <span className="text-lg">months</span> {ageResult.days} <span className="text-lg">days</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2 text-sm">Or expressed as:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Total Months:</span>
                        <span className="font-medium">{ageResult.totalMonths.toLocaleString()} months</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Total Weeks:</span>
                        <span className="font-medium">{ageResult.totalWeeks.toLocaleString()} weeks</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Total Days:</span>
                        <span className="font-medium">{ageResult.totalDays.toLocaleString()} days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Total Hours:</span>
                        <span className="font-medium">{ageResult.totalHours.toLocaleString()} hours</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Total Minutes:</span>
                        <span className="font-medium">{ageResult.totalMinutes.toLocaleString()} minutes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Enter dates and calculate to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default AgeCalculator;
