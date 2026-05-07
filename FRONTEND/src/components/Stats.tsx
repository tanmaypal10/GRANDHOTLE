import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { stats } from "@/data/hotelData";

const Counter = ({ to, suffix }: { to: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      const c = animate(count, to, { duration: 2.5, ease: "easeOut" });
      return c.stop;
    }
  }, [inView, to, count]);

  useEffect(() => rounded.on("change", (v) => { if (ref.current) ref.current.textContent = v; }), [rounded]);
  return <span ref={ref}>0{suffix}</span>;
};

export const Stats = () => {
  return (
    <section className="py-24 relative overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hotel-navy))] to-[hsl(var(--hotel-luxury))]" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-display font-bold gold-text mb-2">
                <Counter to={s.number} suffix={s.suffix} />
              </div>
              <div className="text-sm uppercase tracking-[0.2em] text-foreground/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
