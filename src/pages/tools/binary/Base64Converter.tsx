
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ArrowDownUp, Check, Upload, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<{name: string, type: string, size: number} | null>(null);

  useEffect(() => {
    if (inputText === '') {
      setOutputText('');
      return;
    }

    try {
      if (mode === 'encode') {
        // For encoding text to Base64
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        // For decoding Base64 to text
        try {
          const decoded = decodeURIComponent(escape(atob(inputText)));
          setOutputText(decoded);
        } catch (e) {
          setOutputText('Error: Invalid Base64 input');
        }
      }
    } catch (e) {
      setOutputText('Error: Unable to convert');
    }
  }, [inputText, mode]);

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInputText(outputText);
    setFileInfo(null);
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileInfo({
      name: file.name,
      type: file.type || 'Unknown type',
      size: file.size
    });

    const reader = new FileReader();
    
    if (mode === 'encode') {
      // When encoding, read file as data URL (Base64)
      reader.onload = (event) => {
        // Extract the Base64 part from the data URL
        const result = event.target?.result as string;
        const base64Content = result.split(',')[1];
        setInputText(base64Content || '');
      };
      reader.readAsDataURL(file);
    } else {
      // When decoding, read file as text (should be Base64 text)
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
      };
      reader.readAsText(file);
    }
    
    // Reset the input value so the same file can be uploaded again
    e.target.value = '';
  };

  const downloadAsFile = () => {
    if (!outputText) return;
    
    try {
      let blob;
      let filename;
      
      if (mode === 'encode') {
        // Downloading Base64 as text file
        blob = new Blob([outputText], { type: 'text/plain' });
        filename = 'encoded-base64.txt';
      } else {
        // Try to guess if it's text or binary
        try {
          // Assume it's text if we can decode it normally
          blob = new Blob([outputText], { type: 'text/plain' });
          filename = 'decoded-text.txt';
        } catch (e) {
          // If there's an error, it might be binary data
          blob = new Blob([outputText], { type: 'application/octet-stream' });
          filename = 'decoded-binary.bin';
        }
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('File downloaded');
    } catch (e) {
      toast.error('Failed to download file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Convert text to and from Base64 encoding"
      category="Binary Tools"
      categoryColor="binaryTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Choose to encode (text to Base64) or decode (Base64 to text)</li>
          <li>Enter or paste your text in the input field</li>
          <li>See the result update automatically in real-time</li>
          <li>Copy the result or download as a file</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <Tabs defaultValue="converter">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="about">About Base64</TabsTrigger>
          </TabsList>
          
          <TabsContent value="converter" className="pt-6 space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
              <Button onClick={swapMode} variant="outline" className="flex items-center">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Swap {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              
              <div className="text-sm font-medium text-muted-foreground">
                Mode: <span className="text-foreground">{mode === 'encode' ? 'Text → Base64' : 'Base64 → Text'}</span>
              </div>
            </div>
            
            {fileInfo && (
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <div className="font-medium">Uploaded file:</div>
                <div className="text-muted-foreground">
                  {fileInfo.name} ({fileInfo.type}) - {formatFileSize(fileInfo.size)}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' 
                    ? 'Enter the text you want to encode to Base64...' 
                    : 'Enter the Base64 string you want to decode...'
                  }
                  className="font-mono text-sm h-[300px] resize-none"
                />
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button asChild variant="outline" size="sm">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {mode === 'encode' ? 'File' : 'Base64 File'}
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {mode === 'encode' ? 'Base64 Output' : 'Text Output'}
                </label>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder={mode === 'encode' 
                    ? 'Base64 encoded output will appear here...' 
                    : 'Decoded text will appear here...'
                  }
                  className="font-mono text-sm h-[300px] resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm" disabled={!outputText}>
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button onClick={downloadAsFile} variant="outline" size="sm" disabled={!outputText}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-6">
            <div className="prose max-w-none">
              <h3>What is Base64?</h3>
              <p className="text-muted-foreground">
                Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to send binary data over text-based protocols like email or HTTP.
              </p>
              
              <h3>Common Uses for Base64</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Embedding images directly in HTML/CSS via data URLs</li>
                <li>Encoding binary data for transport in JSON</li>
                <li>Encoding email attachments</li>
                <li>Storing complex data in cookies or local storage</li>
                <li>Embedding fonts in web pages</li>
              </ul>
              
              <h3>Benefits</h3>
              <p className="text-muted-foreground">
                Base64 encoding ensures that binary data remains intact without modification during transport over protocols that may otherwise alter non-text data.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md mt-6">
                <p className="text-sm text-muted-foreground">
                  This tool processes all data locally in your browser. Your data is never sent to any server.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default Base64Converter;
