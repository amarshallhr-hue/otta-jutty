import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message, UserProfile } from "../App";
import StickerPicker from "./StickerPicker";

const STICKER_KEYWORDS: Record<string, string[]> = {
  miss: ["🥺", "💕", "😭"],
  love: ["💖", "😍", "💋"],
  angry: ["😤", "💢", "🙄"],
  mad: ["😤", "💢", "🙄"],
  happy: ["😊", "🤩", "🎉"],
  yay: ["😊", "🤩", "🎉"],
  cute: ["🥰", "😘", "💗"],
  funny: ["😂", "🤣", "😹"],
  lol: ["😂", "🤣", "😹"],
};

const AI_SUGGESTIONS: Record<string, string[]> = {
  miss: [
    "I miss you more than wifi 📶",
    "Come back already 😭",
    "My heart is doing sad cartwheels 🤸",
  ],
  love: [
    "You're my favorite notification 💕",
    "Stop being so cute, it's a problem 😍",
    "I love you to the moon and back 🌙",
  ],
  busy: [
    "Too busy for me? 😤",
    "I'll just sit here being cute then 💅",
    "Fine, I'll talk to the wall 🧱",
  ],
  food: [
    "Food > everything (except you) 🍕",
    "Eat me in your thoughts 😂",
    "Send snacks first, love later 📦",
  ],
};

const DEFAULT_AI = [
  "You're hilarious 😂",
  "That's so you 🙈",
  "I cannot with you rn 💀",
];

const REACTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

function getAISuggestions(lastMsg: string): string[] {
  const lower = lastMsg.toLowerCase();
  for (const [key, sug] of Object.entries(AI_SUGGESTIONS)) {
    if (lower.includes(key)) return sug;
  }
  return DEFAULT_AI;
}

function getSmartStickers(text: string): string[] {
  const lower = text.toLowerCase();
  for (const [key, stickers] of Object.entries(STICKER_KEYWORDS)) {
    if (lower.includes(key)) return stickers;
  }
  return [];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  profile: UserProfile;
  messages: Message[];
  onMessagesChange: (msgs: Message[]) => void;
}

export default function ChatTab({
  profile,
  messages,
  onMessagesChange,
}: Props) {
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const smartStickers = getSmartStickers(input);
  const lastPartnerMsg =
    [...messages].reverse().find((m) => m.sender === "partner")?.text ?? "";
  const aiSuggestions = getAISuggestions(lastPartnerMsg);

  const sendMessage = (text: string, isSticker = false) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: Date.now(),
      reactions: [],
      isSticker,
    };
    const updated = [...messages, newMsg];
    onMessagesChange(updated);
    setInput("");
    setShowStickers(false);
    setShowAI(false);

    setTimeout(
      () => {
        const autoReplies = [
          "Aww 🥺💕",
          "lol same 😂",
          "YOU 😭❤️",
          "stop it 😍",
          "okayyyy 🙈",
          "noooo 💀",
          "i literally can't 😩",
        ];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          sender: "partner",
          timestamp: Date.now(),
          reactions: [],
        };
        onMessagesChange([...updated, reply]);
      },
      1200 + Math.random() * 800,
    );
  };

  const addReaction = (msgId: string, emoji: string) => {
    const updated = messages.map((m) =>
      m.id === msgId
        ? {
            ...m,
            reactions: m.reactions.includes(emoji)
              ? m.reactions.filter((r) => r !== emoji)
              : [...m.reactions, emoji],
          }
        : m,
    );
    onMessagesChange(updated);
    setReactionTarget(null);
  };

  const handlePressStart = (msgId: string) => {
    const timer = setTimeout(() => setReactionTarget(msgId), 500);
    setLongPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    setLongPressTimer(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="animated-gradient px-4 pt-12 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
          {profile.coupleNickname ? profile.coupleNickname.charAt(0) : "💕"}
        </div>
        <div>
          <p className="text-white font-bold text-sm">
            {profile.coupleNickname || `${profile.username} & Partner`}
          </p>
          <p className="text-white/70 text-xs">Code: {profile.inviteCode}</p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ paddingBottom: "180px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            data-ocid={`chat.item.${i + 1}`}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} relative`}
          >
            <div
              onMouseDown={() => handlePressStart(msg.id)}
              onMouseUp={handlePressEnd}
              onTouchStart={() => handlePressStart(msg.id)}
              onTouchEnd={handlePressEnd}
              className={`max-w-[70%] rounded-2xl px-4 py-2 cursor-pointer select-none ${
                msg.sender === "me"
                  ? "gradient-bubble text-white rounded-br-sm"
                  : "chat-bubble-partner rounded-bl-sm"
              } ${msg.isSticker ? "bg-transparent text-4xl px-2 py-1" : ""}`}
            >
              <p
                className={`text-sm font-medium ${msg.isSticker ? "text-4xl" : ""}`}
              >
                {msg.text}
              </p>
              <p className="text-[10px] mt-1 text-white/70">
                {formatTime(msg.timestamp)}
              </p>
              {msg.reactions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {msg.reactions.map((r) => (
                    <span key={r} className="text-sm">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {reactionTarget === msg.id && (
              <div
                className={`absolute ${msg.sender === "me" ? "right-0" : "left-0"} -top-10 bg-white rounded-full shadow-nav px-2 py-1 flex gap-1 z-10`}
                data-ocid="chat.popover"
              >
                {REACTIONS.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => addReaction(msg.id, r)}
                    className="text-xl hover:scale-125 transition-transform"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 space-y-2">
        {smartStickers.length > 0 && (
          <div className="flex gap-2 px-2">
            {smartStickers.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => sendMessage(s, true)}
                className="text-3xl hover:scale-125 transition-transform bg-white rounded-full w-12 h-12 shadow-card flex items-center justify-center"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showAI && (
          <div
            className="bg-white rounded-2xl shadow-card p-3 space-y-1"
            data-ocid="chat.panel"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              ✨ AI Fun Replies
            </p>
            {aiSuggestions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  sendMessage(s);
                  setShowAI(false);
                }}
                className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-accent transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showStickers && (
          <StickerPicker
            onSelect={(s) => sendMessage(s, true)}
            onClose={() => setShowStickers(false)}
          />
        )}

        <div className="flex items-center gap-2 bg-white rounded-full shadow-card px-3 py-1">
          <button
            type="button"
            data-ocid="chat.toggle"
            onClick={() => {
              setShowStickers((v) => !v);
              setShowAI(false);
            }}
            className="text-muted-foreground hover:text-primary transition-colors p-1"
          >
            <Smile size={22} />
          </button>
          <Input
            data-ocid="chat.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Say something cute... 💕"
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground"
          />
          <button
            type="button"
            data-ocid="chat.secondary_button"
            onClick={() => {
              setShowAI((v) => !v);
              setShowStickers(false);
            }}
            className="text-muted-foreground hover:text-primary transition-colors p-1"
            title="AI Suggestions"
          >
            <Zap size={20} />
          </button>
          <Button
            data-ocid="chat.submit_button"
            onClick={() => sendMessage(input)}
            size="sm"
            className="pill-btn animated-gradient text-white border-0 px-4"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
