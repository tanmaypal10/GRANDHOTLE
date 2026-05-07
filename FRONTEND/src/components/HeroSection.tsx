import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hotel-hero.jpg";

export const HeroSection = () => {
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Searching Rooms",
      description: "Finding the best available rooms for your stay...",
    });
  };

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to 
            <span className="bg-gradient-to-r from-hotel-gold to-hotel-warm bg-clip-text text-transparent block">
              GRANDHOTLE
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience luxury hospitality with our comprehensive hotel management system. 
            Book your perfect stay with world-class amenities and exceptional service.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95 shadow-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="checkin" className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-hotel-luxury" />
                  Check-in
                </Label>
                <Input id="checkin" type="date" className="border-border focus:border-hotel-luxury focus:ring-hotel-luxury" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkout" className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-hotel-luxury" />
                  Check-out
                </Label>
                <Input id="checkout" type="date" className="border-border focus:border-hotel-luxury focus:ring-hotel-luxury" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-hotel-luxury" />
                  Guests
                </Label>
                <Input id="guests" type="number" placeholder="2" min="1" max="8" className="border-border focus:border-hotel-luxury focus:ring-hotel-luxury" />
              </div>
              
              <Button variant="luxury" size="lg" className="w-full" onClick={handleSearch}>
                <MapPin className="h-4 w-4 mr-2" />
                Search Rooms
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
