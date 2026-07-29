"use client";

import { motion } from "framer-motion";
import { MessageCircle, Calculator, ArrowRight, ChevronDown } from "lucide-react";
import GiftCard3D from "@/components/gift-card-3d";
import { LogoMark } from "@/components/logo";
import { useWhatsApp } from "@/components/whatsapp-modal";
import { TRUST } from "@/lib/data";
import { Icon } from "@/components/icon";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <section id="home" className="relative overflow-hidden px-4 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="space-y-8 text-center lg:col-span-7 lg:text-left"
        >
          {/* Status badge */}
          <div className="glass-pill inline-flex animate-pulse-soft items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 shadow-lg shadow-emerald-500/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Verified 24/7 Liquidity & Instant Payouts
          </div>

          <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl">
            Your Trusted <br />
            <span className="text-gradient">Global Gift Card</span> & <br />
            <span className="text-gradient-gold">Crypto Exchange</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
            Exchange Steam, Apple, Amazon, Visa, Xbox gift cards and cryptocurrencies with
            guaranteed best market rates, zero hidden charges, and instant money transfers
            globally.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <button
              onClick={() => openWhatsApp("I'd like to trade on WhatsApp now.")}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/25 transition hover:-translate-y-1 sm:w-auto"
            >
              <MessageCircle className="h-6 w-6 transition group-hover:scale-110" />
              Trade on WhatsApp Now
              <ArrowRight className="h-4 w-4 opacity-75 transition group-hover:translate-x-1" />
            </button>
            <a
              href="#calculator"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-200 bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-lg shadow-brand-500/10 transition hover:border-brand-400 hover:text-brand-500 sm:w-auto"
            >
              <Calculator className="h-5 w-5" />
              Check Live Rates
            </a>
          </div>

          {/* Trust micro-features */}
          <div className="grid max-w-lg grid-cols-2 gap-4 border-t border-brand-100 pt-6 text-left sm:grid-cols-3 lg:mx-0">
            {TRUST.map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 ${t.accent}`}>
                  <Icon name={t.icon} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-900">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — dark-blue 3D stage (so the white/blue cards pop with depth) */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 shadow-2xl shadow-brand-900/40 sm:p-8">
            {/* soft inner glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-300/20 blur-3xl" />

            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-2">
                <LogoMark size={28} />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-100">
                  Hot Exchange Rates
                </span>
              </div>
              <span className="rounded-full border border-brand-300/30 bg-brand-400/20 px-2.5 py-1 font-mono text-[10px] text-brand-100">
                Live Market
              </span>
            </div>

            {/* The 3D object */}
            <GiftCard3D />

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <span className="text-brand-200">Today&apos;s Top Rate:</span>
              <span className="flex items-center gap-1 font-bold text-emerald-300">
                ▲ Steam & Apple (High Demand)
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-brand-400/60 lg:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
