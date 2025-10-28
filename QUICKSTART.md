# RAPTOR PWA - Quick Start Guide

Complete setup and installation guide for the RAPTOR Progressive Web App.

## Prerequisites

- Node.js 18+ and npm
- Git

## Installation

### 1. Clone and Navigate

```bash
cd /home/james/APTAnalyzer
git checkout pwa-overhaul
```

### 2. Backend Setup

```bash
cd pwa-app/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database (fetch MITRE ATT&CK data)
npm run db:init
```

This will:
- Download MITRE ATT&CK v18.0 from TAXII server
- Parse and store in SQLite database
- Take 1-2 minutes on first run

Expected output:
```
✓ Fetched 15000+ objects
  ATT&CK Version: 18.0
✓ Database initialized successfully!
Statistics:
  Tactics:       14
  Techniques:    800+
  Groups:        150+
  Software:      700+
  Mitigations:   40+
  Relationships: 13000+
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## Running the Application

### Terminal 1 - Backend API

```bash
cd pwa-app/backend
npm run dev
```

Server starts at: `http://localhost:3001`

### Terminal 2 - Frontend PWA

```bash
cd pwa-app/frontend
npm run dev
```

App opens at: `http://localhost:5173`

## Using RAPTOR

### 1. Select Techniques/Software
- Choose a tactic to filter techniques (optional)
- Search and click techniques you've observed
- Search and click software/malware you've identified
- Adjust the match threshold (default 50%)

### 2. View Potential Matches
- Real-time counter shows groups above threshold
- Must have at least 1 potential match to analyze

### 3. Analyze Threats
- Click "Analyze" button
- Results grouped by match percentage tiers:
  - 90%+ (Critical - High confidence match)
  - 80-89% (High)
  - 70-79% (Medium-High)
  - 60-69% (Medium)
  - 50-59% (Low-Medium)

### 4. View Group Details
- Click any group card to see full details
- View all techniques used by the group
- See software/malware in their arsenal
- Expand techniques to view mitigations

## PWA Features

### Install as App

**Desktop (Chrome/Edge):**
1. Click install icon in address bar
2. Or: Menu → Install RAPTOR

**Mobile:**
1. Browser menu → Add to Home Screen
2. App appears on home screen

### Offline Support

- Data cached after first load
- Analysis works offline
- Background sync when online

## Architecture

```
┌─────────────────┐
│  React Frontend │ ← You interact here
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP API
         ▼
┌─────────────────┐
│  Node.js API    │
│  (Port 3001)    │
└────────┬────────┘
         │ SQLite Cache
         ▼
┌─────────────────┐
│  MITRE TAXII    │ ← Official ATT&CK data
│  Server         │
└─────────────────┘
```

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (needs 18+)
- Ensure database initialized: `npm run db:init`
- Check port 3001 is available

### Frontend shows "Error Loading Data"
- Ensure backend is running
- Check console for CORS errors
- Verify `VITE_API_URL` in `.env`

### No results appear
- Must select at least 1 technique or software
- Threshold too high - try lowering to 50%
- Selected items must exist in group relationships

### Database outdated
Update to latest ATT&CK version:
```bash
cd pwa-app/backend
npm run db:update
```

## Development

### Backend
- `npm run dev` - Hot reload development
- `npm run build` - Compile TypeScript
- `npm start` - Run production build
- `npm run db:init` - Initialize database
- `npm run db:update` - Update ATT&CK data

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Production Deployment

### Backend
```bash
cd pwa-app/backend
npm run build
NODE_ENV=production npm start
```

### Frontend
```bash
cd pwa-app/frontend
npm run build
# Deploy dist/ folder to static hosting
```

## API Endpoints

Base URL: `http://localhost:3001/api`

- `GET /health` - Health check
- `GET /data-source/info` - ATT&CK version info
- `GET /tactics` - List all tactics
- `GET /techniques` - List techniques
- `GET /techniques?tactic=execution` - Filter by tactic
- `GET /groups` - List APT groups
- `GET /groups/:id` - Group details
- `GET /groups/:id/techniques` - Group's techniques
- `GET /groups/:id/software` - Group's software
- `GET /software` - List all software
- `POST /analysis` - Analyze threats
- `POST /analysis/count` - Count potential matches

## Tech Stack

**Backend:**
- Node.js 18+ with TypeScript
- Express for API
- better-sqlite3 for caching
- Axios for TAXII client

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation

**Data Source:**
- MITRE ATT&CK v18.0 via TAXII 2.1
- Updated October 2025

## Support

- Issues: https://github.com/redbeardmeric/APTAnalyzer/issues
- MITRE ATT&CK: https://attack.mitre.org/
- Documentation: See README files in backend/ and frontend/

---

**Project:** RAPTOR v2.0 (PWA)
**Authors:** James Henry, Jaimin Bhagat, Thomas Mason, Tristan Sharpe, Wesley Venters
**License:** MIT
