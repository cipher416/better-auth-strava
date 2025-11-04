# Better Auth + Strava

See demo at : https://better-auth-strava-demo.cristoper.dev/

Strava OAuth provider for [Better Auth](https://www.better-auth.com) with automatic token refresh and seamless session management.

## Features

- 🔐 OAuth 2.0 authentication with Strava
- 🔄 Automatic token refresh (offline access)
- 📧 Smart email handling (placeholder generation for Strava's no-email limitation)
- 🎯 Type-safe session management
- ⚡ Zero-config setup with Better Auth

## Installation

```bash
npm install better-auth better-auth-strava
# or
bun add better-auth better-auth-strava
```

## Quick Start

### 1. Get Strava API Credentials

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Set your **Authorization Callback Domain** (e.g., `localhost` for development)
4. Copy your **Client ID** and **Client Secret**

### 2. Configure Better Auth

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { strava } from "better-auth-strava";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },
  socialProviders: {
    strava: {
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
    },
  },
});
```

### 3. Create Auth Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
});
```

### 4. Add API Route Handler

**Next.js App Router:**

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Next.js Pages Router:**

```typescript
// pages/api/auth/[...all].ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export default toNextJsHandler(auth);
```

### 5. Use in Your App

```tsx
"use client";

import { authClient } from "@/lib/auth-client";

export default function LoginButton() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "strava",
      callbackURL: "/dashboard",
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}!</p>
        <p>Athlete ID: {session.user.image}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={handleSignIn}>Connect with Strava</button>;
}
```

## Usage Examples

### Access Strava Athlete Data

```typescript
const { data: session } = authClient.useSession();

if (session) {
  console.log(session.user.name); // "John Doe"
  console.log(session.user.image); // Profile photo URL
  console.log(session.user.email); // "athlete-12345@strava.local" (placeholder)
}
```

### Check for Placeholder Email

Strava doesn't provide email addresses. This package automatically generates placeholder emails:

```typescript
const { data: session } = authClient.useSession();

if (session?.user.email.endsWith("@strava.local")) {
  // Prompt user to provide a real email
  console.log("Please add your email address");
}
```

### Customize Scopes

```typescript
import { betterAuth } from "better-auth";
import { strava } from "better-auth-strava";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },
  socialProviders: {
    strava: {
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      scopes: ["read", "profile:read_all", "activity:read", "activity:write"],
    },
  },
});
```

### Available Scopes

| Scope               | Description                                |
| ------------------- | ------------------------------------------ |
| `read`              | Read public profile data                   |
| `profile:read_all`  | Read all profile information               |
| `activity:read`     | Read activity data                         |
| `activity:read_all` | Read all activity data (including private) |
| `activity:write`    | Create and modify activities               |

### Server-Side Session Access

```typescript
// app/api/user/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    user: session.user,
  });
}
```

### Protect Routes with Middleware

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## Configuration Options

### Strava Provider Options

```typescript
strava({
  clientId: string;              // Required: Your Strava OAuth client ID
  clientSecret: string;          // Required: Your Strava OAuth client secret
  redirectURI?: string;          // Optional: Override redirect URI
  scopes?: string[];            // Optional: Custom scopes (default: ["read", "profile:read_all", "activity:read_all"])
  approvalPrompt?: "auto" | "force"; // Optional: Force re-authorization (default: "auto")
  accessType?: "offline" | "online"; // Optional: Refresh token support (default: "offline")
})
```

## Email Handling

**Important:** Strava does not provide email addresses through their API.

This package automatically generates deterministic placeholder emails:

```
athlete-{athleteId}@strava.local
```

**Example:** `athlete-34217575@strava.local`

### Why This Approach?

- ✅ **Seamless**: Works with Better Auth's required email field
- ✅ **Deterministic**: Same athlete always gets the same email
- ✅ **Identifiable**: Easy to detect with `.endsWith("@strava.local")`
- ✅ **No Configuration**: Zero setup required

### Handling in Your App

```typescript
// Check if user needs to provide email
if (session.user.email.endsWith("@strava.local")) {
  // Show email collection form
}

// Filter real vs placeholder emails
const realUsers = users.filter((u) => !u.email.endsWith("@strava.local"));
```

## Demo Application

This repository includes a full-featured demo app showing:

- Complete authentication flow
- Session management
- User profile display
- Modern UI with Shadcn components
- PostgreSQL database integration

See [Demo Setup Guide](./DEMO_SETUP.md) for installation instructions.

## Project Structure

```
.
├── packages/
│   └── better-auth-strava/      # NPM package
│       ├── src/
│       │   └── index.ts         # Strava provider implementation
│       └── README.md
├── apps/
│   └── web/                     # Demo Next.js app
│       ├── app/
│       ├── lib/
│       └── components/
├── docker-compose.yml           # PostgreSQL for demo
└── README.md                    # This file
```

## Resources

- [Better Auth Documentation](https://www.better-auth.com)
- [Strava API Documentation](https://developers.strava.com)
- [Package Documentation](./packages/better-auth-strava/README.md)
- [Demo Setup Guide](./DEMO_SETUP.md)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT © [Cristoper Anderson](https://github.com/cipher416)
