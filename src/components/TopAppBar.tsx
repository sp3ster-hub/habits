import { Coins, Sparkles, Zap, Flame, ShieldAlert } from "lucide-react";
import { UserStats } from "../types";

interface TopAppBarProps {
  stats: UserStats;
  doubleXp: boolean;
  protectedStreak: boolean;
}

export default function TopAppBar({ stats, doubleXp, protectedStreak }: TopAppBarProps) {
  const xpPercent = Math.min(100, Math.max(0, (stats.xp / stats.xpNeeded) * 100));

  return (
    <header className="w-full top-0 sticky z-50 bg-[#fff8f0] border-b-2 border-[#201b0c] px-4 py-3 flex flex-col gap-2">
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg border-[1.5px] border-[#201b0c] overflow-hidden bg-[#7e5714] flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 100 100" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 93,30 93,80 50,95 7,80 7,30" stroke="currentColor" strokeWidth="10" />
              <polygon points="50,20 78,38 78,72 50,82 22,72 22,38" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="5" />
            </svg>
          </div>
          <span className="font-serif text-lg md:text-xl font-black text-[#201b0c] tracking-wider uppercase select-none">
            ASCENDANT
          </span>
        </div>

        {/* Currency Display & Boosters */}
        <div className="flex items-center gap-1.5">
          {/* Active Bonuses Indicators */}
          <div className="flex gap-1 mr-1">
            {doubleXp && (
              <div className="flex items-center justify-center w-6.5 h-6.5 rounded-full bg-amber-500 border border-[#201b0c] text-white" title="Double XP active!">
                <Flame className="w-3.5 h-3.5 fill-white" />
              </div>
            )}
            {protectedStreak && (
              <div className="flex items-center justify-center w-6.5 h-6.5 rounded-full bg-blue-500 border border-[#201b0c] text-white animate-pulse" title="Streak Shield active!">
                <Zap className="w-3.5 h-3.5 fill-white" />
              </div>
            )}
          </div>

          {/* Coin Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] border-[#201b0c] bg-amber-50 text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c]">
            <Coins className="w-3.5 h-3.5 text-[#7e5714] fill-amber-300" />
            <span className="font-mono text-xs font-black">
              {stats.coins}<span className="text-[10px] text-amber-800 ml-0.5">GOLD</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border-[1.5px] border-[#201b0c] bg-white text-[10px] text-[#201b0c] font-bold uppercase tracking-wider">
            Streak: <span className="text-orange-600 font-extrabold">🔥 {stats.streak}d</span>
          </div>
        </div>
      </div>

      {/* Global XP Progress Overlay & HP Stamina Row */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-1.5 mt-1 animate-fade-in font-sans">
        
        {/* Row 1: XP Progress Bar */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center px-1 text-[10px]">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7e5714]" />
              <span className="font-serif uppercase tracking-wider text-[#201b0c] font-black">
                Level {stats.level} • {stats.title}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#201b0c] font-black">
              {stats.xp} / {stats.xpNeeded} XP ({Math.round(xpPercent)}%)
            </span>
          </div>
          <div className="p-[1px] w-full h-2.5 bg-[#f9edd3] rounded-md border-[1.5px] border-[#201b0c]">
            <div 
              className={`h-full rounded-sm transition-all duration-1000 ease-out bg-[#7e5714]`}
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Row 2: Colored HP/Stamina Wills Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center px-1 text-[10px]">
            <span className="font-serif uppercase tracking-wider font-extrabold text-[#ba1a1a] flex items-center gap-1">
              ❤️ Sovereign Willpower (HP/Stamina)
            </span>
            <span className="font-mono text-[#ba1a1a] font-extrabold">
              {stats.stamina} / 100 HP
            </span>
          </div>
          <div className="p-[1px] w-full h-2.5 bg-[#f9edd3] rounded-md border-[1.5px] border-[#201b0c]">
            <div 
              className="h-full rounded-sm transition-all duration-1000 ease-out bg-[#ba1a1a]"
              style={{ width: `${stats.stamina}%` }}
            />
          </div>
        </div>

      </div>
    </header>
  );
}
