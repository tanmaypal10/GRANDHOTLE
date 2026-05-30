import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, LogOut, BedDouble, Utensils, Dumbbell, MapPin, CreditCard, MessageSquare, Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GuestPortal = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          const list = await api.getMyBookings();
          setBookings(list);
        } catch (err) {
          console.error("Failed to load user bookings:", err);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-slate-950">Loading...</div>;
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const portalItems = [
    {
      icon: BedDouble,
      title: "My Bookings",
      desc: "View and manage your reservations",
      action: () => setShowBookingsModal(true)
    },
    {
      icon: Utensils,
      title: "Room Service",
      desc: "Order food & beverages to your room",
      action: () => toast({ title: "Room Service", description: "Room service feature coming soon!" })
    },
    {
      icon: Dumbbell,
      title: "Amenities",
      desc: "Spa, gym, pool & more",
      action: () => toast({ title: "Amenities", description: "Amenities booking coming soon!" })
    },
    {
      icon: MapPin,
      title: "Local Guide",
      desc: "Explore nearby attractions",
      action: () => toast({ title: "Local Guide", description: "Local guide list coming soon!" })
    },
    {
      icon: CreditCard,
      title: "Billing",
      desc: "View your charges and invoices",
      action: () => toast({ title: "Billing", description: "Billing dashboard coming soon!" })
    },
    {
      icon: MessageSquare,
      title: "Support",
      desc: "Chat with our concierge team",
      action: () => toast({ title: "Support", description: "Support portal coming soon!" })
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5 bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Hotel className="h-7 w-7 text-amber-500" />
            <span className="text-lg font-bold font-display gold-text">Guest Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:inline">{user.email}</span>
            <Button variant="elegant" size="sm" onClick={handleSignOut} className="border-white/10 hover:border-amber-500/50">
              <LogOut className="h-4 w-4 mr-2 text-amber-500" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold gold-text">Welcome back, {user.name || "Guest"}!</h1>
          <p className="text-slate-400 text-sm mt-1">Make the most of your stay with us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalItems.map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer bg-slate-900 border-white/5 hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              onClick={item.action}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-100">{item.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-0.5">{item.desc}</CardDescription>
                </div>
              </CardHeader>
              {item.title === "My Bookings" && bookings.length > 0 && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">
                  {bookings.length} Booking(s)
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>

      {/* MY BOOKINGS LIST MODAL */}
      {showBookingsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl w-full max-w-2xl p-8 border border-white/15 relative max-h-[85vh] overflow-y-auto glow-gold">
            <button
              onClick={() => setShowBookingsModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-2xl font-display font-semibold mb-6 gold-text">
              My Reservations
            </h3>

            {loadingBookings ? (
              <div className="py-12 text-center text-slate-500">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-base">{b.room?.name || "Suite"}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-light">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        {new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 font-light">
                        {b.guests} Guests • {b.roomsCount || 1} Room(s)
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-0 border-white/5 pt-3 sm:pt-0">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        b.status === "approved" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        b.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-lg font-semibold text-amber-500 sm:mt-2">
                        ${b.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-light">
                You have no room bookings at this time. Go reserve a suite to get started!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestPortal;
