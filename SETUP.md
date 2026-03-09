# Portfolio Setup Instructions

## Environment Variables Configuration

This portfolio uses Spotify and GitHub APIs. You need to configure environment variables to make the Misc page work properly.

### 1. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the app details:
   - **App name**: My Portfolio Spotify Integration
   - **App description**: Spotify integration for my portfolio website
   - **Redirect URIs** (add BOTH):
     - `http://localhost:3000/api/spotify/callback` (for local development)
     - `https://www.myles-harris.com/api/spotify/callback` (for production)
   - **API**: Web API
5. Click "Save"
6. Copy the **Client ID** and **Client Secret**
7. Open `.env.local` and paste them:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

### 2. GitHub API Setup

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Portfolio Website")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)
7. Open `.env.local` and paste it:
   ```
   GITHUB_TOKEN=your_github_token_here
   GITHUB_USERNAME=your_github_username
   ```

### 3. Restart the Development Server

After configuring the environment variables:

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

The Spotify and GitHub widgets on the Misc page should now work!

### 4. Spotify OAuth Flow (First Time)

When you first access the Misc page:
1. The Spotify player will show an error
2. Visit `/api/spotify/auth` to start the OAuth flow
3. Log in with your Spotify account
4. Authorize the application
5. You'll be redirected back with an access token
6. The Spotify player should now work!

## Troubleshooting

### Spotify API Errors
- **"No Spotify access token available"**: Complete the OAuth flow at `/api/spotify/auth`
- **"Spotify client credentials not configured"**: Check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`
- **401 Unauthorized**: Your access token may have expired. Re-authorize at `/api/spotify/auth`

### GitHub API Errors
- **"GitHub token not configured"**: Add your `GITHUB_TOKEN` to `.env.local`
- **403 Forbidden**: Your token may have expired or doesn't have the right scopes. Generate a new one.
- **401 Unauthorized**: Your token is invalid. Generate a new one.

## Security Notes

- **Never commit `.env.local` to git** - It's already in `.gitignore`
- **Never share your tokens publicly**
- **Rotate tokens regularly** for security
- **For production deployment**, set environment variables in your hosting platform (Vercel, Netlify, etc.)
