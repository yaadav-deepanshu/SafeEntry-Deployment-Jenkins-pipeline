import { Scan, Cpu, Zap } from "lucide-react";

const LoadingScanner = () => {
  return (
    <div className="text-center space-y-6">
      {/* Main Scanner Animation */}
      <div className="relative mx-auto w-32 h-32">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        
        {/* Rotating Scanner */}
        <div className="absolute inset-2 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        
        {/* Inner Core */}
        <div className="absolute inset-6 glass rounded-full flex items-center justify-center">
          <Scan className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        {/* Scanning Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-neon-purple rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-neon-green rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-neon-pink rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Status Text */}
      <div className="space-y-3">
        <h3 className="text-2xl font-futuristic gradient-text">
          AI Processing
        </h3>
        <p className="text-foreground-muted">
          Analyzing image for license plates...
        </p>
      </div>

      {/* Processing Steps */}
      <div className="glass rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Image preprocessing complete</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span>Running AI detection model</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span>Extracting text from regions</span>
        </div>
        <div className="flex items-center gap-3 text-sm opacity-50">
          <div className="w-2 h-2 bg-foreground-muted rounded-full" />
          <span>Validating results...</span>
        </div>
      </div>

      {/* Tech Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="glass rounded-lg p-3">
          <Cpu className="w-6 h-6 text-primary mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-foreground-muted">Neural Network</p>
          <p className="font-mono text-sm">Active</p>
        </div>
        <div className="glass rounded-lg p-3">
          <Zap className="w-6 h-6 text-neon-green mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-foreground-muted">Processing</p>
          <p className="font-mono text-sm">87%</p>
        </div>
        <div className="glass rounded-lg p-3">
          <Scan className="w-6 h-6 text-neon-purple mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-foreground-muted">Confidence</p>
          <p className="font-mono text-sm">High</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScanner;