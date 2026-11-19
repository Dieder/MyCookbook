# My Cookbook — Seasonal Bistro Cookbook

**My Cookbook** (*The Hearth, the Coast, and the Orchard*) is an editorial bistro cookbook web application and installable Progressive Web App (PWA). It combines a book-spread reading experience, collectible recipe cards, multi-timer cooking workflows, server-side Gemini recipe generation and adaptation, meal-slot planning, an auto-aggregated shopping list, and Firebase-backed community publishing.

---

## Key Features

### 1. Editorial Cookbook, Chapters & Recipe Cards
- **Book Cover & Frontispiece**: Opening cover view with editorial foreword, quick entry into chapters, recipe cards, AI dish requests, or the meal calendar.
- **Structured Chapters & Subchapters**: Fourteen curated chapters and regional subchapters (including *Breakfast*, *Lunch*, *Dinner*, *Comfort Food*, *Quick & Easy Meals*, *Vegetarian*, *International Favorites* — *Italian*, *Asian*, *Mediterranean*, *Mexican* — *Baking & Bread*, *Desserts*, and *Drinks*), extensible by admins via Firestore.
- **Book Spread Reader**: Two-page editorial layout featuring full-bleed dish photography, regional/seasonal metadata, culinary prose, pull quotes, pairing notes, expandable ingredient checklists, step-by-step preparations, and personal kitchen margin notes.
- **Ergonomic Recipe Cards Index**: Filterable recipe grid/list with search, chapter filtering, compact mobile cards (description below plate photo, combined timer + servings row, collapsible ingredients panel), quick calendar scheduling, and one-tap **⋮** actions for *Preparation*, *Cook Mode*, and *Start Timer*.

### 2. Dynamic Scaling, Unit Systems & Interactive Cooking
- **Live Servings Scaler**: Adjust portion counts per recipe with culinary fraction formatting (e.g., `½`, `¾`) across both ingredients and the shopping list.
- **Metric & US Customary Units**: Global unit toggle in **Settings** (`metric` vs. `imperial`) applied across spreads, cards, and grocery totals.
- **Multi-Timer Engine & Timer Dock**:
  - Per-step countdown timers synced to wall-clock timestamps (`startedAtMs` / `endsAtMs`) so timers stay accurate across view switches.
  - Persistent floating **Timer Dock** tracking multiple concurrent timers with pause/resume, reset, +1m quick add, and Web Audio chime alerts.
- **Distraction-Free Cook Mode**: Fullscreen step-by-step cooking overlay with large typography, active timer controls, and ingredient drawer access.
- **Technique Clips**: Interactive preparation stage cues and optional embedded preparation video guidance inside spreads.

### 3. AI Sous-Chef (Server-Side Gemini API)
- **Ask Chef for a Recipe (`/api/recipes/generate`)**: Generate complete recipes tailored to a prompt, target chapter, serving count, and active UI language—including editorial story prose, pairing note, metric/imperial ingredients, and timed cooking steps.
- **Customize Any Recipe (`/api/recipes/customize`)**: Adapt existing dishes for dietary needs, ingredient swaps, flavor twists, or time constraints while recalculating measurements, step instructions, and timers.
- **Key Protection**: All `@google/genai` calls execute strictly on the Express backend (`server.ts`) using the server-side `GEMINI_API_KEY`; no API key is ever exposed to the browser.

### 4. Meal Calendar & Smart Shopping List
- **Meal Slots & Quick Swap**:
  - Schedule dishes into **`Breakfast`**, **`Lunch`**, **`Dinner`**, and **`Snack`** slots per date with customizable serving overrides.
  - **Mobile 7-Day Card Timeline** alongside a **Tablet/Desktop Monthly Matrix** for fast weekly or monthly planning.
  - **One-Tap Dish Swap**: Replace or reassign a planned slot directly from the calendar card/cell using the meal picker modal without losing your place.
- **Auto-Aggregated Smart Shopping List**:
  - Aggregates ingredients **strictly from scheduled calendar days** across selectable windows (**Next 7 Days**, **Next 14 Days**, or **Current Month**).
  - Scales quantities by each meal slot's configured servings, merges matching ingredient names and compatible units cleanly, and groups items into **6 grocery aisles** (*Produce*, *Meat & Fish*, *Dairy & Eggs*, *Bakery & Grains*, *Pantry & Spices*, *Other*).
  - Supports persistent check-offs (`localStorage`), **Hide Checked**, **Uncheck All**, source dish attribution chips, and one-click **Copy List** to clipboard.

### 5. Community Publishing, Bookmarks & Role-Based Access (RBAC)
- **Google Authentication**: Sign in via Firebase Auth (`GoogleAuthProvider`).
- **Role-Based Access Control** (enforced in `firestore.rules`):
  - **Reader**: Browse published recipes, save cloud-synced bookmarks, plan meals, submit 1–5 star ratings with tasting notes, and request contributor access.
  - **Contributor**: Create, edit, upload compressed dish photos, draft/publish recipes in **My Recipes** using a rich story WYSIWYG editor, and manage personal drafts.
  - **Admin**: Access **Admin Desk** to approve/manage user roles and contributor requests, moderate community chapters/subchapters in **Chapter Editor**, and manage taxonomy.

### 6. Multilingual, Themes & Mobile-First PWA
- **6 Languages**: Interface, navigation, chapters, shopping aisles, and curated catalog localization in **English (`en`)**, **Dutch (`nl`)**, **French (`fr`)**, **Spanish (`es`)**, **German (`de`)**, and **Italian (`it`)**.
- **4 Editorial Themes**: *Classic* (linen & forest green), *Whitepaper* (crisp archival paper), *Modern* (slate & cobalt), and *Colorful* (warm saffron & crimson).
- **Iconized Mobile Navigation**: Borderless icon strip with accessible `title` tooltips (*Home*, *Recipes*, *Cards*, *Calendar*, *Saved* with counter) plus a **`More (⋮)`** overflow menu for *Shopping*, *My Recipes*, *Settings*, and *Admin*.
- **Offline Support & Installable PWA**:
  - Powered by `vite-plugin-pwa` (Workbox) with precached app shell assets, runtime caching for dish photography and Google Fonts, and an **Offline Indicator** banner when disconnected.
  - Firestore multi-tab IndexedDB persistence (`persistentLocalCache` + `persistentMultipleTabManager`) keeps saved recipes, chapters, and calendar plans available offline.
  - Installable on desktop Chrome/Edge, Android Chrome, and iOS Safari (*Add to Home Screen*), with an in-app install trigger in **Settings**.

---

## Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `motion`.
- **Backend Server (`server.ts`)**: Express serving `/api/recipes/generate` and `/api/recipes/customize` via `@google/genai`, Vite middleware in development, and compiled `dist/` static + SPA fallback assets in production.
- **Database & Auth**: Firebase Authentication (Google Sign-In) & Cloud Firestore (named database configured in `firebase-applet-config.json`) with strict schema & RBAC validation in `firestore.rules`.
- **Offline / PWA**: `vite-plugin-pwa` generating `manifest.webmanifest` and Workbox `sw.js`.

---

## Local Development

### Prerequisites
- **Node.js `>= 22.x`** (required by `"start": "node server.ts"` for native TypeScript execution, or use `npm run dev` via `tsx`)
- A **Gemini API key** (`GEMINI_API_KEY`)
- A configured **Firebase** project (`firebase-applet-config.json`)

### Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set GEMINI_API_KEY and APP_URL
```

Run the development server (Express + Vite middleware on port `3000`):

```bash
npm run dev
```

Useful verification commands:

```bash
# TypeScript type-check
npm run lint

# Build client & PWA bundle into dist/
npm run build

# Run production server (serves dist/ + /api/*)
NODE_ENV=production npm start

# Validate Firestore security rules with Firebase ESLint plugin
npx eslint firestore.rules
```

---

## Deploying in the Cloud Ecosystem (Google Cloud & Firebase)

Because **My Cookbook** is a **full-stack Node.js + Express + Vite PWA** (serving both server-side Gemini API routes under `/api/*` and the compiled SPA/Workbox bundle), the cleanest production architecture in the Google Cloud ecosystem is **Google Cloud Run** paired with **Cloud Firestore / Firebase Authentication** and **Secret Manager**.

### Recommended Architecture

```
Browser / Installed PWA (HTTPS)
   │
   ├──► Cloud Run (Express server.ts on $PORT)
   │       ├── Static SPA + manifest.webmanifest + sw.js (dist/)
   │       └── /api/recipes/* ──► @google/genai (GEMINI_API_KEY via Secret Manager)
   │
   └──► Firebase SDK (Client)
           ├── Firebase Auth (Google Sign-In, Authorized Domains)
           └── Cloud Firestore (Named DB + firestore.rules + IndexedDB offline cache)
```

---

### Step 1: Prepare Container & Build Configuration

Add a `Dockerfile` at the repository root (note Node 22 matches `package.json` `"start": "node server.ts"`):

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

# Cloud Run injects PORT (default 8080); server.ts listens on 0.0.0.0:${PORT || 3000}
EXPOSE 8080
CMD ["npm", "start"]
```

Add a `.dockerignore` file (`node_modules`, `dist`, `dev-dist`, `.env`, `.git`) so local secrets and caches are never sent to Cloud Build.

---

### Step 2: Store Secrets in Google Cloud Secret Manager

Never bake `GEMINI_API_KEY` into the Docker image or expose it as a `VITE_*` client variable:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

printf "YOUR_ACTUAL_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

Grant your Cloud Run runtime service account `roles/secretmanager.secretAccessor` on `gemini-api-key`.

---

### Step 3: Deploy to Google Cloud Run

Deploy directly from source using Cloud Build + Cloud Run:

```bash
gcloud run deploy my-cookbook \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"
```

After the first deploy returns your service URL (e.g., `https://my-cookbook-xxxxx.a.run.app`), set `APP_URL`:

```bash
gcloud run services update my-cookbook \
  --region europe-west1 \
  --update-env-vars "APP_URL=https://my-cookbook-xxxxx.a.run.app"
```

> **Tip (Cold Starts & Scaling)**: Set `--min-instances 1` if you want instant recipe-book loads and snappy AI chef responses without cold starts, or keep `--min-instances 0` for pay-per-request cost efficiency.

---

### Step 4: Configure Firebase & Cloud Firestore for Production

1. **Verify `firebase-applet-config.json`**:
   - Ensure `projectId`, `apiKey`, `authDomain`, and `firestoreDatabaseId` match your target Firebase/GCP project.
   - Note that this app targets a **named Firestore database** (`firestoreDatabaseId`) via `initializeFirestore(..., firebaseConfig.firestoreDatabaseId)` in `src/lib/firebase.ts` rather than `(default)`. Make sure that database exists in your target project (or update `firestoreDatabaseId` to `(default)` if migrating to a fresh Firebase project).

2. **Deploy Firestore Security Rules**:
   Validate and publish `firestore.rules` before opening traffic:
   ```bash
   npx eslint firestore.rules
   firebase deploy --only firestore:rules --project YOUR_FIREBASE_PROJECT_ID
   ```
   > Check `isBootstrappedAdmin()` in `firestore.rules` and `isBootstrappedAdminEmail()` in `src/lib/firestoreCommunity.ts` so the initial admin email matches your production administrator account.

3. **Authorize Your Cloud Run / Custom Domain in Firebase Auth (Critical)**:
   - Open **Firebase Console → Authentication → Settings → Authorized domains**.
   - Add your Cloud Run hostname (e.g., `my-cookbook-xxxxx.a.run.app`) and any custom domain mapped to Cloud Run.
   - Without this step, Google Sign-In (`signInWithPopup`) will fail with `auth/unauthorized-domain`.

---

### Step 5: Optional Hybrid Split (Firebase Hosting + Cloud Run)

If you want global edge CDN caching for static pages/images alongside Cloud Run for `/api/*`:

1. Configure `firebase.json` Hosting rewrites:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         { "source": "/api/**", "run": { "serviceId": "my-cookbook", "region": "europe-west1" } },
         { "source": "**", "destination": "/index.html" }
       ]
     }
   }
   ```
2. Deploy `npm run build && firebase deploy --only hosting,firestore:rules`.
3. Add your `.web.app` and `.firebaseapp.com` domains (plus any custom domain) to Firebase Auth Authorized Domains.

---

### Production & PWA Checklist

- **HTTPS Required**: Cloud Run and Firebase Hosting serve TLS automatically, which is mandatory for Service Worker registration (`sw.js`) and PWA installation.
- **Service Worker Caching**: In custom CDN/reverse-proxy setups, ensure `/sw.js` and `/manifest.webmanifest` are served with `Cache-Control: no-cache` so `registerType: 'autoUpdate'` picks up new releases immediately.
- **CI/CD Automation**: Connect your Git repository to **Google Cloud Build** triggers so pushes to `main` automatically run `npm run lint`, `npm run build`, rebuild the container, and deploy a new Cloud Run revision.
- **Cost & Quota Monitoring**: Configure budget alerts in GCP Billing and monitor Gemini API rate limits and Firestore read/write usage as your community cookbook grows.
