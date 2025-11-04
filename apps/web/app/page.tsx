"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { signIn, signOut, useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  const handleSignIn = async () => {
    await signIn.social({
      provider: "strava",
      callbackURL: "/",
    });
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Better Auth + Strava</h1>
          <p className="text-muted-foreground text-lg">OAuth Provider Demo</p>
        </div>

        {!session ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign in with Strava</CardTitle>
                <CardDescription>
                  Connect your Strava account to see your athlete profile
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  className="bg-[#FC4C02] hover:bg-[#E34402] text-white"
                >
                  Connect with Strava
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Create a Strava API application at{" "}
                    <a
                      href="https://www.strava.com/settings/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      strava.com/settings/api
                    </a>
                  </li>
                  <li>
                    Set Authorization Callback Domain to{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      localhost
                    </code>
                  </li>
                  <li>Copy your Client ID and Client Secret</li>
                  <li>
                    Add them to your{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      .env
                    </code>{" "}
                    file
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "Profile"}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{session.user.name}</h2>
                    <p className="text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Data</CardTitle>
                <CardDescription>
                  Complete session information from Better Auth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span>OAuth 2.0 authentication with Strava</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span>Automatic token refresh</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span>Secure session management</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                <span>User profile and athlete data</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <a
            href="https://github.com/better-auth/better-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with better-auth
          </a>
          <span>•</span>
          <a
            href="https://developers.strava.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Strava API
          </a>
        </div>
      </footer>
    </div>
  );
}
