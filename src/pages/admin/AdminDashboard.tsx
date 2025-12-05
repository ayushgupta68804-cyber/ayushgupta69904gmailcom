import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles, Calendar, Users, IndianRupee, TrendingUp,
  Clock, CheckCircle2, AlertCircle, Eye, MessageSquare,
  User, LogOut, Bell, Settings, LayoutDashboard, FileText,
  CreditCard, Image, Star
} from "lucide-react";

// Mock data
const stats = [
  { label: "Total Requests", value: "24", change: "+12%", icon: FileText },
  { label: "Active Events", value: "8", change: "+5%", icon: Calendar },
  { label: "Revenue", value: "₹12.5L", change: "+18%", icon: IndianRupee },
  { label: "Avg Rating", value: "4.9", change: "+0.2", icon: Star },
];

const recentRequests = [
  {
    id: 1,
    customer: "Rahul Sharma",
    type: "Wedding",
    date: "2024-03-15",
    budget: "₹2,50,000",
    status: "new",
    guestCount: 150,
  },
  {
    id: 2,
    customer: "Priya Patel",
    type: "Birthday",
    date: "2024-02-28",
    budget: "₹50,000",
    status: "ai_ready",
    guestCount: 50,
  },
  {
    id: 3,
    customer: "Amit Kumar",
    type: "Corporate",
    date: "2024-03-20",
    budget: "₹1,50,000",
    status: "approved",
    guestCount: 200,
  },
];

const statusConfig = {
  new: { label: "New Request", color: "bg-blue-500/20 text-blue-500" },
  ai_ready: { label: "AI Plans Ready", color: "bg-amber-500/20 text-amber-500" },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-500" },
  completed: { label: "Completed", color: "bg-primary/20 text-primary" },
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
  const [requests] = useState(recentRequests);

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
                Toshan Event
              </span>
              <span className="text-xs text-muted-foreground">Owner Panel</span>
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
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
            {stats.map((stat) => (
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
              <div className="space-y-4">
                {requests.map((request) => {
                  const status = statusConfig[request.status as keyof typeof statusConfig];

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
                          <h4 className="font-medium text-foreground">{request.customer}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{request.type}</span>
                            <span>•</span>
                            <span>{new Date(request.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            <span>•</span>
                            <span>{request.budget}</span>
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
                        {request.status === "ai_ready" && (
                          <Button variant="gold" size="sm">
                            Review Plans
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
