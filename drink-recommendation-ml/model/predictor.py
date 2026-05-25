"""Prediction utilities that load the trained artifacts and score drink matches."""
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from collections import Counter

# ANSI color codes for terminal output
COLORS = {
    'HEADER': '\033[95m',
    'BLUE': '\033[94m',      # Info
    'GREEN': '\033[92m',     # Success
    'YELLOW': '\033[93m',    # Warning
    'RED': '\033[91m',       # Error
    'ENDC': '\033[0m',       # Reset
    'BOLD': '\033[1m',
    'UNDERLINE': '\033[4m'
}


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

        print(f"{COLORS['GREEN']}Model loaded successfully with {len(self.drinks_df)} drinks{COLORS['ENDC']}")

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

    def build_user_taste_profile(self, favorite_drinks):
        if not favorite_drinks:
            return None   # No profile for cold-start users

        # Temperature preference: find the most common temperature value
        # among favorite drinks. Ignore drinks with temperature == "any".
        temps = [d.get('temperature') for d in favorite_drinks
                 if d.get('temperature') and d.get('temperature') != 'any']
        preferred_temp = max(set(temps), key=temps.count) if temps else None

        # Sweetness preference: average sweetnessLevel (0-10 number)
        sweetness_vals = [d.get('sweetnessLevel', 5) for d in favorite_drinks
                          if d.get('sweetnessLevel') is not None]
        avg_sweetness = sum(sweetness_vals) / len(sweetness_vals) if sweetness_vals else 5.0

        # Intensity preference: average intensity (1-5 number)
        intensity_vals = [d.get('intensity', 3) for d in favorite_drinks
                          if d.get('intensity') is not None]
        avg_intensity = sum(intensity_vals) / len(intensity_vals) if intensity_vals else 3.0

        # Caffeine preference: most common caffeineLevel string
        caffeine_vals = [d.get('caffeineLevel', 'none') for d in favorite_drinks
                         if d.get('caffeineLevel')]
        preferred_caffeine = max(set(caffeine_vals), key=caffeine_vals.count) if caffeine_vals else None

        # Flavor tags: collect all flavorProfile strings from all favorites,
        # count occurrences, keep only those appearing 2+ times as "strong" tags,
        # keep all as "all" tags
        all_flavor_tags = []
        for d in favorite_drinks:
            all_flavor_tags.extend(d.get('flavorProfile', []))
        flavor_counts = Counter(all_flavor_tags)
        strong_flavor_tags = {tag for tag, count in flavor_counts.items() if count >= 2}

        return {
            'preferred_temp': preferred_temp,
            'avg_sweetness': avg_sweetness,
            'avg_intensity': avg_intensity,
            'preferred_caffeine': preferred_caffeine,
            'strong_flavor_tags': strong_flavor_tags,
            'all_flavor_tags': set(all_flavor_tags),
            'has_profile': True,
            'favorites_count': len(favorite_drinks)
        }

    def compute_taste_match_score(self, drink, profile):
        if not profile:
            return 0   # Cold-start: no bonus, no penalty

        bonus = 0

        # Temperature match:
        # If the user has a preferred_temp and this drink matches it → +30
        # If the user has a preferred_temp and this drink is "any" → +10
        # If the user has a preferred_temp and this drink does NOT match → -20
        # (This replaces the hard-coded hot/cold weather filter)
        drink_temp = drink.get('temperature', 'any')
        pref_temp = profile.get('preferred_temp')
        if pref_temp:
            if drink_temp == pref_temp:
                bonus += 30
            elif drink_temp == 'any':
                bonus += 10
            else:
                bonus -= 20

        # Sweetness match:
        # Compare drink's sweetnessLevel to user's avg_sweetness
        # If within 2 points difference → +15
        # If within 4 points difference → +8
        # If more than 4 points different → 0 (no penalty, just no bonus)
        drink_sweetness = drink.get('sweetnessLevel', 5)
        diff = abs(drink_sweetness - profile['avg_sweetness'])
        if diff <= 2:
            bonus += 15
        elif diff <= 4:
            bonus += 8

        # Intensity match:
        # Compare drink's intensity to user's avg_intensity
        # If within 1 → +10
        # If within 2 → +5
        drink_intensity = drink.get('intensity', 3)
        diff_i = abs(drink_intensity - profile['avg_intensity'])
        if diff_i <= 1:
            bonus += 10
        elif diff_i <= 2:
            bonus += 5

        # Caffeine match:
        # If drink's caffeineLevel matches user's preferred_caffeine → +15
        pref_caff = profile.get('preferred_caffeine')
        if pref_caff and drink.get('caffeineLevel') == pref_caff:
            bonus += 15

        # Flavor profile match:
        # If drink shares any tag with user's strong_flavor_tags → +12 per matching tag (max +24)
        # If drink shares any tag with user's all_flavor_tags → +5 per matching tag (max +10)
        drink_flavors = set(drink.get('flavorProfile', []))
        strong_matches = drink_flavors & profile.get('strong_flavor_tags', set())
        all_matches = drink_flavors & profile.get('all_flavor_tags', set())
        bonus += min(len(strong_matches) * 12, 24)
        bonus += min(len(all_matches) * 5, 10)

        return bonus

    def predict(self, user_data, user_favorites=None):
        """Predict drink recommendations based on user data."""
        try:
            mood = user_data.get('mood', 'Happy')
            weather_temp = user_data.get('weather', {}).get('temperature', 20)
            weather_condition = user_data.get('weather', {}).get('condition', 'clear')
            timestamp = user_data.get('timestamp', '')
            song = user_data.get('song')

            weather = self.map_weather_condition(weather_condition, weather_temp)
            time_of_day = self.get_time_of_day(timestamp)

            # Build the user taste profile
            profile = self.build_user_taste_profile(user_favorites or [])

            # Use ALL drinks (no hard-coded temperature filter)
            all_drinks = self.drinks_df.copy()

            energy_boost = 'energetic' in mood.lower() or (song is not None)
            recommendations = []

            count = 0
            for _, drink in all_drinks.iterrows():
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

                # Context score for temperature match (removed hard-coded filter, but we keep a small bonus for matching preferred_temp if profile exists)
                # Note: The original code had a bonus for matching preferred_temp (line 116 in old code) but we removed the filter.
                # We'll keep a small bonus for temperature match via the taste match score? Actually, the taste match score already handles temperature.
                # We do not add any temperature-based score here; it's entirely in the taste match score.
                # However, the original context scoring did not include temperature match beyond the filter.
                # We will not add any temperature-based score in the context score.

                if song and drink.get('intensity', 0) >= 3:
                    score += 10

                # Add taste match bonus
                taste_bonus = self.compute_taste_match_score(drink.to_dict(), profile)
                score += taste_bonus

                # Generate reasons
                reasons = self._generate_reasons(drink, mood, weather, time_of_day, song)
                # Add personalized reason if profile exists and taste_bonus is significant
                if profile is not None and taste_bonus >= 20:
                    reasons.append("Matches your taste preferences")
                # Limit to top 3 reasons
                reasons = reasons[:3]

                if count < 5:
                    print(f"Drink {drink.get('name')}: score={score}")
                    count += 1

                recommendations.append({
                    'drink': drink.to_dict(),
                    'score': score,
                    'reasons': reasons,
                })

            recommendations.sort(
                key=lambda x: (
                    x['score'],
                    x['drink'].get('intensity', 0),       # higher intensity breaks ties first
                    -x['drink'].get('sweetnessLevel', 5),  # prefer less sweet as second tiebreaker
                ),
                reverse=True
            )
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
                    'personalized': profile is not None,
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