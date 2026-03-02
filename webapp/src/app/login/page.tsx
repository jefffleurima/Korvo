import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/landing/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-6 pt-28 pb-20">
        <div className="mx-auto max-w-md">
          <Card className="border-black/10 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-black">Log in</CardTitle>
              <CardDescription className="text-black/70">
                Sign in to your Korvo dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="animate-pulse rounded-md h-48 bg-black/5" />}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-sm text-black/60">
            <Link href="/" className="hover:text-black">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
