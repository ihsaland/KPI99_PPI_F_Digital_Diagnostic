# PPI-F Diagnostic Tool Deployment Guide

This guide covers deploying the PPI-F Diagnostic Tool as a password-protected subdomain (`diagnostic.kpi99.co`).

## Prerequisites

- Server with Docker and Docker Compose (or manual setup)
- Domain DNS access for `kpi99.co`
- SSL certificate (Let's Encrypt recommended)
- Nginx installed (for reverse proxy and password protection)

## Architecture

```
diagnostic.kpi99.co (subdomain)
├── Nginx (reverse proxy + password protection)
├── Frontend (Next.js on port 3000)
└── Backend (FastAPI on port 8001)
```

## Step 1: DNS Configuration

Add an A record or CNAME for the subdomain:

```
Type: A
Name: diagnostic
Value: [Your server IP]
TTL: 3600
```

Or if using a load balancer:

```
Type: CNAME
Name: diagnostic
Value: [Your load balancer hostname]
TTL: 3600
```

## Step 2: SSL Certificate

Install Let's Encrypt certificate:

```bash
sudo certbot certonly --nginx -d diagnostic.kpi99.co
```

## Step 3: Set Up Password Protection

Create password file for HTTP Basic Auth:

```bash
sudo htpasswd -c /etc/nginx/.htpasswd username
# Enter password when prompted
```

To add more users:
```bash
sudo htpasswd /etc/nginx/.htpasswd another_username
```

## Step 4: Configure Nginx

1. Copy `nginx.conf` to `/etc/nginx/sites-available/diagnostic.kpi99.co`
2. Update SSL certificate paths if needed
3. Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/diagnostic.kpi99.co /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 5: Deploy Application

### Option A: Docker Compose (Recommended)

```bash
cd /path/to/KPI99_PPI_F_Digital_Diagnostic

# Update environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option B: Manual Deployment

#### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migration to add API key fields
python -m app.migrate_add_api_keys

# Set environment variables
export DATABASE_URL="sqlite:///./kpi99_diagnostic.db"
export CORS_ORIGINS="https://diagnostic.kpi99.co,https://kpi99.co"

# Run with production server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run build

# Set environment variable
export NEXT_PUBLIC_API_URL="https://diagnostic.kpi99.co/api"

# Run production server
npm start
```

## Step 6: Set Up Organizations

1. Access the API (with password):
   ```
   https://diagnostic.kpi99.co/api/docs
   ```

2. Create an organization:
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/" \
     -u "username:password" \
     -H "Content-Type: application/json" \
     -d '{"name": "Example Corp", "domain": "example.com"}'
   ```

3. Generate API key for the organization:
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/1/generate-api-key" \
     -u "username:password"
   ```
   
   **Save the API key** - it's only shown once!

4. (Optional) Set subdomain for organization:
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/1/set-subdomain?subdomain=example" \
     -u "username:password"
   ```

## Step 7: Frontend Configuration

Update `frontend/lib/api.ts` to use the subdomain:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.origin}/api`  // Use same origin
    : 'https://diagnostic.kpi99.co/api');
```

## Step 8: Environment Variables

### Backend (.env)

```env
DATABASE_URL=sqlite:///./kpi99_diagnostic.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/kpi99_diagnostic

SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://diagnostic.kpi99.co,https://kpi99.co
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://diagnostic.kpi99.co/api
```

## Security Considerations

1. **Password Protection**: HTTP Basic Auth at Nginx level (first layer)
2. **API Keys**: Organization-level access control (second layer)
3. **HTTPS Only**: All traffic encrypted
4. **CORS**: Restricted to allowed origins
5. **Rate Limiting**: Consider adding rate limiting in production

## Monitoring

- Backend health: `https://diagnostic.kpi99.co/api/health`
- Check logs: `docker-compose logs -f` or system logs
- Monitor disk space for database and uploads

## Troubleshooting

### 502 Bad Gateway
- Check if backend is running: `curl http://localhost:8001/api/health`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### CORS Errors
- Verify `CORS_ORIGINS` includes your domain
- Check browser console for specific error

### Database Issues
- Run migration: `python -m app.migrate_add_api_keys`
- Check database file permissions

## Maintenance

### Update Application

```bash
git pull
docker-compose build
docker-compose up -d
```

### Backup Database

```bash
# SQLite
cp backend/kpi99_diagnostic.db backups/kpi99_diagnostic_$(date +%Y%m%d).db

# PostgreSQL
pg_dump kpi99_diagnostic > backups/kpi99_diagnostic_$(date +%Y%m%d).sql
```

## Support

For issues or questions, refer to:
- Backend API docs: `https://diagnostic.kpi99.co/api/docs`
- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`




