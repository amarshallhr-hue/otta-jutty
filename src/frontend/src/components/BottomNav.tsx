import type { LucideIcon } from "lucide-react";
import type { TabType } from "../App";

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface Props {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ tabs, activeTab, onTabChange }: Props) {
  return (
    <nav className="bottom-nav" data-ocid="nav.panel">
      <div className="flex items-center justify-around bg-white rounded-full shadow-nav px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              type="button"
              key={tab.id}
              data-ocid={`nav.${tab.id}.tab`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "animated-gradient text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
