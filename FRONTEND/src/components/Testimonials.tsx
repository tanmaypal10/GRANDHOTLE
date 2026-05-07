import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { testimonials } from "@/data/hotelData";
import { SectionHeading } from "./Rooms";

export const Testimonials = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Voices" title="Stories from Our Guests" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            spaceBetween={32}
            slidesPerView={1}
            className="!pb-14"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="glass rounded-2xl p-8 md:p-12 text-center relative">
                  <Quote className="h-10 w-10 text-[hsl(var(--hotel-gold))] mx-auto mb-6 opacity-60" />
                  <p className="text-lg md:text-xl font-display italic text-foreground/90 leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[hsl(var(--hotel-gold))] text-[hsl(var(--hotel-gold))]" />
                    ))}
                  </div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-foreground/60">{t.role}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
      <style>{`.swiper-pagination-bullet{background:hsl(var(--hotel-gold))!important;opacity:.4}.swiper-pagination-bullet-active{opacity:1!important;width:24px!important;border-radius:4px!important;transition:.3s}`}</style>
    </section>
  );
};
