import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Drawer } from "@/components/Drawer";

interface HeaderProps {
  onAdminLogin: () => void;
}

export function Header({ onAdminLogin }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "glass-light border-b border-white/40 shadow-[0_4px_30px_-10px_rgba(0,71,171,0.18)]"
              : "bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="#home" className="flex items-center">
              {scrolled ? <Logo variant="onLight" size={42} /> : <Logo variant="onDark" size={42} />}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                scrolled
                  ? "bg-[#0047AB]/5 text-[#0047AB] hover:bg-[#0047AB] hover:text-white"
                  : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              }`}
            >
              <span className="sr-only">Open menu</span>
              <div className="flex flex-col items-center gap-[5px]">
                <span className="block h-[2px] w-5 rounded-full bg-current transition-transform duration-300 group-hover:w-6" />
                <span className="block h-[2px] w-5 rounded-full bg-current transition-transform duration-300 group-hover:w-6" />
                <span className="block h-[2px] w-5 rounded-full bg-current transition-transform duration-300 group-hover:w-6" />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onAdminLogin={onAdminLogin}
        />
      </AnimatePresence>
    </>
  );
}
