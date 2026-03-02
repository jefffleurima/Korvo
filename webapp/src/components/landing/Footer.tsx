import Link from "next/link";

const productLinks = [
  { href: "/#features", label: "Features" },
];

const companyLinks = [
  { href: "/register", label: "Get Started" },
  { href: "/register?demo=1", label: "Book Demo" },
  { href: "/login", label: "Login" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-black/[0.02] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight text-black">
              KORVO
            </Link>
            <p className="mt-2 max-w-xs text-sm text-black/60">
              Real-time lead interception + conversion engine for med spas. Answer every call, qualify, book—24/7.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-semibold text-black">Product</h4>
              <ul className="mt-3 space-y-2">
                {productLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-black/60 transition-colors hover:text-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-black">Company</h4>
              <ul className="mt-3 space-y-2">
                {companyLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-black/60 transition-colors hover:text-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-black/10 pt-8 text-center text-sm text-black/50">
          © {new Date().getFullYear()} Korvo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
