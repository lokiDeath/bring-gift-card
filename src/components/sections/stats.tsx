import { STATS } from "@/lib/data";

export default function Stats() {
  return (
    <section className="relative z-20 border-y border-brand-100 bg-brand-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className={`mb-1 text-3xl font-black sm:text-4xl ${s.color}`}>{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-900/70 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
