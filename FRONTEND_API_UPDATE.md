# Frontend API Configuration Update Guide

## Overview

To make your frontend work in production (deployed on Vercel), you need to update how API calls are made. Currently, the app uses relative URLs (`/api/...`) which work in development thanks to Vite's proxy, but won't work in production.

## Option 1: Quick Fix (Recommended for Fast Deployment)

### Update vite.config.js

Replace the current `vite.config.js` with:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        }
    },
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '')
    }
})
```

### Create .env files

1. Create `.env.development` in the frontend folder:
```env
VITE_API_URL=http://localhost:5000
```

2. Create `.env.production` in the frontend folder (after deploying backend):
```env
VITE_API_URL=https://your-backend-app.onrender.com
```

### Update axios calls to use full URLs

You have two approaches:

#### Approach A: Update each file individually

In each file that uses axios, change from:
```javascript
axios.get('/api/portfolio')
```

To:
```javascript
axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`)
```

Files to update:
- `src/context/AuthContext.jsx`
- `src/pages/Crypto.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/News.jsx`
- `src/pages/Portfolio.jsx`
- `src/pages/Transactions.jsx`
- `src/pages/Watchlist.jsx`

#### Approach B: Use the centralized API instance (Better)

I've created `src/api.js` for you. Update your files to use it:

**Before:**
```javascript
import axios from 'axios';

const response = await axios.get('/api/portfolio');
```

**After:**
```javascript
import api from '../api';

const response = await api.get('/api/portfolio');
```

This approach is cleaner and handles authentication automatically.

## Option 2: No Code Changes Required (Simplest)

If you don't want to modify your existing code, you can configure Vercel to proxy API requests:

### Update vercel.json

Replace the current `vercel.json` with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-app.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Important:** Replace `https://your-backend-app.onrender.com` with your actual Render backend URL.

This way, all `/api/*` requests from your frontend will be automatically forwarded to your backend, and you don't need to change any code!

## Recommended Approach

For this deployment, I recommend **Option 2** (using Vercel rewrites) because:
- ✅ No code changes required
- ✅ Keeps development setup unchanged
- ✅ Easy to update backend URL in one place
- ✅ Works immediately after deployment

## Steps to Deploy with Option 2

1. Deploy your backend to Render first
2. Get your Render backend URL (e.g., `https://stock-crypto-backend.onrender.com`)
3. Update `vercel.json` with your actual backend URL
4. Deploy frontend to Vercel
5. Test your application

That's it! Your app should work seamlessly.

## Testing

After deployment, test these endpoints in your browser console:

```javascript
// Should return backend health status
fetch('https://your-app.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log);
```

If you see a response, your API proxy is working correctly!
