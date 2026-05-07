import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      if (pathname !== "/") navigate("/");
      setTimeout(() => {
        document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else navigate(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "backdrop-blur-2xl bg-background/70 border-b border-white/10 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button onClick={() => handleNav("/")} className="flex items-center gap-2 group">
          <div className="relative">
            <Hotel className="h-7 w-7 text-[hsl(var(--hotel-gold))] transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 blur-lg bg-[hsl(var(--hotel-gold))] opacity-30" />
          </div>
          <span className="text-xl font-display font-bold gold-text tracking-wide">GRANDHOTLE</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.href)}
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-[hsl(var(--hotel-gold))] transition-colors group"
            >
              {l.label}
              <span className="absolute left-4 right-4 bottom-1 h-px bg-[hsl(var(--hotel-gold))] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="elegant" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
            Login
          </Button>
          <Button variant="luxury" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
            Book Now
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden backdrop-blur-2xl bg-background/95 border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className="text-left px-4 py-3 rounded-lg hover:bg-white/5 hover:text-[hsl(var(--hotel-gold))] transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="elegant" className="flex-1" onClick={() => { setOpen(false); navigate("/auth"); }}>Login</Button>
                <Button variant="luxury" className="flex-1" onClick={() => { setOpen(false); navigate("/auth"); }}>Book Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
