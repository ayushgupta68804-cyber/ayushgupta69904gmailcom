import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles, Calendar, Users, IndianRupee, TrendingUp,
  Eye, MessageSquare, User, LogOut, Bell, Settings, 
  LayoutDashboard, FileText, CreditCard, Image, Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface EventRequest {
  id: string;
  event_type: string;
  event_date: string;
  budget: number;
  status: string;
  guest_count: number;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

interface Stats {
  totalRequests: number;
  activeEvents: number;
  totalRevenue: number;
  avgRating: number;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_review: { label: "New Request", color: "bg-blue-500/20 text-blue-500" },
  ai_plans_ready: { label: "AI Plans Ready", color: "bg-amber-500/20 text-amber-500" },
  owner_reviewing: { label: "Reviewing", color: "bg-amber-500/20 text-amber-500" },
  plan_sent: { label: "Plan Sent", color: "bg-blue-500/20 text-blue-500" },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-500" },
  payment_pending: { label: "Payment Pending", color: "bg-amber-500/20 text-amber-500" },
  confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500/20 text-blue-500" },
  completed: { label: "Completed", color: "bg-primary/20 text-primary" },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-500" },
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Requests" },
  { icon: Calendar, label: "Events" },
  { icon: CreditCard, label: "Payments" },
  { icon: Image, label: "Albums" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading, isAdmin } = useAuth();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    activeEvents: 0,
    totalRevenue: 0,
    avgRating: 4.9,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
      return;
    }

    if (!loading && user && !isAdmin) {
      navigate("/dashboard");
      return;
    }

    if (user && isAdmin) {
      fetchData();
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      // Fetch event requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('event_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (requestsError) throw requestsError;

      // Fetch profiles for customer names
      if (requestsData && requestsData.length > 0) {
        const userIds = [...new Set(requestsData.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        const enrichedRequests = requestsData.map(r => ({
          ...r,
          profiles: profilesMap.get(r.user_id)
        }));
        setRequests(enrichedRequests);
      } else {
        setRequests([]);
      }

      // Calculate stats
      const { count: totalCount } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['confirmed', 'in_progress']);

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('rating');

      const avgRating = feedbackData && feedbackData.length > 0
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
        : 4.9;

      setStats({
        totalRequests: totalCount || 0,
        activeEvents: activeCount || 0,
        totalRevenue,
        avgRating: Number(avgRating.toFixed(1)),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statsDisplay = [
    { label: "Total Requests", value: stats.totalRequests.toString(), change: "+12%", icon: FileText },
    { label: "Active Events", value: stats.activeEvents.toString(), change: "+5%", icon: Calendar },
    { label: "Revenue", value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: "+18%", icon: IndianRupee },
    { label: "Avg Rating", value: stats.avgRating.toString(), change: "+0.2", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-lg font-semibold text-foreground block">
                The Dreamers
              </span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <h1 className="font-display text-xl font-semibold text-foreground">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsDisplay.map((stat) => (
              <Card key={stat.label} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="flex items-center gap-1 text-sm text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm text-muted-foreground mb-1">{stat.label}</h3>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Event Requests</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No event requests yet
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => {
                    const status = statusConfig[request.status] || statusConfig.pending_review;

                    return (
                      <div
                        key={request.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {request.profiles?.full_name || 'Unknown Customer'}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{request.event_type}</span>
                              <span>•</span>
                              <span>{new Date(request.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                              <span>•</span>
                              <span>₹{request.budget.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                            {status.label}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {request.status === "ai_plans_ready" && (
                            <Button variant="gold" size="sm">
                              Review Plans
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;