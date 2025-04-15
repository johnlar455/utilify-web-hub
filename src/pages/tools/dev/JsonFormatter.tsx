
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [formatted, setFormatted] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [spacing, setSpacing] = useState<number>(2);

  useEffect(() => {
    try {
      if (!input.trim()) {
        setFormatted('');
        setError(null);
        return;
      }

      // Try to parse JSON
      const parsedJson = JSON.parse(input);
      const formattedJson = JSON.stringify(parsedJson, null, spacing);
      
      setFormatted(formattedJson);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid JSON');
      }
      setFormatted('');
    }
  }, [input, spacing]);

  const beautifyJson = () => {
    try {
      if (!input.trim()) {
        toast.error('Please enter JSON to format');
        return;
      }

      const parsedJson = JSON.parse(input);
      const formattedJson = JSON.stringify(parsedJson, null, spacing);
      
      setFormatted(formattedJson);
      setInput(formattedJson);
      setError(null);
      toast.success('JSON formatted successfully');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error('Invalid JSON: ' + err.message);
      } else {
        setError('Invalid JSON');
        toast.error('Invalid JSON');
      }
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        toast.error('Please enter JSON to minify');
        return;
      }

      const parsedJson = JSON.parse(input);
      const minifiedJson = JSON.stringify(parsedJson);
      
      setFormatted(minifiedJson);
      setInput(minifiedJson);
      setError(null);
      toast.success('JSON minified successfully');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error('Invalid JSON: ' + err.message);
      } else {
        setError('Invalid JSON');
        toast.error('Invalid JSON');
      }
    }
  };

  const copyToClipboard = () => {
    if (!formatted) return;
    
    navigator.clipboard.writeText(formatted)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const downloadJson = () => {
    if (!formatted) return;
    
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-json.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be uploaded again
    e.target.value = '';
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate and beautify your JSON data"
      category="Dev Tools"
      categoryColor="devTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Paste your JSON in the input field or upload a JSON file</li>
          <li>The formatter will validate and display errors in real-time</li>
          <li>Click "Beautify" to format with proper indentation or "Minify" to compress</li>
          <li>Copy or download the formatted JSON</li>
        </ol>
      }
    >
      <Tabs defaultValue="editor">
        <div className="p-4 border-b">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="editor" className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={beautifyJson} variant="default">Beautify</Button>
            <Button onClick={minifyJson} variant="secondary">Minify</Button>
            <Button onClick={copyToClipboard} variant="outline" disabled={!formatted}>
              {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
            <Button onClick={downloadJson} variant="outline" disabled={!formatted}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <div className="relative">
              <input
                type="file"
                id="json-file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button asChild variant="outline">
                <label htmlFor="json-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload JSON
                </label>
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Invalid JSON</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste your JSON here, e.g. {"name": "John", "age": 30}'
                className="font-mono text-sm h-[400px] resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Result</label>
              <div className={`font-mono text-sm whitespace-pre overflow-auto border rounded-md p-3 h-[400px] ${error ? 'bg-muted' : 'bg-card'}`}>
                {formatted}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="p-6">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Indentation Spaces</label>
              <div className="flex space-x-2">
                {[2, 4, 8].map((space) => (
                  <Button
                    key={space}
                    variant={spacing === space ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpacing(space)}
                  >
                    {space} Spaces
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select the number of spaces for indentation when beautifying JSON.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <h3 className="font-medium mb-2">About JSON Formatter</h3>
              <p className="text-muted-foreground mb-2">
                This tool formats and validates JSON data in real-time. JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write.
              </p>
              <p className="text-muted-foreground">
                All processing happens in your browser. Your data is never sent to any server.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default JsonFormatter;
