# Quick Start: Vercel Deployment

## 5-Minute Setup Guide

### Step 1: Deploy Backend (2 minutes)

**Railway:**
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub → Select repo → Select `backend` folder
3. Add PostgreSQL database (Railway auto-adds `DATABASE_URL`)
4. Add environment variables:
   ```
   SECRET_KEY=generate-with-openssl-rand-hex-32
   CORS_ORIGINS=https://diagnostic.kpi99.co,https://kpi99.co
   ```
5. Copy deployment URL (e.g., `https://your-app.railway.app`)

**OR Render:**
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. New → Web Service → Connect repo → Select `backend` folder
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL database → Copy Internal Database URL
6. Add environment variables (same as Railway)
7. Copy service URL

### Step 2: Deploy Frontend (2 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Add New → Project → Import repo
3. **Root Directory**: `frontend`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   (Use your Railway or Render URL)
5. Deploy

### Step 3: Configure Domain (1 minute)

1. In Vercel → Settings → Domains
2. Add `diagnostic.kpi99.co`
3. Add DNS CNAME record:
   ```
   Type: CNAME
   Name: diagnostic
   Value: [Vercel-provided-value]
   ```

### Step 4: Enable Password Protection

1. Vercel → Settings → Deployment Protection
2. Enable "Password Protection"
3. Set password
4. Save

### Step 5: Set Up First Organization

1. Go to backend API docs: `https://your-backend-url/api/docs`
2. Create organization:
   ```json
   POST /api/organizations/
   {
     "name": "Your Organization",
     "domain": "yourdomain.com"
   }
   ```
3. Generate API key:
   ```
   POST /api/organizations/1/generate-api-key
   ```
4. **Save the API key!**

## Done! 🎉

Your diagnostic tool is now live at `https://diagnostic.kpi99.co`

## Access Flow

1. User visits `https://diagnostic.kpi99.co`
2. Enters Vercel password (site-level protection)
3. Enters organization API key (stored in localStorage)
4. Accesses organization-specific data

## Troubleshooting

- **Build fails**: Check Vercel logs, verify `NEXT_PUBLIC_API_URL` is set
- **CORS errors**: Verify backend `CORS_ORIGINS` includes frontend domain
- **API errors**: Check backend logs in Railway/Render dashboard

## Next Steps

- See `VERCEL_DEPLOYMENT.md` for detailed instructions
- See `VERCEL_PASSWORD_SETUP.md` for password protection options
- Set up monitoring and alerts
- Configure automated backups



