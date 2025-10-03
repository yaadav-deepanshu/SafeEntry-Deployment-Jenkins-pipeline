import { CheckCircle, Copy, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DetectionResult {
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  imageUrl: string;
}

interface PlateResultProps {
  result: DetectionResult;
}

const PlateResult = ({ result }: PlateResultProps) => {
  const handleCopyPlate = () => {
    navigator.clipboard.writeText(result.plateNumber);
    toast({
      title: "Copied!",
      description: "Plate number copied to clipboard",
    });
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-full glass flex items-center justify-center glow-success">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-2xl font-futuristic text-success">
          Plate Detected Successfully!
        </h3>
      </div>

      {/* Main Result Card */}
      <div className="glass rounded-xl p-6 border-2 border-success/30 glow-success">
        <div className="text-center space-y-4">
          <p className="text-sm text-foreground-muted uppercase tracking-wider">
            License Plate Number
          </p>
          
          {/* Plate Number Display */}
          <div className="relative">
            <div className="bg-gradient-to-r from-background-secondary to-background-tertiary rounded-lg p-6 border-2 border-success/50">
              <span className="text-4xl md:text-5xl font-mono font-bold gradient-text tracking-wider">
                {result.plateNumber}
              </span>
            </div>
            
            {/* Copy Button */}
            <Button
              size="sm"
              variant="outline"
              className="absolute -top-2 -right-2 glass glass-hover"
              onClick={handleCopyPlate}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Confidence Score</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Accuracy</span>
              <span className="font-mono text-success font-bold">
                {formatConfidence(result.confidence)}
              </span>
            </div>
            
            {/* Confidence Bar */}
            <div className="w-full bg-background-tertiary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success to-neon-green h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            
            <p className="text-xs text-foreground-muted">
              {result.confidence >= 0.9 ? 'Excellent' : 
               result.confidence >= 0.8 ? 'Very Good' : 
               result.confidence >= 0.7 ? 'Good' : 'Fair'} detection quality
            </p>
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Detection Time</h4>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-sm">
              {formatTimestamp(result.timestamp)}
            </p>
            <p className="text-xs text-foreground-muted">
              Processing completed
            </p>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="glass rounded-lg p-4 border border-primary/20">
        <h4 className="font-semibold mb-3 text-primary">Technical Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-foreground-muted">Model</p>
            <p className="font-mono text-sm">YOLOv8n</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Processing</p>
            <p className="font-mono text-sm">2.1s</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Region</p>
            <p className="font-mono text-sm">Detected</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Format</p>
            <p className="font-mono text-sm">Standard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateResult;