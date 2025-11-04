import { createAuthClient } from "better-auth/react";
import type { Session } from "./auth";

const resolveBaseURL = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: resolveBaseURL(),
});

export const { signIn, signOut, useSession } = authClient;

export type { Session };
