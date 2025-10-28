# RAPTOR Backend API

Node.js + TypeScript backend for the RAPTOR PWA application.

## Features

- **TAXII 2.1 Client** - Fetches data from MITRE ATT&CK official server
- **SQLite Caching** - Fast local database for offline capability
- **RESTful API** - Clean, documented endpoints
- **Type-Safe** - Full TypeScript coverage
- **Auto-Update** - Configurable automatic data updates

## Quick Start

### Installation

```bash
npm install
```

### Initialize Database

First time setup - fetch MITRE ATT&CK data:

```bash
npm run db:init
```

This will:
1. Connect to `https://attack-taxii.mitre.org`
2. Fetch Enterprise ATT&CK collection
3. Parse and store in SQLite database

### Development

```bash
npm run dev
```

Server will start at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Health & Info

- `GET /api/health` - Server health check
- `GET /api/data-source/info` - ATT&CK data version and stats

### Data Retrieval

- `GET /api/tactics` - List all tactics
- `GET /api/techniques` - List all techniques
- `GET /api/techniques?tactic=<shortname>` - Filter techniques by tactic
- `GET /api/techniques/:id` - Get specific technique
- `GET /api/techniques/:id/mitigations` - Get mitigations for technique
- `GET /api/groups` - List all APT groups
- `GET /api/groups/:id` - Get specific group
- `GET /api/groups/:id/techniques` - Get techniques used by group
- `GET /api/groups/:id/software` - Get software used by group
- `GET /api/software` - List all software (malware & tools)
- `GET /api/mitigations` - List all mitigations

### Analysis

- `POST /api/analysis` - Analyze and rank APT groups

  **Request Body:**
  ```json
  {
    "techniques": ["Phishing", "Command and Scripting Interpreter"],
    "software": ["Cobalt Strike", "Mimikatz"],
    "threshold": 50
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "data": {
      "results": [
        {
          "groupId": "intrusion-set--...",
          "groupName": "APT29",
          "matchPercentage": 75,
          "matchedTechniques": ["Phishing", "Command and Scripting Interpreter"],
          "matchedSoftware": ["Cobalt Strike"],
          "totalMatches": 3
        }
      ],
      "totalGroups": 5,
      "inputCount": 4,
      "timestamp": "2025-10-28T..."
    }
  }
  ```

- `POST /api/analysis/count` - Get count of matches above threshold

## Configuration

Create `.env` file (see `.env.example`):

```env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

TAXII_SERVER=https://attack-taxii.mitre.org
TAXII_API_ROOT=/api/v21
TAXII_DISCOVERY=/taxii2/

DATABASE_PATH=./database/raptor.db

CACHE_TTL_HOURS=168
AUTO_UPDATE_ENABLED=true

CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run db:init` - Initialize database with ATT&CK data
- `npm run db:update` - Update database to latest ATT&CK version
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Database Schema

### Tables

- **metadata** - Version info and timestamps
- **tactics** - MITRE ATT&CK tactics
- **techniques** - Attack techniques/sub-techniques
- **groups** - APT/threat groups (intrusion sets)
- **software** - Malware and tools
- **mitigations** - Course of action recommendations
- **relationships** - Relationships between entities

## Architecture

```
src/
├── config/          # Configuration management
├── middleware/      # Express middleware
├── models/          # (Future: data validation models)
├── routes/          # API route handlers
│   ├── analysis.ts
│   ├── groups.ts
│   ├── tactics.ts
│   ├── techniques.ts
│   └── ...
├── scripts/         # CLI scripts (init, update)
├── services/        # Business logic
│   ├── analysisService.ts   # RAPTOR algorithm
│   ├── dataService.ts       # Database queries
│   ├── database.ts          # SQLite connection
│   └── taxiiClient.ts       # TAXII 2.1 client
├── types/           # TypeScript definitions
│   ├── api.ts       # API response types
│   └── stix.ts      # STIX 2.1 types
└── server.ts        # Express app entry point
```

## Data Flow

```
TAXII Server (MITRE)
        ↓
   taxiiClient.ts
        ↓
    database.ts (SQLite cache)
        ↓
   dataService.ts
        ↓
  analysisService.ts
        ↓
   routes/*.ts (Express)
        ↓
    Frontend (React PWA)
```

## Technologies

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.6
- **Framework:** Express 4.19
- **Database:** better-sqlite3 (SQLite)
- **HTTP Client:** Axios
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

## License

MIT - See root LICENSE file
