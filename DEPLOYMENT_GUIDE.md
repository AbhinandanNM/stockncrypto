# 🚀 Complete Deployment Guide - Stock & Crypto Trading Application

This guide provides step-by-step instructions for deploying your MERN application to production using **Vercel** (frontend), **Render** (backend), and **MongoDB Atlas** (database).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step 1: MongoDB Atlas Setup](#step-1-mongodb-atlas-setup)
4. [Step 2: Deploy Backend to Render](#step-2-deploy-backend-to-render)
5. [Step 3: Deploy Frontend to Vercel](#step-3-deploy-frontend-to-vercel)
6. [Step 4: Post-Deployment Verification](#step-4-post-deployment-verification)
7. [Commands & Steps Used](#commands--steps-used)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ GitHub account (to push your code)
- ✅ MongoDB Atlas account (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- ✅ Render account (free tier available at [render.com](https://render.com))
- ✅ Vercel account (free tier available at [vercel.com](https://vercel.com))
- ✅ Git installed on your local machine
- ✅ Node.js and npm installed

---

## Architecture Overview

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Vercel (Frontend)  │  ← React + Vite
│  your-app.vercel.app│
└──────┬──────────────┘
       │ API Calls
       ▼
┌─────────────────────┐
│  Render (Backend)   │  ← Node.js + Express
│  your-app.onrender  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  MongoDB Atlas      │  ← Database
└─────────────────────┘
```

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account & Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create"** to create a new cluster
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (choose closest to your users)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.2 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `stockcrypto-user` (or your choice)
5. Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://stockcrypto-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved earlier
7. Add database name before the `?`: 
   ```
   mongodb+srv://stockcrypto-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stock-crypto-app?retryWrites=true&w=majority
   ```

**✅ MongoDB Atlas Setup Complete!** Save this connection string for the next step.

---

## Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Navigate to your project root
cd "c:\ANM\cclab\Deployment"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Stock & Crypto Trading App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2.2 Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select your repository
5. Configure the service:

   | Field | Value |
   |-------|-------|
   | **Name** | `stock-crypto-backend` (or your choice) |
   | **Region** | Choose closest to your users |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

### 2.3 Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1.4 |
| `JWT_SECRET` | A random secure string (e.g., `your_super_secret_jwt_key_change_this_in_production_12345`) |
| `PORT` | `10000` (Render's default) |
| `NODE_ENV` | `production` |

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll see a URL like: `https://stock-crypto-backend.onrender.com`
4. Test the health endpoint: `https://stock-crypto-backend.onrender.com/api/health`

**✅ Backend Deployed!** Save your Render URL for the next step.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API Configuration

Before deploying, you need to configure the frontend to use your Render backend URL.

1. Check if your frontend has an API configuration file. Look for files like:
   - `src/config.js`
   - `src/api/config.js`
   - Or API calls in components using `axios`

2. Update the base URL to use environment variables. If not already configured, create `src/config.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export { API_BASE_URL };
```

3. Update your axios instances or API calls to use this config:

```javascript
import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;
```

### 3.2 Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? stock-crypto-frontend (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   | Field | Value |
   |-------|-------|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

### 3.3 Add Environment Variables in Vercel

1. In your Vercel project settings, go to **"Settings"** → **"Environment Variables"**
2. Add the following variable:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://stock-crypto-backend.onrender.com/api` (your Render URL) |

3. Click **"Save"**
4. Go to **"Deployments"** and redeploy the latest deployment

### 3.4 Verify Deployment

1. Your app will be available at: `https://your-app-name.vercel.app`
2. Open the URL and test the application

**✅ Frontend Deployed!**

---

## Step 4: Post-Deployment Verification

### 4.1 Test Complete User Flow

1. **Registration**
   - Go to your Vercel URL
   - Navigate to `/register`
   - Create a new account
   - Verify you receive a success message

2. **Login**
   - Log in with your new credentials
   - Verify you're redirected to the dashboard

3. **Portfolio Management**
   - Add a stock or crypto to your portfolio
   - Verify it appears in your holdings
   - Update or delete a holding

4. **Cryptocurrency Dashboard**
   - Navigate to the Crypto page
   - Verify live cryptocurrency data loads from CoinGecko API
   - Check that prices and market data display correctly

5. **Watchlist**
   - Add items to your watchlist
   - Verify they persist after page reload

6. **Transactions**
   - Record a buy/sell transaction
   - Verify it appears in your trading history
   - Check profit/loss calculations

7. **News Feed**
   - Navigate to the News page
   - Verify market news loads correctly

### 4.2 Check Browser Console

1. Open browser DevTools (F12)
2. Check the **Console** tab for errors
3. Check the **Network** tab to verify API calls are successful (status 200)

### 4.3 Monitor Render Logs

1. Go to your Render dashboard
2. Click on your backend service
3. Go to **"Logs"** tab
4. Verify no errors appear when making API calls from the frontend

---

## Commands & Steps Used

### Summary of All Commands

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit - Stock & Crypto Trading App"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main

# 2. Deploy Frontend to Vercel
npm install -g vercel
cd frontend
vercel login
vercel
vercel --prod
```

### Deployment Steps Checklist

- [x] Created MongoDB Atlas cluster
- [x] Configured database user and network access
- [x] Obtained MongoDB connection string
- [x] Pushed code to GitHub
- [x] Created Render web service
- [x] Configured Render environment variables
- [x] Deployed backend to Render
- [x] Updated frontend API configuration
- [x] Deployed frontend to Vercel
- [x] Configured Vercel environment variables
- [x] Verified complete user flow
- [x] Checked for errors in browser console and Render logs

---

## Troubleshooting

### Issue: Backend deployment fails on Render

**Solution:**
- Check Render logs for specific error messages
- Verify all environment variables are set correctly
- Ensure `package.json` has correct start script: `"start": "node server.js"`
- Verify MongoDB connection string is correct and network access is configured

### Issue: Frontend can't connect to backend

**Solution:**
- Verify `VITE_API_URL` environment variable is set in Vercel
- Check that the Render backend URL is correct and includes `/api`
- Ensure CORS is enabled in backend (`app.use(cors())`)
- Check browser console for CORS errors

### Issue: MongoDB connection timeout

**Solution:**
- Verify MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0)
- Check that the connection string includes the correct password
- Ensure the database user has proper permissions

### Issue: Vercel build fails

**Solution:**
- Check build logs in Vercel dashboard
- Verify `package.json` has correct build script: `"build": "vite build"`
- Ensure all dependencies are listed in `package.json`
- Check for TypeScript or linting errors

### Issue: Environment variables not working

**Solution:**
- In Vercel, environment variables must start with `VITE_` to be exposed to the client
- After adding/changing environment variables, redeploy the application
- Clear browser cache and hard reload (Ctrl+Shift+R)

---

## 🎉 Deployment Complete!

Your Stock & Crypto Trading Application is now live!

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://stock-crypto-backend.onrender.com`
- **Database**: MongoDB Atlas

### Important Notes:

⚠️ **Free Tier Limitations:**
- Render free tier: Backend may sleep after 15 minutes of inactivity (first request after sleep takes ~30 seconds)
- MongoDB Atlas free tier: 512MB storage limit
- Vercel free tier: 100GB bandwidth per month

💡 **Next Steps:**
- Set up custom domain in Vercel (optional)
- Configure monitoring and error tracking (e.g., Sentry)
- Set up automated backups for MongoDB
- Implement CI/CD pipeline for automatic deployments

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render and Vercel logs
3. Verify all environment variables are set correctly
4. Test API endpoints directly using tools like Postman or curl

---

**Created:** January 2026  
**Last Updated:** January 2026
