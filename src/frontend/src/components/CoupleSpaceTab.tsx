import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import type { Memory, UserProfile } from "../App";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🥺", label: "Missing You" },
  { emoji: "😍", label: "In Love" },
  { emoji: "😤", label: "Annoyed" },
];

function getDaysTogether(startDate: string): number {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  profile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
  memories: Memory[];
  onMemoriesChange: (m: Memory[]) => void;
}

export default function CoupleSpaceTab({
  profile,
  onProfileChange,
  memories,
  onMemoriesChange,
}: Props) {
  const [newMemCaption, setNewMemCaption] = useState("");
  const [newMemEmoji, setNewMemEmoji] = useState("📸");
  const [dialogOpen, setDialogOpen] = useState(false);

  const days = getDaysTogether(profile.startDate);

  const addMemory = () => {
    if (!newMemCaption.trim()) return;
    const mem: Memory = {
      id: Date.now().toString(),
      caption: newMemCaption.trim(),
      emoji: newMemEmoji || "📸",
      date: new Date().toISOString().split("T")[0],
    };
    onMemoriesChange([...memories, mem]);
    setNewMemCaption("");
    setNewMemEmoji("📸");
    setDialogOpen(false);
  };

  const setMood = (emoji: string) => {
    onProfileChange({ ...profile, myMood: emoji });
  };

  return (
    <div>
      <div className="animated-gradient px-6 pt-12 pb-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={18} fill="white" />
          <h1 className="text-xl font-black">Couple Space</h1>
        </div>
        <p className="text-white/80 text-sm">
          {profile.coupleNickname || `${profile.username} & Partner`}
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Love Counter */}
        <div
          className="bg-white rounded-2xl p-5 shadow-card text-center"
          data-ocid="couple.card"
        >
          <div className="text-5xl mb-2">💕</div>
          <div className="text-4xl font-black gradient-text">{days}</div>
          <div className="text-base font-semibold text-muted-foreground mt-1">
            Days Together 💕
          </div>
          {!profile.startDate && (
            <p className="text-xs text-muted-foreground mt-2">
              Set your start date in Profile ⚙️
            </p>
          )}
        </div>

        {/* Mood Sharing */}
        <div
          className="bg-white rounded-2xl p-5 shadow-card"
          data-ocid="couple.panel"
        >
          <h3 className="font-bold text-base mb-3">Mood Sharing 🌈</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">You</p>
              <div className="text-4xl mb-2">{profile.myMood}</div>
              <div className="flex flex-wrap justify-center gap-1">
                {MOODS.map((m) => (
                  <button
                    type="button"
                    key={m.emoji}
                    data-ocid="couple.toggle"
                    onClick={() => setMood(m.emoji)}
                    className={`text-xl rounded-full w-8 h-8 flex items-center justify-center transition-all ${
                      profile.myMood === m.emoji
                        ? "bg-accent ring-2 ring-primary scale-110"
                        : "hover:bg-accent"
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Partner</p>
              <div className="text-4xl mb-2">{profile.partnerMood}</div>
              <p className="text-xs text-muted-foreground">
                Waiting for their update...
              </p>
            </div>
          </div>
        </div>

        {/* Shared Memories */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">Memories 📸</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="couple.open_modal_button"
                  size="sm"
                  className="pill-btn animated-gradient text-white border-0 gap-1"
                >
                  <Plus size={14} /> Add
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-[90vw] rounded-2xl"
                data-ocid="couple.dialog"
              >
                <DialogHeader>
                  <DialogTitle>Add a Memory 💕</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Caption
                    </p>
                    <Input
                      data-ocid="couple.input"
                      placeholder="What happened? 🥺"
                      value={newMemCaption}
                      onChange={(e) => setNewMemCaption(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Emoji
                    </p>
                    <Input
                      placeholder="Pick an emoji (e.g. 🌹)"
                      value={newMemEmoji}
                      onChange={(e) => setNewMemEmoji(e.target.value)}
                      className="text-2xl"
                    />
                  </div>
                  <Button
                    data-ocid="couple.save_button"
                    onClick={addMemory}
                    className="pill-btn w-full animated-gradient text-white border-0"
                  >
                    Save Memory 💾
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {memories.length === 0 ? (
            <div
              className="text-center py-6 text-muted-foreground"
              data-ocid="couple.empty_state"
            >
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">No memories yet! Add your first one 💕</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3" data-ocid="couple.list">
              {memories.map((mem, i) => (
                <div
                  key={mem.id}
                  data-ocid={`couple.item.${i + 1}`}
                  className="bg-accent rounded-xl p-3 text-center"
                >
                  <div className="text-4xl mb-1">{mem.emoji}</div>
                  <p className="text-xs font-semibold">{mem.caption}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {mem.date}
                  </p>
                </div>
              ))}
            </div>
          )}
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
