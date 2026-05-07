import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel, User, Settings, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="flex items-center space-x-2">
            <Hotel className="h-8 w-8 text-hotel-luxury" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-hotel-luxury to-hotel-cool bg-clip-text text-transparent">
              GRANDHOTLE
            </h1>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Management System
          </Badge>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" onClick={() => scrollTo("hero")}>
            <Calendar className="h-4 w-4 mr-2" />
            Bookings
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollTo("services")}>
            <User className="h-4 w-4 mr-2" />
            Guests
          </Button>
          <Button variant="ghost" size="sm" onClick={() => scrollTo("services")}>
            <Settings className="h-4 w-4 mr-2" />
            Rooms
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="elegant" size="sm" onClick={() => navigate("/auth")}>
            Staff Login
          </Button>
          <Button variant="luxury" size="sm" onClick={() => navigate("/auth")}>
            Guest Portal
          </Button>
        </div>
      </div>
    </header>
  );
};
