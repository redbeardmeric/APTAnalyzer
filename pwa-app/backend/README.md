# RAPTOR Backend API

Node.js + TypeScript backend for the RAPTOR PWA application.

## Features

- **GitHub + TAXII Data Loading** - Primary source from GitHub (no rate limits), TAXII fallback
- **SQLite Caching** - Fast local database for offline capability
- **RESTful API** - Clean, documented endpoints
- **Type-Safe** - Full TypeScript coverage
- **Smart Updates** - Intelligent version checking and update system

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
1. Download Enterprise ATT&CK bundle from GitHub repository
2. Cache bundle locally for fast re-initialization
3. Parse and store in SQLite database

**Why GitHub?** TAXII 2.1 has strict rate limits (10 requests per 10 minutes). We use the official MITRE CTI GitHub repository for initial data loading and periodic updates, falling back to TAXII only when needed.

### Check Database Version

Check current database version and update status:

```bash
npm run db:check
```

### Update Database

Update to latest ATT&CK version:

```bash
npm run db:update
```

This will:
1. Check GitHub for latest release
2. Download if newer version available
3. Fallback to TAXII if GitHub fails
4. Update database with new data

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
- `npm run db:init` - Initialize database with ATT&CK data (from GitHub)
- `npm run db:update` - Update database to latest ATT&CK version (GitHub → TAXII fallback)
- `npm run db:check` - Check current database version and update status
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
│   ├── stixLoader.ts        # GitHub STIX bundle loader
│   └── taxiiClient.ts       # TAXII 2.1 client
├── types/           # TypeScript definitions
│   ├── api.ts       # API response types
│   └── stix.ts      # STIX 2.1 types
└── server.ts        # Express app entry point
```

## Data Flow

### Initial Load & Updates
```
GitHub Repository (Primary)
  mitre/cti/enterprise-attack.json
        ↓
   stixLoader.ts
        ↓
    cache/*.json (local cache)
        ↓
    database.ts (SQLite)
```

### TAXII Fallback (if GitHub fails)
```
TAXII Server (MITRE)
  attack-taxii.mitre.org
        ↓
   taxiiClient.ts
        ↓
    database.ts (SQLite)
```

### API Request Flow
```
Frontend (React PWA)
        ↓
   routes/*.ts (Express)
        ↓
  analysisService.ts
        ↓
   dataService.ts
        ↓
    database.ts (SQLite)
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
