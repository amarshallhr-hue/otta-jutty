import { Toaster } from "@/components/ui/sonner";
import { Gamepad2, Heart, MessageCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import ChatTab from "./components/ChatTab";
import CoupleSpaceTab from "./components/CoupleSpaceTab";
import GamesTab from "./components/GamesTab";
import OnboardingScreen from "./components/OnboardingScreen";
import ProfileTab from "./components/ProfileTab";

export type TabType = "chat" | "couple" | "games" | "profile";

export interface UserProfile {
  username: string;
  inviteCode: string;
  partnerCode: string;
  coupleNickname: string;
  startDate: string;
  myMood: string;
  partnerMood: string;
  theme: "pink" | "purple" | "ocean";
}

export interface Message {
  id: string;
  text: string;
  sender: "me" | "partner";
  timestamp: number;
  reactions: string[];
  isSticker?: boolean;
}

export interface Memory {
  id: string;
  caption: string;
  emoji: string;
  date: string;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey babe! 💕",
    sender: "partner",
    timestamp: Date.now() - 3600000,
    reactions: [],
  },
  {
    id: "2",
    text: "Hiii!! I miss you so much 🥺",
    sender: "me",
    timestamp: Date.now() - 3500000,
    reactions: [],
  },
  {
    id: "3",
    text: "I was just thinking about you 😍",
    sender: "partner",
    timestamp: Date.now() - 3400000,
    reactions: [],
  },
  {
    id: "4",
    text: "You're literally the best thing ever 💖",
    sender: "me",
    timestamp: Date.now() - 3300000,
    reactions: ["❤️"],
  },
  {
    id: "5",
    text: "lol stop being cute 😂",
    sender: "partner",
    timestamp: Date.now() - 3200000,
    reactions: [],
  },
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [memories, setMemories] = useState<Memory[]>([
    { id: "1", caption: "Our first date!", emoji: "🌹", date: "2024-02-14" },
    { id: "2", caption: "Beach day together", emoji: "🏖️", date: "2024-06-20" },
    { id: "3", caption: "Movie night 🎬", emoji: "🍿", date: "2024-09-10" },
    { id: "4", caption: "Coffee morning ☕", emoji: "☕", date: "2024-11-01" },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("otta-jutty-profile");
    if (stored) setProfile(JSON.parse(stored));

    const storedMsgs = localStorage.getItem("otta-jutty-messages");
    if (storedMsgs) setMessages(JSON.parse(storedMsgs));

    const storedMemories = localStorage.getItem("otta-jutty-memories");
    if (storedMemories) setMemories(JSON.parse(storedMemories));
  }, []);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem("otta-jutty-profile", JSON.stringify(p));
  };

  const saveMessages = (msgs: Message[]) => {
    setMessages(msgs);
    localStorage.setItem("otta-jutty-messages", JSON.stringify(msgs));
  };

  const saveMemories = (mems: Memory[]) => {
    setMemories(mems);
    localStorage.setItem("otta-jutty-memories", JSON.stringify(mems));
  };

  const theme = profile?.theme ?? "pink";

  if (!profile) {
    return (
      <div className={`theme-${theme}`}>
        <div className="app-container">
          <OnboardingScreen onComplete={saveProfile} />
        </div>
        <Toaster />
      </div>
    );
  }

  const tabs = [
    { id: "chat" as TabType, label: "Chat", icon: MessageCircle },
    { id: "couple" as TabType, label: "Us", icon: Heart },
    { id: "games" as TabType, label: "Games", icon: Gamepad2 },
    { id: "profile" as TabType, label: "Profile", icon: User },
  ];

  return (
    <div className={`theme-${theme}`}>
      <div className="app-container">
        <div className="pb-24">
          {activeTab === "chat" && (
            <div className="fade-slide-in">
              <ChatTab
                profile={profile}
                messages={messages}
                onMessagesChange={saveMessages}
              />
            </div>
          )}
          {activeTab === "couple" && (
            <div className="fade-slide-in">
              <CoupleSpaceTab
                profile={profile}
                onProfileChange={saveProfile}
                memories={memories}
                onMemoriesChange={saveMemories}
              />
            </div>
          )}
          {activeTab === "games" && (
            <div className="fade-slide-in">
              <GamesTab />
            </div>
          )}
          {activeTab === "profile" && (
            <div className="fade-slide-in">
              <ProfileTab profile={profile} onProfileChange={saveProfile} />
            </div>
          )}
        </div>
        <BottomNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <Toaster />
    </div>
  );
}
