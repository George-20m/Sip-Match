import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Logger } from '@/src/utils/logger';

interface UserLocationData {
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
}

const fallbackLocation = {
  latitude: 30.0444,
  longitude: 31.2357,
  locationName: 'Cairo, Egypt',
};

let cachedLocation: UserLocationData | null = null;

export function useUserLocation(): UserLocationData {
  const [data, setData] = useState<UserLocationData>(
    cachedLocation || {
      location: null,
      latitude: null,
      longitude: null,
      isLoading: true,
      error: null,
    }
  );

  useEffect(() => {
    // If we already have a cached location and it's not in an error/loading state, don't re-fetch immediately
    if (cachedLocation && !cachedLocation.error && !cachedLocation.isLoading) return;

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          const fallbackData: UserLocationData = {
            location: fallbackLocation.locationName,
            latitude: fallbackLocation.latitude,
            longitude: fallbackLocation.longitude,
            isLoading: false,
            error: null,
          };
          setData(fallbackData);
          cachedLocation = fallbackData;
          return;
        }

        // 1. Try to get last known position first (very fast)
        const lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          const { latitude, longitude } = lastKnown.coords;

          // Set initial coordinates so weather can start loading
          setData(prev => ({
            ...prev,
            latitude,
            longitude,
            location: prev.location || 'Detecting...',
          }));

          // Try to geocode the last known position quickly
          try {
            const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (address) {
              const locationName = address.city || address.district || address.region || 'Unknown';
              setData(prev => ({ ...prev, location: locationName, isLoading: false }));
            }
          } catch (e) {
            Logger.info('Reverse geocoding of last known position failed, awaiting current position', 'userLocation');
          }
        }

        // 2. Get current position (more accurate, but takes time)
        // Using Balanced instead of Highest for a good speed/accuracy trade-off
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = currentLocation.coords;

        // 3. Geocode the current position
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

        let locationName = 'Unknown';
        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          locationName = place.city || place.district || place.region || 'Unknown';
        }

        const finalData: UserLocationData = {
          location: locationName,
          latitude,
          longitude,
          isLoading: false,
          error: null,
        };

        cachedLocation = finalData;
        setData(finalData);
      } catch (error) {
        Logger.error('Failed to retrieve user location', 'userLocation', error);
        const fallbackData: UserLocationData = {
          location: fallbackLocation.locationName,
          latitude: fallbackLocation.latitude,
          longitude: fallbackLocation.longitude,
          isLoading: false,
          error: null,
        };
        setData(fallbackData);
        cachedLocation = fallbackData;
      }
    };

    fetchLocation();
  }, []);

  return data;
}