# Deployment troubleshooting

## "Error loading organizations" / "Failed to load organizations" in production

The frontend calls the backend via Next.js **rewrites**: requests to `/api/*` are proxied to the URL in **`NEXT_PUBLIC_API_URL`**. If that variable is **not set in Vercel** (or is wrong), the rewrite points to `http://localhost:8001`, which does not exist in production, so the request fails.

**Fix:**

1. **Vercel** → Your project → **Settings** → **Environment Variables**
2. Add (or update):
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** your production backend URL, e.g. `https://your-app.up.railway.app` (no trailing slash)
   - **Environment:** Production (and Preview if you use it)
3. **Redeploy** so the new value is used at build time: **Deployments** → latest → **⋯** → **Redeploy**

Also ensure the **backend** (e.g. Railway) is running and reachable: open `https://your-backend-url/api/health` in a browser; you should see `{"status":"healthy"}`.

---

## Local changes not showing in production

If you pushed to Git but production (e.g. diagnostic.kpi99.co) still shows old content, check the following.

## 1. Confirm Vercel is building from the right place

- Vercel Dashboard → Your Project → **Settings** → **General**
- **Root Directory** must be **`frontend`** (this repo has the Next.js app in `frontend/`).
- If it’s blank or `.`, Vercel may be building the wrong folder. Set to `frontend` and redeploy.

## 2. Confirm which branch production uses

- **Settings** → **Git** → **Production Branch**.
- It’s usually `main`. If it’s something else (e.g. `production`), either push to that branch or change Production Branch to `main`.

## 3. Trigger a new deployment

- **Deployments** → open the latest deployment → **⋯** → **Redeploy** (or **Redeploy with existing Build Cache**).
- Or push an empty commit:  
  `git commit --allow-empty -m "Trigger deploy" && git push`

## 4. Check the latest build

- **Deployments** → click the latest deployment.
- If **Status** is **Failed**, open it and read the **Build Logs** (often missing env, type errors, or install failures).
- Fix any errors and push again (or fix in Vercel and redeploy).

## 5. Environment variables

- **Settings** → **Environment Variables**.
- `NEXT_PUBLIC_*` and other build-time vars are baked in at **build** time. After changing them, **redeploy** (new build) or they won’t apply.

## 6. Caching

- Do a **hard refresh**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac).
- Or test in an **incognito/private** window.
- If you use a CDN or custom cache in front of Vercel, purge cache there too.

## 7. You’re on a preview URL

- Each branch/PR gets a **Preview** URL (e.g. `kpi99-ppi-f-xxx.vercel.app`).
- **Production** is the URL you set as production (e.g. `diagnostic.kpi99.co`). Open that URL to confirm.

## Quick checklist

| Check | Where |
|-------|--------|
| Root Directory = `frontend` | Settings → General |
| Production branch = `main` (or the branch you push) | Settings → Git |
| Latest deployment status = Ready | Deployments |
| Build logs show no errors | Deployments → latest → Build Logs |
| Hard refresh or incognito | Browser |

After changing **Root Directory** or **Production Branch**, use **Redeploy** so production runs from the correct branch and folder.
