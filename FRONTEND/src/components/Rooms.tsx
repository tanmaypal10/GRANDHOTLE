import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data/hotelData";
import { useToast } from "@/hooks/use-toast";

export const Rooms = () => {
  const { toast } = useToast();
  return (
    <section id="rooms" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Accommodations" title="Suites Crafted for the Senses" subtitle="Each room is a story of craftsmanship, where every texture and light has been considered." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {rooms.map((room, i) => (
            <motion.article
              key={room.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[hsl(var(--hotel-gold))] text-[hsl(var(--hotel-gold))]" />
                  {room.rating}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-display font-semibold mb-1">{room.name}</h3>
                    <p className="text-sm text-foreground/60">{room.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-2xl font-display gold-text">${room.price}</div>
                    <div className="text-xs text-foreground/50">/ night</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {room.amenities.map((a) => (
                    <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/70">
                      {a}
                    </span>
                  ))}
                </div>

                <Button
                  variant="luxury"
                  className="w-full group/btn"
                  onClick={() => toast({ title: `${room.name} selected`, description: "Continue to checkout to confirm your reservation." })}
                >
                  Reserve Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="text-center max-w-2xl mx-auto"
  >
    <div className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--hotel-gold))] mb-3">{eyebrow}</div>
    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-foreground/70 text-lg font-light">{subtitle}</p>}
  </motion.div>
);
