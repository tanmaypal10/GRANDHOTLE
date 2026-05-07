import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, LogOut, Users, BedDouble, CalendarCheck, BarChart3, Settings, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StaffDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardItems = [
    { icon: CalendarCheck, title: "Bookings", desc: "Manage reservations", count: "24 Active" },
    { icon: Users, title: "Guests", desc: "Guest management", count: "156 Total" },
    { icon: BedDouble, title: "Rooms", desc: "Room availability", count: "42 Available" },
    { icon: ClipboardList, title: "Housekeeping", desc: "Task assignments", count: "8 Pending" },
    { icon: BarChart3, title: "Reports", desc: "Analytics & insights", count: "View" },
    { icon: Settings, title: "Settings", desc: "System configuration", count: "Manage" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Hotel className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-foreground">Staff Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="elegant" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's your hotel operations overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:border-primary/30"
              onClick={() => toast({ title: item.title, description: `${item.title} module coming soon!` })}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </div>
                <item.icon className="h-8 w-8 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{item.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
