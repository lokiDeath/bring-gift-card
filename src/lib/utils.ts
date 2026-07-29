import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  // twMerge + clsx for safe, deduped class composition.
  return twMerge(clsx(inputs));
}

/** Format a number as a localized currency string. */
export function formatCurrency(amount: number, currency: string): string {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "USD"
        ? "$"
        : currency === "GHS"
          ? "GH₵"
          : "";
  const value = Number.isFinite(amount) ? amount : 0;
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  });
  return `${symbol} ${formatted}`;
}

/**
 * Build a wa.me link. The number stays digits-only and is NEVER meant to be
 * rendered as visible text — only placed inside the href. Safe for client use.
 */
export function buildWhatsAppLink(number: string, message: string): string {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Small delay helper. */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
