  import { SignUp } from '@clerk/nextjs';
  import { clerkCustomAppearance } from '@/lib/clerkTheme';

  export default function SignUpPage() {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-base px-4 py-8 relative overflow-hidden antialiased">
        <div className="z-10 w-full max-w-md flex justify-center">
          <SignUp
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/"
            appearance={clerkCustomAppearance}
          />
        </div>
      </main>
    );
  }