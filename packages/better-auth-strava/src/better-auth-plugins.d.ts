declare module "better-auth/plugins" {
  export interface OAuthUserMapping {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    metadata?: Record<string, unknown>;
  }

  export interface OAuthProviderConfig {
    providerId: string;
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    redirectURI?: string;
    scopes?: string[];
    accessType?: string;
    authorizationUrlParams?: Record<string, string | undefined>;
    mapProfileToUser?: (profile: unknown) => OAuthUserMapping | Promise<OAuthUserMapping>;
  }

  export interface GenericOAuthOptions {
    config: OAuthProviderConfig[];
  }

  export type OAuthPlugin = (request: unknown) => Promise<unknown> | unknown;

  export function genericOAuth(options: GenericOAuthOptions): OAuthPlugin;
}
