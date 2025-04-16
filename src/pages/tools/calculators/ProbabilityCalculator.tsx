
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dice5 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schemas for different probability calculators
const coinTossSchema = z.object({
  numberOfHeads: z.coerce.number().int().min(0, "Number of heads must be positive"),
  numberOfTosses: z.coerce.number().int().min(1, "Number of tosses must be at least 1"),
  probabilityType: z.enum(["exactly", "atleast", "atmost"])
});

const diceRollSchema = z.object({
  targetOutcome: z.coerce.number().int().min(1, "Outcome must be at least 1").max(6, "Outcome cannot exceed 6"),
  numberOfDice: z.coerce.number().int().min(1, "Number of dice must be at least 1"),
  numberOfRolls: z.coerce.number().int().min(1, "Number of rolls must be at least 1"),
  probabilityType: z.enum(["exactly", "atleast", "atmost"])
});

const customEventSchema = z.object({
  probabilityOfSuccess: z.coerce.number().min(0, "Probability must be at least 0").max(1, "Probability cannot exceed 1"),
  numberOfTrials: z.coerce.number().int().min(1, "Number of trials must be at least 1"),
  numberOfSuccesses: z.coerce.number().int().min(0, "Number of successes must be at least 0"),
  probabilityType: z.enum(["exactly", "atleast", "atmost"])
});

type CoinTossFormValues = z.infer<typeof coinTossSchema>;
type DiceRollFormValues = z.infer<typeof diceRollSchema>;
type CustomEventFormValues = z.infer<typeof customEventSchema>;

const ProbabilityCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("coin-toss");
  const [coinResult, setCoinResult] = useState<number | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [customResult, setCustomResult] = useState<number | null>(null);

  const coinTossForm = useForm<CoinTossFormValues>({
    resolver: zodResolver(coinTossSchema),
    defaultValues: {
      numberOfHeads: 1,
      numberOfTosses: 1,
      probabilityType: "exactly"
    }
  });

  const diceRollForm = useForm<DiceRollFormValues>({
    resolver: zodResolver(diceRollSchema),
    defaultValues: {
      targetOutcome: 6,
      numberOfDice: 1,
      numberOfRolls: 1,
      probabilityType: "exactly"
    }
  });

  const customEventForm = useForm<CustomEventFormValues>({
    resolver: zodResolver(customEventSchema),
    defaultValues: {
      probabilityOfSuccess: 0.5,
      numberOfTrials: 10,
      numberOfSuccesses: 5,
      probabilityType: "exactly"
    }
  });

  // Binomial probability mass function (PMF)
  const binomialPMF = (k: number, n: number, p: number): number => {
    // Binomial coefficient (n choose k)
    const binomialCoefficient = (n: number, k: number): number => {
      if (k < 0 || k > n) return 0;
      if (k === 0 || k === n) return 1;
      
      let result = 1;
      for (let i = 1; i <= k; i++) {
        result *= (n - (i - 1));
        result /= i;
      }
      return result;
    };
    
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  // Binomial cumulative distribution function (CDF)
  const binomialCDF = (k: number, n: number, p: number): number => {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += binomialPMF(i, n, p);
    }
    return sum;
  };

  // Calculate coin toss probability
  const calculateCoinTossProbability = (data: CoinTossFormValues) => {
    const { numberOfHeads, numberOfTosses, probabilityType } = data;
    const p = 0.5; // Probability of heads on a fair coin
    
    let result: number;
    
    if (probabilityType === "exactly") {
      result = binomialPMF(numberOfHeads, numberOfTosses, p);
    } else if (probabilityType === "atleast") {
      result = 1 - binomialCDF(numberOfHeads - 1, numberOfTosses, p);
    } else { // "atmost"
      result = binomialCDF(numberOfHeads, numberOfTosses, p);
    }
    
    setCoinResult(result);
  };

  // Calculate dice roll probability
  const calculateDiceRollProbability = (data: DiceRollFormValues) => {
    const { targetOutcome, numberOfDice, numberOfRolls, probabilityType } = data;
    const p = 1/6; // Probability of getting a specific number on a fair die
    
    let result: number;
    
    if (probabilityType === "exactly") {
      result = binomialPMF(numberOfRolls, numberOfDice, p);
    } else if (probabilityType === "atleast") {
      result = 1 - binomialCDF(numberOfRolls - 1, numberOfDice, p);
    } else { // "atmost"
      result = binomialCDF(numberOfRolls, numberOfDice, p);
    }
    
    setDiceResult(result);
  };

  // Calculate custom event probability
  const calculateCustomEventProbability = (data: CustomEventFormValues) => {
    const { probabilityOfSuccess, numberOfTrials, numberOfSuccesses, probabilityType } = data;
    
    let result: number;
    
    if (probabilityType === "exactly") {
      result = binomialPMF(numberOfSuccesses, numberOfTrials, probabilityOfSuccess);
    } else if (probabilityType === "atleast") {
      result = 1 - binomialCDF(numberOfSuccesses - 1, numberOfTrials, probabilityOfSuccess);
    } else { // "atmost"
      result = binomialCDF(numberOfSuccesses, numberOfTrials, probabilityOfSuccess);
    }
    
    setCustomResult(result);
  };

  return (
    <ToolLayout
      title="Probability Calculator"
      description="Calculate probabilities for various random events"
      category="Calculator Tools"
      categoryColor="calculatorTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the type of probability calculation</li>
          <li>Enter the parameters for your scenario</li>
          <li>Click Calculate to see the probability result</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            This calculator helps you compute probabilities for common scenarios like coin tosses, 
            dice rolls, and custom probability events.
          </p>
        </div>

        <Tabs defaultValue="coin-toss" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="coin-toss">Coin Toss</TabsTrigger>
            <TabsTrigger value="dice-roll">Dice Roll</TabsTrigger>
            <TabsTrigger value="custom-event">Custom Event</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coin-toss" className="pt-4">
            <Form {...coinTossForm}>
              <form onSubmit={coinTossForm.handleSubmit(calculateCoinTossProbability)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={coinTossForm.control}
                    name="probabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probability Type</FormLabel>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant={field.value === "exactly" ? "default" : "outline"}
                            onClick={() => field.onChange("exactly")}
                            className="flex-1"
                          >
                            Exactly
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atleast" ? "default" : "outline"}
                            onClick={() => field.onChange("atleast")}
                            className="flex-1"
                          >
                            At Least
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atmost" ? "default" : "outline"}
                            onClick={() => field.onChange("atmost")}
                            className="flex-1"
                          >
                            At Most
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={coinTossForm.control}
                      name="numberOfHeads"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Heads</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={coinTossForm.control}
                      name="numberOfTosses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Tosses</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Dice5 className="mr-2 h-4 w-4" />
                  Calculate Probability
                </Button>
              </form>
            </Form>

            {coinResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result:</h3>
                <p className="text-2xl font-bold">{(coinResult * 100).toFixed(4)}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Probability of getting {coinTossForm.getValues().probabilityType === "exactly" ? "exactly" : 
                    coinTossForm.getValues().probabilityType === "atleast" ? "at least" : "at most"} {coinTossForm.getValues().numberOfHeads} heads 
                  in {coinTossForm.getValues().numberOfTosses} coin tosses.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="dice-roll" className="pt-4">
            <Form {...diceRollForm}>
              <form onSubmit={diceRollForm.handleSubmit(calculateDiceRollProbability)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={diceRollForm.control}
                    name="probabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probability Type</FormLabel>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant={field.value === "exactly" ? "default" : "outline"}
                            onClick={() => field.onChange("exactly")}
                            className="flex-1"
                          >
                            Exactly
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atleast" ? "default" : "outline"}
                            onClick={() => field.onChange("atleast")}
                            className="flex-1"
                          >
                            At Least
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atmost" ? "default" : "outline"}
                            onClick={() => field.onChange("atmost")}
                            className="flex-1"
                          >
                            At Most
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={diceRollForm.control}
                      name="targetOutcome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Outcome (1-6)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={diceRollForm.control}
                      name="numberOfRolls"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Successes</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={diceRollForm.control}
                      name="numberOfDice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Dice</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Dice5 className="mr-2 h-4 w-4" />
                  Calculate Probability
                </Button>
              </form>
            </Form>

            {diceResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result:</h3>
                <p className="text-2xl font-bold">{(diceResult * 100).toFixed(4)}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Probability of rolling {diceRollForm.getValues().probabilityType === "exactly" ? "exactly" : 
                    diceRollForm.getValues().probabilityType === "atleast" ? "at least" : "at most"} {diceRollForm.getValues().numberOfRolls} {diceRollForm.getValues().targetOutcome}'s
                  with {diceRollForm.getValues().numberOfDice} dice.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="custom-event" className="pt-4">
            <Form {...customEventForm}>
              <form onSubmit={customEventForm.handleSubmit(calculateCustomEventProbability)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={customEventForm.control}
                    name="probabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probability Type</FormLabel>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant={field.value === "exactly" ? "default" : "outline"}
                            onClick={() => field.onChange("exactly")}
                            className="flex-1"
                          >
                            Exactly
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atleast" ? "default" : "outline"}
                            onClick={() => field.onChange("atleast")}
                            className="flex-1"
                          >
                            At Least
                          </Button>
                          <Button 
                            type="button" 
                            variant={field.value === "atmost" ? "default" : "outline"}
                            onClick={() => field.onChange("atmost")}
                            className="flex-1"
                          >
                            At Most
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={customEventForm.control}
                      name="probabilityOfSuccess"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Probability of Success (0-1)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={customEventForm.control}
                      name="numberOfTrials"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Trials</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={customEventForm.control}
                      name="numberOfSuccesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Successes</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Dice5 className="mr-2 h-4 w-4" />
                  Calculate Probability
                </Button>
              </form>
            </Form>

            {customResult !== null && (
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Result:</h3>
                <p className="text-2xl font-bold">{(customResult * 100).toFixed(4)}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Probability of getting {customEventForm.getValues().probabilityType === "exactly" ? "exactly" : 
                    customEventForm.getValues().probabilityType === "atleast" ? "at least" : "at most"} {customEventForm.getValues().numberOfSuccesses} successes 
                  in {customEventForm.getValues().numberOfTrials} trials
                  with individual success probability of {customEventForm.getValues().probabilityOfSuccess}.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default ProbabilityCalculator;
