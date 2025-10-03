import { useState } from "react";
import { Settings as SettingsIcon, Save, RotateCcw, Bell, Shield, Zap, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    confidenceThreshold: [0.7],
    autoSave: true,
    notifications: true,
    soundAlerts: false,
    maxHistory: "100",
    processingQuality: "high",
    enableAnalytics: true,
    darkMode: true,
    apiTimeout: [5000],
    retryAttempts: [3]
  });

  const handleSave = () => {
    localStorage.setItem('anpr-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      confidenceThreshold: [0.7],
      autoSave: true,
      notifications: true,
      soundAlerts: false,
      maxHistory: "100",
      processingQuality: "high",
      enableAnalytics: true,
      darkMode: true,
      apiTimeout: [5000],
      retryAttempts: [3]
    };
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Configure your ANPR system preferences and performance parameters
            </p>
          </div>

          {/* Detection Settings */}
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Detection Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="confidence">
                  Confidence Threshold: {settings.confidenceThreshold[0]}
                </Label>
                <Slider
                  id="confidence"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={settings.confidenceThreshold}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, confidenceThreshold: value }))}
                  className="flex-1"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum confidence level required to accept plate detections
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="quality">Processing Quality</Label>
                  <p className="text-sm text-muted-foreground">
                    Higher quality improves accuracy but increases processing time
                  </p>
                </div>
                <Select
                  value={settings.processingQuality}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, processingQuality: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="timeout">
                  API Timeout: {settings.apiTimeout[0]}ms
                </Label>
                <Slider
                  id="timeout"
                  min={1000}
                  max={10000}
                  step={500}
                  value={settings.apiTimeout}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, apiTimeout: value }))}
                  className="flex-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="retries">
                  Retry Attempts: {settings.retryAttempts[0]}
                </Label>
                <Slider
                  id="retries"
                  min={1}
                  max={5}
                  step={1}
                  value={settings.retryAttempts}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, retryAttempts: value }))}
                  className="flex-1"
                />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold">Data Management</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maxHistory">Maximum History Records</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit the number of stored detection records
                  </p>
                </div>
                <Select
                  value={settings.maxHistory}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, maxHistory: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autoSave">Auto-save Detections</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save successful detections to history
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="analytics">Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Collect usage statistics and performance metrics
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAnalytics: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for successful detections
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sounds">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play audio alerts for detection events
                  </p>
                </div>
                <Switch
                  id="sounds"
                  checked={settings.soundAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundAlerts: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;