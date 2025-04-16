
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  format, 
  differenceInMonths, 
  differenceInCalendarMonths, 
  addMonths, 
  subMonths,
  differenceInDays,
  getDaysInMonth
} from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dateRangeSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  includeEndMonth: z.boolean().default(true),
});

const addSubtractSchema = z.object({
  startDate: z.date({
    required_error: "Date is required",
  }),
  months: z.coerce.number().int().min(1, "Months must be at least 1"),
  operation: z.enum(["add", "subtract"]),
});

type DateRangeFormValues = z.infer<typeof dateRangeSchema>;
type AddSubtractFormValues = z.infer<typeof addSubtractSchema>;

const MonthCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("date-range");
  const [dateRangeResult, setDateRangeResult] = useState<{
    months: number; 
    exactMonths: number; 
    days: number;
  } | null>(null);
  const [addSubtractResult, setAddSubtractResult] = useState<{resultDate: Date} | null>(null);

  const dateRangeForm = useForm<DateRangeFormValues>({
    resolver: zodResolver(dateRangeSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addMonths(new Date(), 6),
      includeEndMonth: true,
    }
  });

  const addSubtractForm = useForm<AddSubtractFormValues>({
    resolver: zodResolver(addSubtractSchema),
    defaultValues: {
      startDate: new Date(),
      months: 6,
      operation: "add",
    }
  });

  const calculateDateRange = (data: DateRangeFormValues) => {
    const { startDate, endDate, includeEndMonth } = data;
    
    // Ensure dates are in the correct order
    const [earlierDate, laterDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];
    
    // Calculate whole calendar months difference
    const calendarMonths = differenceInCalendarMonths(laterDate, earlierDate);
    
    // Calculate exact months difference
    const exactMonths = differenceInMonths(laterDate, earlierDate);
    
    // Add 1 if including end month
    const monthResult = includeEndMonth ? calendarMonths + 1 : calendarMonths;
    
    // Calculate remaining days
    const startOfLastWholeMonth = addMonths(earlierDate, calendarMonths);
    const daysRemainder = differenceInDays(laterDate, startOfLastWholeMonth);
    
    setDateRangeResult({
      months: monthResult,
      exactMonths,
      days: daysRemainder,
    });
  };

  const calculateAddSubtract = (data: AddSubtractFormValues) => {
    const { startDate, months, operation } = data;
    
    const resultDate = operation === "add" 
      ? addMonths(startDate, months) 
      : subMonths(startDate, months);
    
    setAddSubtractResult({ resultDate });
  };

  return (
    <ToolLayout
      title="Month Calculator"
      description="Calculate months between dates and add or subtract months from a date"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the calculator type: Months Between Dates or Add/Subtract Months</li>
          <li>Enter your dates or date and number of months</li>
          <li>See the calculated results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This calculator helps you find the number of months between two dates, 
            or calculate a date by adding or subtracting months from a starting date.
          </p>
        </div>

        <Tabs defaultValue="date-range" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="date-range">Months Between Dates</TabsTrigger>
            <TabsTrigger value="add-subtract">Add/Subtract Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value="date-range" className="pt-4">
            <Form {...dateRangeForm}>
              <form onSubmit={dateRangeForm.handleSubmit(calculateDateRange)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={dateRangeForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={dateRangeForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={dateRangeForm.control}
                  name="includeEndMonth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include End Month in Count</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calculate Months
                </Button>
              </form>
            </Form>

            {dateRangeResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-4">Results:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Whole Months</p>
                    <p className="text-xl font-bold">
                      {dateRangeResult.months} month{dateRangeResult.months !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Exact Time</p>
                    <p className="text-xl font-bold">
                      {dateRangeResult.exactMonths} month{dateRangeResult.exactMonths !== 1 ? 's' : ''}, {dateRangeResult.days} day{dateRangeResult.days !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Date Range</p>
                    <p className="text-sm">
                      {format(dateRangeForm.getValues().startDate, "MMM d, yyyy")} to {format(dateRangeForm.getValues().endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add-subtract" className="pt-4">
            <Form {...addSubtractForm}>
              <form onSubmit={addSubtractForm.handleSubmit(calculateAddSubtract)} className="space-y-4">
                <FormField
                  control={addSubtractForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMMM d, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={addSubtractForm.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="add">Add Months</SelectItem>
                            <SelectItem value="subtract">Subtract Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addSubtractForm.control}
                    name="months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Months</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calculate Result Date
                </Button>
              </form>
            </Form>

            {addSubtractResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result Date:</h3>
                <p className="text-2xl font-bold">
                  {format(addSubtractResult.resultDate, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {addSubtractForm.getValues().operation === "add" ? "Added" : "Subtracted"} {addSubtractForm.getValues().months} month{addSubtractForm.getValues().months !== 1 ? 's' : ''} 
                  {addSubtractForm.getValues().operation === "add" ? " to " : " from "}
                  {format(addSubtractForm.getValues().startDate, "MMMM d, yyyy")}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default MonthCalculator;
