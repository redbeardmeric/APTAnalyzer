# RAPTOR Frontend - Progressive Web App

Modern React PWA for the RAPTOR (Ranking Advanced Persistent Threat Ontological Report) tool.

## Features

- **Modern React UI** - Built with React 19 + TypeScript
- **Tailwind CSS** - Dark cybersecurity theme matching original PyQt5 design
- **Progressive Web App** - Installable, offline-capable
- **Real-time Analysis** - Live match counter as you select techniques/software
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Type-Safe** - Full TypeScript coverage

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router v7
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **PWA:** Vite Plugin PWA with Workbox

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

App will open at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/              # API client
│   └── client.ts     # Axios wrapper for backend API
├── components/       # React components
│   ├── Layout/      # App layout components
│   ├── Selection/   # Technique/software selection
│   ├── Analysis/    # Results display
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   └── utils.ts     # Helper functions
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Results.tsx
│   └── GroupDetail.tsx
├── store/           # State management
│   └── useAppStore.ts
├── types/           # TypeScript definitions
│   └── index.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Color Scheme

The app uses a dark cybersecurity-themed color palette:

- **Background:** `#282C2E`
- **Surface:** `#1E2224`
- **Border:** `#3A3F42`
- **Text:** `#E8E8E8`
- **Primary (Green):** `#10B981`
- **Danger (Red):** `#EF4444`
- **Warning (Orange):** `#F59E0B`

## License

MIT - See root LICENSE file
