import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  isScanning: boolean;
}

const ImageUpload = ({ onImageUpload, uploadedImage, isScanning }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileSelect(e as any);
    input.click();
  }, [handleFileSelect]);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`upload-zone cursor-pointer ${isDragging ? 'dragging' : ''} ${isScanning ? 'opacity-75 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isScanning ? handleClick : undefined}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full glass flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary animate-float" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {isDragging ? 'Drop image here' : 'Upload Vehicle Image'}
            </h3>
            <p className="text-foreground-muted">
              Drag & drop an image or click to browse
            </p>
            <p className="text-sm text-foreground-muted mt-1">
              Supports JPG, PNG, WebP (Max 10MB)
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="glass glass-hover"
            disabled={isScanning}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        </div>
      </div>

      {/* Image Preview */}
      {uploadedImage && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded vehicle"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-foreground font-semibold">Analyzing...</p>
                </div>
              </div>
            )}
            
            {/* Scan Line Effect */}
            {isScanning && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              </div>
            )}
          </div>
          
          <div className="p-4 bg-gradient-to-r from-background/80 to-background-secondary/80">
            <p className="text-sm text-foreground-muted">
              Image uploaded successfully • Ready for analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;