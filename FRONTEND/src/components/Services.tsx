import { motion } from "framer-motion";
import { Sparkles, Waves, Wifi, UtensilsCrossed, Dumbbell, Plane } from "lucide-react";
import { SectionHeading } from "./Rooms";

const services = [
  { icon: Sparkles, title: "Signature Spa", desc: "Holistic rituals from masters around the world." },
  { icon: Waves, title: "Infinity Pool", desc: "Sunlit waters with panoramic horizon views." },
  { icon: Wifi, title: "Lightning WiFi", desc: "Seamless gigabit connectivity throughout." },
  { icon: UtensilsCrossed, title: "Michelin Dining", desc: "Three restaurants led by acclaimed chefs." },
  { icon: Dumbbell, title: "Wellness Studio", desc: "24/7 fitness with personal trainers on call." },
  { icon: Plane, title: "Airport Concierge", desc: "Private transfers and chauffeured limousines." },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="container mx-auto px-4 relative">
        <SectionHeading eyebrow="Services" title="Curated For Every Moment" subtitle="A constellation of experiences, designed to elevate every hour of your stay." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-2xl glass overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[hsl(var(--hotel-gold))] opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[hsl(var(--hotel-gold))] to-[hsl(var(--hotel-warm))] text-[hsl(var(--hotel-navy))] mb-4 shadow-[0_0_20px_hsl(var(--hotel-gold)/0.4)] group-hover:scale-110 transition-transform">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{s.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
