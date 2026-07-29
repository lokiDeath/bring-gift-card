"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { PublicConfig, RateRow, SiteSettings } from "@/lib/types";
import { DEFAULT_RATES, DEFAULT_SETTINGS } from "@/lib/data";

type ConfigValue = {
  rates: RateRow[];
  settings: SiteSettings;
  loading: boolean;
  /** Re-fetch live config (used after admin saves). */
  refresh: () => Promise<void>;
};

const ConfigContext = createContext<ConfigValue>({
  rates: DEFAULT_RATES,
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<RateRow[]>(DEFAULT_RATES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/config", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data: PublicConfig = await res.json();
      setRates(data.rates?.length ? data.rates : DEFAULT_RATES);
      setSettings(data.settings ?? DEFAULT_SETTINGS);
    } catch {
      // Keep defaults on failure — site stays fully usable.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ConfigContext.Provider value={{ rates, settings, loading, refresh }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
