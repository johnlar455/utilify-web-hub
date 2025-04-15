
import React, { useState, useRef, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';

const ImageResizer: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [resizedImageUrl, setResizedImageUrl] = useState<string>('');
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resizedImageUrl) URL.revokeObjectURL(resizedImageUrl);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Clean up previous URLs
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resizedImageUrl) URL.revokeObjectURL(resizedImageUrl);
      
      setOriginalImage(file);
      setOriginalSize(file.size);
      
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value[0]);
  };

  const resizeImage = () => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Cleanup previous URL
            if (resizedImageUrl) URL.revokeObjectURL(resizedImageUrl);
            
            const url = URL.createObjectURL(blob);
            setResizedImageUrl(url);
            setResizedSize(blob.size);
          }
        },
        originalImage.type,
        quality / 100
      );
    };
    img.src = imageUrl;
  };

  const downloadImage = () => {
    if (!resizedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = resizedImageUrl;
    
    // Generate filename
    const originalName = originalImage?.name || 'image';
    const extension = originalName.split('.').pop();
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    
    link.download = `${baseName}-${width}x${height}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resizedImageUrl) URL.revokeObjectURL(resizedImageUrl);
    
    setOriginalImage(null);
    setImageUrl('');
    setResizedImageUrl('');
    setOriginalDimensions({ width: 0, height: 0 });
    setWidth(0);
    setHeight(0);
    setResizedSize(0);
    setOriginalSize(0);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculatedReduction = originalSize > 0 && resizedSize > 0 
    ? Math.round((1 - resizedSize / originalSize) * 100) 
    : 0;

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize and compress your images with live preview"
      category="Image Tools"
      categoryColor="imageTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Upload an image using the button below</li>
          <li>Adjust dimensions and quality settings</li>
          <li>Click "Resize" to process the image</li>
          <li>Download the resized image</li>
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
          
          {!imageUrl ? (
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Upload an image to resize</h3>
              <p className="text-sm text-muted-foreground mb-4">Supports JPG, PNG, WebP, and GIF formats</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">{originalImage?.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Original: {originalDimensions.width} × {originalDimensions.height}px ({formatFileSize(originalSize)})
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearImage}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              <Tabs defaultValue="resize" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="resize">Resize</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resize" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="maintainAspectRatio">Maintain aspect ratio</Label>
                        </div>
                        <Switch
                          id="maintainAspectRatio" 
                          checked={maintainAspectRatio}
                          onCheckedChange={setMaintainAspectRatio}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={handleHeightChange}
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="quality">Quality: {quality}%</Label>
                        </div>
                        <Slider
                          id="quality"
                          min={1}
                          max={100}
                          step={1}
                          value={[quality]}
                          onValueChange={handleQualityChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="relative mx-auto border bg-card shadow-sm rounded overflow-hidden" style={{ maxWidth: '100%', maxHeight: '200px' }}>
                        <img 
                          src={imageUrl} 
                          alt="Original"
                          className="object-contain max-h-[200px] mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button onClick={resizeImage}>Resize Image</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="py-4">
                  {resizedImageUrl ? (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="border p-2 rounded bg-card">
                          <div className="text-xs text-center mb-2 font-medium">Original</div>
                          <img 
                            src={imageUrl} 
                            alt="Original"
                            className="max-h-[200px] object-contain mx-auto"
                          />
                          <div className="text-xs text-center mt-2 text-muted-foreground">
                            {originalDimensions.width} × {originalDimensions.height}px
                            <br />
                            {formatFileSize(originalSize)}
                          </div>
                        </div>
                        
                        <div className="border p-2 rounded bg-card">
                          <div className="text-xs text-center mb-2 font-medium">Resized</div>
                          <img 
                            src={resizedImageUrl} 
                            alt="Resized"
                            className="max-h-[200px] object-contain mx-auto"
                          />
                          <div className="text-xs text-center mt-2 text-muted-foreground">
                            {width} × {height}px
                            <br />
                            {formatFileSize(resizedSize)}
                          </div>
                        </div>
                      </div>
                      
                      {calculatedReduction > 0 && (
                        <div className="bg-muted/50 p-3 rounded text-center text-sm">
                          File size reduced by <span className="font-medium">{calculatedReduction}%</span>
                        </div>
                      )}
                      
                      <div className="flex justify-center mt-4">
                        <Button onClick={downloadImage}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Resized Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Resize an image to see the preview</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          All processing happens in your browser. Your images are never uploaded to any server.
        </div>
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </ToolLayout>
  );
};

export default ImageResizer;
