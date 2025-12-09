import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Sparkles, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Phone, 
  Mail,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const teamValues = [
  {
    icon: Heart,
    title: "Passion",
    description: "We pour our hearts into every event, treating your celebrations as our own.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Every detail matters. We plan meticulously to ensure flawless execution.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work closely with you, making you part of every decision in the planning process.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, exceeding expectations every time.",
  },
];

const stats = [
  { number: "500+", label: "Events Completed" },
  { number: "50,000+", label: "Happy Guests" },
  { number: "5", label: "Cities Covered" },
  { number: "100%", label: "Client Satisfaction" },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | The Dreamers Event - Your Vision, Our Expertise</title>
        <meta name="description" content="Learn about The Dreamers Event - India's AI-powered event planning company. We transform your dreams into unforgettable celebrations across Jaipur, Delhi NCR, and more." />
        <meta name="keywords" content="about the dreamers event, event planning company, wedding planner India, corporate event organizer" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Your Dreams, Our Mission</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-gradient-gold">The Dreamers Event</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just event planners; we're dream architects. Our passion is transforming your 
              vision into extraordinary celebrations that create lasting memories.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card variant="elevated" className="group hover:shadow-gold transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To revolutionize event planning in India by combining cutting-edge AI technology with 
                    traditional hospitality excellence. We aim to make premium event planning accessible 
                    to everyone, ensuring every celebration—regardless of budget—receives the attention 
                    and creativity it deserves.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated" className="group hover:shadow-gold transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-champagne/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Eye className="w-8 h-8 text-champagne" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted and innovative event planning platform, known for 
                    creating personalized, memorable experiences. We envision a future where every 
                    celebration is as unique as the people behind it, powered by technology but driven 
                    by human creativity and emotion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4 bg-gradient-dark">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Dreamers Event was born from a simple belief: every celebration deserves to be 
                extraordinary. Founded with a passion for creating memorable experiences, we've grown 
                from a small team in Jaipur to serving clients across India.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our journey began when we noticed a gap in the market—premium event planning was often 
                inaccessible to middle-class families who deserved beautiful celebrations just as much 
                as anyone else. We set out to change that by leveraging AI technology to create smart, 
                efficient planning that reduces costs without compromising on quality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to have been part of over 500 celebrations, from intimate birthday 
                parties to grand weddings. Each event has taught us something new, making us better at 
                what we do. But what hasn't changed is our commitment to making your dreams come true.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6">
                  <div className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-gradient-dark">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                These principles guide everything we do at The Dreamers Event
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamValues.map((value, index) => (
                <Card key={index} variant="elevated" className="text-center hover:shadow-gold transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose <span className="text-gradient-gold">Us?</span>
                </h2>
                <div className="space-y-4">
                  {[
                    "AI-powered smart planning for optimized budgets",
                    "Personal touch with dedicated event coordinators",
                    "Transparent pricing with no hidden costs",
                    "Pan India coverage with local expertise",
                    "24/7 support throughout your event journey",
                    "Post-event digital albums and highlight reels",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card variant="elevated" className="p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="tel:+918766353710" className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Call us</div>
                      <div className="font-medium text-foreground">+91 87663 53710</div>
                    </div>
                  </a>

                  <a href="mailto:thedreamersevents1@gmail.com" className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email us</div>
                      <div className="font-medium text-foreground">thedreamersevents1@gmail.com</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Serving</div>
                      <div className="font-medium text-foreground">Jaipur, Delhi NCR, Dehradun, Lucknow, Prayagraj & PAN India</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-dark">
          <div className="container mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Create Magic?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's turn your vision into an unforgettable celebration. Start your journey with us today.
            </p>
            <Link to="/request">
              <Button variant="gold" size="lg" className="group">
                Plan Your Event
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

export default About;
