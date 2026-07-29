"use client";

import { motion } from "framer-motion";
import { MessageCircle, MapPin, Clock, Mail, Building2 } from "lucide-react";
import { useConfig } from "@/components/config-provider";
import { useWhatsApp } from "@/components/whatsapp-modal";

export default function Contact() {
  const { settings } = useConfig();
  const { openWhatsApp } = useWhatsApp();

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-8 shadow-lg sm:p-12"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Office details */}
          <div className="space-y-6 lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
              Physical Location
            </span>
            <h2 className="text-3xl font-black text-brand-900">Nigeria Office — Lagos</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Our Nigeria-based team works hard every day to serve our global customers. Reach us
              24/7 directly via WhatsApp — our agents reply instantly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-100 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">Office Address</h4>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-100 text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">Operating Hours</h4>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">
                    24 Hours / 7 Days A Week (Non-stop Instant Response)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-200 bg-gold-100 text-gold-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">Email</h4>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">{settings.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => openWhatsApp("I'd like to reach the Lagos team.")}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Lagos Team on WhatsApp
            </button>
          </div>

          {/* Stylized map / HQ panel */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-950 p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-brand-800 pb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-400" />
                  <span className="text-xs font-bold text-white">Lagos Headquarters</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Active Support Center
                </span>
              </div>

              <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-brand-800 bg-brand-950">
                {/* Dot grid */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />
                {/* Pulsing pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-slate-950 shadow-xl">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-brand-700 bg-brand-950/90 px-4 py-2 text-center shadow-2xl">
                    <p className="text-xs font-bold text-white">Bring Gift Card HQ</p>
                    <p className="text-[10px] text-brand-300">{settings.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
