"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ASSETS } from "@/lib/data";
import type { Asset } from "@/lib/types";
import { Icon } from "@/components/icon";
import { useWhatsApp } from "@/components/whatsapp-modal";

const FILTERS = ["All", "Gaming", "Shopping", "Entertainment", "Crypto"] as const;
type Filter = (typeof FILTERS)[number];

export default function Showcase() {
  const { openWhatsApp } = useWhatsApp();
  const [filter, setFilter] = useState<Filter>("All");

  const list = useMemo(
    () => (filter === "All" ? ASSETS : ASSETS.filter((a) => a.group === filter)),
    [filter]
  );

  return (
    <section id="showcase" className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            Our Supported Fleet
          </span>
          <h2 className="mt-2 text-3xl font-black text-brand-900 sm:text-4xl">
            Gift Cards & Tokens We Trade
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                filter === f
                  ? "bg-brand-600 font-bold text-white"
                  : "bg-brand-50 text-brand-600 hover:bg-brand-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {list.map((a, i) => (
          <ShowcaseCard
            key={a.key}
            asset={a}
            index={i}
            onTrade={() => openWhatsApp(`I'd like to trade a ${a.name}. Please share your best rate.`)}
          />
        ))}
      </div>
    </section>
  );
}

function ShowcaseCard({
  asset,
  index,
  onTrade,
}: {
  asset: Asset;
  index: number;
  onTrade: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group lift flex flex-col justify-between rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl transition group-hover:scale-110">
          <Icon name={asset.icon} className="h-5 w-5 text-brand-600" />
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          {asset.tag}
        </span>
      </div>
      <div>
        <h4 className="text-base font-bold text-brand-900">{asset.name}</h4>
        <p className="mt-1 text-xs text-slate-500">{asset.group} · {asset.sample}</p>
      </div>
      <button
        onClick={onTrade}
        className="mt-4 w-full rounded-lg bg-brand-50 py-2 text-xs font-bold text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"
      >
        Trade {asset.name.split(" ")[0]}
      </button>
    </motion.div>
  );
}
