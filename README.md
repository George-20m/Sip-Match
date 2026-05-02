# SipMatch

SipMatch is an Expo React Native app backed by Convex, Clerk authentication, and a local Python ML recommendation API.

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- Expo Go or an Android/iOS simulator

## Environment Files

The app expects these files in the project root:

### `.env.local`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_ML_API_URL=http://your_local_ip:3000
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
EXPO_PUBLIC_SPOTIFY_REDIRECT_URI=sipmatch://spotify-callback
CONVEX_DEPLOYMENT=your_convex_deployment
EXPO_PUBLIC_CONVEX_URL=your_convex_url
```

If you use Clerk with Convex, also make sure `CLERK_ISSUER_URL` is available for Convex when running `npx convex dev`.

## Install Dependencies

Install the app dependencies:

```bash
npm install
```

Install the ML API dependencies:

```bash
cd drink-recommendation-ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Run the App

You need 3 running services during development.

### 1. Start Convex

From the project root:

```bash
npx convex dev
```

### 2. Start the Python ML API

From `drink-recommendation-ml`:

```bash
cd drink-recommendation-ml
.venv\Scripts\activate
python app.py
```

By default the ML API starts on:

```text
http://192.168.110.63:3000
```

If your machine IP is different, update the hardcoded ML API URL in:

- `app/services/mlService.ts`
- `app/components/HomeScreen.tsx`
- `drink-recommendation-ml/test_api.py`

Or run the API with matching environment variables:

```bash
$env:FLASK_HOST="0.0.0.0"
$env:FLASK_PORT="3000"
python app.py
```

### 3. Start Expo

From the project root:

```bash
npm start
```

## Platform Commands

Run Expo directly for a target platform:

```bash
npm run android
npm run ios
npm run web
```

## Useful Commands

Lint the project:

```bash
npm run lint
```

Retrain the ML model manually:

```bash
cd drink-recommendation-ml
.venv\Scripts\activate
python model/train_model.py
```

## Recommended Development Order

Open 3 terminals:

1. `npx convex dev`
2. `cd drink-recommendation-ml && .venv\Scripts\activate && python app.py`
3. `npm start`
