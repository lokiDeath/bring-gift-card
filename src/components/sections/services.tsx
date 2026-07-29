"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { Icon } from "@/components/icon";
import { useWhatsApp } from "@/components/whatsapp-modal";

export default function Services() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <section id="services" className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">What We Do</span>
        <h2 className="mt-2 text-3xl font-black text-brand-900 sm:text-4xl">Our Core Financial Services</h2>
        <p className="mt-3 text-sm text-slate-600">
          End-to-end liquidity solutions for individuals and business traders globally.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="lift glass-strong flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-8"
          >
            <div>
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl ${s.accent} ${s.glow}`}
              >
                <Icon name={s.icon} className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-brand-900">{s.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => openWhatsApp(`I'm interested in your ${s.title} service.`)}
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white py-3 text-sm font-bold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
            >
              {s.id === "cards" ? "Trade Cards" : s.id === "crypto" ? "Trade Crypto" : "Transfer Money"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
