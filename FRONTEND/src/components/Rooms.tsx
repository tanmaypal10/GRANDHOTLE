import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Calendar, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Rooms = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms(true);
        setRooms(data);
      } catch (err) {
        console.error("Error loading rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleReserveClick = (room: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a room reservation.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setSelectedRoom(room);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Information",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      await api.createBooking({
        roomId: selectedRoom._id,
        checkIn,
        checkOut,
        guests,
        roomsCount,
      });

      toast({
        title: "Booking Successful!",
        description: `Successfully reserved the ${selectedRoom.name}. You can manage this in your Guest Portal.`,
      });
      setSelectedRoom(null);
      setCheckIn("");
      setCheckOut("");
      navigate("/guest-portal");
    } catch (err: any) {
      toast({
        title: "Booking Failed",
        description: err.message || "Failed to submit booking",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground font-light">
        Loading luxury suites...
      </div>
    );
  }

  return (
    <section id="rooms" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Accommodations" title="Suites Crafted for the Senses" subtitle="Each room is a story of craftsmanship, where every texture and light has been considered." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {rooms.map((room, i) => (
            <motion.article
              key={room._id}
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
                    <h3 className="text-2xl font-display font-semibold mb-1 text-slate-100">{room.name}</h3>
                    <p className="text-sm text-foreground/60">{room.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-2xl font-display gold-text">${room.price}</div>
                    <div className="text-xs text-foreground/50">/ night</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {room.amenities.map((a: string) => (
                    <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/70">
                      {a}
                    </span>
                  ))}
                </div>

                <Button
                  variant="luxury"
                  className="w-full group/btn"
                  onClick={() => handleReserveClick(room)}
                >
                  Reserve Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* RESERVATION MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl w-full max-w-md p-8 border border-white/15 shadow-2xl relative">
            <h3 className="text-2xl font-display font-semibold mb-6 gold-text">
              Reserve {selectedRoom.name}
            </h3>
            
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Check-in Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--hotel-gold))]" />
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Check-out Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--hotel-gold))]" />
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--hotel-gold))]" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400">Rooms Count</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-6 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">Rate per night</div>
                  <div className="text-lg font-semibold text-slate-200">${selectedRoom.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Price</div>
                  <div className="text-xl font-display font-bold gold-text">
                    ${selectedRoom.price * roomsCount}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(var(--hotel-gold))] to-[hsl(var(--hotel-warm))] text-[hsl(var(--hotel-navy))] font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition disabled:opacity-50"
                >
                  {bookingLoading ? "Confirming..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
