import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--hotel-gold))] to-[hsl(var(--hotel-warm))] origin-left z-[60]"
    />
  );
};

export const FloatingActions = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity } }}
        className="p-4 rounded-full bg-gradient-to-br from-[hsl(var(--hotel-gold))] to-[hsl(var(--hotel-warm))] text-[hsl(var(--hotel-navy))] shadow-[0_0_30px_hsl(var(--hotel-gold)/0.5)]"
        aria-label="Chat"
        onClick={() => alert("Concierge chat coming soon")}
      >
        <MessageCircle className="h-5 w-5" />
      </motion.button>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 rounded-full glass-strong"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
};
