"""Prediction utilities that load the trained artifacts and score drink matches."""
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


class DrinkPredictor:
    def __init__(self, model_path='model'):
        """Load the trained model and encoders."""
        model_dir = Path(model_path)
        if not model_dir.is_absolute():
            model_dir = Path(__file__).resolve().parent.parent / model_dir

        self.model = joblib.load(model_dir / 'model.pkl')
        self.mood_encoder = joblib.load(model_dir / 'mood_encoder.pkl')
        self.weather_encoder = joblib.load(model_dir / 'weather_encoder.pkl')
        self.caffeine_encoder = joblib.load(model_dir / 'caffeine_encoder.pkl')
        self.temperature_encoder = joblib.load(model_dir / 'temperature_encoder.pkl')
        self.label_encoder = joblib.load(model_dir / 'label_encoder.pkl')
        self.drinks_df = pd.read_pickle(model_dir / 'drinks_df.pkl')

        print(f"Model loaded successfully with {len(self.drinks_df)} drinks")

    def map_weather_condition(self, condition, temperature):
        """Map weather condition to drink-friendly format."""
        condition = condition.lower() if condition else ""

        if temperature >= 25:
            return "hot"
        if temperature >= 18:
            return "warm"
        if temperature >= 10:
            return "cool"
        return "cold"

    def get_time_of_day(self, timestamp):
        """Extract time of day from timestamp."""
        from datetime import datetime

        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            hour = dt.hour

            if 5 <= hour < 12:
                return "morning"
            if 12 <= hour < 17:
                return "afternoon"
            if 17 <= hour < 21:
                return "evening"
            return "night"
        except Exception:
            return "afternoon"

    def predict(self, user_data):
        """Predict drink recommendations based on user data."""
        try:
            mood = user_data.get('mood', 'Happy')
            weather_temp = user_data.get('weather', {}).get('temperature', 20)
            weather_condition = user_data.get('weather', {}).get('condition', 'clear')
            timestamp = user_data.get('timestamp', '')
            song = user_data.get('song')

            weather = self.map_weather_condition(weather_condition, weather_temp)
            time_of_day = self.get_time_of_day(timestamp)

            preferred_temp = 'cold' if weather in ['hot', 'warm'] else 'hot'

            filtered_drinks = self.drinks_df[
                (self.drinks_df['temperature'] == preferred_temp)
                | (self.drinks_df['temperature'] == 'frozen')
            ].copy()

            energy_boost = 'energetic' in mood.lower() or (song is not None)
            recommendations = []

            for _, drink in filtered_drinks.iterrows():
                score = 0

                best_moods = drink.get('bestForMoods', [])
                mood_lower = mood.lower()

                if mood_lower in best_moods:
                    score += 50
                elif any(m in best_moods for m in [mood_lower, 'happy', 'refreshed']):
                    score += 30

                best_weather = drink.get('bestForWeather', [])
                if weather in best_weather or 'any' in best_weather:
                    score += 20

                best_times = drink.get('bestTimeOfDay', [])
                if best_times and time_of_day in best_times:
                    score += 15

                caffeine = drink.get('caffeineLevel', 'none')
                if energy_boost and caffeine in ['high', 'medium']:
                    score += 15
                elif not energy_boost and caffeine in ['low', 'none']:
                    score += 10

                if drink['temperature'] == preferred_temp:
                    score += 10

                if song and drink.get('intensity', 0) >= 3:
                    score += 10

                recommendations.append({
                    'drink': drink.to_dict(),
                    'score': score,
                    'reasons': self._generate_reasons(drink, mood, weather, time_of_day, song),
                })

            recommendations.sort(key=lambda x: x['score'], reverse=True)
            top_recommendations = recommendations[:5]

            return {
                'success': True,
                'recommendations': [
                    {
                        'name': rec['drink']['name'],
                        'nameArabic': rec['drink'].get('nameArabic', ''),
                        'category': rec['drink'].get('category', ''),
                        'temperature': rec['drink'].get('temperature', ''),
                        'caffeineLevel': rec['drink'].get('caffeineLevel', ''),
                        'sweetnessLevel': rec['drink'].get('sweetnessLevel', 0),
                        'score': rec['score'],
                        'reasons': rec['reasons'],
                        'flavorProfile': rec['drink'].get('flavorProfile', []),
                        'vegan': rec['drink'].get('vegan', False),
                        'intensity': rec['drink'].get('intensity', 3),
                    }
                    for rec in top_recommendations
                ],
                'context': {
                    'mood': mood,
                    'weather': weather,
                    'temperature': weather_temp,
                    'time_of_day': time_of_day,
                    'has_song': song is not None,
                },
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'recommendations': [],
            }

    def _generate_reasons(self, drink, mood, weather, time_of_day, song):
        """Generate human-readable reasons for recommendation."""
        reasons = []

        best_moods = drink.get('bestForMoods', [])
        if mood.lower() in best_moods:
            reasons.append(f"Perfect for your {mood.lower()} mood")

        if weather in drink.get('bestForWeather', []):
            reasons.append(f"Great for {weather} weather")

        if time_of_day in drink.get('bestTimeOfDay', []):
            reasons.append(f"Ideal for {time_of_day}")

        if song:
            reasons.append("Matches your music energy")

        flavors = drink.get('flavorProfile', [])
        if flavors:
            reasons.append(f"Features {', '.join(flavors[:2])} notes")

        return reasons[:3]
