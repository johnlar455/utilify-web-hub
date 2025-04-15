
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState<{ [key: number]: boolean }>({});

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUUIDs = () => {
    const newUuids = Array(quantity).fill(0).map(() => generateUUID());
    setUuids(newUuids);
    setIsCopied({});
  };

  const copyToClipboard = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid)
      .then(() => {
        setIsCopied({ ...isCopied, [index]: true });
        toast.success('UUID copied to clipboard');
        setTimeout(() => {
          setIsCopied({ ...isCopied, [index]: false });
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to copy UUID');
      });
  };

  const copyAll = () => {
    const text = uuids.join('\n');
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('All UUIDs copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy UUIDs');
      });
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUIDs (v4)"
      category="Miscellaneous"
      categoryColor="miscTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select how many UUIDs to generate</li>
          <li>Click Generate to create new UUIDs</li>
          <li>Copy individual UUIDs or all at once</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="quantity">Number of UUIDs</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <Button onClick={generateUUIDs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={copyAll}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>

            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="relative">
                  <Input
                    value={uuid}
                    readOnly
                    className="pr-20 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1"
                    onClick={() => copyToClipboard(uuid, index)}
                  >
                    {isCopied[index] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          All UUIDs are generated using the v4 specification (random)
        </div>
      </div>
    </ToolLayout>
  );
};

export default UuidGenerator;
