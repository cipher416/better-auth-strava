# @better-auth/strava

Strava OAuth provider for [better-auth](https://github.com/better-auth/better-auth).

## Installation

Install the provider alongside `better-auth`:

```bash
bun add better-auth @better-auth/strava
# or
npm install better-auth @better-auth/strava
```

## Usage

```ts
import { betterAuth } from "better-auth";
import { strava } from "@better-auth/strava";

const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "./data/auth.db",
  },
  plugins: [
    strava({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
    }),
  ],
});
```

### Advanced Options

```ts
strava({
  clientId: process.env.STRAVA_CLIENT_ID!,
  clientSecret: process.env.STRAVA_CLIENT_SECRET!,
  redirectURI: "https://your-app.com/api/auth/callback/strava", // Optional: override redirect URI
  scopes: ["read", "profile:read_all", "activity:read_all"], // Optional: customize scopes
  approvalPrompt: "auto", // Optional: "auto" | "force"
  accessType: "offline", // Optional: "offline" | "online"
});
```

## Quick Start

1. **Get Strava API credentials** from [strava.com/settings/api](https://www.strava.com/settings/api)

2. **Set environment variables:**

   ```bash
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   ```

3. **Use in your app:**

   ```tsx
   import { createAuthClient } from "better-auth/react";

   const authClient = createAuthClient();

   // Sign in with Strava
   authClient.signIn.social({
     provider: "strava",
     callbackURL: "/dashboard",
   });

   // Get session
   const { data: session } = authClient.useSession();
   console.log(session.user.name); // "Cristoper Anderson"
   console.log(session.user.metadata.stravaAthleteId); // 34217575
   ```

## Configuration

| Option           | Type                      | Default                                             | Description                                                  |
| ---------------- | ------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `clientId`       | `string`                  | —                                                   | Strava OAuth client ID.                                      |
| `clientSecret`   | `string`                  | —                                                   | Strava OAuth client secret.                                  |
| `redirectURI`    | `string`                  | —                                                   | Override redirect URI if different from better-auth default. |
| `scopes`         | `string[]`                | `["read", "profile:read_all", "activity:read_all"]` | Strava OAuth scopes (comma-separated internally).            |
| `approvalPrompt` | `"auto"` \| `"force"`     | `"auto"`                                            | Controls Strava approval prompt behaviour.                   |
| `accessType`     | `"offline"` \| `"online"` | `"offline"`                                         | Whether to request refresh tokens.                           |

## Email Handling

**Important:** Strava does not provide email addresses through their API, even with the `profile:read_all` scope. This is a known limitation of the Strava API (see [NextAuth's Strava provider](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/strava.ts) which also doesn't provide email).

### Solution

This provider automatically generates deterministic placeholder emails in the format:

```
athlete-{athleteId}@strava.local
```

**Example:** `athlete-34217575@strava.local`

### Features

- ✅ **Plug-and-Play**: Works out of the box with any better-auth setup - no configuration needed
- ✅ **Deterministic**: Same athlete always gets the same email address
- ✅ **Identifiable**: Easy to filter placeholder emails by the `@strava.local` domain
- ✅ **Metadata Flag**: Check `session.user.metadata.hasPlaceholderEmail` to identify generated emails

### Handling Placeholder Emails

If you need real email addresses from users:

```ts
// Check if email is a placeholder
if (session.user.email.endsWith("@strava.local")) {
  // Prompt user to provide real email
}

// Or check the metadata flag
if (session.user.metadata.hasPlaceholderEmail) {
  // This user authenticated via Strava without email
}
```

### When Strava Provides Email

If a user's Strava account does provide an email (rare), the provider will:

- Use the real email address
- Set `emailVerified: true`
- Set `hasPlaceholderEmail: false` in metadata

## License

MIT
