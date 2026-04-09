import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ExtractRequest {
  url: string;
}

export interface ExtractResponse {
  platform: string;
  title: string;
  duration?: number;
  thumbnail?: string;
  formats: FormatInfo[];
}

export interface FormatInfo {
  format_id: string;
  quality: string;
  ext: string;
  filesize?: number;
}

export interface DownloadRequest {
  url: string;
  format: string;
  quality?: string;
  audio_only?: boolean;
}

export interface DownloadResponse {
  download_url: string;
  expires_at: string;
}

export interface FormatsResponse {
  video: string[];
  audio: string[];
  video_formats: string[];
}

export const api = {
  async extract(url: string): Promise<ExtractResponse> {
    const response = await axios.post<ExtractResponse>(`${API_BASE_URL}/extract`, { url });
    return response.data;
  },

  async download(request: DownloadRequest): Promise<DownloadResponse> {
    const response = await axios.post<DownloadResponse>(`${API_BASE_URL}/download`, request);
    return response.data;
  },

  async getFormats(url: string): Promise<FormatsResponse> {
    const response = await axios.get<FormatsResponse>(`${API_BASE_URL}/formats`, {
      params: { url },
    });
    return response.data;
  },

  async health(): Promise<{ status: string; version: string; uptime: number }> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
};
