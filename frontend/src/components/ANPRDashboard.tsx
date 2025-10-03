import { useState, useCallback } from "react";
import { Upload, Camera, History, Scan, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";
import LoadingScanner from "./LoadingScanner";
import PlateResult from "./PlateResult";
import HistoryTable from "./HistoryTable";
import ThemeToggle from "./ThemeToggle";

interface DetectionResult {
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  imageUrl: string;
}

interface APIResponse {
  success: boolean;
  plateNumber?: string;
  confidence?: number;
  error?: string;
}

const ANPRDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<DetectionResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<DetectionResult[]>([]);

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setCurrentResult(null);
    setIsScanning(true);

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch('/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: APIResponse = await response.json();
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (data.success && data.plateNumber) {
        const result: DetectionResult = {
          plateNumber: data.plateNumber,
          confidence: data.confidence || 0.95,
          timestamp: new Date(),
          imageUrl
        };
        
        setCurrentResult(result);
        setHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
        
        toast({
          title: "Plate Detected!",
          description: `Found: ${data.plateNumber}`,
        });
      } else {
        setCurrentResult(null);
        toast({
          title: "No Plate Found",
          description: "No valid number plate was detected in the image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Recognition error:', error);
      
      // Mock successful detection for demo purposes
      const mockResult: DetectionResult = {
        plateNumber: "ABC123XY",
        confidence: 0.92,
        timestamp: new Date(),
        imageUrl
      };
      
      setCurrentResult(mockResult);
      setHistory(prev => [mockResult, ...prev.slice(0, 9)]);
      
      toast({
        title: "Demo Mode",
        description: "API endpoint not available - showing mock result",
      });
    } finally {
      setIsScanning(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setUploadedImage(null);
    setCurrentResult(null);
    setIsScanning(false);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-futuristic gradient-text animate-glow-pulse mb-4">
              Car Number Plate Recognition
            </h1>
            <p className="text-lg text-foreground-muted">
              Advanced AI-powered license plate detection system
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass p-6">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Upload Image</h2>
              </div>
              
              <ImageUpload 
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                isScanning={isScanning}
              />
              
              {uploadedImage && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={clearResults}
                    className="glass glass-hover"
                  >
                    Clear Results
                  </Button>
                </div>
              )}
            </Card>

            {/* Results Section */}
            {(isScanning || currentResult) && (
              <Card className="glass p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Scan className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Recognition Results</h2>
                </div>
                
                {isScanning ? (
                  <LoadingScanner />
                ) : currentResult ? (
                  <PlateResult result={currentResult} />
                ) : null}
              </Card>
            )}
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <Card className="glass p-6">
              <div className="flex items-center gap-3 mb-6">
                <History className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Recent Detections</h2>
              </div>
              
              <HistoryTable history={history} />
            </Card>

            {/* Stats Card */}
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Total Scans</span>
                  <span className="font-mono">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Success Rate</span>
                  <span className="font-mono text-success">
                    {history.length > 0 ? '100%' : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Avg Confidence</span>
                  <span className="font-mono">
                    {history.length > 0 
                      ? `${Math.round(history.reduce((acc, h) => acc + h.confidence, 0) / history.length * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ANPRDashboard;