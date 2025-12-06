import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              The Dreamers Event
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                  Login
                </Button>
                <Button variant="gold" onClick={() => navigate("/auth/signup")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/gallery"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {user ? (
                  <>
                    <Button variant="outline" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { navigate("/auth/login"); setIsOpen(false); }}>
                      Login
                    </Button>
                    <Button variant="gold" onClick={() => { navigate("/auth/signup"); setIsOpen(false); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;