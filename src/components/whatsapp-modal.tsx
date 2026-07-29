"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { MessageCircle, X, ShieldCheck } from "lucide-react";
import { useConfig } from "./config-provider";
import { buildWhatsAppLink } from "@/lib/utils";

/**
 * Global WhatsApp trade modal.
 * Any "Trade" button calls openWhatsApp(message) instead of hard-coding a number.
 * The real number lives only inside the wa.me href — it is never rendered as text.
 */
type Ctx = {
  openWhatsApp: (message: string) => void;
};

const WhatsAppModalContext = createContext<Ctx>({ openWhatsApp: () => {} });

export function useWhatsApp() {
  return useContext(WhatsAppModalContext);
}

export function WhatsAppModalProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useConfig();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const openWhatsApp = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const link = buildWhatsAppLink(settings.whatsappNumber, message);

  return (
    <WhatsAppModalContext.Provider value={{ openWhatsApp }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Start a WhatsApp trade"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-strong relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Start WhatsApp Trade</h3>
                <p className="text-xs font-semibold text-emerald-400">
                  ● Agent Online · 24/7 Response
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-1 font-mono text-[11px] text-slate-400">
                AUTOMATED TRADE MESSAGE PREVIEW:
              </p>
              <p className="text-sm font-medium italic text-white">“{message}”</p>
            </div>

            <div className="space-y-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <MessageCircle className="h-5 w-5" />
                Continue to WhatsApp Chat
              </a>
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-xl border border-white/10 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3 w-3" />
                Secure · Verified · Instant payout
              </p>
            </div>
          </div>
        </div>
      )}
    </WhatsAppModalContext.Provider>
  );
}
