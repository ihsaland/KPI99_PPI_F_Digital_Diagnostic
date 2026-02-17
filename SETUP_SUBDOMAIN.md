# Quick Setup Guide for Subdomain Deployment

## Overview

This guide will help you quickly set up the PPI-F Diagnostic Tool on `diagnostic.kpi99.co` with password protection and organization-level access.

## Quick Start (5 Steps)

### 1. DNS Setup

Add DNS record for subdomain:
- **Type**: A (or CNAME if using load balancer)
- **Name**: `diagnostic`
- **Value**: Your server IP address
- **TTL**: 3600

### 2. SSL Certificate

```bash
sudo certbot certonly --nginx -d diagnostic.kpi99.co
```

### 3. Password Protection

```bash
# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Add more users (optional)
sudo htpasswd /etc/nginx/.htpasswd user2
```

### 4. Deploy Application

```bash
cd /path/to/KPI99_PPI_F_Digital_Diagnostic

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit backend/.env with your settings
nano backend/.env

# Deploy with Docker
docker-compose up -d

# Or deploy manually (see DEPLOYMENT.md)
```

### 5. Configure Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/diagnostic.kpi99.co

# Update SSL paths if needed
sudo nano /etc/nginx/sites-available/diagnostic.kpi99.co

# Enable site
sudo ln -s /etc/nginx/sites-available/diagnostic.kpi99.co /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Initial Organization Setup

1. **Access the API** (with HTTP Basic Auth):
   ```
   https://diagnostic.kpi99.co/api/docs
   ```

2. **Create Organization**:
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/" \
     -u "admin:your-password" \
     -H "Content-Type: application/json" \
     -d '{"name": "Your Organization", "domain": "yourdomain.com"}'
   ```

3. **Generate API Key** (save this!):
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/1/generate-api-key" \
     -u "admin:your-password"
   ```

4. **Set Subdomain** (optional):
   ```bash
   curl -X POST "https://diagnostic.kpi99.co/api/organizations/1/set-subdomain?subdomain=yourorg" \
     -u "admin:your-password"
   ```

## Access Control Layers

1. **HTTP Basic Auth** (Nginx level)
   - Username/password required to access the site
   - Configured in `/etc/nginx/.htpasswd`

2. **API Key** (Application level)
   - Each organization gets a unique API key
   - Frontend stores API key in localStorage
   - Backend validates API key for all requests

## Testing

1. **Health Check**:
   ```bash
   curl https://diagnostic.kpi99.co/api/health
   ```

2. **Access Frontend**:
   Open `https://diagnostic.kpi99.co` in browser
   - Should prompt for HTTP Basic Auth
   - After login, should see the diagnostic tool

3. **API Access**:
   ```bash
   # With HTTP Basic Auth
   curl -u "admin:password" https://diagnostic.kpi99.co/api/organizations/
   
   # With API Key
   curl -H "X-API-Key: your-api-key" https://diagnostic.kpi99.co/api/organizations/
   ```

## Troubleshooting

- **502 Bad Gateway**: Check if backend is running (`docker-compose ps`)
- **403 Forbidden**: Check API key or HTTP Basic Auth credentials
- **CORS Errors**: Verify `CORS_ORIGINS` in backend `.env`
- **SSL Issues**: Check certificate paths in nginx config

## Next Steps

- See `DEPLOYMENT.md` for detailed deployment instructions
- Configure monitoring and backups
- Set up automated SSL renewal
- Review security best practices



