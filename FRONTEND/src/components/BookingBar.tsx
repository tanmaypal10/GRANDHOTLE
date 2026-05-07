import { CalendarDays, Users, BedDouble, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const BookingBar = () => {
  const { toast } = useToast();
  return (
    <div className="max-w-5xl mx-auto glass-strong rounded-2xl p-6 md:p-8 shadow-2xl border border-white/15 hover:border-[hsl(var(--hotel-gold)/0.4)] transition-all duration-500 group">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <Field icon={<CalendarDays className="h-4 w-4" />} label="Check-in">
          <Input type="date" className="bg-white/5 border-white/10" />
        </Field>
        <Field icon={<CalendarDays className="h-4 w-4" />} label="Check-out">
          <Input type="date" className="bg-white/5 border-white/10" />
        </Field>
        <Field icon={<Users className="h-4 w-4" />} label="Guests">
          <Input type="number" defaultValue={2} min={1} max={10} className="bg-white/5 border-white/10" />
        </Field>
        <Field icon={<BedDouble className="h-4 w-4" />} label="Rooms">
          <Input type="number" defaultValue={1} min={1} max={5} className="bg-white/5 border-white/10" />
        </Field>
        <Button
          variant="luxury"
          size="lg"
          className="w-full"
          onClick={() => toast({ title: "Searching availability", description: "Finding the perfect suite for your dates..." })}
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-xs uppercase tracking-wider text-foreground/70 flex items-center gap-2">
      <span className="text-[hsl(var(--hotel-gold))]">{icon}</span>
      {label}
    </Label>
    {children}
  </div>
);
