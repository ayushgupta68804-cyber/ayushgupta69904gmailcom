import { Card, CardContent } from "@/components/ui/card";
import { Heart, PartyPopper, Building2, Gift, Music, Mic2 } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Grand ceremonies to intimate vows, we create magical wedding experiences with traditional and modern themes.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    icon: PartyPopper,
    title: "Birthday Parties",
    description: "From kids' fun themes to elegant milestone celebrations, every birthday becomes unforgettable.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Building2,
    title: "Corporate Events",
    description: "Professional conferences, product launches, and team celebrations with sophisticated planning.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Gift,
    title: "Surprise Events",
    description: "Secret proposals, surprise parties, and emotional reveals crafted with perfect timing.",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: Music,
    title: "Concerts & Festivals",
    description: "High-energy music events with professional sound, lighting, and crowd management.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Mic2,
    title: "Cultural Events",
    description: "Traditional ceremonies, religious functions, and cultural celebrations with authentic touches.",
    gradient: "from-red-500/20 to-rose-500/20",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Events We Specialize In
          </h2>
          <p className="text-muted-foreground text-lg">
            Whatever your occasion, we bring expertise, creativity, and flawless execution to make it extraordinary.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              variant="elevated"
              className="group hover:border-primary/30 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
