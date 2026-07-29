"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Bolt } from "lucide-react";
import { FOUNDERS } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutFounders() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* About copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6 lg:col-span-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            About Bring Gift Card
          </span>
          <h2 className="text-3xl font-black leading-tight text-brand-900 sm:text-4xl">
            Connecting Global Traders With Unmatched Speed & Security
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            At <strong className="text-brand-900">Bring Gift Card</strong>, we provide instant liquidity
            for all major gift card brands, cryptocurrency pairs, and international money transfers.
          </p>
          <p className="text-sm leading-relaxed text-slate-500">
            Our mission is simple: eliminate long waiting times, offer transparent top-tier market
            rates, and maintain 24/7 dedicated support for every customer around the globe.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
              <ShieldCheck className="mb-2 h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-brand-900">End-to-End Safe</h4>
              <p className="mt-1 text-xs text-slate-500">Protected trades with instant code verification.</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
              <Bolt className="mb-2 h-5 w-5 text-gold-600" />
              <h4 className="text-sm font-bold text-brand-900">Instant Bank Deposit</h4>
              <p className="mt-1 text-xs text-slate-500">Direct wire to your designated local bank account.</p>
            </div>
          </div>
        </motion.div>

        {/* Founders */}
        <div id="team" className="space-y-6 lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-6 text-center lg:text-left"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Leadership</span>
            <h3 className="mt-1 text-2xl font-bold text-brand-900">Meet Our Founders</h3>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FOUNDERS.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-sm transition hover:border-brand-300 hover:shadow-lg"
              >
                {/* Avatar with initials */}
                <div className={`mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-tr p-1 shadow-xl ${f.gradient}`}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-100">
                    <span className="text-2xl font-black text-brand-700">{f.initials}</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-brand-900">{f.name}</h4>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${f.accent}`}>
                  {f.role}
                </p>
                <p className="text-xs leading-relaxed text-slate-500">{f.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
