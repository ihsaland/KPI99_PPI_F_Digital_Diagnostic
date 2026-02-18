# Backend Connection Troubleshooting Guide

## Error: "Failed to load organizations. Please check if the backend server is running."

This error means the frontend cannot connect to the Railway backend API.

## Quick Diagnosis Steps

### Step 1: Check Browser Console
1. Open `https://diagnostic.kpi99.co/` in your browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for error messages - they will show:
   - The URL being called
   - The error type (CORS, 404, timeout, etc.)
   - Network errors

### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for requests to `/api/organizations/`
4. Click on the request to see:
   - **Request URL** (should be your Railway backend URL)
   - **Status Code** (200 = success, 404/500 = error, CORS = CORS issue)
   - **Response** (error message if any)

## Common Issues and Fixes

### Issue 1: NEXT_PUBLIC_API_URL Not Set

**Symptoms:**
- Network tab shows requests to `https://diagnostic.kpi99.co/api/organizations/` (same domain)
- Should be pointing to Railway backend instead

**Fix:**
1. Get your Railway backend URL:
   - Railway Dashboard → Your Service → Settings → Networking
   - Copy the URL (e.g., `https://your-app.up.railway.app`)

2. Set in Vercel:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add/Update:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://your-app.up.railway.app
     ```
   - **Important**: No trailing slash, use `https://`

3. Redeploy:
   - Vercel Dashboard → Deployments → Latest → Redeploy
   - Or push a commit to trigger auto-deploy

### Issue 2: Backend Not Running

**Symptoms:**
- Network tab shows connection timeout or "Failed to fetch"
- Status code: 0 or no response

**Fix:**
1. Check Railway Dashboard:
   - Railway Dashboard → Your Service → Deployments
   - Verify latest deployment is "Active" (green)
   - Check logs for errors

2. Test backend directly:
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status": "healthy"}`

3. If backend is down:
   - Check Railway logs for errors
   - Restart the service if needed
   - Verify environment variables are set

### Issue 3: CORS Errors

**Symptoms:**
- Browser console shows: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
- Network tab shows CORS error

**Fix:**
1. Check Railway CORS settings:
   - Railway Dashboard → Your Service → Variables
   - Verify `CORS_ORIGINS` includes:
     ```
     https://diagnostic.kpi99.co,https://kpi99.co,https://kpi-99-ppi-f-digital-diagnostic.vercel.app
     ```

2. Update if needed:
   - Add/Update `CORS_ORIGINS` variable
   - Include all frontend domains (comma-separated, no spaces)
   - Restart Railway service (or it may auto-restart)

### Issue 4: Wrong Backend URL

**Symptoms:**
- Network tab shows 404 errors
- Backend URL doesn't match Railway URL

**Fix:**
1. Verify Railway backend URL:
   - Railway Dashboard → Your Service → Settings → Networking
   - Copy the exact URL

2. Update Vercel environment variable:
   - Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` with correct URL
   - Redeploy

### Issue 5: API Endpoint Path Issue

**Symptoms:**
- Network tab shows 404 on `/api/organizations/`
- Backend URL is correct but endpoint not found

**Fix:**
1. Test backend endpoint directly:
   ```bash
   curl https://your-backend-url.railway.app/api/organizations/
   ```

2. Check backend logs:
   - Railway Dashboard → Your Service → Deployments → View Logs
   - Look for route registration messages

3. Verify backend is running:
   - Visit: `https://your-backend-url.railway.app/api/docs`
   - Should show FastAPI Swagger documentation

## Step-by-Step Fix Checklist

- [ ] **Get Railway Backend URL**
  - Railway Dashboard → Service → Settings → Networking
  - Copy the URL (e.g., `https://your-app.up.railway.app`)

- [ ] **Test Backend is Running**
  ```bash
  curl https://your-backend-url.railway.app/api/health
  ```
  Should return: `{"status": "healthy"}`

- [ ] **Set NEXT_PUBLIC_API_URL in Vercel**
  - Vercel Dashboard → Project → Settings → Environment Variables
  - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app`
  - Apply to: Production, Preview, Development

- [ ] **Redeploy Vercel**
  - Vercel Dashboard → Deployments → Latest → Redeploy
  - Or push a commit

- [ ] **Check CORS Settings**
  - Railway Dashboard → Service → Variables
  - Verify `CORS_ORIGINS` includes frontend domain

- [ ] **Test in Browser**
  - Open `https://diagnostic.kpi99.co/`
  - Check browser console (F12)
  - Check Network tab for API calls
  - Verify requests go to Railway backend

## Debugging Commands

### Test Backend Health
```bash
curl https://your-backend-url.railway.app/api/health
```

### Test Organizations Endpoint
```bash
curl https://your-backend-url.railway.app/api/organizations/
```

### Test with API Key (if required)
```bash
curl -H "X-API-Key: your-api-key" \
     https://your-backend-url.railway.app/api/organizations/
```

### Check CORS
```bash
curl -H "Origin: https://diagnostic.kpi99.co" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend-url.railway.app/api/health
```

## Expected Behavior After Fix

✅ Browser console shows no errors  
✅ Network tab shows successful API calls to Railway backend  
✅ Organizations load successfully  
✅ Data displays correctly  
✅ API calls return 200 status codes  

## Still Having Issues?

1. **Check Vercel Build Logs:**
   - Vercel Dashboard → Deployments → Latest → Build Logs
   - Verify `NEXT_PUBLIC_API_URL` is available during build

2. **Check Railway Logs:**
   - Railway Dashboard → Service → Deployments → View Logs
   - Look for incoming requests or errors

3. **Verify Environment Variables:**
   - Vercel: `NEXT_PUBLIC_API_URL` is set correctly
   - Railway: `CORS_ORIGINS` includes frontend domain
   - Railway: `DATABASE_URL` is set (for database connection)

4. **Test Backend API Docs:**
   - Visit: `https://your-backend-url.railway.app/api/docs`
   - Should show FastAPI Swagger UI
   - Test endpoints from there

