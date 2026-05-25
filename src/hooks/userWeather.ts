import axios from 'axios';
import { useEffect, useState } from 'react';
import { Logger } from '@/src/utils/logger';

interface WeatherData {
  temperature: number | null;
  weatherIcon: string | null;
  condition: string | null;
  isLoading: boolean;
}

let cachedWeather: WeatherData | null = null;
let lastFetchTime = 0;

const ONE_HOUR = 60 * 60 * 1000;

export function useUserWeather(
  latitude: number | null,
  longitude: number | null
): WeatherData {
  const [weather, setWeather] = useState<WeatherData>(
    cachedWeather || {
      temperature: null,
      weatherIcon: null,
      condition: null,
      isLoading: true,
    }
  );

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const now = Date.now();
    // Use cached weather if it's less than an hour old
    if (cachedWeather && now - lastFetchTime < ONE_HOUR) {
      setWeather(cachedWeather);
      return;
    }

    const fetchWeather = async () => {
      setWeather(prev => ({ ...prev, isLoading: true }));
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        const temp = Math.round(response.data.current.temperature_2m);
        const weatherCode = response.data.current.weather_code;

        let condition = 'Clear';
        if (weatherCode >= 61 && weatherCode <= 67) condition = 'Rain';
        else if (weatherCode >= 71 && weatherCode <= 77) condition = 'Snow';
        else if (weatherCode >= 80 && weatherCode <= 82) condition = 'Rain';
        else if (weatherCode >= 51 && weatherCode <= 57) condition = 'Rain';
        else if (weatherCode >= 2 && weatherCode <= 3) condition = 'Cloudy';
        else if (weatherCode >= 95) condition = 'Storm';
        else if (weatherCode >= 45) condition = 'Fog';

        const finalWeather = {
          temperature: temp,
          weatherIcon: getWeatherIcon(condition),
          condition,
          isLoading: false,
        };

        cachedWeather = finalWeather;
        lastFetchTime = now;
        setWeather(finalWeather);
      } catch (error) {
        Logger.error('Failed to fetch weather data', 'userWeather', error);
        setWeather(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return weather;
}

function getWeatherIcon(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return 'weather-sunny';
  if (c.includes('cloud')) return 'weather-cloudy';
  if (c.includes('rain')) return 'weather-rainy';
  if (c.includes('storm')) return 'weather-lightning';
  if (c.includes('snow')) return 'weather-snowy';
  if (c.includes('fog') || c.includes('mist')) return 'weather-fog';
  return 'weather-partly-cloudy';
}