"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Info } from "lucide-react";
import { ASSETS, ASSET_MAP } from "@/lib/data";
import type { AssetCategory, AssetKey, PayoutCurrency } from "@/lib/types";
import { useConfig } from "@/components/config-provider";
import { useWhatsApp } from "@/components/whatsapp-modal";
import { formatCurrency } from "@/lib/utils";

export default function Calculator() {
  const { rates } = useConfig();
  const { openWhatsApp } = useWhatsApp();

  const [category, setCategory] = useState<AssetCategory>("giftcard");
  const [key, setKey] = useState<AssetKey>("steam");
  const [amount, setAmount] = useState<number>(100);
  const [currency, setCurrency] = useState<PayoutCurrency>("NGN");

  const rateMap = useMemo(() => {
    const m = new Map<AssetKey, number>();
    rates.forEach((r) => m.set(r.key, r.rate));
    return m;
  }, [rates]);

  const payout = useMemo(() => {
    const base = rateMap.get(key) ?? 1100;
    const amt = Number.isFinite(amount) ? amount : 0;
    if (currency === "NGN") return amt * base;
    if (currency === "USD") return amt * 0.95;
    return amt * (base / 100);
  }, [rateMap, key, amount, currency]);

  const baseRate = rateMap.get(key) ?? 1100;

  function onCategoryChange(c: AssetCategory) {
    setCategory(c);
    setKey(c === "crypto" ? "usdt" : "steam");
  }

  const brandLabel = ASSET_MAP[key]?.name ?? key;

  function trade() {
    openWhatsApp(
      `Hello Bring Gift Card! I want to trade ${formatCurrency(amount, "USD")} of ${brandLabel}. ` +
        `Calculated payout: ${formatCurrency(payout, currency)} (${currency}). Please provide payment account details.`
    );
  }

  const visibleAssets = ASSETS.filter((a) => a.category === category);

  return (
    <section id="calculator" className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
          Instant Quotation
        </span>
        <h2 className="mt-2 text-3xl font-black text-brand-900 sm:text-4xl">
          Live Exchange Rate Calculator
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Select your card or crypto type, input the amount, and see your exact payout estimate
          before starting your WhatsApp trade. Rates update live from our admin panel.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="glass-strong relative mx-auto max-w-3xl rounded-3xl border border-brand-100 p-6 shadow-xl sm:p-10"
      >
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-900/70">
              1. Asset Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["giftcard", "crypto"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => onCategoryChange(c)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    category === c
                      ? "border-brand-400 bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "border-brand-100 bg-white text-brand-900/70 hover:bg-brand-50"
                  }`}
                >
                  {c === "giftcard" ? "Gift Cards" : "Cryptocurrency"}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-900/70">
              2. Brand / Token
            </label>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value as AssetKey)}
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3.5 text-sm font-medium text-brand-900 focus:border-brand-400 focus:outline-none"
            >
              {visibleAssets.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-900/70">
              3. Face Value (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-400">
                $
              </span>
              <input
                type="number"
                value={amount}
                min={1}
                max={100000}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-brand-200 bg-white py-3.5 pl-8 pr-4 text-lg font-bold text-brand-900 focus:border-brand-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-900/70">
              4. Payout Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as PayoutCurrency)}
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3.5 text-sm font-medium text-brand-900 focus:border-brand-400 focus:outline-none"
            >
              <option>NGN</option>
              <option>USD</option>
              <option>GHS</option>
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-900/60">
              Estimated Instant Payout
            </span>
            <p className="mt-1 text-3xl font-black text-emerald-600 sm:text-4xl">
              {formatCurrency(payout, currency)}
            </p>
            <span className="mt-1 block font-mono text-[11px] text-brand-600">
              {currency === "NGN"
                ? `Calculated at rate: ${baseRate.toLocaleString("en-US")} NGN / USD`
                : currency === "USD"
                  ? "Calculated at standard USD OTC rate"
                  : `Calculated at rate: ${(baseRate / 100).toFixed(2)} GHS / USD`}
            </span>
          </div>

          <button
            onClick={trade}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
          >
            <MessageCircle className="h-5 w-5" />
            Trade This Amount Now
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
          <Info className="h-3 w-3 text-brand-500" />
          Rates update dynamically according to global market demand. Instant bank transfer upon
          code verification.
        </p>
      </motion.div>
    </section>
  );
}
