# Vercel Deployment Guide - PPI-F Diagnostic Tool

This guide covers deploying the PPI-F Diagnostic Tool using **Vercel (Frontend) + Railway/Render (Backend)** with API key-based organization access.

## Architecture

```
diagnostic.kpi99.co (Vercel)
├── Frontend (Next.js) - Vercel
└── Backend API (FastAPI) - Railway or Render
    └── Database (PostgreSQL or SQLite)
```

## Prerequisites

- Vercel account (free tier works)
- Railway or Render account (for backend)
- GitHub repository with your code
- Domain DNS access for `kpi99.co`

## Step 1: Deploy Backend (Railway or Render)

### Option A: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory

3. **Configure Environment Variables**
   - Go to Variables tab
   - Add the following:
     ```
     DATABASE_URL=postgresql://... (Railway provides PostgreSQL)
     SECRET_KEY=your-secure-random-string
     CORS_ORIGINS=https://diagnostic.kpi99.co,https://kpi99.co
     UPLOAD_DIR=./uploads
     REPORT_DIR=./reports
     ```

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

5. **Deploy**
   - Railway will auto-deploy on push to main branch
   - Note the deployment URL (e.g., `https://your-app.railway.app`)

6. **Run Database Migration**
   - Go to Deployments → View Logs
   - Or use Railway CLI:
     ```bash
     railway run python -m app.migrate_add_api_keys
     ```

### Option B: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Service**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3

4. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://... (Render provides PostgreSQL)
   SECRET_KEY=your-secure-random-string
   CORS_ORIGINS=https://diagnostic.kpi99.co,https://kpi99.co
   UPLOAD_DIR=./uploads
   REPORT_DIR=./reports
   ```

5. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Copy the Internal Database URL
   - Add it to your Web Service environment variables

6. **Deploy**
   - Render will auto-deploy
   - Note the service URL (e.g., `https://your-app.onrender.com`)

7. **Run Database Migration**
   - Use Render Shell or SSH:
     ```bash
     python -m app.migrate_add_api_keys
     ```

## Step 2: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` directory

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```
     (Use your Railway or Render backend URL)

5. **Configure Custom Domain**
   - Go to Settings → Domains
   - Add `diagnostic.kpi99.co`
   - Follow DNS instructions:
     - Add CNAME record: `diagnostic` → `cname.vercel-dns.com`

6. **Enable Password Protection**
   - Go to Settings → Deployment Protection
   - Enable "Password Protection"
   - Set a password (this protects the entire site)
   - Save

7. **Deploy**
   - Vercel will auto-deploy on push to main branch
   - Or click "Deploy" to deploy immediately

## Step 3: DNS Configuration

Add DNS records for the subdomain:

### For Vercel Frontend:
```
Type: CNAME
Name: diagnostic
Value: cname.vercel-dns.com
TTL: 3600
```

Vercel will provide the exact CNAME value when you add the domain.

## Step 4: Set Up Organizations

1. **Access Backend API**
   - Go to `https://your-backend-url.railway.app/api/docs`
   - Or `https://your-backend-url.onrender.com/api/docs`

2. **Create Organization**
   ```bash
   curl -X POST "https://your-backend-url/api/organizations/" \
     -H "Content-Type: application/json" \
     -d '{"name": "Example Corp", "domain": "example.com"}'
   ```

3. **Generate API Key**
   ```bash
   curl -X POST "https://your-backend-url/api/organizations/1/generate-api-key" \
     -H "Content-Type: application/json"
   ```
   
   **Save the API key** - it's only shown once!

4. **Set Subdomain (Optional)**
   ```bash
   curl -X POST "https://your-backend-url/api/organizations/1/set-subdomain?subdomain=example" \
     -H "Content-Type: application/json"
   ```

## Step 5: Configure Frontend API Key Storage

The frontend automatically includes API keys from localStorage. Users need to:

1. Access `https://diagnostic.kpi99.co`
2. Enter Vercel password (if enabled)
3. Enter their organization API key (stored in localStorage)
4. The frontend will include the API key in all requests

## Environment Variables Summary

### Backend (Railway/Render)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secure-random-string
CORS_ORIGINS=https://diagnostic.kpi99.co,https://kpi99.co
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Access Control Layers

1. **Vercel Password Protection** (Site Level)
   - Protects entire frontend
   - Configured in Vercel dashboard

2. **API Key Authentication** (Organization Level)
   - Each organization has unique API key
   - Frontend stores in localStorage
   - Backend validates on every request

3. **Organization Isolation**
   - All data scoped to organization
   - API automatically filters by organization

## Testing

1. **Backend Health Check**
   ```bash
   curl https://your-backend-url/api/health
   ```

2. **Frontend Access**
   - Visit `https://diagnostic.kpi99.co`
   - Should prompt for Vercel password
   - After login, should see diagnostic tool

3. **API with API Key**
   ```bash
   curl -H "X-API-Key: your-api-key" \
     https://your-backend-url/api/organizations/
   ```

## Monitoring

### Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- View deployments, logs, and analytics

### Railway
- Dashboard: [railway.app/dashboard](https://railway.app/dashboard)
- View logs, metrics, and deployments

### Render
- Dashboard: [dashboard.render.com](https://dashboard.render.com)
- View logs, metrics, and deployments

## Troubleshooting

### Frontend Issues

**Build Fails**
- Check Vercel build logs
- Verify `NEXT_PUBLIC_API_URL` is set
- Check for TypeScript errors

**API Calls Fail**
- Verify backend URL is correct
- Check CORS settings in backend
- Verify API key is set in localStorage

### Backend Issues

**Deployment Fails**
- Check Railway/Render logs
- Verify all environment variables are set
- Check database connection

**Database Migration**
- Run migration manually via Railway CLI or Render Shell
- Check database connection string

**CORS Errors**
- Verify `CORS_ORIGINS` includes frontend domain
- Check backend logs for CORS errors

## Cost Estimates

### Vercel (Frontend)
- **Free Tier**: 100GB bandwidth, unlimited deployments
- **Pro**: $20/month for more bandwidth and features

### Railway (Backend)
- **Free Tier**: $5 credit/month
- **Pro**: Pay-as-you-go, ~$5-20/month for small apps

### Render (Backend)
- **Free Tier**: Spins down after inactivity
- **Starter**: $7/month for always-on service

## Security Best Practices

1. ✅ Use strong `SECRET_KEY` (generate with `openssl rand -hex 32`)
2. ✅ Enable Vercel password protection
3. ✅ Use HTTPS (automatic with Vercel)
4. ✅ Store API keys securely (localStorage is acceptable for this use case)
5. ✅ Regularly rotate API keys
6. ✅ Monitor access logs
7. ✅ Use PostgreSQL in production (not SQLite)

## Next Steps

- Set up monitoring and alerts
- Configure automated backups
- Set up CI/CD pipelines
- Review security settings
- Test organization isolation

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Render Docs: [render.com/docs](https://render.com/docs)



