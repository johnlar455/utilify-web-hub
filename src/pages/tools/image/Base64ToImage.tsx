
import React, { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Base64ToImage: React.FC = () => {
  const [base64String, setBase64String] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileNameRef = useRef<string>('converted-image');
  const fileTypeRef = useRef<string>('png');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64String(e.target.value);
    setError('');
  };

  const convertToImage = () => {
    if (!base64String) {
      setError('Please enter a base64 string');
      return;
    }

    try {
      // Try to handle both with and without the data URL prefix
      let formattedBase64 = base64String.trim();
      
      // If it doesn't start with the data URL prefix, try to determine the image type and add the prefix
      if (!formattedBase64.startsWith('data:')) {
        // Try to determine image type from the base64 string
        const signatures: { [key: string]: string } = {
          '/9j/': 'data:image/jpeg;base64,',
          'iVBORw0KGgo': 'data:image/png;base64,',
          'R0lGODlh': 'data:image/gif;base64,',
          'UklGRk': 'data:image/webp;base64,',
          'PD94bWwgdmVyc2lvbj0': 'data:image/svg+xml;base64,',
        };

        let prefix = 'data:image/png;base64,'; // Default to PNG
        for (const [signature, dataUrl] of Object.entries(signatures)) {
          if (formattedBase64.startsWith(signature)) {
            prefix = dataUrl;
            fileTypeRef.current = dataUrl.split('/')[1].split(';')[0];
            break;
          }
        }
        
        formattedBase64 = prefix + formattedBase64;
      } else {
        // Extract file type from the data URL
        const typeMatch = formattedBase64.match(/data:image\/([a-zA-Z0-9]+);base64,/);
        if (typeMatch && typeMatch[1]) {
          fileTypeRef.current = typeMatch[1];
        }
      }
      
      // Validate by creating an image from the base64 string
      const img = new Image();
      img.src = formattedBase64;
      
      img.onload = () => {
        setImageUrl(formattedBase64);
        setError('');
      };
      
      img.onerror = () => {
        setError('Invalid base64 image string');
        setImageUrl('');
      };
      
    } catch (err) {
      setError('Error processing the base64 string');
      setImageUrl('');
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${fileNameRef.current}.${fileTypeRef.current}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully');
  };

  const clearData = () => {
    setBase64String('');
    setImageUrl('');
    setError('');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        // Check if there's an image in the clipboard
        const imageType = clipboardItem.types.find(type => type.startsWith('image/'));
        
        if (imageType) {
          const blob = await clipboardItem.getType(imageType);
          const reader = new FileReader();
          
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
              setBase64String(e.target.result);
            }
          };
          
          reader.readAsDataURL(blob);
          return;
        }
        
        // Check for text (might be a base64 string)
        if (clipboardItem.types.includes('text/plain')) {
          const blob = await clipboardItem.getType('text/plain');
          const text = await blob.text();
          setBase64String(text);
          return;
        }
      }
    } catch (err) {
      // Fallback to the deprecated API if the new one fails
      navigator.clipboard.readText()
        .then(text => {
          setBase64String(text);
        })
        .catch(() => {
          toast.error('Failed to read from clipboard');
        });
    }
  };

  return (
    <ToolLayout
      title="Base64 to Image"
      description="Convert base64 encoded strings back to images"
      category="Image Tools"
      categoryColor="imageTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Paste your base64 string in the input field</li>
          <li>Click "Convert" to generate the image</li>
          <li>Download the converted image</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="base64Input">Base64 Input</Label>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePasteFromClipboard}>
                <Upload className="h-4 w-4 mr-2" />
                Paste
              </Button>
              <Button variant="outline" size="sm" onClick={clearData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            id="base64Input"
            placeholder="Paste your base64 encoded string here..."
            className="min-h-[150px] font-mono text-xs"
            value={base64String}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={convertToImage} disabled={!base64String.trim()}>
            Convert to Image
          </Button>
        </div>
        
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {imageUrl && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Preview</h3>
              <Button onClick={downloadImage}>
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            </div>
            <div className="flex justify-center border p-4 rounded-md bg-muted/30">
              <img
                src={imageUrl}
                alt="Converted from base64"
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default Base64ToImage;
