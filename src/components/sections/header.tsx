"use client";

import { useEffect, useState } from "react";
import { Menu, X, Headset, MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { useWhatsApp } from "@/components/whatsapp-modal";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Rates", href: "#calculator" },
  { label: "Services", href: "#services" },
  { label: "Cards", href: "#showcase" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong border-b border-brand-100 py-2.5"
          : "border-b border-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <a href="#home" className="group">
          <Logo size={40} variant="dark" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-900/70 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-brand-500">
              {n.label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={() => openWhatsApp("General inquiry from the website.")}
            className="glass-pill flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:text-brand-500"
          >
            <Headset className="h-4 w-4 text-brand-500" />
            Support 24/7
          </button>
          <button
            onClick={() => openWhatsApp("I'd like to start an instant trade.")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Trade Now
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-brand-900 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mt-3 space-y-1 border-t border-brand-100 px-4 pb-4 pt-3 md:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-brand-900/80 hover:bg-brand-50 hover:text-brand-500"
            >
              {n.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openWhatsApp("I'd like to trade on WhatsApp.");
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> Trade on WhatsApp
          </button>
        </div>
      )}
    </header>
  );
}
