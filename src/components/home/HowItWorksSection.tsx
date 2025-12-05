import { MessageSquare, Sparkles, UserCheck, CreditCard, Camera } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Share Your Vision",
    description: "Tell us about your event - type, budget, guests, and preferences. Upload voice notes or reference images.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "We Craft Options",
    description: "Our expert team creates personalized plans tailored to your requirements and budget.",
  },
  {
    icon: UserCheck,
    number: "03",
    title: "Personal Consultation",
    description: "Your dedicated organizer explains the plan, answers questions, and finalizes every detail.",
  },
  {
    icon: CreditCard,
    number: "04",
    title: "Confirm & Execute",
    description: "Approve the plan, make payment, and relax while we bring your vision to life.",
  },
  {
    icon: Camera,
    number: "05",
    title: "Cherish Memories",
    description: "Receive a digital album and highlight reel to relive your special moments forever.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your Journey to the
            <span className="bg-gradient-to-r from-primary to-champagne bg-clip-text text-transparent"> Perfect Event</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A seamless process from your first idea to your unforgettable celebration.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center group"
              >
                {/* Icon Container */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
