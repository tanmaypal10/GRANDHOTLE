import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, LogOut, BedDouble, Utensils, Dumbbell, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GuestPortal = () => {
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

  const portalItems = [
    { icon: BedDouble, title: "My Bookings", desc: "View and manage your reservations" },
    { icon: Utensils, title: "Room Service", desc: "Order food & beverages to your room" },
    { icon: Dumbbell, title: "Amenities", desc: "Spa, gym, pool & more" },
    { icon: MapPin, title: "Local Guide", desc: "Explore nearby attractions" },
    { icon: CreditCard, title: "Billing", desc: "View your charges and invoices" },
    { icon: MessageSquare, title: "Support", desc: "Chat with our concierge team" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Hotel className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-foreground">Guest Portal</span>
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
          <h1 className="text-3xl font-bold text-foreground">Welcome, Guest!</h1>
          <p className="text-muted-foreground mt-1">Make the most of your stay with us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalItems.map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:border-primary/30"
              onClick={() => toast({ title: item.title, description: `${item.title} feature coming soon!` })}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuestPortal;
