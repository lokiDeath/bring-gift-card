import { CreditCard, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

const QUICK = [
  { label: "Home", href: "#home" },
  { label: "Live Rate Calculator", href: "#calculator" },
  { label: "Services", href: "#services" },
  { label: "Supported Gift Cards", href: "#showcase" },
  { label: "About Us", href: "#about" },
];

const SERVICE_LINKS = [
  "Gift Card Buying & Selling",
  "Cryptocurrency Exchange (USDT/BTC)",
  "Global Money Remittance",
  "Instant Bank Wire Payouts",
];

export default function Footer() {
  const address = "13B Ikosi Road, Ketu, Lagos, Nigeria";

  return (
    <footer className="relative z-20 border-t border-brand-900 bg-brand-950 pt-16 pb-12 text-sm text-brand-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-500/20 text-brand-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-black tracking-tight text-white">BRING GIFTCARD</span>
            </div>
            <p className="text-xs leading-relaxed text-brand-300">
              Your trusted global partner for gift card trading, cryptocurrency exchange, and
              international money transfers.
            </p>
            <p className="text-[11px] text-brand-400/60">&copy; {new Date().getFullYear()} Bring Gift Card. All rights reserved.</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              {QUICK.map((q) => (
                <li key={q.label}>
                  <a href={q.href} className="text-brand-300 transition-colors hover:text-white">{q.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-2 text-xs">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-brand-300 transition-colors hover:text-white">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — no phone number printed */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Direct Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-400" /> {address}
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Support 24/7
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> Verified Safe Payouts
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
