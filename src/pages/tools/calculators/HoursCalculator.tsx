
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format, addHours, addMinutes, differenceInMinutes, parseISO } from 'date-fns';

const timeRangeSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be in format HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be in format HH:MM"),
  breakDuration: z.coerce.number().min(0, "Break must be positive").max(1440, "Break cannot exceed 24 hours"),
});

const addSubtractSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be in format HH:MM"),
  hours: z.coerce.number().min(0, "Hours must be positive"),
  minutes: z.coerce.number().min(0, "Minutes must be positive").max(59, "Minutes cannot exceed 59"),
  operation: z.enum(["add", "subtract"]),
});

const decimalToTimeSchema = z.object({
  decimalHours: z.coerce.number().min(0, "Hours must be positive"),
});

const timeToDecimalSchema = z.object({
  hours: z.coerce.number().min(0, "Hours must be positive").max(99, "Hours cannot exceed 99"),
  minutes: z.coerce.number().min(0, "Minutes must be positive").max(59, "Minutes cannot exceed 59"),
});

type TimeRangeFormValues = z.infer<typeof timeRangeSchema>;
type AddSubtractFormValues = z.infer<typeof addSubtractSchema>;
type DecimalToTimeFormValues = z.infer<typeof decimalToTimeSchema>;
type TimeToDecimalFormValues = z.infer<typeof timeToDecimalSchema>;

const HoursCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("time-range");
  const [timeRangeResult, setTimeRangeResult] = useState<{hours: number; minutes: number; decimal: number} | null>(null);
  const [addSubtractResult, setAddSubtractResult] = useState<{resultTime: string} | null>(null);
  const [decimalToTimeResult, setDecimalToTimeResult] = useState<{hours: number; minutes: number} | null>(null);
  const [timeToDecimalResult, setTimeToDecimalResult] = useState<{decimal: number} | null>(null);

  const timeRangeForm = useForm<TimeRangeFormValues>({
    resolver: zodResolver(timeRangeSchema),
    defaultValues: {
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 30,
    }
  });

  const addSubtractForm = useForm<AddSubtractFormValues>({
    resolver: zodResolver(addSubtractSchema),
    defaultValues: {
      startTime: "12:00",
      hours: 1,
      minutes: 30,
      operation: "add",
    }
  });

  const decimalToTimeForm = useForm<DecimalToTimeFormValues>({
    resolver: zodResolver(decimalToTimeSchema),
    defaultValues: {
      decimalHours: 1.5,
    }
  });

  const timeToDecimalForm = useForm<TimeToDecimalFormValues>({
    resolver: zodResolver(timeToDecimalSchema),
    defaultValues: {
      hours: 1,
      minutes: 30,
    }
  });

  const calculateTimeRange = (data: TimeRangeFormValues) => {
    const { startTime, endTime, breakDuration } = data;
    
    // Create date objects with the same day but different times
    const today = new Date();
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDate = new Date(today);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const endDate = new Date(today);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    // If end time is earlier than start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    // Calculate difference in minutes and subtract break duration
    const diffMinutes = differenceInMinutes(endDate, startDate) - breakDuration;
    
    // Calculate hours and remaining minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const decimal = Number((diffMinutes / 60).toFixed(2));
    
    setTimeRangeResult({ hours, minutes, decimal });
  };

  const calculateAddSubtract = (data: AddSubtractFormValues) => {
    const { startTime, hours, minutes, operation } = data;
    
    // Create a date object with the current day but specified time
    const today = new Date();
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    
    const startDate = new Date(today);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    // Add or subtract hours and minutes
    let resultDate: Date;
    if (operation === "add") {
      resultDate = addMinutes(addHours(startDate, hours), minutes);
    } else {
      resultDate = addMinutes(addHours(startDate, -hours), -minutes);
    }
    
    // Format the result time as HH:MM
    const resultTime = format(resultDate, "HH:mm");
    
    setAddSubtractResult({ resultTime });
  };

  const calculateDecimalToTime = (data: DecimalToTimeFormValues) => {
    const { decimalHours } = data;
    
    // Calculate hours and minutes
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    setDecimalToTimeResult({ hours, minutes });
  };

  const calculateTimeToDecimal = (data: TimeToDecimalFormValues) => {
    const { hours, minutes } = data;
    
    // Calculate decimal hours
    const decimal = Number((hours + minutes / 60).toFixed(2));
    
    setTimeToDecimalResult({ decimal });
  };

  // Helper function to format time duration
  const formatDuration = (hours: number, minutes: number): string => {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <ToolLayout
      title="Hours Calculator"
      description="Calculate time differences, add/subtract time, and convert between time formats"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the calculator type: Time Range, Add/Subtract Time, or Time Conversion</li>
          <li>Enter the required time values</li>
          <li>View the calculated results</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This calculator helps you calculate time differences, add or subtract time from a starting time, 
            and convert between decimal hours and hours:minutes format.
          </p>
        </div>

        <Tabs defaultValue="time-range" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="time-range">Time Range</TabsTrigger>
            <TabsTrigger value="add-subtract">Add/Subtract</TabsTrigger>
            <TabsTrigger value="time-conversion">Conversion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time-range" className="pt-4">
            <Form {...timeRangeForm}>
              <form onSubmit={timeRangeForm.handleSubmit(calculateTimeRange)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={timeRangeForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time (HH:MM)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={timeRangeForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time (HH:MM)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={timeRangeForm.control}
                    name="breakDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Break Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="1440" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Calculate Time Difference
                </Button>
              </form>
            </Form>

            {timeRangeResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Time Difference:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Time Duration</p>
                    <p className="text-xl font-bold">{formatDuration(timeRangeResult.hours, timeRangeResult.minutes)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <p className="text-sm text-muted-foreground">Decimal Hours</p>
                    <p className="text-xl font-bold">{timeRangeResult.decimal} hours</p>
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
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (HH:MM)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={addSubtractForm.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addSubtractForm.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="59" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addSubtractForm.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operation</FormLabel>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant={field.value === "add" ? "default" : "outline"}
                            onClick={() => field.onChange("add")}
                            className="flex-1"
                          >
                            Add
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "subtract" ? "default" : "outline"}
                            onClick={() => field.onChange("subtract")}
                            className="flex-1"
                          >
                            Subtract
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Calculate Result Time
                </Button>
              </form>
            </Form>

            {addSubtractResult && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result Time:</h3>
                <p className="text-2xl font-bold">{addSubtractResult.resultTime}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {addSubtractForm.getValues().operation === "add" ? "Added" : "Subtracted"} {formatDuration(addSubtractForm.getValues().hours, addSubtractForm.getValues().minutes)} 
                  {addSubtractForm.getValues().operation === "add" ? " to " : " from "}
                  {addSubtractForm.getValues().startTime}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="time-conversion" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Decimal Hours to Time</h3>
                <Form {...decimalToTimeForm}>
                  <form onSubmit={decimalToTimeForm.handleSubmit(calculateDecimalToTime)} className="space-y-4">
                    <FormField
                      control={decimalToTimeForm.control}
                      name="decimalHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decimal Hours</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      Convert to Hours:Minutes
                    </Button>
                  </form>
                </Form>

                {decimalToTimeResult && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Result:</h3>
                    <p className="text-xl font-bold">{formatDuration(decimalToTimeResult.hours, decimalToTimeResult.minutes)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Time to Decimal Hours</h3>
                <Form {...timeToDecimalForm}>
                  <form onSubmit={timeToDecimalForm.handleSubmit(calculateTimeToDecimal)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={timeToDecimalForm.control}
                        name="hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hours</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={timeToDecimalForm.control}
                        name="minutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minutes</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="59" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      Convert to Decimal
                    </Button>
                  </form>
                </Form>

                {timeToDecimalResult && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Result:</h3>
                    <p className="text-xl font-bold">{timeToDecimalResult.decimal} hours</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default HoursCalculator;
