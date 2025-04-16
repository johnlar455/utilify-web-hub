
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from "@/components/ui/button";
import { CalendarDays } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, differenceInDays, differenceInBusinessDays, addDays, isSaturday, isSunday } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dateRangeSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  includeEndDate: z.boolean().default(true),
  excludeWeekends: z.boolean().default(false),
});

const addSubtractSchema = z.object({
  startDate: z.date({
    required_error: "Date is required",
  }),
  days: z.coerce.number().int().min(1, "Days must be at least 1"),
  operation: z.enum(["add", "subtract"]),
  excludeWeekends: z.boolean().default(false),
});

type DateRangeFormValues = z.infer<typeof dateRangeSchema>;
type AddSubtractFormValues = z.infer<typeof addSubtractSchema>;

const DaysCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("date-range");
  const [dateRangeResult, setDateRangeResult] = useState<{days: number} | null>(null);
  const [addSubtractResult, setAddSubtractResult] = useState<{resultDate: Date} | null>(null);

  const dateRangeForm = useForm<DateRangeFormValues>({
    resolver: zodResolver(dateRangeSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      includeEndDate: true,
      excludeWeekends: false,
    }
  });

  const addSubtractForm = useForm<AddSubtractFormValues>({
    resolver: zodResolver(addSubtractSchema),
    defaultValues: {
      startDate: new Date(),
      days: 7,
      operation: "add",
      excludeWeekends: false,
    }
  });

  const calculateDateRange = (data: DateRangeFormValues) => {
    const { startDate, endDate, includeEndDate, excludeWeekends } = data;
    
    let days: number;
    
    if (excludeWeekends) {
      days = differenceInBusinessDays(endDate, startDate);
    } else {
      days = differenceInDays(endDate, startDate);
    }
    
    // Include the end date if requested
    if (includeEndDate) {
      days += 1;
      
      // If including end date and excluding weekends, check if the end date is a weekend
      if (excludeWeekends && (isSaturday(endDate) || isSunday(endDate))) {
        days -= 1;
      }
    }
    
    setDateRangeResult({ days });
  };

  const calculateAddSubtract = (data: AddSubtractFormValues) => {
    const { startDate, days, operation, excludeWeekends } = data;
    
    let resultDate = startDate;
    let daysProcessed = 0;
    
    if (!excludeWeekends) {
      // Simple addition/subtraction if weekends are included
      resultDate = operation === "add" 
        ? addDays(startDate, days) 
        : addDays(startDate, -days);
    } else {
      // Skip weekends when adding/subtracting days
      let dayCounter = 0;
      const direction = operation === "add" ? 1 : -1;
      
      while (daysProcessed < days) {
        dayCounter += direction;
        const checkDate = addDays(startDate, dayCounter);
        
        if (!isSaturday(checkDate) && !isSunday(checkDate)) {
          daysProcessed += 1;
        }
      }
      
      resultDate = addDays(startDate, dayCounter);
    }
    
    setAddSubtractResult({ resultDate });
  };

  return (
    <ToolLayout
      title="Days Calculator"
      description="Calculate days between dates and add or subtract days from a date"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the calculator type: Date Range or Add/Subtract Days</li>
          <li>Enter your dates or date and number of days</li>
          <li>Configure options such as including end date or excluding weekends</li>
          <li>See the calculated results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This calculator helps you find the number of days between two dates, 
            or calculate a date by adding or subtracting days from a starting date.
          </p>
        </div>

        <Tabs defaultValue="date-range" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="date-range">Date Range</TabsTrigger>
            <TabsTrigger value="add-subtract">Add/Subtract Days</TabsTrigger>
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={dateRangeForm.control}
                    name="includeEndDate"
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
                          <FormLabel>Include End Date</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={dateRangeForm.control}
                    name="excludeWeekends"
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
                          <FormLabel>Exclude Weekends</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Calculate Days
                </Button>
              </form>
            </Form>

            {dateRangeResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result:</h3>
                <p className="text-2xl font-bold">
                  {dateRangeResult.days} day{dateRangeResult.days !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  From {format(dateRangeForm.getValues().startDate, "MMMM d, yyyy")} to {format(dateRangeForm.getValues().endDate, "MMMM d, yyyy")}
                  {dateRangeForm.getValues().includeEndDate ? " (inclusive)" : " (exclusive)"}
                  {dateRangeForm.getValues().excludeWeekends ? ", excluding weekends" : ""}
                </p>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
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
                            <SelectItem value="add">Add Days</SelectItem>
                            <SelectItem value="subtract">Subtract Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addSubtractForm.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Days</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <button
                              type="button"
                              className="border border-r-0 px-3 py-2 rounded-l-md border-input"
                              onClick={() => field.onChange(Math.max(1, field.value - 1))}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </button>
                            <Input
                              type="number"
                              min="1"
                              className="rounded-none flex-1"
                              {...field}
                            />
                            <button
                              type="button"
                              className="border border-l-0 px-3 py-2 rounded-r-md border-input"
                              onClick={() => field.onChange(field.value + 1)}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addSubtractForm.control}
                  name="excludeWeekends"
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
                        <FormLabel>Exclude Weekends</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" />
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
                  {addSubtractForm.getValues().operation === "add" ? "Added" : "Subtracted"} {addSubtractForm.getValues().days} days 
                  {addSubtractForm.getValues().excludeWeekends ? " (excluding weekends)" : ""} 
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

export default DaysCalculator;
