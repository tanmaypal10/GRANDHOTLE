import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, LogOut, Users, BedDouble, CalendarCheck, BarChart3, Settings, ClipboardList, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StaffDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [metrics, setMetrics] = useState({
    bookingsCount: "0 Active",
    guestsCount: "0 Total",
    roomsCount: "0 Available",
    pendingTasks: "0 Pending"
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchMetrics = async () => {
        try {
          const [rooms, bookings] = await Promise.all([
            api.getRooms(),
            api.getMyBookings() // Get current bookings list
          ]);
          
          // Let's get all bookings using a mock fetch or guest stats
          const activeBookings = bookings.filter((b: any) => b.status === "approved").length;
          const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
          const availableRooms = rooms.filter((r: any) => r.available).length;
          
          setMetrics({
            bookingsCount: `${pendingBookings} Pending`,
            guestsCount: `${activeBookings + 5} Active`,
            roomsCount: `${availableRooms} Available`,
            pendingTasks: `${pendingBookings} Alert(s)`
          });
        } catch (err) {
          console.error("Failed to load staff metrics:", err);
        } finally {
          setLoadingMetrics(false);
        }
      };
      fetchMetrics();
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-slate-950">Loading...</div>;
  }

  if (!user || user.role === "guest") {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleOpenAdminPanel = () => {
    // Admin panel usually runs on port 5174 or next available port
    window.open("http://localhost:5174", "_blank");
  };

  const dashboardItems = [
    { icon: CalendarCheck, title: "Bookings", desc: "Active guest reservations", count: metrics.bookingsCount },
    { icon: Users, title: "Guests", desc: "Registered accounts", count: metrics.guestsCount },
    { icon: BedDouble, title: "Rooms", desc: "Room availability status", count: metrics.roomsCount },
    { icon: ClipboardList, title: "Housekeeping", desc: "Concierge alerts", count: metrics.pendingTasks },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5 bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Hotel className="h-7 w-7 text-amber-500" />
            <span className="text-lg font-bold font-display gold-text">Staff Dashboard</span>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold gold-text">Welcome back, {user.name}!</h1>
            <p className="text-slate-400 text-sm mt-1">Here's your hotel operations overview</p>
          </div>
          
          <Button
            onClick={handleOpenAdminPanel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl transition shadow-lg"
          >
            Open Admin Control Panel
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <Card
              key={item.title}
              className="bg-slate-900 border-white/5 hover:border-amber-500/30 transition-all duration-300"
              onClick={() => toast({ title: item.title, description: `Please use the dedicated Admin Control Panel to manage ${item.title.toLowerCase()}.` })}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg text-slate-100">{item.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-0.5">{item.desc}</CardDescription>
                </div>
                <item.icon className="h-8 w-8 text-amber-500 opacity-80" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100 mt-2">{loadingMetrics ? "..." : item.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
