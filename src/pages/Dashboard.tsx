import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, Plus, Calendar, Clock, MapPin, IndianRupee,
  MessageSquare, CheckCircle2, AlertCircle, User, LogOut, Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface EventRequest {
  id: string;
  event_type: string;
  event_date: string;
  status: string;
  budget: number;
  location: string;
  guest_count: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending_review: { label: "Under Review", color: "bg-amber-500/20 text-amber-500", icon: Clock },
  ai_plans_ready: { label: "Plans Ready", color: "bg-blue-500/20 text-blue-500", icon: AlertCircle },
  plan_sent: { label: "Plan Received", color: "bg-blue-500/20 text-blue-500", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-500", icon: CheckCircle2 },
  payment_pending: { label: "Payment Pending", color: "bg-amber-500/20 text-amber-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-500", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "bg-blue-500/20 text-blue-500", icon: Clock },
  completed: { label: "Completed", color: "bg-primary/20 text-primary", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-500", icon: AlertCircle },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventRequest[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
      return;
    }

    if (isAdmin) {
      navigate("/admin");
      return;
    }

    if (user) {
      fetchEvents();
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('event_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                The Dreamers Event
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground">
              Manage your events and track their progress.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card
              variant="glow"
              className="cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => navigate("/request")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
                  <Plus className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">New Event</h3>
                  <p className="text-sm text-muted-foreground">Start planning</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Chat Support</h3>
                  <p className="text-sm text-muted-foreground">Talk to organizer</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Calendar</h3>
                  <p className="text-sm text-muted-foreground">View timeline</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Events
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            {loadingEvents ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : events.length === 0 ? (
              <Card variant="elevated" className="text-center py-16">
                <CardContent>
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Events Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start planning your first unforgettable event!
                  </p>
                  <Button variant="gold" onClick={() => navigate("/request")}>
                    <Plus className="w-4 h-4" />
                    Plan Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => {
                  const status = statusConfig[event.status] || statusConfig.pending_review;
                  const StatusIcon = status.icon;

                  return (
                    <Card
                      key={event.id}
                      variant="elevated"
                      className="hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                {event.event_type}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(event.event_date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  ₹{event.budget.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.label}
                            </span>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;