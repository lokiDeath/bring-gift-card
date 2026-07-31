import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Activity,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchGiftCards,
  updateRate,
  toggleCardActive,
  listUsers,
  createUser,
  deleteUser,
} from "@/lib/api";
import type { GiftCard, User, UserRole } from "@/lib/types";
import { Logo } from "@/components/Logo";
import { formatUSD } from "@/lib/utils";

type TabKey = "overview" | "rates" | "users";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Gate: redirect unauthenticated users to home.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  // Load cards on mount.
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchGiftCards()
      .then(setCards)
      .catch((e) => toast.error(e.message || "Failed to load cards"))
      .finally(() => setLoadingCards(false));
  }, [isAuthenticated]);

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const { users } = await listUsers();
      setUsers(users);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "master" && tab === "users") {
      refreshUsers();
    }
  }, [isAuthenticated, user, tab]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0047AB]" />
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; masterOnly?: boolean }[] = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "rates", label: "Rate Management", icon: <TrendingUp className="h-4 w-4" /> },
    {
      key: "users",
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
      masterOnly: true,
    },
  ];

  const visibleTabs = tabs.filter((t) => !t.masterOnly || user.role === "master");

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-[#0A1224] hover:bg-[#F4F7FC]"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo variant="onLight" size={32} />
      </div>

      {/* Sidebar (mobile drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#0A1224]/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarContent
                user={user}
                tabs={visibleTabs}
                tab={tab}
                onTab={(k) => {
                  setTab(k);
                  setSidebarOpen(false);
                }}
                onLogout={logout}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-72 flex-none border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
          <SidebarContent
            user={user}
            tabs={visibleTabs}
            tab={tab}
            onTab={setTab}
            onLogout={logout}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {tab === "overview" && <OverviewTab user={user} cards={cards} loadingCards={loadingCards} onGoToRates={() => setTab("rates")} />}
                {tab === "rates" && (
                  <RatesTab
                    cards={cards}
                    loading={loadingCards}
                    onUpdate={(updated) =>
                      setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
                    }
                  />
                )}
                {tab === "users" && user.role === "master" && (
                  <UsersTab
                    users={users}
                    loading={loadingUsers}
                    currentUser={user}
                    onRefresh={refreshUsers}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===================== SIDEBAR ===================== */
interface SidebarContentProps {
  user: User;
  tabs: { key: TabKey; label: string; icon: React.ReactNode }[];
  tab: TabKey;
  onTab: (k: TabKey) => void;
  onLogout: () => void;
  onClose?: () => void;
}

function SidebarContent({ user, tabs, tab, onTab, onLogout, onClose }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
        <Logo variant="onLight" size={36} />
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7384] hover:bg-[#F4F7FC] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="border-b border-[#E2E8F0] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] p-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] font-display text-sm font-bold text-white">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-[#0A1224]">
              {user.username}
            </p>
            <p className="text-xs capitalize text-[#6B7384]">
              {user.role} access
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
          Dashboard
        </p>
        <ul className="space-y-1">
          {tabs.map((t) => (
            <li key={t.key}>
              <button
                onClick={() => onTab(t.key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] text-white shadow-lg shadow-[#0047AB]/25"
                    : "text-[#3B4256] hover:bg-[#F4F7FC] hover:text-[#0047AB]"
                }`}
              >
                <span className={tab === t.key ? "text-white" : "text-[#6B7384] group-hover:text-[#0047AB]"}>
                  {t.icon}
                </span>
                {t.label}
                <ChevronRight
                  className={`ml-auto h-3.5 w-3.5 transition-transform ${
                    tab === t.key ? "translate-x-0 text-white" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
          Public
        </p>
        <a
          href="/"
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#3B4256] transition-colors hover:bg-[#F4F7FC] hover:text-[#0047AB]"
        >
          <ArrowLeft className="h-4 w-4 text-[#6B7384] group-hover:text-[#0047AB]" />
          Back to website
        </a>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#E2E8F0] p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ===================== OVERVIEW TAB ===================== */
function OverviewTab({
  user,
  cards,
  loadingCards,
  onGoToRates,
}: {
  user: User;
  cards: GiftCard[];
  loadingCards: boolean;
  onGoToRates: () => void;
}) {
  const activeCards = cards.filter((c) => c.isActive);
  const avgRate = activeCards.length
    ? activeCards.reduce((sum, c) => sum + c.baseRate, 0) / activeCards.length
    : 0;

  const stats = [
    {
      label: "Total cards",
      value: cards.length.toString(),
      icon: <CreditCard className="h-4 w-4" />,
      accent: "from-[#0047AB] to-[#1E5BD6]",
    },
    {
      label: "Active cards",
      value: activeCards.length.toString(),
      icon: <Activity className="h-4 w-4" />,
      accent: "from-[#16A34A] to-[#22C55E]",
    },
    {
      label: "Avg payout rate",
      value: `${(avgRate * 100).toFixed(1)}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      accent: "from-[#C9A24B] to-[#E5C77B]",
    },
    {
      label: "Your role",
      value: user.role,
      icon: <ShieldCheck className="h-4 w-4" />,
      accent: "from-[#7C3AED] to-[#A855F7]",
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.username}.`}
        subtitle="Here's what's happening on your platform today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
          >
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.accent} opacity-10 blur-2xl`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}>
              {s.icon}
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1224]">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[#6B7384]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent cards preview */}
      <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-[#0A1224]">Recent card rates</h3>
            <p className="text-xs text-[#6B7384]">Latest 5 cards in your catalogue</p>
          </div>
          <button
            onClick={onGoToRates}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] hover:underline"
          >
            Manage all
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="divide-y divide-[#F4F7FC]">
          {loadingCards ? (
            <div className="p-8 text-center text-sm text-[#6B7384]">Loading…</div>
          ) : cards.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F7FC] text-xs font-bold text-[#0047AB]">
                  {c.brand.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1224]">{c.brand}</p>
                  <p className="text-xs text-[#6B7384]">/ {c.slug}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-[#0047AB]">
                  {Math.round(c.baseRate * 100)}%
                </p>
                <p className="text-xs text-[#6B7384]">
                  $100 → {formatUSD(100 * c.baseRate, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== RATES TAB ===================== */
function RatesTab({
  cards,
  loading,
  onUpdate,
}: {
  cards: GiftCard[];
  loading: boolean;
  onUpdate: (card: GiftCard) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const selected = cards.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    if (selected) {
      setRateInput((selected.baseRate * 100).toFixed(1));
    }
  }, [selected]);

  const handleSave = async () => {
    if (!selected) return;
    const pct = parseFloat(rateInput);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      toast.error("Rate must be a number between 0 and 100.");
      return;
    }
    setSaving(true);
    try {
      const { card } = await updateRate(selected.id, pct / 100);
      onUpdate(card);
      toast.success(`${card.brand} rate updated to ${(card.baseRate * 100).toFixed(1)}%.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update rate.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (card: GiftCard) => {
    setTogglingId(card.id);
    try {
      const { card: updated } = await toggleCardActive(card.id, !card.isActive);
      onUpdate(updated);
      toast.success(`${updated.brand} is now ${updated.isActive ? "active" : "hidden"}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to toggle card.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Rate Management"
        subtitle="Update the payout rate for any gift card. Changes are reflected on the public site instantly."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: card list */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">All gift cards</h3>
              <p className="text-xs text-[#6B7384]">Tap a card to edit its rate</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading cards…</div>
            ) : (
              <div className="divide-y divide-[#F4F7FC]">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedId(card.id)}
                    className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors ${
                      selectedId === card.id ? "bg-[#F4F7FC]" : "hover:bg-[#F4F7FC]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0047AB]/10 to-[#1E5BD6]/10 text-xs font-bold text-[#0047AB]">
                        {card.brand.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">{card.brand}</p>
                        <p className="text-xs text-[#6B7384]">/ {card.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold text-[#0047AB]">
                          {(card.baseRate * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-[#6B7384]">
                          $100 → {formatUSD(100 * card.baseRate, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          card.isActive
                            ? "bg-[#16A34A]/10 text-[#16A34A]"
                            : "bg-[#9CA3AF]/10 text-[#6B7384]"
                        }`}
                      >
                        {card.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: edit panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">Edit rate</h3>
              <p className="text-xs text-[#6B7384]">Changes go live instantly</p>
            </div>

            {!selected ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FC]">
                  <TrendingUp className="h-5 w-5 text-[#6B7384]" />
                </div>
                <p className="text-sm font-semibold text-[#0A1224]">No card selected</p>
                <p className="mt-1 text-xs text-[#6B7384]">
                  Pick a card from the list to edit its rate.
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] text-sm font-bold text-white">
                    {selected.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-[#0A1224]">
                      {selected.brand}
                    </p>
                    <p className="text-xs text-[#6B7384]">/ {selected.slug}</p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-[#0A1224] mb-2">
                  Payout rate (% of face value)
                </label>
                <div className="relative mb-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-3 pl-4 pr-12 text-base font-mono font-bold text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6B7384]">
                    %
                  </span>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl bg-[#F4F7FC] p-3">
                  {[25, 50, 100].map((d) => (
                    <div key={d} className="text-center">
                      <p className="text-[10px] font-medium uppercase text-[#6B7384]">${d} card</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-[#0047AB]">
                        {formatUSD(d * (parseFloat(rateInput) || 0) / 100, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 transition-all hover:shadow-xl hover:shadow-[#0047AB]/35 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      Update rate
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggle(selected)}
                  disabled={togglingId === selected.id}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-2.5 text-sm font-semibold text-[#3B4256] hover:bg-[#F4F7FC] transition-colors disabled:opacity-70"
                >
                  {togglingId === selected.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {selected.isActive ? "Hide from public" : "Show on public site"}
                </button>

                <p className="mt-4 text-center text-xs text-[#6B7384]">
                  Last updated: {new Date(selected.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== USERS TAB (master only) ===================== */
function UsersTab({
  users,
  loading,
  currentUser,
  onRefresh,
}: {
  users: User[];
  loading: boolean;
  currentUser: User;
  onRefresh: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>("staff");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) {
      toast.error("Username required and password must be at least 6 characters.");
      return;
    }
    setCreating(true);
    try {
      await createUser(username.trim(), password, role);
      toast.success(`User "${username}" created with ${role} role.`);
      setUsername("");
      setPassword("");
      setRole("staff");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (u.id === currentUser.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    setDeletingId(u.id);
    try {
      await deleteUser(u.id);
      toast.success(`User "${u.username}" deleted.`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Create staff accounts for your team. Staff users can manage rates but cannot create or delete users."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Create form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleCreate}
            className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
          >
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">Create new user</h3>
              <p className="text-xs text-[#6B7384]">New account will be active immediately</p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder="e.g. sarah_ops"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 pl-4 pr-11 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6B7384] hover:bg-[#F4F7FC]"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["staff", "master"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                        role === r
                          ? "border-[#0047AB] bg-[#0047AB]/5 text-[#0047AB] ring-1 ring-[#0047AB]/20"
                          : "border-[#E2E8F0] bg-white text-[#6B7384] hover:border-[#0047AB]/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#6B7384]">
                  {role === "master"
                    ? "Master: full access — manage rates and users."
                    : "Staff: rate management only. Cannot manage users."}
                </p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 transition-all hover:shadow-xl hover:shadow-[#0047AB]/35 disabled:opacity-70"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create user
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* User list */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">Team members</h3>
              <p className="text-xs text-[#6B7384]">{users.length} user{users.length === 1 ? "" : "s"} total</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading users…</div>
            ) : (
              <div className="divide-y divide-[#F4F7FC]">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] text-xs font-bold text-white">
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">
                          {u.username}
                          {u.id === currentUser.id && (
                            <span className="ml-2 rounded-full bg-[#0047AB]/10 px-2 py-0.5 text-[10px] font-bold text-[#0047AB]">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#6B7384]">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "master"
                            ? "bg-[#C9A24B]/15 text-[#9B7A2E]"
                            : "bg-[#0047AB]/10 text-[#0047AB]"
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === u.id}
                          className="rounded-lg p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors disabled:opacity-50"
                          aria-label={`Delete ${u.username}`}
                        >
                          {deletingId === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== SHARED ===================== */
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl font-extrabold tracking-tight text-[#0A1224] sm:text-3xl"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-1.5 text-sm text-[#6B7384]"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
