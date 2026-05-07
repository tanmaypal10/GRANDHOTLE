import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { number: "10,000+", label: "Global Reservations", description: "Processed monthly" },
  { number: "99.9%", label: "System Uptime", description: "Reliable service" },
  { number: "150+", label: "Partner Hotels", description: "Worldwide network" },
  { number: "24/7", label: "Customer Support", description: "Always available" },
];

export const StatsSection = () => {
  const { toast } = useToast();

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-hotel-luxury via-primary to-hotel-cool text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Hotels Worldwide</h3>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Our hotel management system powers hospitality businesses globally, 
            delivering exceptional results and guest satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              onClick={() => toast({ title: stat.label, description: `${stat.number} — ${stat.description}` })}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-hotel-gold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-white/80">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
