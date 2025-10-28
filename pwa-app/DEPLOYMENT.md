# RAPTOR PWA - Deployment Guide

Complete guide for deploying the RAPTOR Progressive Web App to production.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)

---

## Deployment Options

### Recommended Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Static Hosting)          │
│  - Vercel / Netlify / Cloudflare    │
│  - Serves React PWA                 │
└──────────────┬──────────────────────┘
               │ API Calls
               ▼
┌─────────────────────────────────────┐
│  Backend (Node.js Server)           │
│  - Railway / Render / DigitalOcean  │
│  - Express API + SQLite DB          │
└──────────────┬──────────────────────┘
               │ TAXII Client
               ▼
┌─────────────────────────────────────┐
│  MITRE ATT&CK TAXII Server          │
│  https://attack-taxii.mitre.org     │
└─────────────────────────────────────┘
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

**Pros:** Free tier, automatic deployments, built-in PostgreSQL
**Difficulty:** Easy

#### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**
   ```bash
   cd pwa-app/backend
   railway init
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Initialize Database**
   ```bash
   railway run npm run db:init
   ```

6. **Get URL**
   ```bash
   railway domain
   # Use this URL in frontend VITE_API_URL
   ```

#### railway.json Configuration

Create `pwa-app/backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 2: Render.com

**Pros:** Free tier, easy setup, automatic SSL
**Difficulty:** Easy

#### Steps:

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Build**
   - **Build Command:** `cd pwa-app/backend && npm install && npm run build`
   - **Start Command:** `cd pwa-app/backend && npm start`
   - **Environment:** Node

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   CORS_ORIGINS=https://your-frontend-domain.com
   DATABASE_PATH=/opt/render/project/.render/database/raptor.db
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

5. **Initialize Database** (via SSH)
   ```bash
   # After first deploy
   npm run db:init
   ```

---

### Option 3: DigitalOcean App Platform

**Pros:** $5/month, good performance, managed databases
**Difficulty:** Medium

#### Steps:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository
   - Select `pwa-app/backend` as source directory

2. **Configure**
   - **Run Command:** `npm start`
   - **Build Command:** `npm install && npm run build`
   - **HTTP Port:** 3001

3. **Environment Variables**
   ```
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy & Initialize**
   ```bash
   # Via console after deployment
   npm run db:init
   ```

---

### Option 4: Docker + VPS

**Pros:** Full control, can use any VPS provider
**Difficulty:** Advanced

See [Docker Deployment](#docker-deployment) section below.

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Pros:** Best React support, automatic deployments, global CDN
**Difficulty:** Easy

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure**
   Create `pwa-app/frontend/vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.railway.app/api`

4. **Deploy**
   ```bash
   cd pwa-app/frontend
   vercel
   # Follow prompts
   ```

5. **Production Deploy**
   ```bash
   vercel --prod
   ```

#### Automatic Deployments

- Push to `main` branch → Auto-deploy to production
- Pull requests → Preview deployments
- Configure in Vercel Dashboard → Git Integration

---

### Option 2: Netlify

**Pros:** Great for static sites, easy rollbacks
**Difficulty:** Easy

#### Steps:

1. **Create Site**
   - Go to https://netlify.com
   - "Add new site" → "Import existing project"
   - Connect GitHub

2. **Build Settings**
   - **Base directory:** `pwa-app/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `pwa-app/frontend/dist`

3. **Environment Variables**
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url`

4. **Redirects**
   Create `pwa-app/frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

5. **Deploy**
   - Push to GitHub → Auto-deploys

---

### Option 3: Cloudflare Pages

**Pros:** Global CDN, unlimited bandwidth, great performance
**Difficulty:** Easy

#### Steps:

1. **Create Project**
   - Go to Cloudflare Dashboard → Pages
   - "Create a project" → Connect GitHub

2. **Build Configuration**
   - **Framework preset:** Vite
   - **Build command:** `cd pwa-app/frontend && npm install && npm run build`
   - **Build output directory:** `pwa-app/frontend/dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url/api
   ```

4. **Deploy**
   - Push to repository → Auto-deploys

---

## Docker Deployment

### Complete Stack with Docker Compose

#### Directory Structure
```
pwa-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   └── ...
└── frontend/
    ├── Dockerfile
    └── ...
```

#### Backend Dockerfile

Create `pwa-app/backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/scripts ./src/scripts

# Create database directory
RUN mkdir -p /app/database

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start app
CMD ["npm", "start"]
```

#### Frontend Dockerfile

Create `pwa-app/frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build app
RUN npm run build

# Production image with nginx
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

Create `pwa-app/frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

#### Docker Compose

Create `pwa-app/docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_PATH=/app/database/raptor.db
      - CORS_ORIGINS=http://localhost:80,http://localhost
    volumes:
      - backend-data:/app/database
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://localhost:3001/api
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  backend-data:
```

#### Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d

# Initialize database
docker-compose exec backend npm run db:init

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d --build
```

---

## Environment Configuration

### Backend Environment Variables

```bash
# Required
NODE_ENV=production                    # production or development
PORT=3001                             # API port
DATABASE_PATH=./database/raptor.db    # SQLite database path

# TAXII Server (usually default)
TAXII_SERVER=https://attack-taxii.mitre.org
TAXII_API_ROOT=/api/v21
TAXII_DISCOVERY=/taxii2/

# Cache Settings
CACHE_TTL_HOURS=168                   # 1 week
AUTO_UPDATE_ENABLED=true              # Auto-update ATT&CK data

# CORS (comma-separated frontend URLs)
CORS_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

### Frontend Environment Variables

```bash
# Required
VITE_API_URL=https://api.your-domain.com/api

# Optional - Analytics
VITE_GA_ID=G-XXXXXXXXXX              # Google Analytics
VITE_SENTRY_DSN=https://...          # Sentry error tracking
```

---

## Post-Deployment

### 1. Initialize Database

```bash
# Backend must be running
curl -X GET https://api.your-domain.com/api/health

# SSH into backend server or use Docker exec
npm run db:init

# Verify
curl -X GET https://api.your-domain.com/api/data-source/info
```

### 2. Test PWA Installation

**Desktop:**
1. Open app in Chrome/Edge
2. Look for install icon in address bar
3. Click to install
4. Verify standalone mode works

**Mobile:**
1. Open in mobile browser
2. Menu → "Add to Home Screen"
3. Test offline mode

### 3. Monitor Performance

**Backend Metrics:**
- API response times
- Database query performance
- Memory usage
- Error rates

**Frontend Metrics:**
- Lighthouse PWA score (aim for 90+)
- First Contentful Paint
- Time to Interactive
- Service Worker cache hit rate

### 4. Set Up Monitoring

**Backend (Optional):**
```bash
npm install --save @sentry/node
```

Add to `server.ts`:
```typescript
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}
```

**Frontend (Optional):**
```bash
npm install --save @sentry/react
```

### 5. Regular Maintenance

**Weekly:**
- Check for ATT&CK updates: `npm run db:update`
- Review error logs

**Monthly:**
- Update dependencies: `npm audit fix`
- Check security vulnerabilities
- Review analytics data

---

## Security Checklist

- [ ] HTTPS enabled (Let's Encrypt)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] Environment variables not committed
- [ ] Database not publicly accessible
- [ ] API authentication (if needed)
- [ ] Regular security audits: `npm audit`

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend
# Or on Railway/Render, use their log viewer

# Common issues:
# - PORT mismatch
# - Database path not writable
# - CORS_ORIGINS misconfigured
```

### Frontend can't reach backend
```bash
# Check CORS
curl -I https://api.your-domain.com/api/health

# Verify VITE_API_URL is correct
# Check browser console for CORS errors
```

### Database not initializing
```bash
# Ensure database directory exists
mkdir -p database

# Check write permissions
ls -la database/

# Re-run init
npm run db:init
```

### PWA not installing
```bash
# Run Lighthouse audit
# Check manifest.json is accessible
# Verify service worker is registered
# Must be served over HTTPS
```

---

## Cost Estimates

### Free Tier Setup
- **Backend:** Railway Free ($0) or Render Free ($0)
- **Frontend:** Vercel Free ($0) or Netlify Free ($0)
- **Database:** SQLite included ($0)
- **Total:** $0/month

### Production Setup
- **Backend:** Railway Pro ($5-20/month)
- **Frontend:** Vercel Pro ($20/month) or Cloudflare Pages (Free)
- **Database:** SQLite included
- **Monitoring:** Sentry Free tier
- **Total:** $5-40/month

### Enterprise Setup
- **Backend:** DigitalOcean Droplet ($12-24/month)
- **Frontend:** Cloudflare Pages (Free with paid workers)
- **Database:** Managed PostgreSQL ($15/month)
- **CDN:** Cloudflare Pro ($20/month)
- **Total:** $47-59/month

---

## Support

- **Backend Issues:** Check `pwa-app/backend/README.md`
- **Frontend Issues:** Check `pwa-app/frontend/README.md`
- **General Setup:** See `QUICKSTART.md`
- **GitHub Issues:** https://github.com/redbeardmeric/APTAnalyzer/issues

---

**Good luck with your deployment!** 🚀
