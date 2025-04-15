
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';

const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(5);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Lorem ipsum data
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
    'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateText = () => {
    let result = '';

    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * loremWords.length);
        words.push(loremWords[randomIndex]);
      }
      // Capitalize first letter
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      result = words.join(' ');
    } 
    else if (type === 'sentences') {
      for (let i = 0; i < count; i++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
        const sentence = [];
        
        for (let j = 0; j < sentenceLength; j++) {
          const randomIndex = Math.floor(Math.random() * loremWords.length);
          sentence.push(loremWords[randomIndex]);
        }
        
        // Capitalize first letter and add period
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        result += sentence.join(' ') + '. ';
      }
    } 
    else if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        const paragraphLength = Math.floor(Math.random() * 3) + 3; // 3-5 sentences per paragraph
        const paragraph = [];
        
        for (let j = 0; j < paragraphLength; j++) {
          const sentenceLength = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
          const sentence = [];
          
          for (let k = 0; k < sentenceLength; k++) {
            const randomIndex = Math.floor(Math.random() * loremWords.length);
            sentence.push(loremWords[randomIndex]);
          }
          
          // Capitalize first letter and add period
          sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
          paragraph.push(sentence.join(' ') + '.');
        }
        
        result += paragraph.join(' ') + '\n\n';
      }
    }

    setOutput(result.trim());
  };

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setIsCopied(true);
        toast.success('Text copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy text');
      });
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and layouts"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Choose the type of content you want (paragraphs, sentences, or words)</li>
          <li>Set the number of items to generate</li>
          <li>Click Generate to create your lorem ipsum text</li>
          <li>Copy the result to use in your designs</li>
        </ol>
      }
    >
      <Tabs defaultValue="generator">
        <div className="p-4 border-b">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="generator">Generator</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="generator" className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <RadioGroup 
                  value={type}
                  onValueChange={(value) => setType(value as 'paragraphs' | 'sentences' | 'words')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paragraphs" id="paragraphs" />
                    <Label htmlFor="paragraphs" className="cursor-pointer">Paragraphs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sentences" id="sentences" />
                    <Label htmlFor="sentences" className="cursor-pointer">Sentences</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words" id="words" />
                    <Label htmlFor="words" className="cursor-pointer">Words</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="count">Count</Label>
                <div className="flex space-x-2">
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                  <Button onClick={generateText}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="output">Generated Text</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  disabled={!output}
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              <Textarea
                id="output"
                value={output}
                placeholder="Generated text will appear here..."
                className="min-h-[200px]"
                readOnly
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default LoremIpsumGenerator;
