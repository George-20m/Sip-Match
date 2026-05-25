// Client-side wrapper around the local Flask ML recommendation API.
import axios from 'axios';
import { Logger } from '@/src/utils/logger';

const ML_API_URL = process.env.EXPO_PUBLIC_ML_API_URL || 'http://192.168.110.63:3000';

export interface MLRecommendationRequest {
  user_id: string;
  email: string;
  name?: string;
  mood: string;
  song: string | null;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
  weather: {
    temperature: number;
    condition: string;
    humidity: number | null;
  };
  timestamp: string;
  userFavorites?: any[]; // Array of drink objects
}

export interface MLDrinkRecommendation {
  name: string;
  nameArabic: string;
  category: string;
  temperature: string;
  caffeineLevel: string;
  sweetnessLevel: number;
  score: number;
  reasons: string[];
  flavorProfile: string[];
  vegan: boolean;
  intensity: number;
}

export interface MLRecommendationResponse {
  success: boolean;
  recommendations: MLDrinkRecommendation[];
  context: {
    mood: string;
    weather: string;
    temperature: number;
    time_of_day: string;
    has_song: boolean;
  };
  error?: string;
}

export const mlService = {
  /**
   * Get drink recommendations from ML API
   */
  async getRecommendations(
    request: MLRecommendationRequest
  ): Promise<MLRecommendationResponse> {
    try {
      Logger.info(`Sending request to ML API at ${ML_API_URL}`, 'mlService');

      const response = await axios.post<MLRecommendationResponse>(
        `${ML_API_URL}/recommend`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      Logger.success('ML recommendation response received successfully', 'mlService');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error('ML API request failed', 'mlService', {
          message: error.message,
          status: error.response?.status,
          url: `${ML_API_URL}/recommend`,
        });

        // Return error response
        return {
          success: false,
          recommendations: [],
          context: {
            mood: request.mood,
            weather: 'unknown',
            temperature: request.weather.temperature,
            time_of_day: 'unknown',
            has_song: request.song !== null,
          },
          error: error.response?.data?.error || error.message || 'Failed to connect to ML service',
        };
      }

      Logger.error('Unexpected error during ML recommendation request', 'mlService', error);
      return {
        success: false,
        recommendations: [],
        context: {
          mood: request.mood,
          weather: 'unknown',
          temperature: request.weather.temperature,
          time_of_day: 'unknown',
          has_song: request.song !== null,
        },
        error: 'An unexpected error occurred',
      };
    }
  },

  /**
   * Check if ML API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${ML_API_URL}/`, {
        timeout: 5000,
      });
      return response.data.status === 'running' && response.data.model_loaded;
    } catch (error) {
      Logger.error('ML API health check failed', 'mlService', error);
      return false;
    }
  },

  /**
   * Get ML API statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await axios.get(`${ML_API_URL}/stats`);
      return response.data;
    } catch (error) {
      Logger.error('Failed to retrieve ML statistics', 'mlService', error);
      return null;
    }
  },
};