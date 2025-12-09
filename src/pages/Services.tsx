import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  PartyPopper, 
  Heart, 
  Building2, 
  Sparkles, 
  Music, 
  Camera, 
  Utensils, 
  Palette, 
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Heart,
    title: "Wedding Planning",
    description: "From intimate ceremonies to grand celebrations, we craft unforgettable weddings that reflect your unique love story. Our comprehensive wedding services include venue selection, decor design, catering coordination, and day-of management.",
    features: ["Venue Selection & Setup", "Custom Decor & Themes", "Vendor Coordination", "Day-of Coordination"],
    gradient: "from-rose-gold/20 to-champagne/20",
  },
  {
    icon: PartyPopper,
    title: "Birthday Celebrations",
    description: "Make every milestone memorable with our creative birthday party planning. From children's themed parties to elegant adult celebrations, we bring your vision to life with stunning decorations and entertainment.",
    features: ["Theme-based Decor", "Entertainment & Activities", "Custom Cakes & Catering", "Photography & Videography"],
    gradient: "from-primary/20 to-gold-light/20",
  },
  {
    icon: Building2,
    title: "Corporate Events",
    description: "Elevate your brand with professionally executed corporate events. We specialize in product launches, conferences, team-building events, and annual celebrations that leave lasting impressions.",
    features: ["Conference Management", "Product Launches", "Team Building Events", "Award Ceremonies"],
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: Sparkles,
    title: "Surprise Events",
    description: "Create magical moments with our surprise event planning. Whether it's a proposal, anniversary surprise, or milestone celebration, we handle every detail to ensure the perfect reveal.",
    features: ["Proposal Planning", "Anniversary Surprises", "Secret Celebrations", "Flash Mobs"],
    gradient: "from-champagne/20 to-rose-gold/20",
  },
  {
    icon: Music,
    title: "Concert & Festival",
    description: "Experience the energy of professionally organized concerts and festivals. From stage design to sound systems, lighting, and artist coordination, we deliver events that electrify audiences.",
    features: ["Stage Design & Setup", "Sound & Lighting", "Artist Management", "Crowd Management"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description: "Capture every precious moment with our professional photography and videography services. We provide candid shots, cinematic videos, and beautifully edited highlight reels.",
    features: ["Candid Photography", "Cinematic Videos", "Drone Shots", "Same-day Edits"],
    gradient: "from-gold-light/20 to-champagne/20",
  },
  {
    icon: Utensils,
    title: "Catering Services",
    description: "Delight your guests with exquisite culinary experiences. Our catering services offer diverse cuisines, custom menus, and professional service that complements your event perfectly.",
    features: ["Multi-cuisine Options", "Custom Menus", "Live Counters", "Bar Services"],
    gradient: "from-accent/20 to-rose-gold/20",
  },
  {
    icon: Palette,
    title: "Decor & Design",
    description: "Transform any space into a stunning venue with our creative decor services. From floral arrangements to lighting design, we create atmospheres that captivate and inspire.",
    features: ["Floral Arrangements", "Lighting Design", "Theme Execution", "Stage Decor"],
    gradient: "from-champagne/20 to-primary/20",
  },
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Our Services | The Dreamers Event - Complete Event Planning</title>
        <meta name="description" content="Explore our comprehensive event planning services including weddings, birthdays, corporate events, concerts, and more. The Dreamers Event brings your vision to life." />
        <meta name="keywords" content="event planning, wedding planner, birthday party, corporate events, concert organizer, Jaipur, Delhi NCR" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Premium Event Services</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-gradient-gold">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, we offer comprehensive event planning services 
              tailored to bring your vision to life with elegance and precision.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  variant="elevated" 
                  className="group hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-dark">
          <div className="container mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Let our AI-powered platform help you design the perfect event. Get personalized plans in minutes.
            </p>
            <Link to="/request">
              <Button variant="gold" size="lg" className="group">
                Start Planning Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Services;
