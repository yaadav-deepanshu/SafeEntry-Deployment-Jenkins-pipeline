// src/services/api.ts

// ========================
// Interfaces (Types)
// ========================
export interface PlateRecognitionResponse {
  success: boolean;
  plate_number: string;
  timestamp: string;
  confidence?: number;
  processing_time?: number;
  error?: string;
  image_url?: string; // added for frontend preview
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

export interface HealthCheckResponse {
  status: string;
  message: string;
  version?: string;
}

// ========================
// API Config
// ========================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Custom error wrapper
export class ApiError extends Error {
  constructor(
    public status: number,
    public info?: any,
    message: string = "API Request Failed"
  ) {
    super(message);
  }
}

// ========================
// API Functions
// ========================

/**
 * Uploads an image and runs ANPR recognition
 */
export const recognizePlate = async (
  imageFile: File
): Promise<PlateRecognitionResponse> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(`${API_BASE_URL}/recognize/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text(), "ANPR failed");
  }

  return response.json();
};

/**
 * Fetch recognition history
 */
export const getHistory = async (
  limit: number = 100
): Promise<PlateHistoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);

  if (!response.ok) {
    throw new ApiError(response.status, await response.text(), "History fetch failed");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/**
 * Fetch system stats (total/today count, latest plate)
 */
export const getStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/stats`);

  if (!response.ok) {
    throw new ApiError(response.status, await response.text(), "Stats fetch failed");
  }

  return response.json();
};

/**
 * Health check for backend
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new ApiError(response.status, await response.text(), "Health check failed");
  }

  return response.json();
};
