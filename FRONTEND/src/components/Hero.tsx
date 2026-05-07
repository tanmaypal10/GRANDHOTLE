import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingBar } from "./BookingBar";
import heroImage from "@/assets/hotel-hero.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax bg */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      <div className="absolute inset-0 z-0" style={{ background: "var(--gradient-glow)" }} />

      <div className="container mx-auto px-4 z-10 relative pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--hotel-gold))]" />
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/80">A Five-Star Sanctuary</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-[1.05]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block"
            >
              Where Luxury
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="block gold-text italic"
            >
              Meets Eternity
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 font-light"
          >
            Experience timeless hospitality at GRANDHOTLE — a sanctuary of refined comfort, masterful service, and cinematic views from every suite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Button variant="luxury" size="xl" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}>
              Book Your Stay
            </Button>
            <Button variant="glass" size="xl" onClick={() => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Rooms
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          id="booking"
        >
          <BookingBar />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-foreground/60 hidden md:block"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
};
