import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getHistory } from '@/services/api';
import { PlateHistoryItem } from '@/types/api';
import { History, Calendar, Hash, AlertCircle } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState<PlateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted component
    
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory(50);
        if (isMounted) {
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        if (isMounted) {
          setError('Failed to load history. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs only once

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center text-destructive">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-6 h-6" />
              Recognition History
            </CardTitle>
            <CardDescription>
              Recent license plate recognition results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate Number</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Image</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono font-bold">{item.number}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              item.confidence && item.confidence > 80 
                                ? "default" 
                                : item.confidence && item.confidence > 50 
                                ? "secondary" 
                                : "outline"
                            }
                          >
                            {item.confidence ? `${item.confidence.toFixed(1)}%` : 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.image_path ? (
                            <img
                              src={`http://localhost:8000${item.image_path}`}
                              alt="Detected plate"
                              className="w-16 h-12 object-cover rounded border"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">No image</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recognition history yet</p>
                <p className="text-sm mt-2">Process some images to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;