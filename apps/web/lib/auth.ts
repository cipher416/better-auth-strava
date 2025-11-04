import { betterAuth } from "better-auth";
import { strava } from "better-auth-strava";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const normalizeUrl = (url?: string | null) => {
  if (!url) {
    return undefined;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return undefined;
  }
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, "");
};

const trustedOrigins = Array.from(
  new Set(
    [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.NEXT_PUBLIC_VERCEL_URL,
    ]
      .map(normalizeUrl)
      .filter((value): value is string => Boolean(value)),
  ),
);

if (trustedOrigins.length === 0) {
  trustedOrigins.push("http://localhost:3000");
}

export const auth = betterAuth({
  database: pool,
  trustedOrigins,
  plugins: [
    strava({
      clientId: process.env.STRAVA_CLIENT_ID || "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET || "",
      scopes: ["read", "profile:read_all", "activity:read_all"],
      approvalPrompt: "auto",
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
