# Google OAuth Setup

To enable real Google sign-in, create a free OAuth client at Google Cloud Console.

## Steps

1. Go to https://console.cloud.google.com
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set Application type to **Web application**
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - Your production URL when you deploy
7. Click **Create** — copy the **Client ID** and **Client Secret**

## Fill in .env.local

Open `frontend/.env.local` and fill in:

```
AUTH_GOOGLE_ID=<your-client-id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<your-client-secret>
AUTH_SECRET=<any-random-string-32-chars>   # run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

## Generate AUTH_SECRET

Run this in your terminal:

```bash
openssl rand -base64 32
```

Paste the output as `AUTH_SECRET`.

## Restart the frontend

```bash
cd frontend && npm run dev
```

Google sign-in will now work on the `/auth/login` page.

## Note on OAuth consent screen

If you're the only user during development, set the app to **Testing** mode and add your Google account as a test user — no Google verification needed.
