
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

const RemoveLineBreaks: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [mode, setMode] = useState<'remove' | 'add'>('remove');
  const [separator, setSeparator] = useState<string>(' ');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const processText = () => {
    if (!text) return;

    if (mode === 'remove') {
      const processed = text.replace(/[\r\n]+/g, separator);
      setResult(processed);
    } else {
      // Add line breaks after each sentence
      const processed = text
        .replace(/([.!?])\s+/g, '$1\n')
        .replace(/\n+/g, '\n'); // Remove multiple consecutive line breaks
      setResult(processed);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => {
        setIsCopied(true);
        toast.success('Text copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy text');
      });
  };

  const handleSwitchTexts = () => {
    if (result) {
      setText(result);
      setResult('');
    }
  };

  return (
    <ToolLayout
      title="Line Break Remover"
      description="Remove or add line breaks in your text"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Paste your text in the input area</li>
          <li>Select the operation mode (remove or add line breaks)</li>
          <li>If removing line breaks, choose a replacement separator</li>
          <li>Click the Process button</li>
          <li>Copy the result to use elsewhere</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="input">Input Text</Label>
            <Textarea
              id="input"
              placeholder="Enter text with line breaks..."
              className="min-h-[250px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output">Result</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSwitchTexts}
                  disabled={!result}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  disabled={!result}
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
            </div>
            <Textarea
              id="output"
              placeholder="Processed text will appear here..."
              className="min-h-[250px]"
              value={result}
              readOnly
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Operation Mode</Label>
            <RadioGroup 
              value={mode}
              onValueChange={(value) => setMode(value as 'remove' | 'add')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remove" id="remove" />
                <Label htmlFor="remove" className="cursor-pointer">Remove Line Breaks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="cursor-pointer">Add Line Breaks</Label>
              </div>
            </RadioGroup>
          </div>
          
          {mode === 'remove' && (
            <div className="space-y-2">
              <Label>Replace With</Label>
              <RadioGroup 
                value={separator}
                onValueChange={setSeparator}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value=" " id="space" />
                  <Label htmlFor="space" className="cursor-pointer">Space</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="nothing" />
                  <Label htmlFor="nothing" className="cursor-pointer">Nothing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value=", " id="comma" />
                  <Label htmlFor="comma" className="cursor-pointer">Comma</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="; " id="semicolon" />
                  <Label htmlFor="semicolon" className="cursor-pointer">Semicolon</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <Button onClick={processText} disabled={!text}>Process Text</Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RemoveLineBreaks;
