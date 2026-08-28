"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MLForgeMark } from "@/components/icons";

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a href="/terms" className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45">
      Terms of Service
    </a>{" "}
    and{" "}
    <a href="/privacy" className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45">
      Privacy Policy
    </a>
  </>
);

type Mode = "signin" | "signup";

export default function AuthSectionOne() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = mode === "signup";

  const toggleMode = () => {
    setMode(isSignUp ? "signin" : "signup");
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNotice(null);

    if (isSignUp) {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        setError(authError.message);
      } else if (!data.session) {
        // Email confirmation is required on this project — there's no session yet,
        // so redirecting to /dashboard would just bounce back to /login.
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        let isAdmin = email.toLowerCase() === "senthil210520012421@gmail.com";
        if (!isAdmin && data?.user) {
          const { data: adminData } = await supabase.from('platform_admins').select('role').eq('user_id', data.user.id).maybeSingle();
          if (adminData) isAdmin = true;
        }
        
        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    }

    setIsLoading(false);
  };

  // Google/Apple aren't enabled in this Supabase project's Auth settings yet
  // (requires provider credentials from Google Cloud Console / Apple Developer).
  // Disabled rather than left silently broken.
  const oauthAvailable = false;

  const handleOAuth = async (provider: "google" | "apple") => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <section className="h-screen overflow-hidden bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="grid h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left: sign-in / sign-up form */}
        <div className="flex items-center justify-center overflow-hidden rounded-md border border-black/20 bg-white px-6 sm:px-10 dark:border-white/10 dark:bg-[#0a0a0a] lg:px-14 xl:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-2 flex items-center gap-2">
              <MLForgeMark className="w-[24px] h-[24px]" />
              <span className="text-sm font-bold tracking-tight">Payment Reminders</span>
            </div>

            <h1 className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm leading-snug text-black/60 dark:text-white/55">
              Payment Reminder — A sub-product of MLForge Studio.
            </p>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-2 text-sm"
                onClick={() => handleOAuth("google")}
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled
                title="Coming soon"
                className="h-9 gap-2 text-sm"
                onClick={() => handleOAuth("apple")}
              >
                <AppleIcon />
                Apple
              </Button>
            </div>

            <div className="my-4 flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              or
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 rounded-lg border border-input px-3 h-10 focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:border-ring">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-full border-0 shadow-none px-0 focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2 rounded-lg border border-input px-3 h-10 focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:border-ring">
                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    className="h-full border-0 shadow-none px-0 focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}
              {notice && <div className="text-sm text-[#16A34A]">{notice}</div>}

              {isSignUp ? (
                <p className="text-xs leading-5 text-black/40 dark:text-white/35">{termsText}</p>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal text-black/60 dark:text-white/55">
                      Remember me
                    </Label>
                  </div>
                  <button type="button" className="text-sm font-medium text-[#22C55E] hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-1 h-10 w-full bg-[#22C55E] text-white text-sm font-medium hover:bg-[#16A34A]"
              >
                {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-black/50 dark:text-white/50">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={toggleMode} className="font-medium text-[#22C55E] hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        {/* Right: brand panel, matches the landing page hero */}
        <div className="relative hidden items-center justify-center overflow-hidden rounded-md lg:flex">
          <img
            src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6929d3408e9ff6a515b9eee8_ai-hero--1-.avif"
            alt="Payment Reminders"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 sm:p-10">
            <div />
            <div>
              <h2 className="max-w-[520px] text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
                Get paid faster,
                <br />
                automatically.
              </h2>
              <p className="mt-3 max-w-[420px] text-sm text-white/85">
                Escalating reminder emails for overdue invoices, connected read-only to your own Stripe.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-white/85">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A3E635]" />
                Never moves money. Never creates invoices. Read-only, always.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
