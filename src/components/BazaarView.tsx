import React, { useState } from "react";
import { ShoppingBag, Coins, Sparkles, CheckCircle2, Music, Shield, ShieldCheck, HelpCircle } from "lucide-react";
import { UserStats, BazaarItem } from "../types";

interface BazaarViewProps {
  stats: UserStats;
  bazaarItems: BazaarItem[];
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setBazaarItems: React.Dispatch<React.SetStateAction<BazaarItem[]>>;
  addLogMessage: (text: string) => void;
  setUnlockSoundtrack: (unlocked: boolean) => void;
}

export default function BazaarView({
  stats,
  bazaarItems,
  setStats,
  setBazaarItems,
  addLogMessage,
  setUnlockSoundtrack
}: BazaarViewProps) {
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Purchase item
  const buyItem = (id: string, cost: number) => {
    if (stats.coins < cost) {
      setErrorNotice("Alas! You do not carry enough Coins for this legendary artifact!");
      addLogMessage("Insufficient coin balance for bazaar purchase.");
      return;
    }

    // Deduct coins and mark bought
    setStats(prev => ({
      ...prev,
      coins: prev.coins - cost
    }));

    setBazaarItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          purchased: true,
          active: true
        };
      }
      return item;
    }));

    addLogMessage(`Successfully acquired '${id.replace('_', ' ')}'! Deducted ${cost} Coins.`);

    // Item specific functional triggers
    if (id === "scholar_soundtrack") {
      setUnlockSoundtrack(true);
      addLogMessage("Scholar Soundtrack unlocked! You can now activate procedurally relaxing chimes above.");
    } else if (id === "ancient_cape") {
      setStats(prev => ({
        ...prev,
        avatarClass: "special-cape" // Changes profile avatar!
      }));
      addLogMessage("Ancient Cape equipped! Received +5 Charisma aura (+10% gold/XP bonus from tasks).");
    } else if (id === "crystal_boost") {
      addLogMessage("Double XP active for the next hour!");
    } else if (id === "streak_shield") {
      addLogMessage("Streak Shield armed. Your streak will be preserved if you miss a focus hour.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in px-4">
      
      {/* Scroll Header Titles */}
      <section className="mb-6 text-center md:text-left">
        <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#201b0c] mb-2 flex items-center justify-center md:justify-start gap-2">
          Gilded Bazaar
        </h2>
        <div className="h-[2px] w-24 bg-[#7e5714] mx-auto md:mx-0"></div>
      </section>

      {/* Grid List layout of Artifacts */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {bazaarItems.map((item) => {
          const isBought = item.purchased;

          return (
            <div 
              key={item.id}
              className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col justify-between text-center transition-all duration-150 transform active:scale-[0.98] shadow-[3px_3px_0px_0px_#201b0c]"
            >
              {/* Product Visual Container Frame */}
              <div className="w-full aspect-square mb-3 rounded-xl border-2 border-[#201b0c] overflow-hidden bg-[#f9edd3] relative">
                <img 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-300 hover:scale-105" 
                  src={item.image}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Info Labels */}
              <div>
                <h3 className="font-serif text-sm md:text-md font-extrabold text-[#201b0c] mb-0.5 leading-tight">
                  {item.name}
                </h3>
                <p className="font-sans text-[10px] text-[#4f4538] mb-4 font-bold uppercase tracking-tight">
                  {item.description}
                </p>
              </div>

              {/* Action purchase button with hard offset styling */}
              <button
                onClick={() => buyItem(item.id, item.cost)}
                disabled={isBought}
                className={`w-full py-2 border-[1.5px] border-[#201b0c] rounded-lg font-bold text-xs transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none ${
                  isBought
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-sans shadow-none pointer-events-none"
                    : "bg-[#7e5714] text-white hover:bg-[#805533]"
                }`}
              >
                {isBought ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Purchased
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs font-black">{item.cost} COINS</span>
                    <Coins className="w-3.5 h-3.5 fill-amber-300 text-white" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </section>

      {/* Curator Call-out Box */}
      <section className="max-w-2xl mx-auto">
        <div className="border-2 border-[#201b0c] bg-[#fffcf5] rounded-xl p-5 shadow-[4px_4px_0px_0px_#201b0c]">
          <h4 className="font-serif text-base md:text-lg text-[#201b0c] text-center mb-2.5 font-bold uppercase tracking-wider">
            Message from the Curator
          </h4>
          <p className="font-serif text-xs md:text-sm text-[#4f4538] italic text-center leading-relaxed">
            &quot;Step closer, traveler. The items you find here are not mere trinkets; they are the manifest will of those who refuse to settle for mediocrity. Choose wisely, for gold is plentiful, but time is a fleeting shadow on the sundial of your ambition.&quot;
          </p>
          <div className="mt-3 flex justify-center opacity-70">
            <ShoppingBag className="text-[#7e5714] w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Insufficient gold dialog */}
      {errorNotice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_#201b0c] relative text-center">
            <h4 className="font-serif text-sm font-extrabold uppercase text-[#ba1a1a] mb-2">Bazaar Warning</h4>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 mx-auto mb-3 border border-[#201b0c]/10">
              <Coins className="w-6 h-6 fill-amber-300" />
            </div>
            <p className="text-xs text-[#201b0c] font-black leading-relaxed mb-5">
              {errorNotice}
            </p>
            <button
              onClick={() => setErrorNotice(null)}
              className="w-full py-2 bg-[#7e5714] border-2 border-[#201b0c] text-white font-sans text-xs font-black uppercase tracking-wider rounded-lg shadow-[2.5px_2.5px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Earn More Gold
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
