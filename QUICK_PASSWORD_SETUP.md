# Quick Setup: Vercel Password Protection

## Enable Password Protection in 3 Steps

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in to your account
3. Select your project: **KPI99_PPI_F_Digital_Diagnostic**

### Step 2: Enable Password Protection
1. Click **Settings** (in the top navigation)
2. Click **Deployment Protection** (in the left sidebar)
3. Find the **Password Protection** section
4. Toggle the switch to **ON**
5. Enter a strong password (12+ characters recommended)
   - Example: `KPI99-PPI-F-2024!Secure`
6. Choose protection scope:
   - **All Deployments** (recommended) - Protects production and preview deployments
   - **Preview Deployments Only** - Only protects preview/PR deployments
7. Click **Save**

### Step 3: Test Access
1. Visit your site: `https://diagnostic.kpi99.co/`
2. You should see a browser password prompt
3. Enter the password you set
4. Site should load after authentication

## Password Requirements

- **Minimum**: 8 characters (Vercel requirement)
- **Recommended**: 12+ characters
- **Best Practice**: Mix of uppercase, lowercase, numbers, and symbols
- **Example**: `KPI99-PPI-F-2024!Secure`

## How It Works

- Uses **HTTP Basic Authentication**
- Password is transmitted over **HTTPS** (secure)
- Works with all routes and pages
- Applies to both custom domain and Vercel default URL
- Single password shared by all authorized users

## Security Layers

Your application has **two layers of security**:

1. **Vercel Password Protection** (Site Level)
   - Protects entire frontend
   - Required to access any page
   - Configured in Vercel dashboard

2. **API Key Authentication** (Organization Level)
   - Each organization has unique API key
   - Required to access organization data
   - Configured in application

## Updating Password

1. Go to **Settings** → **Deployment Protection**
2. Update the password field
3. Click **Save**
4. New password takes effect immediately
5. All users will need to re-authenticate

## Disabling Password Protection

1. Go to **Settings** → **Deployment Protection**
2. Toggle **Password Protection** to **OFF**
3. Click **Save**
4. Site becomes publicly accessible immediately

## Troubleshooting

### Password prompt doesn't appear
- Check that password protection is enabled in Vercel dashboard
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Verify you're accessing the correct domain

### Can't access after entering password
- Verify password is correct (case-sensitive)
- Check browser console for errors
- Try a different browser
- Contact Vercel support if issue persists

### Want to change password
- Go to Settings → Deployment Protection
- Update password field
- Save changes
- All users must use new password

## Best Practices

1. ✅ Use a strong, unique password
2. ✅ Share password securely with authorized users only
3. ✅ Rotate password periodically (every 90 days recommended)
4. ✅ Document password in secure password manager
5. ✅ Combine with API key authentication for organization-level security

## Access Flow

```
User visits https://diagnostic.kpi99.co/
    ↓
Browser shows password prompt (HTTP Basic Auth)
    ↓
User enters Vercel password
    ↓
Frontend loads
    ↓
User enters Organization API Key (if needed)
    ↓
Full access to diagnostic tool
```

## Support

- Vercel Docs: [vercel.com/docs/security/deployment-protection](https://vercel.com/docs/security/deployment-protection)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

