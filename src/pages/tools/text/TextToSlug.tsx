
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TextToSlug: React.FC = () => {
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const convertToSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    setSlug(convertToSlug(text));
  }, [text]);

  const copyToClipboard = () => {
    if (!slug) return;
    
    navigator.clipboard.writeText(slug)
      .then(() => {
        setIsCopied(true);
        toast.success('Slug copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy slug');
      });
  };

  return (
    <ToolLayout
      title="Text to Slug Converter"
      description="Convert any text to a URL-friendly slug format"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter or paste your text in the input area</li>
          <li>The URL-friendly slug will be generated automatically</li>
          <li>Copy the result to use in your URLs</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Text</label>
          <Textarea
            placeholder="Enter your text here..."
            className="min-h-[120px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Generated Slug</label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              disabled={!slug}
            >
              {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
          </div>
          <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
            {slug || 'Slug will appear here'}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextToSlug;
