import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, Globe, Luggage, MapPin, Shield, Users,
  Utensils, Wifi, Car, Dumbbell
} from "lucide-react";

const services = [
  { icon: CreditCard, title: "Payment Processing", description: "Secure payment gateway with multiple currency support", badge: "Automated" },
  { icon: Users, title: "Guest Management", description: "Complete guest registration and profile management", badge: "24/7" },
  { icon: MapPin, title: "Room Management", description: "Real-time room availability and rate management", badge: "Live Updates" },
  { icon: Luggage, title: "Concierge Services", description: "Luggage storage and safety deposit box services", badge: "Premium" },
  { icon: Globe, title: "Tour Services", description: "Guided tour booking and local experience packages", badge: "Curated" },
  { icon: Shield, title: "Security & Privacy", description: "Advanced security measures for guest privacy", badge: "Protected" },
  { icon: Utensils, title: "Dining Services", description: "Restaurant reservations and room service", badge: "Gourmet" },
  { icon: Wifi, title: "Digital Services", description: "High-speed internet and smart room controls", badge: "Connected" },
  { icon: Car, title: "Transportation", description: "Airport transfers and car rental services", badge: "Convenient" },
  { icon: Dumbbell, title: "Wellness Center", description: "Fitness center, spa, and recreational facilities", badge: "Wellness" },
];

export const ServicesSection = () => {
  const { toast } = useToast();

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-hotel-luxury to-hotel-cool bg-clip-text text-transparent">
            Comprehensive Hotel Services
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our advanced hotel management system automates every aspect of hospitality, 
            from guest registration to premium services, ensuring exceptional experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:shadow-hotel-luxury/10 hover:-translate-y-1 cursor-pointer"
              onClick={() => toast({ title: service.title, description: service.description })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <service.icon className="h-8 w-8 text-hotel-luxury group-hover:text-hotel-cool transition-colors" />
                  <Badge variant="secondary" className="text-xs">{service.badge}</Badge>
                </div>
                <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
