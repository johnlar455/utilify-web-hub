
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const HexConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [hex, setHex] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!text) {
      setHex('');
      return;
    }

    try {
      if (mode === 'encode') {
        const hexResult = Array.from(text)
          .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ');
        setHex(hexResult.toUpperCase());
      } else {
        const bytes = text.split(' ');
        const decoded = bytes
          .map(byte => String.fromCharCode(parseInt(byte, 16)))
          .join('');
        setHex(decoded);
      }
    } catch (error) {
      setHex('Error: Invalid input');
    }
  }, [text, mode]);

  const copyToClipboard = () => {
    if (!hex) return;
    
    navigator.clipboard.writeText(hex)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <ToolLayout
      title="Hex Converter"
      description="Convert text to and from hexadecimal"
      category="Binary Tools"
      categoryColor="binaryTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your text in the input field</li>
          <li>Choose between Text to Hex or Hex to Text mode</li>
          <li>See the conversion result in real-time</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="encode">Text to Hex</TabsTrigger>
            <TabsTrigger value="decode">Hex to Text</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {mode === 'encode' ? 'Text Input' : 'Hex Input'}
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text to convert to hexadecimal...'
                  : 'Enter hexadecimal values separated by spaces...'
                }
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {mode === 'encode' ? 'Hex Output' : 'Text Output'}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!hex}
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              <Textarea
                value={hex}
                readOnly
                className="font-mono"
                placeholder={mode === 'encode'
                  ? 'Hexadecimal output will appear here...'
                  : 'Decoded text will appear here...'
                }
              />
            </div>
          </div>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default HexConverter;
