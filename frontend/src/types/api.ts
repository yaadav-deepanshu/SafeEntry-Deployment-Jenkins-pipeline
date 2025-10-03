// src/types/api.ts

export interface PlateRecognitionResponse {
  success: boolean;
  plate_number: string;
  timestamp: string;
  confidence?: number;
  processing_time?: number;
  error?: string;
}

export interface PlateHistoryItem {
  id: number;
  number: string;
  timestamp: string;
  image_path?: string;
  confidence?: number;
}

export interface StatsResponse {
  total_records: number;
  today_records: number;
  most_recent: {
    plate: string | null;
    timestamp: string | null;
  };
}