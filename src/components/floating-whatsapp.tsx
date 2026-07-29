"use client";

import { MessageCircle } from "lucide-react";
import { useWhatsApp } from "@/components/whatsapp-modal";

export default function FloatingWhatsApp() {
  const { openWhatsApp } = useWhatsApp();
  return (
    <button
      onClick={() => openWhatsApp("Hi! I'd like to start a trade.")}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-3xl text-slate-950 shadow-2xl shadow-emerald-500/50 transition hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-500/40" />
    </button>
  );
}
