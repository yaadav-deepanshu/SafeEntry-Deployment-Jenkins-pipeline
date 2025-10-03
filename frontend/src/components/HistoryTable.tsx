import { Calendar, Target, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetectionResult {
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  imageUrl: string;
}

interface HistoryTableProps {
  history: DetectionResult[];
}

const HistoryTable = ({ history }: HistoryTableProps) => {
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
          <Calendar className="w-8 h-8 text-foreground-muted" />
        </div>
        <p className="text-foreground-muted">No detections yet</p>
        <p className="text-sm text-foreground-muted">
          Upload an image to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {history.map((item, index) => (
        <div
          key={`${item.timestamp.getTime()}-${index}`}
          className="glass rounded-lg p-3 glass-hover transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            {/* Image Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={item.imageUrl}
                alt="Detection"
                className="w-12 h-12 rounded-lg object-cover border border-glass-border"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm font-semibold truncate">
                  {item.plateNumber}
                </span>
                <span className="text-xs text-foreground-muted flex-shrink-0">
                  {formatTime(item.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-foreground-muted">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{formatConfidence(item.confidence)}</span>
                </div>
                
                {/* Confidence Indicator */}
                <div className="flex-1 bg-background-tertiary rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      item.confidence >= 0.9 ? 'bg-success' :
                      item.confidence >= 0.8 ? 'bg-neon-green' :
                      item.confidence >= 0.7 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${item.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* View All Button */}
      {history.length >= 5 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full glass glass-hover mt-4"
        >
          View All History
        </Button>
      )}
    </div>
  );
};

export default HistoryTable;