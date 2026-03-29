import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Star, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../App";

interface Props {
  profile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
}

const THEMES = [
  { key: "pink" as const, label: "Pink Love", emoji: "💕" },
  { key: "purple" as const, label: "Purple Dream", emoji: "💜" },
  { key: "ocean" as const, label: "Ocean Blue", emoji: "🌊" },
];

export default function ProfileTab({ profile, onProfileChange }: Props) {
  const [nickname, setNickname] = useState(profile.coupleNickname);
  const [startDate, setStartDate] = useState(profile.startDate);
  const [copied, setCopied] = useState(false);

  const save = () => {
    onProfileChange({ ...profile, coupleNickname: nickname, startDate });
    toast.success("Profile saved! 💾");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(profile.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <div className="animated-gradient px-6 pt-12 pb-8 flex flex-col items-center text-white">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-3">
          <User size={40} color="white" />
        </div>
        <h1 className="text-2xl font-black">{profile.username}</h1>
        <p className="text-white/80 text-sm mt-1">Your Otta Jutty Profile ✨</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Invite Code */}
        <div
          className="bg-white rounded-2xl p-5 shadow-card"
          data-ocid="profile.card"
        >
          <h3 className="font-bold text-sm mb-3">Your Invite Code 🔐</h3>
          <div className="flex items-center gap-3 bg-accent rounded-xl px-4 py-3">
            <span className="text-2xl font-black tracking-widest gradient-text flex-1">
              {profile.inviteCode}
            </span>
            <button
              type="button"
              data-ocid="profile.secondary_button"
              onClick={copyCode}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this code with your partner 💕
          </p>
        </div>

        {/* Couple Settings */}
        <div
          className="bg-white rounded-2xl p-5 shadow-card"
          data-ocid="profile.panel"
        >
          <h3 className="font-bold text-sm mb-3">Couple Settings 💑</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Couple Nickname
              </p>
              <Input
                data-ocid="profile.input"
                placeholder="e.g. Lovey Doveys 💕"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Together Since
              </p>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <Button
            data-ocid="profile.save_button"
            onClick={save}
            className="pill-btn w-full mt-4 animated-gradient text-white border-0 font-bold"
          >
            Save Changes 💾
          </Button>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Star size={16} /> Theme
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t.key}
                data-ocid={`profile.${t.key}.toggle`}
                onClick={() => onProfileChange({ ...profile, theme: t.key })}
                className={`rounded-xl py-3 text-center transition-all border-2 ${
                  profile.theme === t.key
                    ? "border-primary bg-accent"
                    : "border-transparent hover:bg-muted"
                }`}
              >
                <div className="text-2xl">{t.emoji}</div>
                <p className="text-[10px] font-semibold mt-1">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-destructive/20">
          <h3 className="font-bold text-sm text-destructive mb-2">
            Danger Zone ⚠️
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            This will clear all your data and reset the app.
          </p>
          <Button
            data-ocid="profile.delete_button"
            onClick={resetAll}
            variant="destructive"
            className="pill-btn w-full font-bold"
          >
            Reset Everything 🗑️
          </Button>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
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
