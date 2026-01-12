# 🚀 Quick Deployment Reference

## TL;DR - Deployment Steps

### 1️⃣ MongoDB Atlas (5 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster → Create database user → Allow all IPs (0.0.0.0/0)
3. Get connection string, replace `<password>` and add database name
4. **Save this connection string!**

### 2️⃣ Deploy Backend to Render (10 minutes)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: Any random secure string
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
6. Deploy and **save your Render URL**

### 3️⃣ Update Vercel Config (2 minutes)
1. Open `frontend/vercel.json`
2. Replace `YOUR-BACKEND-APP.onrender.com` with your actual Render URL
3. Commit and push changes

### 4️⃣ Deploy Frontend to Vercel (5 minutes)

**Option A - CLI:**
```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

**Option B - Dashboard:**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy

### 5️⃣ Test (2 minutes)
1. Open your Vercel URL
2. Register a new account
3. Test portfolio, crypto, watchlist features

---

## 📁 Files Created for Deployment

| File | Purpose |
|------|---------|
| `frontend/vercel.json` | Vercel config with API proxy |
| `frontend/.env.production.example` | Production env template |
| `frontend/src/config.js` | API configuration helper |
| `frontend/src/api.js` | Axios instance with auth |
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step guide |
| `FRONTEND_API_UPDATE.md` | API configuration options |

---

## 🔑 Environment Variables Needed

### Backend (Render)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/stock-crypto-app
JWT_SECRET=your_super_secret_key_here
PORT=10000
NODE_ENV=production
```

### Frontend (Vercel)
**No environment variables needed!** The `vercel.json` proxy handles everything.

---

## ✅ Deployment Checklist

```
[ ] MongoDB Atlas cluster created
[ ] Database user created with password saved
[ ] Network access configured (0.0.0.0/0)
[ ] Connection string obtained
[ ] Code pushed to GitHub
[ ] Backend deployed to Render
[ ] Render URL saved
[ ] vercel.json updated with Render URL
[ ] Frontend deployed to Vercel
[ ] Registration tested
[ ] Login tested
[ ] Portfolio features tested
[ ] API calls working (check browser console)
```

---

## 🎯 Important URLs

After deployment, save these:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Backend Health**: `https://your-app.onrender.com/api/health`

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Render logs, verify MongoDB connection string |
| Frontend can't reach backend | Verify `vercel.json` has correct Render URL |
| CORS errors | Backend already has `cors()` enabled, should work |
| MongoDB connection timeout | Check network access allows 0.0.0.0/0 |
| Render backend sleeping | Free tier sleeps after 15min inactivity, first request takes ~30s |

---

## 📊 Proof of Deployment

To document your deployment for submission:

### Screenshots to Take:
1. **MongoDB Atlas Dashboard** - showing your cluster
2. **Render Dashboard** - showing deployed backend service
3. **Vercel Dashboard** - showing deployed frontend
4. **Live Application** - registration page
5. **Live Application** - logged in dashboard with data
6. **Browser DevTools** - Network tab showing successful API calls
7. **Render Logs** - showing successful API requests

### Commands Used:
```bash
# Git commands
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# Vercel deployment
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

### Configuration Files Modified:
- `frontend/vercel.json` - Added API proxy configuration
- Backend environment variables set in Render dashboard
- MongoDB Atlas network access and user configuration

---

## 🎓 For Academic Submission

### What to Include:

1. **Deployment Guide** - `DEPLOYMENT_GUIDE.md` (comprehensive)
2. **Quick Reference** - This file (summary)
3. **Screenshots** - All 7 screenshots listed above
4. **Live URLs** - Frontend and backend URLs
5. **Repository** - GitHub repository link
6. **Commands Log** - Copy of all commands used
7. **Environment Variables** - List of variables (without actual values)

### Deployment Architecture Diagram:

```
User Browser
    ↓
Vercel (Frontend - React/Vite)
    ↓ /api/* requests proxied via vercel.json
Render (Backend - Node.js/Express)
    ↓
MongoDB Atlas (Database)
    ↓
CoinGecko API (Crypto data)
```

---

## ⏱️ Total Deployment Time

- MongoDB Atlas: ~5 minutes
- Backend to Render: ~10 minutes
- Frontend to Vercel: ~5 minutes
- Testing: ~5 minutes
- **Total: ~25 minutes**

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ You can register a new user
- ✅ You can log in
- ✅ Portfolio page loads and you can add holdings
- ✅ Crypto page shows live cryptocurrency data
- ✅ Watchlist works
- ✅ Transactions can be recorded
- ✅ No errors in browser console
- ✅ No errors in Render logs

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md`

**Need to update API configuration?** See `FRONTEND_API_UPDATE.md`
