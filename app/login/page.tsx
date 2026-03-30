"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  async function handleLogin() {
    await login();
    router.replace("/");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-sidebar-primary-foreground"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Kanban Board</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your board
        </p>
      </div>
      <GoogleLoginButton onClick={handleLogin} isLoading={isLoading} />
    </div>
  );
}
