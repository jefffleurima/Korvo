"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createOrganizationAndUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined },
      });
      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }
      await createOrganizationAndUser(companyName || "My Company");
      router.refresh();
      router.push("/setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
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
        <Label htmlFor="signup-company" className="text-black">
          Firm name
        </Label>
        <Input
          id="signup-company"
          type="text"
          placeholder="Smith & Associates Law"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border-black/20 bg-white"
          autoComplete="organization"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-black">
          Email
        </Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password" className="text-black">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border-black/20 bg-white"
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full bg-black text-white hover:bg-black/90"
        disabled={isLoading}
      >
        {isLoading ? "Creating account…" : "Get started"}
      </Button>
      <p className="text-center text-sm text-black/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
