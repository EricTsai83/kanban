"use client";

import { Loader2 } from "lucide-react";

type Props = {
  onClick: () => void;
  isLoading: boolean;
};

export function GoogleLoginButton({ onClick, isLoading }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-3 rounded-md bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-md transition-shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      ) : (
        <GoogleLogo />
      )}
      <span>{isLoading ? "Signing in…" : "Sign in with Google"}</span>
    </button>
  );
}

function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.14 29.52 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.45 13.16 17.77 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.67c-.55 2.95-2.2 5.45-4.67 7.13l7.19 5.58C43.29 37.57 46.52 31.5 46.52 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.74 28.26A14.54 14.54 0 0 1 9.5 24c0-1.48.26-2.91.72-4.26l-7.1-5.52A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.57 10.76l8.17-6.5z"
      />
      <path
        fill="#34A853"
        d="M24 47c5.52 0 10.15-1.83 13.53-4.96l-7.19-5.58C28.5 37.96 26.36 38.5 24 38.5c-6.23 0-11.55-3.66-13.26-8.74l-8.17 6.5C6.07 44.52 14.49 47 24 47z"
      />
    </svg>
  );
}
