# RAPTOR PWA - Progressive Web App

Modern Progressive Web App version of the RAPTOR (Ranking Advanced Persistent Threat Ontological Report) tool.

## Architecture

### Backend (FastAPI + Python)
- RESTful API server
- TAXII 2.1 client for MITRE ATT&CK data
- SQLite caching layer
- PDF/HTML report generation

### Frontend (React + Vite + Tailwind)
- Modern responsive UI
- Progressive Web App capabilities
- Offline-first architecture
- Service Worker for caching

## Project Structure

```
pwa-app/
├── backend/          # FastAPI backend server
│   ├── api/         # API routes
│   ├── models/      # Data models
│   ├── services/    # Business logic
│   └── requirements.txt
├── frontend/        # React PWA
│   ├── src/        # React components
│   ├── public/     # Static assets
│   └── package.json
└── README.md
```

## Data Source

This application uses the official MITRE ATT&CK TAXII 2.1 server:
- API: `https://attack-taxii.mitre.org/api/v21/`
- Current version: ATT&CK v18.0 (October 2025)
- No authentication required

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Legacy Application

The original PyQt5 desktop application is preserved in the `RAPTOR/` directory.
