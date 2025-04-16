
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Utensils } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

const calorieCalculatorSchema = z.object({
  age: z.coerce.number().min(15, "Age must be at least 15").max(100, "Age must be at most 100"),
  gender: z.enum(["male", "female"]),
  height: z.coerce.number().min(100, "Height must be at least 100 cm").max(250, "Height must be at most 250 cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be at most 300 kg"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),
  goal: z.enum(["maintain", "lose", "gain"]),
  rateOfChange: z.coerce.number().min(0, "Rate must be at least 0").max(1, "Rate must be at most 1"),
});

type CalorieCalculatorFormValues = z.infer<typeof calorieCalculatorSchema>;

// Activity level multipliers
const activityMultipliers = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise/sports 1-3 days/week
  moderate: 1.55, // Moderate exercise/sports 3-5 days/week
  active: 1.725, // Hard exercise/sports 6-7 days/week
  "very-active": 1.9, // Very hard exercise/sports & physical job or 2x training
};

const CalorieCalculator: React.FC = () => {
  const [calorieResults, setCalorieResults] = useState<{
    bmr: number;
    maintenance: number;
    recommended: number;
    macros: { protein: number; carbs: number; fat: number };
  } | null>(null);

  const form = useForm<CalorieCalculatorFormValues>({
    resolver: zodResolver(calorieCalculatorSchema),
    defaultValues: {
      age: 30,
      gender: "male",
      height: 175,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain",
      rateOfChange: 0.5,
    }
  });

  const calculateCalories = (data: CalorieCalculatorFormValues) => {
    const { age, gender, height, weight, activityLevel, goal, rateOfChange } = data;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Calculate maintenance calories
    const maintenance = Math.round(bmr * activityMultipliers[activityLevel]);
    
    // Calculate recommended calories based on goal
    let recommended: number;
    if (goal === "maintain") {
      recommended = maintenance;
    } else if (goal === "lose") {
      // For weight loss, subtract 500-1000 calories per day (depending on rate)
      recommended = Math.round(maintenance - (rateOfChange * 1000));
    } else { // gain
      // For weight gain, add 300-500 calories per day (depending on rate)
      recommended = Math.round(maintenance + (rateOfChange * 500));
    }
    
    // Calculate macros (protein, carbs, fat) in grams
    // Protein: 30% of calories (4 calories per gram)
    // Fat: 25% of calories (9 calories per gram)
    // Carbs: 45% of calories (4 calories per gram)
    const protein = Math.round((recommended * 0.3) / 4);
    const fat = Math.round((recommended * 0.25) / 9);
    const carbs = Math.round((recommended * 0.45) / 4);
    
    setCalorieResults({
      bmr: Math.round(bmr),
      maintenance,
      recommended,
      macros: { protein, carbs, fat }
    });
  };

  return (
    <ToolLayout
      title="Calorie Calculator"
      description="Calculate your daily calorie needs based on personal factors"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your age, gender, height, and weight</li>
          <li>Select your activity level</li>
          <li>Choose your goal (maintain, lose, or gain weight)</li>
          <li>View your recommended daily calorie intake and macronutrient breakdown</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This calculator estimates your daily calorie needs based on your age, gender, 
            height, weight, activity level, and goals. The results provide a starting point 
            for your nutrition planning.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateCalories)} className="space-y-6">
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
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Activity & Goals</h3>
              
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
                        <SelectItem value="light">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Very active (hard exercise/sports 6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Super active (very hard exercise/sports & physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lose">Lose weight</SelectItem>
                        <SelectItem value="maintain">Maintain weight</SelectItem>
                        <SelectItem value="gain">Gain weight</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("goal") !== "maintain" && (
                <FormField
                  control={form.control}
                  name="rateOfChange"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("goal") === "lose" ? 
                          "Weight Loss Rate (kg/week)" : 
                          "Weight Gain Rate (kg/week)"}
                      </FormLabel>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Slow ({form.watch("goal") === "lose" ? "0.25 kg" : "0.125 kg"})</span>
                          <span>Moderate (0.5 kg)</span>
                          <span>Fast ({form.watch("goal") === "lose" ? "1 kg" : "0.75 kg"})</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={1}
                            step={0.125}
                            value={[value]}
                            onValueChange={([val]) => onChange(val)}
                            {...field}
                          />
                        </FormControl>
                        <div className="text-center pt-1">
                          <span className="text-sm font-medium">
                            {value} kg per week
                          </span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <Button type="submit" className="w-full">
              <Utensils className="mr-2 h-4 w-4" />
              Calculate Daily Calories
            </Button>
          </form>
        </Form>

        {calorieResults && (
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-4">Your Daily Calorie Results:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Basal Metabolic Rate</p>
                <p className="text-xl font-bold">{calorieResults.bmr} calories</p>
                <p className="text-xs text-muted-foreground mt-1">Calories your body burns at rest</p>
              </div>
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Maintenance Calories</p>
                <p className="text-xl font-bold">{calorieResults.maintenance} calories</p>
                <p className="text-xs text-muted-foreground mt-1">To maintain your current weight</p>
              </div>
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Recommended Daily Intake</p>
                <p className="text-xl font-bold text-green-600">{calorieResults.recommended} calories</p>
                <p className="text-xs text-muted-foreground mt-1">Based on your goal</p>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Recommended Macronutrients:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Protein (30%)</p>
                <p className="text-lg font-bold">{calorieResults.macros.protein}g</p>
                <p className="text-xs text-muted-foreground mt-1">{calorieResults.macros.protein * 4} calories</p>
              </div>
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Carbohydrates (45%)</p>
                <p className="text-lg font-bold">{calorieResults.macros.carbs}g</p>
                <p className="text-xs text-muted-foreground mt-1">{calorieResults.macros.carbs * 4} calories</p>
              </div>
              <div className="p-4 bg-background rounded-md border">
                <p className="text-sm text-muted-foreground">Fat (25%)</p>
                <p className="text-lg font-bold">{calorieResults.macros.fat}g</p>
                <p className="text-xs text-muted-foreground mt-1">{calorieResults.macros.fat * 9} calories</p>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Note: These calculations provide estimates and should be adjusted based on your results over time.</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CalorieCalculator;
