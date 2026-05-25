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
CONVEX_DEPLOYMENT=your_convex_deployment                        # From Convex Dashboard → Settings → URL & Deploy Key
EXPO_PUBLIC_CONVEX_URL=your_convex_url                          # From Convex Dashboard → Settings → URL & Deploy Key
EXPO_PUBLIC_CONVEX_SITE_URL=your_convex_site_url                # Same as EXPO_PUBLIC_CONVEX_URL but ends in .site
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key    # From Clerk Dashboard → Configure → API Keys
CLERK_ISSUER_URL=your_clerk_issuer_url                          # From Clerk Dashboard → Configure → Domains (e.g. https://xxx.clerk.accounts.dev)
EXPO_PUBLIC_ML_API_URL=http://your_local_ip:3000                # Your local ML API server IP
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id           # From Spotify Developer Dashboard
EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret   # From Spotify Developer Dashboard
EXPO_PUBLIC_SPOTIFY_REDIRECT_URI=sipmatch://spotify-callback    # Spotify OAuth redirect URI
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
python -m pip install -r requirements.txt
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

> See the [ML service README](drink-recommendation-ml/README.md) for full API docs, personalization details, and training instructions.

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

---
*sip your mood, match your moment.*
