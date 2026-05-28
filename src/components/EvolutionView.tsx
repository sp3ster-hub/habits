import React, { useState } from "react";
import { Zap, Shield, Sparkles, BookOpen, Lock, CheckCircle2, History, Award } from "lucide-react";
import { UserStats, EvolutionStage } from "../types";

interface EvolutionViewProps {
  stats: UserStats;
  stages: EvolutionStage[];
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setStages: React.Dispatch<React.SetStateAction<EvolutionStage[]>>;
  addLogMessage: (text: string) => void;
}

export default function EvolutionView({ stats, stages, setStats, setStages, addLogMessage }: EvolutionViewProps) {
  const [boostAnimating, setBoostAnimating] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Calculate current evolution path percentage
  const currentPathPercent = Math.round((stats.xp / stats.xpNeeded) * 100);

  // Functional Boost Progress (using Coins to gain XP)
  const handleBoost = () => {
    if (stats.coins < 50) {
      setErrorNotice("You need at least 50 Coins to buy a Concentrated Discipline Elixir!");
      addLogMessage("Insufficient coins to purchase evolution elixir.");
      return;
    }

    setBoostAnimating(true);
    addLogMessage("Consumed Concentrated Discipline Elixir! Injected +100 XP.");

    setTimeout(() => {
      let nextXp = stats.xp + 100;
      let nextCoins = stats.coins - 50;
      let nextLevel = stats.level;
      let title = stats.title;

      if (nextXp >= stats.xpNeeded) {
        nextXp -= stats.xpNeeded;
        nextLevel += 1;
        title = "Ascended Scholar";
        addLogMessage("✨ STAGE ASCENSION! You have transcended the Path of the Awakened and unlocked Stage 3: The Scholar!");
        
        // Update stages states
        setStages(prev => prev.map(s => {
          if (s.id === 1 || s.id === 2) {
            return { ...s, status: "COMPLETED" };
          }
          if (s.id === 3) {
            return { ...s, status: "ACTIVE" };
          }
          return s;
        }));
      }

      setStats(prev => ({
        ...prev,
        xp: nextXp,
        coins: nextCoins,
        level: nextLevel,
        title: nextLevel >= 13 ? "Master Scholar" : prev.title
      }));
      setBoostAnimating(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in px-4">
      
      {/* Scroll Title Section */}
      <section className="mb-6 text-left border-l-4 border-[#7e5714] pl-4">
        <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#201b0c]">
          Journal of Evolution
        </h1>
        <p className="font-sans text-xs md:text-sm italic text-[#4f4538] font-bold mt-1.5 leading-normal">
          Analytical chronicle of your developmental path, mental upgrades, and permanent trait modifiers.
        </p>
      </section>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 gap-6 items-start">
        
        {/* Left column: Stages List & Progression Boost */}
        <div className="flex flex-col gap-4">
          {stages.map((stage) => {
            const isCompleted = stage.status === "COMPLETED";
            const isActive = stage.status === "ACTIVE";
            const isLocked = stage.status === "LOCKED";

            return (
              <div 
                key={stage.id}
                className={`transition-all duration-150 relative rounded-2xl p-4 flex items-center gap-4 overflow-hidden border-2 border-[#201b0c] ${
                  isActive 
                    ? "bg-amber-50/40 shadow-[4px_4px_0px_0px_#201b0c]" 
                    : isCompleted 
                    ? "bg-[#f9edd3]/25 opacity-70 shadow-none" 
                    : "bg-gray-50/10 border-dashed border-gray-400 opacity-60 shadow-none"
                }`}
              >
                {/* Active badge label */}
                {isActive && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#7e5714] border-b-[1.5px] border-l-[1.5px] border-[#201b0c] text-white font-mono text-[9px] font-black tracking-widest rounded-bl-lg">
                    ACTIVE
                  </div>
                )}

                {/* Portrait card thumbnail */}
                <div className={`w-16 h-16 rounded-xl border-2 border-[#201b0c] flex-shrink-0 flex items-center justify-center overflow-hidden bg-white ${
                  isActive ? "bg-[#f9edd3]" : ""
                }`}>
                  <img 
                    src={stage.image} 
                    alt={stage.name} 
                    className={`w-full h-full object-contain p-1.5 ${isLocked || isCompleted ? "grayscale opacity-80" : ""}`}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="font-serif text-base font-extrabold text-[#201b0c] leading-none">
                    {stage.name}
                  </h3>
                  <p className="font-sans text-xs text-[#4f4538] mt-1 italic font-medium max-w-md">
                    {stage.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5 font-sans">
                    {isCompleted && (
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Completed Stage
                      </span>
                    )}

                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-[#7e5714] tracking-widest flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" /> Current Evolution Stage
                      </span>
                    )}

                    {isLocked && (
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-gray-400" /> Locked Path
                      </span>
                    )}
                  </div>
                </div>

                {isLocked && stage.id === 3 && (
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-[10px] font-bold text-orange-950 uppercase bg-orange-100 border border-[#201b0c] px-2.5 py-1 rounded">
                      {stage.xpToUnlock} XP Required
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Evolution Progression Bar */}
          <div className="mt-2 text-sans">
            <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#201b0c]">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-[#4f4538] leading-none">
                    Evolutionary Mastery Quotient
                  </h4>
                  <p className="font-serif text-lg font-extrabold text-[#201b0c] mt-0.5">
                    Path to Ascended Scholar (Lvl 13+)
                  </p>
                </div>
                <span className="font-serif text-md font-black text-[#7e5714]">{currentPathPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-6 w-full bg-[#f9edd3] rounded-md p-[2px] relative overflow-hidden border-2 border-[#201b0c]">
                <div 
                  className="h-full bg-[#7e5714] transition-all duration-1000 ease-out flex items-center justify-end pr-2" 
                  style={{ width: `${currentPathPercent}%` }}
                >
                  <div className="w-full h-full bg-white/5 absolute inset-0 animate-pulse" />
                </div>
              </div>

              <div className="mt-2.5 flex justify-between font-mono text-[10px] font-bold text-gray-500">
                <span>{stats.xp} / {stats.xpNeeded} XP</span>
                <span>{stats.xpNeeded - stats.xp} XP needed to transcend</span>
              </div>

              {/* Boost Button with action cost */}
              <button
                onClick={handleBoost}
                disabled={boostAnimating}
                className={`w-full mt-5 py-2.5 bg-[#7e5714] text-white border-2 border-[#201b0c] font-sans text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  boostAnimating ? "opacity-75 animate-pulse" : ""
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                {boostAnimating ? "IMPROVING DISCIPLINE..." : "CONSUME INTELLECT ELIXIR (-50 Coins for +100 XP)"}
              </button>
            </div>
          </div>
        </div>

        {/* Action modifiers sidebar */}
        <div className="flex flex-col gap-4">
          
          {/* Active Rank Bonus details wrapper */}
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 relative overflow-hidden shadow-[4px_4px_0px_0px_#201b0c]">
            
            {/* Spinning wax seal stamp decoration */}
            <div className="absolute top-2 right-2">
              <div className="w-10 h-10 rounded-full bg-[#7e5714] flex items-center justify-center border-2 border-[#201b0c] shadow-sm">
                <Award className="text-white w-5 h-5" />
              </div>
            </div>

            <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-[#7e5714] mb-1">
              Active Evolution bonuses
            </h4>
            <h3 className="font-serif text-lg font-bold text-[#201b0c] mb-4 flex items-center gap-1.5">
              Stage 2: The Awakened
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-amber-50 border border-[#201b0c] text-[#7e5714] mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-none">Defensive Stamina Shield</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">Reduces damage taken from procrastination failures by 15%.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-amber-50 border border-[#201b0c] text-[#7e5714] mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-none">Willpower multipliers</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">+10% Gold boosts on active task streaks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lore Fragment box */}
          <div className="bg-white p-5 border-2 border-dashed border-[#201b0c] rounded-2xl relative">
            <p className="font-serif italic text-xs md:text-sm text-[#4f4538] leading-relaxed">
              &quot;The transition from steel to arcana is not merely a change of gear, but a rewiring of the soul&apos;s ledger. One must forge discipline before they can manifest the mystic fire.&quot;
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#201b0c]/10">
              <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#4f4538] uppercase">
                Fragment #142 - The Scribe
              </span>
              <History className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

        </div>

      </div>

      {/* Insufficient gold dialog */}
      {errorNotice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_#201b0c] relative text-center">
            <h4 className="font-serif text-sm font-extrabold uppercase text-[#ba1a1a] mb-2">Insufficient Gold</h4>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mx-auto mb-3 border border-[#201b0c]/10">
              <Zap className="w-5 h-5 fill-amber-300 text-amber-600 animate-pulse" />
            </div>
            <p className="text-xs text-[#201b0c] font-black leading-relaxed mb-5">
              {errorNotice}
            </p>
            <button
              onClick={() => setErrorNotice(null)}
              className="w-full py-2 bg-[#7e5714] border-2 border-[#201b0c] text-white font-sans text-xs font-black uppercase tracking-wider rounded-lg shadow-[2.5px_2.5px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Continue Quests
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
