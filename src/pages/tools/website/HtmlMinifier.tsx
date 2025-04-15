
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const HtmlMinifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const minifyHtml = () => {
    if (!input) {
      toast.error('Please enter HTML code to minify');
      return;
    }

    try {
      // Remove comments
      let minified = input.replace(/<!--[\s\S]*?-->/g, '');
      
      // Remove whitespace between tags
      minified = minified.replace(/>\s+</g, '><');
      
      // Remove line breaks and extra spaces
      minified = minified.replace(/\s+/g, ' ').trim();
      
      setOutput(minified);
      toast.success('HTML minified successfully');
    } catch (error) {
      toast.error('Error minifying HTML');
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const calculateStats = () => {
    if (!input || !output) return null;
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([output]).size;
    const savedBytes = originalSize - minifiedSize;
    const savingPercentage = ((savedBytes / originalSize) * 100).toFixed(1);
    
    return {
      originalSize,
      minifiedSize,
      savedBytes,
      savingPercentage
    };
  };

  const stats = calculateStats();

  return (
    <ToolLayout
      title="HTML Minifier"
      description="Minify HTML code to reduce file size"
      category="Website Tools"
      categoryColor="websiteTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Paste your HTML code in the input field</li>
          <li>Click the Minify button to process</li>
          <li>Copy the minified result</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input HTML</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="font-mono min-h-[300px]"
            />
            <Button onClick={minifyHtml} className="w-full">Minify HTML</Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Minified Output</label>
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
              value={output}
              readOnly
              placeholder="Minified HTML will appear here..."
              className="font-mono min-h-[300px]"
            />
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Original Size</div>
              <div className="text-2xl font-semibold">{stats.originalSize} B</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Minified Size</div>
              <div className="text-2xl font-semibold">{stats.minifiedSize} B</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Bytes Saved</div>
              <div className="text-2xl font-semibold">{stats.savedBytes} B</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Reduction</div>
              <div className="text-2xl font-semibold">{stats.savingPercentage}%</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default HtmlMinifier;
