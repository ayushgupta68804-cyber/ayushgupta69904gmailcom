import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, email, password, fullName, type = "signup" } = location.state || {};
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      navigate("/auth/signup");
      return;
    }
    // Start cooldown on mount
    setResendCooldown(20);
  }, [phone, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP expiry timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: {
          phone,
          otp: otpString,
          type,
          email,
          password,
          fullName,
        },
      });

      if (error || data?.error) {
        toast({
          title: "Verification Failed",
          description: data?.error || error?.message || "Invalid OTP",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: type === "signup" ? "Account created successfully!" : "Login successful!",
      });

      // Set session if returned
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      navigate(data.isAdmin ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(20);
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phone, email, type },
      });

      if (error || data?.error) {
        toast({
          title: "Failed to resend OTP",
          description: data?.error || error?.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your phone",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-champagne flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            The Dreamers Event
          </span>
        </Link>

        <Card variant="elevated" className="backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-foreground">{phone}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Timer */}
            <div className="text-center">
              <span className={`text-sm ${timeLeft < 60 ? "text-destructive" : "text-muted-foreground"}`}>
                OTP expires in: {formatTime(timeLeft)}
              </span>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-lg border border-border bg-secondary/50 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={timeLeft === 0}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              variant="gold"
              className="w-full"
              size="lg"
              onClick={handleVerify}
              disabled={isLoading || otp.join("").length !== 6 || timeLeft === 0}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${resendCooldown > 0 ? "" : "animate-spin-slow"}`} />
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </Button>
            </div>

            {/* Back Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;
