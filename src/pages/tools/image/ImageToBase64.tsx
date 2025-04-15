
import React, { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Upload, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ImageToBase64: React.FC = () => {
  const [base64String, setBase64String] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64String(result);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (!base64String) return;
    
    navigator.clipboard.writeText(base64String)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout
      title="Image to Base64"
      description="Convert images to base64 encoded strings"
      category="Image Tools"
      categoryColor="imageTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select an image file using the upload button</li>
          <li>The base64 string will be generated automatically</li>
          <li>Copy the result to use it in your code</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/30">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Select Image
          </Button>

          {fileName && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>File: {fileName}</p>
              <p>Type: {fileType}</p>
              <p>Size: {formatFileSize(fileSize)}</p>
            </div>
          )}
        </div>

        {base64String && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Base64 Output</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
              >
                {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <Textarea
              value={base64String}
              readOnly
              className="font-mono text-sm h-[200px]"
            />
            <img
              src={base64String}
              alt="Preview"
              className="max-h-[200px] object-contain mx-auto border rounded"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageToBase64;
