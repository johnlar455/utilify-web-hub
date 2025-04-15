
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
}

const ColorConverter: React.FC = () => {
  const [color, setColor] = useState<ColorValues>({
    hex: '#000000',
    rgb: 'rgb(0, 0, 0)',
    hsl: 'hsl(0, 0%, 0%)',
  });

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHsl = (rgb: string): string => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return 'hsl(0, 0%, 0%)';

    let r = parseInt(match[1]) / 255;
    let g = parseInt(match[2]) / 255;
    let b = parseInt(match[3]) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleHexChange = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb);
      setColor({ hex, rgb, hsl });
    }
  };

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB, and HSL formats"
      category="Converters"
      categoryColor="converterTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter a color in HEX format (#RRGGBB)</li>
          <li>See the conversions in RGB and HSL</li>
          <li>Preview the color in real-time</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="colorPicker">Color Picker</Label>
                <div className="flex gap-4">
                  <Input
                    type="color"
                    id="colorPicker"
                    value={color.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={color.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label>RGB</Label>
                <Input
                  type="text"
                  value={color.rgb}
                  readOnly
                  className="font-mono"
                />
              </div>

              <div>
                <Label>HSL</Label>
                <Input
                  type="text"
                  value={color.hsl}
                  readOnly
                  className="font-mono"
                />
              </div>

              <div className="h-24 rounded-md border" style={{ backgroundColor: color.hex }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ColorConverter;
