"use client";

import { SignIn, AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { clerkCustomAppearance } from "@/lib/clerkTheme";

export default function SignInPage() {
  const pathname = usePathname();

  if (pathname?.includes("/sso-callback")) {
    return (
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-base px-4 py-8 relative overflow-hidden antialiased">
      <div className="z-10 w-full max-w-md flex justify-center">
        <SignIn
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          appearance={clerkCustomAppearance}             
        />
      </div>
    </main>
  );
}
