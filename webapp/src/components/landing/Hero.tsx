import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white px-6 pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-black/50">
          For med spas
        </p>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-black md:text-5xl lg:text-6xl">
          Never miss a $2,500 consultation again.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black/70">
          Korvo answers every call, qualifies leads, and books consultations automatically—24/7. So your med spa never drops a potential client, even at 10 PM.
        </p>
        <ul className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-black/60">
          <li>Capture every signal</li>
          <li>AI engages in seconds</li>
          <li>Intent scoring + routing</li>
        </ul>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="group rounded-full bg-black px-8 py-6 text-base font-medium text-white hover:bg-black/90"
          >
            <Link href="/register" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
