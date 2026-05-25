# drink-recommendation-ml

The Python ML service powering SipMatch's personalized drink recommendations. Built with Flask and scikit-learn.

---

## What it does

This service receives a POST request from the SipMatch React Native app containing the user's current context (mood, weather, time, song) and their favorites history. It returns a ranked list of the top 5 drink recommendations personalized to that specific user.

Two things happen at prediction time:

1. **Context scoring** — each drink is scored based on how well it fits the current mood, weather condition, time of day, and energy level.
2. **Taste match scoring** — if the user has favorited drinks before, a personal taste profile is built from those favorites (preferred temperature, sweetness, intensity, caffeine level, and flavor tags) and used to boost or penalize each drink accordingly.

Users with no favorites yet get context-only recommendations (cold start fallback). Personalization kicks in automatically once they start favoriting drinks — no manual input required.

---

## Project structure

```
drink-recommendation-ml/
├── app.py               # Flask API entry point
├── model/
│   ├── predictor.py     # Prediction logic + personalization
│   └── train_model.py   # Model training script
├── requirements.txt
└── README.md
```

---

## API

### `POST /recommend`

Returns the top 5 personalized drink recommendations.

**Request body:**

```json
{
  "user_id": "clerk_user_id",
  "email": "user@example.com",
  "mood": "Happy",
  "song": "Song name or null",
  "location": { "latitude": 30.0, "longitude": 31.0 },
  "weather": { "temperature": 28, "condition": "clear" },
  "timestamp": "2024-01-01T14:00:00Z",
  "userFavorites": [
    {
      "name": "Espresso",
      "temperature": "hot",
      "sweetnessLevel": 2,
      "intensity": 5,
      "caffeineLevel": "high",
      "flavorProfile": ["bitter", "bold", "rich"]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "recommendations": [
    {
      "name": "Corto Classic",
      "category": "shaken_coffee",
      "temperature": "hot",
      "score": 148,
      "reasons": [
        "Perfect for your happy mood",
        "Ideal for afternoon",
        "Matches your taste preferences"
      ]
    }
  ],
  "context": {
    "mood": "Happy",
    "weather": "hot",
    "temperature": 28,
    "time_of_day": "afternoon",
    "has_song": false,
    "personalized": true
  }
}
```

`personalized: true` means the user had enough favorites history to apply taste profile scoring.

---

## Personalization system

The taste profile is built from the user's favorited drinks and captures:

| Signal | How it's used |
|---|---|
| Temperature preference | Most common temperature among favorites. Hot-drink lovers get hot drinks even on hot days. |
| Sweetness level | Average sweetness across favorites. Matched within ±2 points for full bonus. |
| Intensity | Average intensity across favorites. Matched within ±1 for full bonus. |
| Caffeine preference | Most common caffeine level. Exact match gets a bonus. |
| Flavor tags | Tags appearing 2+ times in favorites are "strong" signals and score higher matches. |

New users (0 favorites) receive context-only recommendations. Personalization activates automatically as favorites accumulate — no threshold, every favorite shifts the profile.

---

## Running locally

```bash
cd drink-recommendation-ml
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python app.py
```

Server starts on `http://0.0.0.0:3000`.

---

## Training the model

```bash
python model/train_model.py
```

This fetches all drinks from the Convex database, builds a training dataset by expanding drink attributes into feature combinations, trains a `RandomForestClassifier`, and saves the model as `model.pkl`.

The model uses these features: `mood_encoded`, `weather_encoded`, `caffeine_encoded`, `temp_encoded`, `sweetnessLevel`, `intensity`, `vegan`.

---

## Testing

**Cold start (no favorites):**

```bash
curl -X POST "http://localhost:3000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_1",
    "mood": "Happy",
    "weather": { "temperature": 35, "condition": "sunny" },
    "timestamp": "2024-01-01T14:00:00Z",
    "userFavorites": []
  }'
```

Expected: `"personalized": false`, recommendations driven by weather/mood context.

**Personalized (hot-drink lover in hot weather):**

```bash
curl -X POST "http://localhost:3000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_2",
    "mood": "Happy",
    "weather": { "temperature": 35, "condition": "sunny" },
    "timestamp": "2024-01-01T14:00:00Z",
    "userFavorites": [
      { "name": "Espresso", "temperature": "hot", "sweetnessLevel": 1, "intensity": 5, "caffeineLevel": "high", "flavorProfile": ["bitter", "bold"] },
      { "name": "Latte", "temperature": "hot", "sweetnessLevel": 5, "intensity": 3, "caffeineLevel": "medium", "flavorProfile": ["creamy", "rich"] },
      { "name": "Americano", "temperature": "hot", "sweetnessLevel": 2, "intensity": 4, "caffeineLevel": "high", "flavorProfile": ["bitter", "bold"] }
    ]
  }'
```

Expected: `"personalized": true`, hot drinks in top 5 despite 35°C weather.

---

## Tech stack

- Python 3.13
- Flask
- scikit-learn (RandomForestClassifier)
- pandas / numpy
- joblib