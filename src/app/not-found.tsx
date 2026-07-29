import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <p className="text-7xl font-black text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        Back to home
      </Link>
    </main>
  );
}
