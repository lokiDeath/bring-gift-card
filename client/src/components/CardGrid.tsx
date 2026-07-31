import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, X } from "lucide-react";
import type { GiftCard } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

interface CardGridProps {
  cards: GiftCard[];
  loading: boolean;
}

const DENOMINATIONS = [25, 50, 100, 200, 500];

export function CardGrid({ cards, loading }: CardGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) => c.brand.toLowerCase().includes(q) || c.slug.includes(q));
  }, [cards, query]);

  return (
    <div id="cards" className="relative">
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-12 max-w-xl"
      >
        <div className="group relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7384] transition-colors group-focus-within:text-[#0047AB]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gift cards — Steam, Apple, Amazon…"
            className="w-full rounded-2xl border border-[#E2E8F0] bg-white py-4 pl-14 pr-12 text-base text-[#0A1224] shadow-sm placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6B7384] hover:bg-[#F4F7FC] hover:text-[#0A1224] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-sm text-[#6B7384]">
          Showing{" "}
          <span className="font-semibold text-[#0047AB]">{filtered.length}</span> of{" "}
          <span className="font-semibold">{cards.length}</span> tradable cards · live rates
        </p>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <CardSkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState query={query} onReset={() => setQuery("")} />
      ) : (
        <StaggerContainer
          stagger={0.06}
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((card) => (
            <StaggerItem key={card.id}>
              <CardTile card={card} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function CardTile({ card }: { card: GiftCard }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,71,171,0.25)] hover:border-[#0047AB]/30 transition-all duration-300"
    >
      {/* Card image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB]">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <img
          src={card.imageUrl}
          alt={`${card.brand} gift card`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            // Fallback: hide broken image, show brand initial.
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Brand badge */}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0047AB] backdrop-blur ring-1 ring-black/5">
          {card.brand}
        </div>

        {/* Rate badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#0047AB] px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
          <TrendingUp className="h-2.5 w-2.5" />
          {Math.round(card.baseRate * 100)}%
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-base font-bold tracking-tight text-[#0A1224]">
          {card.brand}
        </h3>
        <p className="mt-1 text-xs text-[#6B7384]">
          Payout rate · live
        </p>

        {/* Rate table */}
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {DENOMINATIONS.map((d) => (
            <div
              key={d}
              className="rounded-lg bg-[#F4F7FC] px-1 py-2 text-center"
            >
              <p className="text-[9px] font-medium uppercase text-[#6B7384]">${d}</p>
              <p className="mt-0.5 font-mono text-[11px] font-bold text-[#0047AB]">
                {formatUSD(d * card.baseRate, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hover sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100" />
    </motion.article>
  );
}

function CardSkeletonGrid() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
        >
          <div className="h-44 animate-pulse bg-[#F4F7FC]" />
          <div className="p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-[#F4F7FC]" />
            <div className="mt-3 h-3 w-16 animate-pulse rounded bg-[#F4F7FC]" />
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-10 animate-pulse rounded-lg bg-[#F4F7FC]" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="empty"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="mx-auto max-w-md rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F4F7FC] p-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <Search className="h-5 w-5 text-[#6B7384]" />
        </div>
        <p className="font-display text-base font-semibold text-[#0A1224]">
          No cards match “{query}”
        </p>
        <p className="mt-1 text-sm text-[#6B7384]">
          Try a different brand name or clear your search.
        </p>
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0047AB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002B6D] transition-colors"
        >
          <X className="h-4 w-4" />
          Clear search
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
