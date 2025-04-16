
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const tdeeCalculatorSchema = z.object({
  age: z.coerce.number().min(15, "Age must be at least 15").max(100, "Age must be at most 100"),
  gender: z.enum(["male", "female"]),
  height: z.coerce.number().min(100, "Height must be at least 100 cm").max(250, "Height must be at most 250 cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be at most 300 kg"),
  bodyfat: z.coerce.number().min(3, "Body fat must be at least 3%").max(70, "Body fat must be at most 70%").optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),
  formula: z.enum(["mifflin", "harris", "katch"]),
});

type TDEECalculatorFormValues = z.infer<typeof tdeeCalculatorSchema>;

// Activity level multipliers
const activityMultipliers = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise/sports 1-3 days/week
  moderate: 1.55, // Moderate exercise/sports 3-5 days/week
  active: 1.725, // Hard exercise/sports 6-7 days/week
  "very-active": 1.9, // Very hard exercise/sports & physical job or 2x training
};

// Activity descriptions for results
const activityDescriptions = {
  sedentary: "Little or no exercise",
  light: "Light exercise 1-3 days/week",
  moderate: "Moderate exercise 3-5 days/week",
  active: "Heavy exercise 6-7 days/week",
  "very-active": "Very heavy exercise, physical job, or twice daily training",
};

// Goal calorie adjustments
const goalCalorieAdjustments = {
  "extreme-loss": -1000, // -1000 calories for extreme weight loss (2lb/week)
  "weight-loss": -500, // -500 calories for weight loss (1lb/week)
  "mild-loss": -250, // -250 calories for mild weight loss (0.5lb/week)
  "maintain": 0, // 0 calories for maintenance
  "mild-gain": 250, // +250 calories for mild weight gain (0.5lb/week)
  "weight-gain": 500, // +500 calories for weight gain (1lb/week)
  "extreme-gain": 1000, // +1000 calories for extreme weight gain (2lb/week)
};

interface TDEEResults {
  bmr: number;
  tdee: number;
  goals: {
    extremeLoss: number;
    weightLoss: number;
    mildLoss: number;
    maintain: number;
    mildGain: number;
    weightGain: number;
    extremeGain: number;
  };
}

const TdeeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [results, setResults] = useState<TDEEResults | null>(null);

  const form = useForm<TDEECalculatorFormValues>({
    resolver: zodResolver(tdeeCalculatorSchema),
    defaultValues: {
      age: 30,
      gender: "male",
      height: 175,
      weight: 70,
      bodyfat: undefined,
      activityLevel: "moderate",
      formula: "mifflin",
    }
  });

  const watchFormula = form.watch("formula");

  const calculateTDEE = (data: TDEECalculatorFormValues) => {
    const { age, gender, height, weight, bodyfat, activityLevel, formula } = data;
    
    // Calculate BMR based on selected formula
    let bmr: number;
    
    if (formula === "mifflin") {
      // Mifflin-St Jeor Equation
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
    } else if (formula === "harris") {
      // Harris-Benedict Equation
      if (gender === "male") {
        bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
      } else {
        bmr = 9.247 * weight + 3.098 * height - 4.330 * age + 447.593;
      }
    } else { // Katch-McArdle
      // This formula requires body fat percentage
      if (bodyfat !== undefined) {
        // Calculate lean body mass
        const lbm = weight * (1 - (bodyfat / 100));
        // Katch-McArdle Formula: BMR = 370 + (21.6 * LBM)
        bmr = 370 + (21.6 * lbm);
      } else {
        // Fallback to Mifflin-St Jeor if body fat is not provided
        if (gender === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
      }
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
    
    // Calculate calorie targets for different goals
    const extremeLoss = Math.max(1200, tdee + goalCalorieAdjustments["extreme-loss"]);
    const weightLoss = Math.max(1200, tdee + goalCalorieAdjustments["weight-loss"]);
    const mildLoss = Math.max(1200, tdee + goalCalorieAdjustments["mild-loss"]);
    const maintain = tdee;
    const mildGain = tdee + goalCalorieAdjustments["mild-gain"];
    const weightGain = tdee + goalCalorieAdjustments["weight-gain"];
    const extremeGain = tdee + goalCalorieAdjustments["extreme-gain"];
    
    setResults({
      bmr: Math.round(bmr),
      tdee,
      goals: {
        extremeLoss,
        weightLoss,
        mildLoss,
        maintain,
        mildGain,
        weightGain,
        extremeGain
      }
    });
    
    // Switch to results tab
    setActiveTab("results");
  };

  return (
    <ToolLayout
      title="TDEE Calculator"
      description="Calculate your Total Daily Energy Expenditure for accurate nutrition planning"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your personal details including age, gender, height, and weight</li>
          <li>Select your activity level</li>
          <li>Choose a calculation formula (optional: enter body fat % for Katch-McArdle)</li>
          <li>View your BMR, TDEE, and calorie targets for different goals</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            <strong>TDEE</strong> (Total Daily Energy Expenditure) represents the total number of calories 
            you burn each day based on your BMR (Basal Metabolic Rate) and activity level. 
            This calculator helps you determine your energy needs for effective nutrition planning.
          </p>
        </div>

        <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(calculateTDEE)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" min="15" max="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <label htmlFor="male">Male</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <label htmlFor="female">Female</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" min="100" max="250" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" min="30" max="300" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchFormula === "katch" && (
                    <FormField
                      control={form.control}
                      name="bodyfat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Fat Percentage (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="3" max="70" placeholder="Optional but recommended for this formula" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Activity & Formula</h3>
                  
                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Very active (heavy exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="very-active">Super active (very heavy exercise, physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="formula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calculation Formula</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select calculation formula" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mifflin">Mifflin-St Jeor (most accurate for most people)</SelectItem>
                            <SelectItem value="harris">Harris-Benedict (slightly older formula)</SelectItem>
                            <SelectItem value="katch">Katch-McArdle (uses body fat percentage)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate TDEE
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="results" className="pt-4">
            {results && (
              <div>
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium">Your Information:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Age:</span> {form.getValues().age} years
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Gender:</span> {form.getValues().gender === "male" ? "Male" : "Female"}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Height:</span> {form.getValues().height} cm
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Weight:</span> {form.getValues().weight} kg
                    </div>
                    <div className="text-sm col-span-2">
                      <span className="text-muted-foreground">Activity Level:</span> {activityDescriptions[form.getValues().activityLevel]}
                    </div>
                    <div className="text-sm col-span-2">
                      <span className="text-muted-foreground">Formula:</span> {
                        form.getValues().formula === "mifflin" ? "Mifflin-St Jeor" : 
                        form.getValues().formula === "harris" ? "Harris-Benedict" : 
                        "Katch-McArdle"
                      }
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 bg-background rounded-md border">
                    <p className="text-lg text-muted-foreground mb-1">Basal Metabolic Rate</p>
                    <p className="text-3xl font-bold">{results.bmr} calories</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This is the number of calories your body burns at complete rest.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-background rounded-md border">
                    <p className="text-lg text-muted-foreground mb-1">Total Daily Energy Expenditure</p>
                    <p className="text-3xl font-bold">{results.tdee} calories</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This is your maintenance calories based on your activity level.
                    </p>
                  </div>
                </div>
                
                <h3 className="font-medium mb-4">Daily Calorie Targets for Your Goals:</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Extreme Weight Loss:</div>
                    <div className="font-semibold">{results.goals.extremeLoss} calories/day</div>
                    <div className="text-sm text-muted-foreground">~2 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Weight Loss:</div>
                    <div className="font-semibold">{results.goals.weightLoss} calories/day</div>
                    <div className="text-sm text-muted-foreground">~1 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Mild Weight Loss:</div>
                    <div className="font-semibold">{results.goals.mildLoss} calories/day</div>
                    <div className="text-sm text-muted-foreground">~0.5 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md bg-muted">
                    <div className="text-foreground font-medium">Maintenance:</div>
                    <div className="font-semibold">{results.goals.maintain} calories/day</div>
                    <div className="text-sm text-muted-foreground">0 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Mild Weight Gain:</div>
                    <div className="font-semibold">{results.goals.mildGain} calories/day</div>
                    <div className="text-sm text-muted-foreground">~0.5 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Weight Gain:</div>
                    <div className="font-semibold">{results.goals.weightGain} calories/day</div>
                    <div className="text-sm text-muted-foreground">~1 lb/week</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    <div className="text-muted-foreground font-medium">Extreme Weight Gain:</div>
                    <div className="font-semibold">{results.goals.extremeGain} calories/day</div>
                    <div className="text-sm text-muted-foreground">~2 lb/week</div>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-muted-foreground">
                  <p className="mb-1">Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>These calculations provide estimates and should be adjusted based on your results.</li>
                    <li>Calorie targets for weight loss will never go below 1200 calories per day.</li>
                    <li>For accurate tracking, consider using a food scale and nutrition tracking app.</li>
                    <li>Consult with a healthcare provider before starting any significant diet change.</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("calculator")}
                    className="w-full"
                  >
                    Return to Calculator
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default TdeeCalculator;
