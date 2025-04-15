
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (useLowercase) chars += lowercase;
    if (useUppercase) chars += uppercase;
    if (useNumbers) chars += numbers;
    if (useSpecial) chars += special;

    if (!chars) {
      toast.error('Please select at least one character type');
      return;
    }

    let result = '';
    const charsLength = chars.length;
    
    // Ensure at least one character from each selected type
    if (useUppercase) result += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (useLowercase) result += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (useNumbers) result += numbers[Math.floor(Math.random() * numbers.length)];
    if (useSpecial) result += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = result.length; i < length; i++) {
      result += chars[Math.floor(Math.random() * charsLength)];
    }

    // Shuffle the result
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(result);
  };

  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password)
      .then(() => {
        setIsCopied(true);
        toast.success('Password copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy password');
      });
  };

  const calculateStrength = (): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: 'No Password', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 12) score += 2;
    if (password.length >= 16) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;

    if (score >= 7) return { score, label: 'Very Strong', color: 'bg-green-500' };
    if (score >= 5) return { score, label: 'Strong', color: 'bg-emerald-500' };
    if (score >= 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Weak', color: 'bg-red-500' };
  };

  const strength = calculate

Strength();

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure random passwords"
      category="Miscellaneous"
      categoryColor="miscTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select password options (length, character types)</li>
          <li>Click Generate to create a new password</li>
          <li>Copy the generated password to use it</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Password Length: {length}</Label>
            </div>
            <Slider
              value={[length]}
              min={8}
              max={32}
              step={1}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={useUppercase}
                onCheckedChange={setUseUppercase}
              />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="lowercase"
                checked={useLowercase}
                onCheckedChange={setUseLowercase}
              />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="numbers"
                checked={useNumbers}
                onCheckedChange={setUseNumbers}
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="special"
                checked={useSpecial}
                onCheckedChange={setUseSpecial}
              />
              <Label htmlFor="special">Special Characters (!@#$%^&*)</Label>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
          </div>

          {password && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={password}
                  readOnly
                  className="pr-20 font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1"
                  onClick={copyToClipboard}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm">Password Strength: {strength.label}</div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: `${(strength.score / 8) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default PasswordGenerator;
