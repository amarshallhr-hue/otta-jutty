import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { UserProfile } from "../App";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [myCode] = useState(generateCode);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (!username.trim()) {
        setError("Enter your name!");
        return;
      }
      setError("");
      setStep(2);
    } else {
      const profile: UserProfile = {
        username: username.trim(),
        inviteCode: myCode,
        partnerCode: partnerCode.trim() || "DEMO01",
        coupleNickname: "",
        startDate: "",
        myMood: "😊",
        partnerMood: "😍",
        theme: "pink",
      };
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="animated-gradient px-6 pt-16 pb-12 flex flex-col items-center text-white">
        <img
          src="/assets/generated/otta-jutty-mascot-transparent.dim_200x200.png"
          alt="Otta Jutty mascot"
          className="w-24 h-24 rounded-full mb-4 shadow-lg"
        />
        <h1 className="text-4xl font-black tracking-tight">Otta Jutty</h1>
        <p className="text-white/80 text-sm mt-1 font-medium">
          Stay Connected, Stay Playful 💕
        </p>
      </div>

      <div className="flex-1 -mt-6 bg-background rounded-t-3xl px-6 pt-8 pb-6">
        {step === 1 ? (
          <div className="fade-slide-in">
            <h2 className="text-2xl font-bold mb-1">What's your name? 👋</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Let your partner know who you are!
            </p>
            <Input
              data-ocid="onboarding.input"
              placeholder="Your cute nickname..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              className="pill-btn text-base py-5 px-5 font-medium"
            />
            {error && (
              <p
                className="text-destructive text-sm mt-2"
                data-ocid="onboarding.error_state"
              >
                {error}
              </p>
            )}
            <Button
              data-ocid="onboarding.primary_button"
              onClick={handleNext}
              className="pill-btn w-full mt-6 py-5 text-base font-bold animated-gradient text-white border-0"
            >
              Continue →
            </Button>
          </div>
        ) : (
          <div className="fade-slide-in">
            <h2 className="text-2xl font-bold mb-1">Your Invite Code 🔐</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Share this with your partner, or enter theirs!
            </p>

            <div className="bg-accent rounded-2xl p-4 mb-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Your code</p>
              <p className="text-3xl font-black tracking-widest gradient-text">
                {myCode}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Share this with your partner
              </p>
            </div>

            <Input
              data-ocid="onboarding.partner_input"
              placeholder="Partner's 6-char code (optional)"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              className="pill-btn text-base py-5 px-5 font-medium tracking-widest"
              maxLength={6}
            />

            <Button
              data-ocid="onboarding.submit_button"
              onClick={handleNext}
              className="pill-btn w-full mt-6 py-5 text-base font-bold animated-gradient text-white border-0"
            >
              Start Chatting! 💬
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
