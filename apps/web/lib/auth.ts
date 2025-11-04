import { betterAuth } from "better-auth";
import { strava } from "better-auth-strava";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  trustedOrigins: [process.env.BETTER_AUTH_URL || ""],
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
