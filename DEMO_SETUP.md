# Demo Application Setup Guide

This guide will help you set up and run the demo application that showcases the `better-auth-strava` package.

## Prerequisites

- [Bun](https://bun.sh) installed (or Node.js 18+)
- [Docker](https://www.docker.com) and Docker Compose
- A Strava account
- A Strava OAuth application

## Quick Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Strava OAuth Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application (or use an existing one)
3. Set the **Authorization Callback Domain** to `localhost`
4. Copy your **Client ID** and **Client Secret**

### 3. Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL 16 instance with:
- **Host:** `localhost:5432`
- **Database:** `better_auth_strava`
- **User:** `postgres`
- **Password:** `postgres`

**Verify it's running:**
```bash
docker ps | grep better-auth-postgres
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cd apps/web
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Strava OAuth Credentials
STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/better_auth_strava
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 5. Initialize the Database

Run the migration script to create the necessary tables:

```bash
bun run db:migrate
```

This creates the following tables in PostgreSQL:
- `user` - User accounts and profile data
- `session` - Active user sessions
- `account` - OAuth provider connections
- `verification` - Email verification tokens

### 6. Start the Development Server

```bash
bun dev
```

The demo app will be available at **http://localhost:3000**

## Demo Features

The demo application showcases:

### Authentication
- ✅ Sign in with Strava OAuth
- ✅ Automatic token refresh
- ✅ Secure session management
- ✅ Sign out functionality

### User Interface
- ✅ Modern, responsive design
- ✅ Dark mode support
- ✅ Shadcn UI components
- ✅ User profile display
- ✅ Athlete data from Strava

### Technical Features
- ✅ Next.js 15 App Router
- ✅ PostgreSQL database
- ✅ Type-safe API routes
- ✅ Server-side session handling
- ✅ Client-side React hooks

## Project Structure

```
apps/web/
├── app/
│   ├── api/auth/[...all]/
│   │   └── route.ts              # Better Auth API handler
│   ├── page.tsx                   # Home page with auth UI
│   ├── layout.tsx                 # Root layout with providers
│   └── globals.css                # Global styles
├── lib/
│   ├── auth.ts                    # Better Auth server config
│   ├── auth-client.ts             # Better Auth client utilities
│   └── db.ts                      # Database connection
├── components/
│   └── ui/                        # Shadcn UI components
└── .env                           # Environment variables (not in git)
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

```bash
# Check if container is running
docker ps

# View container logs
docker logs better-auth-postgres

# Restart the container
docker-compose restart
```

### Port Already in Use

**Problem:** Port 5432 or 3000 already in use

```bash
# For PostgreSQL (port 5432)
# Stop other PostgreSQL instances or change port in docker-compose.yml

# For Next.js (port 3000)
# Change port: bun dev --port 3001
```

### Migration Errors

**Problem:** Database migration fails

```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Wait for PostgreSQL to be ready
sleep 5

# Run migration again
bun run db:migrate
```

### Strava OAuth Errors

**Problem:** Redirect URI mismatch

1. Check your Strava app settings at https://www.strava.com/settings/api
2. Ensure **Authorization Callback Domain** is set to `localhost`
3. Restart the dev server after changing OAuth settings

**Problem:** Invalid client credentials

1. Verify `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` in `.env`
2. Ensure no extra spaces or quotes
3. Regenerate credentials in Strava if needed

### Session Issues

**Problem:** Session not persisting

1. Check `BETTER_AUTH_SECRET` is set and at least 32 characters
2. Clear browser cookies and localStorage
3. Restart the development server

## Database Management

### Access PostgreSQL CLI

```bash
docker exec -it better-auth-postgres psql -U postgres -d better_auth_strava
```

### View Tables

```sql
\dt                          -- List all tables
\d user                      -- Describe user table
SELECT * FROM "user";        -- View all users
SELECT * FROM session;       -- View all sessions
```

### Reset Database

```bash
# Stop and remove containers with volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-run migrations
bun run db:migrate
```

## Development Tips

### Hot Reload

The demo uses Turbo for fast hot reload. Changes to:
- React components → Instant refresh
- API routes → Requires page refresh
- Environment variables → Requires server restart

### Debugging

Enable debug logging in `apps/web/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  // ... other config
  logger: {
    level: "debug",
  },
});
```

### Testing Different Scopes

Modify scopes in `apps/web/lib/auth.ts`:

```typescript
socialProviders: {
  strava: {
    clientId: process.env.STRAVA_CLIENT_ID!,
    clientSecret: process.env.STRAVA_CLIENT_SECRET!,
    scopes: ["read", "activity:read_all"], // Customize here
  },
},
```

After changing scopes:
1. Sign out from the demo
2. Restart the server
3. Sign in again to reauthorize with new scopes

## Stopping the Demo

### Stop Development Server
Press `Ctrl+C` in the terminal running `bun dev`

### Stop PostgreSQL

```bash
# Stop but keep data
docker-compose stop

# Stop and remove (keeps volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## Next Steps

- Explore the [main README](./README.md) for usage examples
- Check out the [package documentation](./packages/better-auth-strava/README.md)
- Read [Better Auth docs](https://www.better-auth.com) for advanced features
- Review [Strava API docs](https://developers.strava.com) for available data

## Need Help?

- Check [Better Auth Documentation](https://www.better-auth.com)
- Open an issue at [GitHub Issues](https://github.com/cipher416/better-auth-strava/issues)
- Review [Strava API Documentation](https://developers.strava.com)
