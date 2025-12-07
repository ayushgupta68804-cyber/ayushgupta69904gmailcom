import { useState, useRef } from "react";
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
  Home, TreePine, Sparkles, Upload, Mic, ArrowRight, X, Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    
    setUploadingImages(true);
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setReferenceImages(prev => [...prev, ...uploadedUrls]);
      toast({
        title: "Images Uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload some images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit an event request.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (!formData.eventType) {
      toast({
        title: "Event Type Required",
        description: "Please select an event type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse budget - extract numeric value
      const budgetValue = parseFloat(formData.budget.replace(/[^0-9.]/g, '')) || 0;
      const guestCountValue = parseInt(formData.guestCount) || 0;

      // Insert event request
      const { data: eventRequest, error: insertError } = await supabase
        .from('event_requests')
        .insert({
          user_id: user.id,
          event_type: formData.eventType,
          budget: budgetValue,
          guest_count: guestCountValue,
          event_date: formData.eventDate,
          event_time: formData.eventTime || null,
          location: formData.location,
          venue_type: formData.venueType,
          time_of_day: formData.timeOfDay,
          event_scale: formData.eventScale,
          reference_images: referenceImages.length > 0 ? referenceImages : null,
          status: 'pending_review',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Send notification
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'booking_confirmation',
            email: user.email,
            userName: user.user_metadata?.full_name || 'Valued Customer',
            eventType: formData.eventType,
            eventDate: formData.eventDate,
          },
        });
      } catch (notifError) {
        console.log("Notification skipped:", notifError);
      }

      // Trigger AI plan generation
      try {
        const { error: aiError } = await supabase.functions.invoke('generate-ai-plans', {
          body: {
            eventRequestId: eventRequest.id,
            eventType: formData.eventType,
            budget: budgetValue,
            guestCount: guestCountValue,
            venueType: formData.venueType,
            timeOfDay: formData.timeOfDay,
            eventScale: formData.eventScale,
            location: formData.location,
          },
        });

        if (aiError) {
          console.log("AI generation will be done by admin:", aiError);
        }
      } catch (aiError) {
        console.log("AI plan generation queued for admin review");
      }

      toast({
        title: "Request Submitted Successfully!",
        description: "Our organizer will review your request and contact you shortly with personalized plans.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    placeholder="e.g., 50000 or 100000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">Enter amount in INR</p>
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
                    min="1"
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
                    min={new Date().toISOString().split('T')[0]}
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
                
                {/* Image Upload */}
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    {uploadingImages ? (
                      <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {uploadingImages ? "Uploading..." : "Upload Reference Images"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>

                  {/* Preview uploaded images */}
                  {referenceImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {referenceImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Reference ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-destructive-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  Send Request to Organizer
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventRequest;
