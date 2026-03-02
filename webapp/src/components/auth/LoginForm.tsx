"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }
      router.refresh();
      router.push(redirect.startsWith("/") ? redirect : "/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-black">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-black/20 bg-white"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-black">
            Password
          </Label>
          <Link
            href="#"
            className="text-xs text-black/60 hover:text-black"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-black/20 bg-white"
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full bg-black text-white hover:bg-black/90"
        disabled={isLoading}
      >
        {isLoading ? "Signing in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-black/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-black hover:underline">
          Get started
        </Link>
      </p>
    </form>
  );
}
