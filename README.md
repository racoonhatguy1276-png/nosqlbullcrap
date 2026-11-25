# Calorie & Micronutrition Tracker

A full-stack nutrition tracker that demonstrates real-time **MongoDB data updates** (`$set`, `$inc`, `$push`, `$pull`, and `upsert`) in a single-user, no-auth local setup.

## Tech Stack

- **Frontend (project root):** React (Vite), Tailwind CSS, Axios, Lucide React icons
- **Backend (`/server`):** Node.js, Express, Mongoose (MongoDB), cors, dotenv

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)

## Setup

### 1. Backend (`/server`)

```bash
cd server
cp .env.example .env      # then edit .env with your MongoDB URI
npm install
npm run dev               # starts on http://localhost:5000
```

`.env` variables:

```
MONGO_URI=mongodb://127.0.0.1:27017/micronutrition_tracker
JWT_SECRET=your_super_secret_key
PORT=5000
```

On startup the server automatically creates a single default user profile (daily targets) and seeds the 12 pre-made foods into MongoDB — but only if those collections are empty.

### 2. Frontend (project root)

```bash
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies `/api` calls to `http://localhost:5000`, so no CORS setup is needed. Open the app and the dashboard loads directly — no login required.

## MongoDB Update Operators Demonstrated

| Endpoint | Method | Operators |
|---|---|---|
| `PUT /api/foods/:id` | PUT | `$set` |
| `PATCH /api/logs/today/add` | PATCH | `$push` + `$inc` + `upsert: true` |
| `PATCH /api/logs/today/entry/:entryId` | PATCH | positional `$` + `$set` + `$inc` |
| `PATCH /api/logs/today/remove/:entryId` | PATCH | `$pull` + `$inc` |
| `PUT /api/user/targets` | PUT | `$set` (nested fields) |

All update endpoints use `{ new: true }` so the updated document is returned. The **Live MongoDB Update Inspector** drawer in the UI shows the HTTP method, MongoDB operator, and the live JSON document returned from each call.

## Features

- Dashboard with calorie ring, macro breakdown, and micronutrient progress bars
- Editable daily targets
- Searchable pre-made food library with "Log", "Edit Nutrition", and "Add Custom Food"
- Today's food log with serving steppers (+/-) and delete
- Live MongoDB Update Inspector drawer
