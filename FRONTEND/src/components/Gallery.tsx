import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { SectionHeading } from "./Rooms";

export const Gallery = () => {
  const [active, setActive] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setGalleryImages(data);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground font-light">Loading gallery portfolio...</div>;
  }

  return (
    <section id="gallery" className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Gallery" title="Glimpses of GRANDHOTLE" />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {galleryImages.map((img, i) => (
            <motion.button
              key={img._id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActive(img.src)}
              className={`relative group overflow-hidden rounded-xl ${img.span || ""}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium">{img.alt}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-6 right-6 p-2 rounded-full glass" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={active}
              alt="Preview"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
