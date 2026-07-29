"use client";

import {
  Apple,
  Bitcoin,
  Clapperboard,
  Coins,
  CreditCard,
  Footprints,
  Gamepad2,
  Gift,
  Hexagon,
  Music,
  ShoppingCart,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps icon-name strings (from data.ts) to lucide components.
 * Keeps the data layer declarative and avoids dynamic lookups.
 */
const MAP: Record<string, LucideIcon> = {
  Apple,
  Bitcoin,
  Clapperboard,
  Coins,
  CreditCard,
  Footprints,
  Gamepad2,
  Gift,
  Hexagon,
  Music,
  ShoppingCart,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  ArrowLeftRight,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} />;
}
