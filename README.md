# Better Auth + Strava Demo

This is a demo web application showcasing the `@better-auth/strava` OAuth provider integration.

## Features

- OAuth 2.0 authentication with Strava
- Automatic token refresh (offline access)
- Secure session management with better-auth
- User profile and athlete data from Strava API
- Clean, modern UI with dark mode support

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Strava OAuth Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application (or use an existing one)
3. Set the **Authorization Callback Domain** to `localhost`
4. Copy your **Client ID** and **Client Secret**

### 3. Set Environment Variables

Copy the example environment file and fill in your Strava credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Strava credentials:

```env
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret
```

Generate a secure random secret for `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Initialize the Database

Run the migration script to create the necessary database tables:

```bash
bun run db:migrate
```

This will create a SQLite database at `data/auth.db` with the following tables:

- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

### 5. Run the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication Flow

1. User clicks "Connect with Strava"
2. User is redirected to Strava OAuth authorization page
3. After approval, Strava redirects back to `/api/auth/callback/strava`
4. Better-auth exchanges the authorization code for access tokens
5. User session is created and stored in the SQLite database
6. User profile is displayed on the page

### API Routes

- `GET /api/auth/[...all]` - Handles all better-auth endpoints including:
  - `/api/auth/signin/strava` - Initiates OAuth flow
  - `/api/auth/callback/strava` - Handles OAuth callback
  - `/api/auth/session` - Returns current session
  - `/api/auth/signout` - Signs out the user

### Project Structure

```
apps/web/
├── app/
│   ├── api/auth/[...all]/
│   │   └── route.ts          # Better-auth API handler
│   ├── page.tsx               # Demo UI
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── auth.ts                # Better-auth server config
│   └── auth-client.ts         # Better-auth client utilities
├── data/
│   └── auth.db                # SQLite database (auto-created)
└── .env                       # Environment variables
```

## Strava Scopes

The demo requests the following Strava scopes:

- `read` - Read public profile data
- `profile:read_all` - Read all profile information (includes email if available)
- `activity:read_all` - Read all activity data

You can modify the scopes in `apps/web/lib/auth.ts`.

## Email Handling

Strava does not provide email addresses through their API. The `@better-auth/strava` provider handles this automatically by:

- Generating deterministic placeholder emails: `athlete-{id}@strava.local`
- Setting `hasPlaceholderEmail: true` in user metadata
- Working out of the box with no configuration needed

**Example:** User with athlete ID `34217575` gets email `athlete-34217575@strava.local`

You can check if an email is a placeholder:

```typescript
if (session.user.email.endsWith("@strava.local")) {
  // This is a placeholder email
}
```

See the [@better-auth/strava package](../../packages/better-auth-strava) for more details.

## Learn More

- [Better Auth Documentation](https://www.better-auth.com)
- [Strava API Documentation](https://developers.strava.com)
- [@better-auth/strava Package](../../packages/better-auth-strava)

## License

MIT
