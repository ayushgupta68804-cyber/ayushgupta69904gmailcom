import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, PartyPopper, Building2, Gift, Music, Mic2,
  Calendar, Users, MapPin, IndianRupee, Sun, Moon,
  Home, TreePine, Sparkles, Upload, Mic, ArrowRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const eventTypes = [
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "birthday", label: "Birthday", icon: PartyPopper },
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "surprise", label: "Surprise", icon: Gift },
  { id: "concert", label: "Concert", icon: Music },
  { id: "cultural", label: "Cultural", icon: Mic2 },
];

const EventRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventType: "",
    budget: "",
    guestCount: "",
    eventDate: "",
    eventTime: "",
    location: "",
    venueType: "indoor",
    timeOfDay: "day",
    eventScale: "balanced",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted!",
        description: "Our organizer will contact you shortly with personalized plans.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
              Plan Your Event
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Tell Us About Your
              <span className="bg-gradient-to-r from-primary to-champagne bg-clip-text text-transparent"> Dream Event</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your vision and let our experts create the perfect celebration for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Event Type Selection */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Event Type</CardTitle>
                <CardDescription>What kind of event are you planning?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventType: type.id })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.eventType === type.id
                          ? "border-primary bg-primary/10 text-primary shadow-[0_4px_30px_hsl(43_74%_52%/0.2)]"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      <type.icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget & Guests */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    Budget Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="e.g., ₹50,000 - ₹1,00,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Number of Guests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    placeholder="Expected guest count"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Event Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Event Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>
            </div>

            {/* Location */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Event Location
                </CardTitle>
                <CardDescription>Provide the venue address or area</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Enter venue address or preferred area"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Event Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Venue Type */}
                <div className="space-y-3">
                  <Label>Venue Type</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, venueType: "indoor" })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                        formData.venueType === "indoor"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      Indoor
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, venueType: "outdoor" })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                        formData.venueType === "outdoor"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <TreePine className="w-5 h-5" />
                      Outdoor
                    </button>
                  </div>
                </div>

                {/* Time of Day */}
                <div className="space-y-3">
                  <Label>Time of Day</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, timeOfDay: "day" })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                        formData.timeOfDay === "day"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      Daytime
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, timeOfDay: "night" })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                        formData.timeOfDay === "night"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      Evening/Night
                    </button>
                  </div>
                </div>

                {/* Event Scale */}
                <div className="space-y-3">
                  <Label>Event Scale</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "simple", label: "Simple & Elegant" },
                      { id: "balanced", label: "Balanced" },
                      { id: "grand", label: "Grand & Luxurious" },
                    ].map((scale) => (
                      <button
                        key={scale.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, eventScale: scale.id })}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          formData.eventScale === scale.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="text-sm font-medium">{scale.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes & Uploads */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Share any specific requirements or ideas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Tell us more about your vision, theme preferences, special requirements..."
                  className="min-h-32"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Upload Reference Images</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Record Voice Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Describe your vision verbally</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting || !formData.eventType}
            >
              {isSubmitting ? "Sending Request..." : "Send Request to Organizer"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventRequest;
