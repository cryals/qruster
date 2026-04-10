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
    if (!url || url.trim().length === 0) {
      throw new Error('URL is required');
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }

    try {
      const response = await axios.post<ExtractResponse>(`${API_BASE_URL}/extract`, { url: url.trim() });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async download(request: DownloadRequest): Promise<DownloadResponse> {
    if (!request.url || request.url.trim().length === 0) {
      throw new Error('URL is required');
    }

    if (!request.format || request.format.trim().length === 0) {
      throw new Error('Format is required');
    }

    try {
      const response = await axios.post<DownloadResponse>(`${API_BASE_URL}/download`, {
        ...request,
        url: request.url.trim(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async getFormats(url: string): Promise<FormatsResponse> {
    if (!url || url.trim().length === 0) {
      throw new Error('URL is required');
    }

    try {
      const response = await axios.get<FormatsResponse>(`${API_BASE_URL}/formats`, {
        params: { url: url.trim() },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async health(): Promise<{ status: string; version: string; uptime: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Backend service is unavailable');
      }
      throw error;
    }
  },
};
