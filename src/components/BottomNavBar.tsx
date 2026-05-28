import { Swords, PawPrint, TrendingUp, BarChart3, Store, User } from "lucide-react";

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { id: "arena", label: "Arena", icon: Swords },
    { id: "bestiary", label: "Bestiary", icon: PawPrint },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "evolution", label: "Evolution", icon: TrendingUp },
    { id: "bazaar", label: "Bazaar", icon: Store },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 w-full z-50 flex justify-around items-end px-3 pb-6 pt-2.5 bg-[#fff8f0] border-t-[1.5px] border-[#201b0c] shadow-[0_-4px_16px_rgba(32,27,12,0.08)]">
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (isActive) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center bg-[#7e5714] text-white border-[1.5px] border-[#201b0c] rounded-xl px-4 py-1.5 shadow-[2px_2px_0px_0px_#201b0c] active:translate-y-[1px] transition-all duration-100"
                id={`nav-${tab.id}`}
              >
                <Icon className="w-5 h-5 text-white stroke-[2.5px]" />
                <span className="font-sans text-[11px] font-bold mt-0.5 tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          } else {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center text-[#4f4538] p-2 hover:bg-[#7e5714]/10 rounded-xl transition-all duration-100 transform active:scale-95"
                id={`nav-${tab.id}`}
              >
                <Icon className="w-5 h-5 opacity-80 stroke-[2px]" />
                <span className="font-sans text-[10px] font-medium mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }
        })}
      </div>
    </nav>
  );
}
