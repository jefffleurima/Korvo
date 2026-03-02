import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/SignupForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-6 pt-28 pb-20">
        <div className="mx-auto max-w-md">
          <Card className="border-black/10 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-black">Get started</CardTitle>
              <CardDescription className="text-black/70">
                Create your account to set up Korvo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
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
