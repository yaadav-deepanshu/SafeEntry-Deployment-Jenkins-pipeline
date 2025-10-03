// src/pages/Analytics.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStats, getHistory } from '@/services/api';
import { StatsResponse, PlateHistoryItem } from '@/types/api';
import { BarChart3, TrendingUp, Clock, Calendar } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [history, setHistory] = useState<PlateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        getStats(),
        getHistory(100)
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_records || 0}</div>
              <p className="text-xs text-muted-foreground">All-time recognitions</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Records</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.today_records || 0}</div>
              <p className="text-xs text-muted-foreground">Recognitions today</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.most_recent.plate || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.most_recent.timestamp ? 
                  new Date(stats.most_recent.timestamp).toLocaleDateString() : 
                  'No recent activity'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Recognition Statistics
            </CardTitle>
            <CardDescription>
              Overview of license plate recognition activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Total Recognitions</h4>
                <p className="text-3xl font-bold text-primary">{stats?.total_records || 0}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Today's Recognitions</h4>
                <p className="text-3xl font-bold text-secondary">{stats?.today_records || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;