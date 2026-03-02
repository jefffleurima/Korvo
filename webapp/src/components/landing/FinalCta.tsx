import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-black/[0.03] px-8 py-16 text-center md:px-12 md:py-20">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-black md:text-3xl">
          Ready to never miss a consultation again?
        </h2>
        <p className="mt-3 text-black/70">
          Answer every call 24/7. Qualify leads. Book consults—even when your front desk is closed.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="group rounded-full bg-black px-8 py-6 text-base font-medium text-white hover:bg-black/90"
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
