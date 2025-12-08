import { Link } from "react-router-dom";
import { Sparkles, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                The Dreamers Event
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting unforgettable moments with AI-powered event planning. From intimate gatherings to grand celebrations.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/the_dreamers_events?igsh=aG5ncHYzYWI1ZGt1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Our Services
              </Link>
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Gallery
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/request" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Plan Your Event
              </Link>
            </div>
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Events We Plan</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Weddings</span>
              <span className="text-sm text-muted-foreground">Birthday Parties</span>
              <span className="text-sm text-muted-foreground">Corporate Events</span>
              <span className="text-sm text-muted-foreground">Surprise Celebrations</span>
              <span className="text-sm text-muted-foreground">Concerts & Festivals</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+918766353710" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +91 87663 53710
              </a>
              <a href="mailto:thedreamersevents1@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                thedreamersevents1@gmail.com
              </a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Jaipur+Delhi+NCR+Dehradun+Lucknow+Prayagraj+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="hover:underline">Jaipur, Delhi NCR, Dehradun, Lucknow, Prayagraj & PAN India</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 The Dreamers Event. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;