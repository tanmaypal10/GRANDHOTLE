import { Hotel, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const { toast } = useToast();
  return (
    <footer id="contact" className="relative border-t border-white/10 bg-[hsl(var(--hotel-navy))]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="h-7 w-7 text-[hsl(var(--hotel-gold))]" />
              <span className="text-xl font-display font-bold gold-text">GRANDHOTLE</span>
            </div>
            <p className="text-foreground/60 text-sm leading-relaxed mb-4">
              A timeless sanctuary of luxury, where every detail is composed for moments worth remembering.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="p-2 rounded-full glass hover:text-[hsl(var(--hotel-gold))] hover:border-[hsl(var(--hotel-gold)/0.5)] transition-all" aria-label="social">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              {["Rooms & Suites", "Dining", "Spa & Wellness", "Events", "Gift Cards"].map((l) => (
                <li key={l}><a href="#" className="hover:text-[hsl(var(--hotel-gold))] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-[hsl(var(--hotel-gold))] shrink-0 mt-0.5" />1 GRANDHOTLE Boulevard, Côte d'Azur</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 text-[hsl(var(--hotel-gold))] shrink-0 mt-0.5" />+1 (555) 010-2025</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-[hsl(var(--hotel-gold))] shrink-0 mt-0.5" />stay@grandhotle.hotel</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Newsletter</h4>
            <p className="text-sm text-foreground/60 mb-4">Receive curated offers and seasonal stories.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); toast({ title: "Subscribed", description: "Welcome to the GRANDHOTLE inner circle." }); }}
              className="flex gap-2"
            >
              <Input type="email" required placeholder="your@email.com" className="bg-white/5 border-white/10" />
              <Button type="submit" variant="luxury" size="sm">Join</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-foreground/50">
          <div>© {new Date().getFullYear()} GRANDHOTLE Hotels. All rights reserved.</div>
          <div className="flex gap-6"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
        </div>
      </div>
    </footer>
  );
};
