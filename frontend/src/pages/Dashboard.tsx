import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scan, Upload, Camera, AlertCircle } from 'lucide-react';
import { recognizePlate } from '@/services/api';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const response = await recognizePlate(selectedFile);
      setResult(response);
    } catch (error) {
      console.error('Failed to process image:', error);
      setResult({
        success: false,
        error: 'Failed to process image. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-6 h-6" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Upload an image containing a license plate for recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Drag & drop an image here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports JPG, PNG, JPEG
                </p>
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {previewUrl && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Preview</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSelection}
                    >
                      Clear
                    </Button>
                  </div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 rounded-lg max-h-64 object-contain mx-auto border"
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleProcessImage}
                disabled={!selectedFile || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Recognize Plate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recognition Results</CardTitle>
              <CardDescription>
                License plate recognition results will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {result.error ? (
                    <div className="bg-destructive/15 text-destructive p-4 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <p>{result.error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Plate Number</Label>
                          <p className="text-2xl font-bold text-primary">
                            {result.plate_number || 'Not detected'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Confidence</Label>
                          <p className="text-2xl font-bold">
                            {result.confidence ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                          </p>
                          {result.confidence && result.confidence < 50 && (
                            <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              Low confidence result
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground">Timestamp</Label>
                        <p>{new Date(result.timestamp).toLocaleString()}</p>
                      </div>

                      {result.processing_time && (
                        <div>
                          <Label className="text-muted-foreground">Processing Time</Label>
                          <p>{result.processing_time.toFixed(2)} seconds</p>
                        </div>
                      )}

                      {result.image_path && (
                        <div>
                          <Label className="text-muted-foreground">Processed Plate</Label>
                          <img
                            src={`http://localhost:8000${result.image_path}`}
                            alt="Processed plate"
                            className="mt-2 rounded-lg max-h-48 object-contain border"
                          />
                        </div>
                      )}

                      {result.success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 font-medium flex items-center gap-2">
                            <Scan className="w-4 h-4" />
                            Plate successfully recognized and saved to database!
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use clear, well-lit images of license plates</li>
              <li>• Ensure the plate is facing directly towards the camera</li>
              <li>• Avoid extreme angles or glare on the plate</li>
              <li>• Higher resolution images work better</li>
              <li>• Make sure the entire plate is visible in the image</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;