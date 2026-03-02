import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-black">KORVO</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-black/45">For med spas</span>
        </Link>
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/#features"
            className="text-sm text-black/70 transition-colors hover:text-black"
          >
            Features
          </Link>
          <Link
            href="/login"
            className="text-sm text-black/70 transition-colors hover:text-black"
          >
            Login
          </Link>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-black px-5 font-medium text-white hover:bg-black/90"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
