import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Rooms } from "@/components/Rooms";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { ScrollProgress, FloatingActions } from "@/components/Floating";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Rooms />
        <Services />
        <Stats />
        <Testimonials />
        <Gallery />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
