"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  LogOut,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Mail,
  MapPin,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { ASSETS, DEFAULT_RATES, DEFAULT_SETTINGS } from "@/lib/data";
import type { AssetKey, RateRow, SiteSettings } from "@/lib/types";

type Tab = "rates" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("rates");

  const [rates, setRates] = useState<RateRow[]>(DEFAULT_RATES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const [ratesDirty, setRatesDirty] = useState(false);
  const [settingsDirty, setSettingsDirty] = useState(false);

  const [savingRates, setSavingRates] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [loading, setLoading] = useState(true);

  // Load current config from the public endpoint (same source the site uses).
  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.rates?.length) setRates(d.rates);
        if (d?.settings) setSettings(d.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  /* ---------- Rates ---------- */
  function updateRate(key: AssetKey, value: number) {
    setRates((prev) =>
      prev.map((r) => (r.key === key ? { ...r, rate: value } : r))
    );
    setRatesDirty(true);
  }
  function toggleActive(key: AssetKey) {
    setRates((prev) =>
      prev.map((r) => (r.key === key ? { ...r, active: !r.active } : r))
    );
    setRatesDirty(true);
  }

  async function saveRates() {
    setSavingRates(true);
    try {
      const res = await fetch("/api/admin/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save rates.");
      setRatesDirty(false);
      flash("ok", "Rates updated. The live site now reflects the new values.");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingRates(false);
    }
  }

  /* ---------- Settings ---------- */
  function updateSettings(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
    setSettingsDirty(true);
  }
  async function saveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_number: settings.whatsappNumber,
          email: settings.email,
          address: settings.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");
      setSettingsDirty(false);
      flash("ok", "Settings saved. WhatsApp links now use the new number.");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingSettings(false);
    }
  }

  return (
    <main className="relative min-h-screen px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <header className="glass-strong mb-8 flex flex-col gap-4 rounded-2xl border border-white/15 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-emerald-400 p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-ink-900">
                <CreditCard className="h-5 w-5 text-brand-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Bring Gift Card · Admin</h1>
              <p className="text-xs text-slate-400">Manage live rates & site settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 transition hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/25"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <TabButton active={tab === "rates"} onClick={() => setTab("rates")} icon={TrendingUp}>
            Exchange Rates
          </TabButton>
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={MessageCircle}>
            Site Settings
          </TabButton>
        </div>

        {loading ? (
          <div className="glass flex h-64 items-center justify-center rounded-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
          </div>
        ) : tab === "rates" ? (
          <RatesEditor
            rates={rates}
            dirty={ratesDirty}
            saving={savingRates}
            onRate={updateRate}
            onToggle={toggleActive}
            onSave={saveRates}
          />
        ) : (
          <SettingsEditor
            settings={settings}
            dirty={settingsDirty}
            saving={savingSettings}
            onChange={updateSettings}
            onSave={saveSettings}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2">
          <div
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold shadow-2xl ${
              toast.type === "ok"
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : "border-red-500/30 bg-red-500/15 text-red-300"
            }`}
          >
            {toast.type === "ok" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Reusable tab button ---------- */
function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-brand-500 text-white"
          : "glass-pill text-slate-300 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

/* ---------- Rates editor ---------- */
function RatesEditor({
  rates,
  dirty,
  saving,
  onRate,
  onToggle,
  onSave,
}: {
  rates: RateRow[];
  dirty: boolean;
  saving: boolean;
  onRate: (key: AssetKey, value: number) => void;
  onToggle: (key: AssetKey) => void;
  onSave: () => void;
}) {
  const grouped = useMemo(() => {
    return {
      giftcard: ASSETS.filter((a) => a.category === "giftcard"),
      crypto: ASSETS.filter((a) => a.category === "crypto"),
    };
  }, []);

  function rateOf(key: AssetKey) {
    return rates.find((r) => r.key === key)?.rate ?? 0;
  }
  function activeOf(key: AssetKey) {
    return rates.find((r) => r.key === key)?.active ?? true;
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-white/15 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Exchange Rates</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Rate = payout units per <strong>$1 USD</strong> face value (e.g. 1285 → ₦1285 per $1).
            </p>
          </div>
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-300">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {(["giftcard", "crypto"] as const).map((cat) => (
        <div key={cat} className="glass rounded-2xl border border-white/15 p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-300">
            {cat === "giftcard" ? "Gift Cards" : "Cryptocurrency"}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {grouped[cat].map((a) => {
              const active = activeOf(a.key);
              return (
                <div
                  key={a.key}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    active
                      ? "border-white/10 bg-white/5"
                      : "border-white/5 bg-white/[0.02] opacity-60"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{a.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">{a.key}</p>
                  </div>
                  <div className="relative w-28">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={rateOf(a.key)}
                      onChange={(e) => onRate(a.key, Number(e.target.value))}
                      className="w-full rounded-lg border border-white/15 bg-ink-900 py-2 pl-3 pr-10 text-right text-sm font-bold text-white focus:border-brand-400 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-500">
                      /$1
                    </span>
                  </div>
                  <button
                    onClick={() => onToggle(a.key)}
                    className={`rounded-lg px-2.5 py-2 text-[10px] font-bold transition ${
                      active
                        ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {active ? "ON" : "OFF"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-400 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Rates
        </button>
      </div>
    </div>
  );
}

/* ---------- Settings editor ---------- */
function SettingsEditor({
  settings,
  dirty,
  saving,
  onChange,
  onSave,
}: {
  settings: SiteSettings;
  dirty: boolean;
  saving: boolean;
  onChange: (patch: Partial<SiteSettings>) => void;
  onSave: () => void;
}) {
  const [reveal, setReveal] = useState(false);
  const digits = settings.whatsappNumber.replace(/\D/g, "");
  const masked = reveal ? digits : "•".repeat(Math.min(12, Math.max(0, digits.length - 3))) + digits.slice(-3);

  return (
    <div className="space-y-6">
      <div className="glass flex items-center justify-between rounded-2xl border border-white/15 p-5">
        <div>
          <h2 className="text-base font-bold text-white">Site Settings</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            The WhatsApp number powers every “Trade” button. It is never shown as visible text on
            the public site.
          </p>
        </div>
        {dirty && (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-300">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="glass space-y-5 rounded-2xl border border-white/15 p-5">
        {/* WhatsApp number */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Number
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
              +
            </span>
            <input
              type={reveal ? "text" : "password"}
              inputMode="tel"
              value={settings.whatsappNumber}
              onChange={(e) => onChange({ whatsappNumber: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-ink-900 py-3 pl-8 pr-24 text-sm font-medium text-white focus:border-emerald-400 focus:outline-none"
              placeholder="e.g. 2348012345678"
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Digits only, with country code. Current preview: <span className="font-mono">{masked}</span>
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Mail className="h-3.5 w-3.5 text-brand-400" /> Support Email
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-ink-900 px-4 py-3 text-sm font-medium text-white focus:border-brand-400 focus:outline-none"
            placeholder="support@bringgiftcard.com"
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-gold-400" /> Office Address
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-ink-900 px-4 py-3 text-sm font-medium text-white focus:border-brand-400 focus:outline-none"
            placeholder="13B Ikosi Road, Ketu, Lagos, Nigeria"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-400 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}
