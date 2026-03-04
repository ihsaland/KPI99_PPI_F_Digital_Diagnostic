# Semi-private site access

The app can be gated behind a single shared password so only people with the password can open the site.

## How it works

- When **password protection is enabled**, every request (except the unlock page and auth API) is checked for a valid access cookie.
- If the cookie is missing or invalid, the user is redirected to **`/unlock`**, where they enter the site password.
- On correct password, the server sets an **httpOnly, signed cookie** (no password stored in the cookie). The user is redirected to the page they tried to open (or home).
- The cookie lasts **30 days**; after that the user must enter the password again.

## Enable semi-private access

### 1. Environment variables

Set these in your deployment (e.g. Vercel → Project → Settings → Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `PASSWORD_PROTECTION_ENABLED` | Yes | Set to `true` to turn on the gate. |
| `SITE_PASSWORD` | Yes (when enabled) | The shared password users must enter to access the site. |

Example:

```
PASSWORD_PROTECTION_ENABLED=true
SITE_PASSWORD=your-secure-password-here
```

Use a strong password (e.g. 12+ characters, mixed case, numbers, symbols). Do not commit it to the repo.

### 2. Redeploy

Redeploy the frontend so the new env vars are applied. After that, visiting any page (except `/unlock`) will redirect to `/unlock` until the user enters the correct password.

## Disable semi-private access

- Set `PASSWORD_PROTECTION_ENABLED` to `false` (or remove it), then redeploy.
- The site will be fully public again; `/unlock` will redirect to home.

## Routes

- **`/unlock`** – Password form. Shown when protection is on and the user has no valid cookie.
- **`/api/auth/unlock`** – `POST` with `{ "password": "..." }`. Sets the access cookie on success.
- **`/api/auth/status`** – `GET`. Returns `{ "protected": true|false }`. Used by `/unlock` to redirect when protection is off.

## Security notes

- The password is only checked on the server; it is not stored in the cookie. The cookie holds a signed token.
- Cookie is `httpOnly` and `secure` in production, so it is not readable by JavaScript and is sent only over HTTPS.
- This is **semi-private** (one shared password). For per-user accounts, you would add a real auth system.
