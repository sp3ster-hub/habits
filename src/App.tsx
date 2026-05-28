import { useState, useEffect } from "react";
import { Sparkles, MessageSquareCode, Bell, Moon, Play, Info } from "lucide-react";
import { UserStats, Quest, Phantom, EvolutionStage, BazaarItem, JournalEntry } from "./types";
import {
  INITIAL_USER_STATS,
  INITIAL_QUESTS,
  INITIAL_PHANTOMS,
  INITIAL_STAGES,
  INITIAL_BAZAAR_ITEMS,
  INITIAL_JOURNAL_ENTRIES
} from "./initialData";

import TopAppBar from "./components/TopAppBar";
import BottomNavBar from "./components/BottomNavBar";
import SoundtrackPlayer from "./components/SoundtrackPlayer";
import ArenaView from "./components/ArenaView";
import BestiaryView from "./components/BestiaryView";
import EvolutionView from "./components/EvolutionView";
import BazaarView from "./components/BazaarView";
import ProfileView from "./components/ProfileView";
import AnalyticsView from "./components/AnalyticsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("arena");

  // Persistent States
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("ascendant_user_stats");
    return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem("ascendant_quests");
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [phantoms, setPhantoms] = useState<Phantom[]>(() => {
    const saved = localStorage.getItem("ascendant_phantoms");
    return saved ? JSON.parse(saved) : INITIAL_PHANTOMS;
  });

  const [stages, setStages] = useState<EvolutionStage[]>(() => {
    const saved = localStorage.getItem("ascendant_stages");
    return saved ? JSON.parse(saved) : INITIAL_STAGES;
  });

  const [bazaarItems, setBazaarItems] = useState<BazaarItem[]>(() => {
    const saved = localStorage.getItem("ascendant_bazaar_items");
    return saved ? JSON.parse(saved) : INITIAL_BAZAAR_ITEMS;
  });

  const [journal, setJournal] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("ascendant_journal");
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  const [unlockSoundtrack, setUnlockSoundtrack] = useState<boolean>(() => {
    const saved = localStorage.getItem("ascendant_unlock_soundtrack");
    return saved ? JSON.parse(saved) : false;
  });

  // Action log feed notifications
  const [logFeed, setLogFeed] = useState<string[]>([
    "Sovereign ledger synchronized. Welcomed back to Ascendant!",
    "The Sloth Behemoth rests in the Arena... Defend your habits!"
  ]);

  // Meditate Breath modal state
  const [showMeditate, setShowMeditate] = useState(false);
  const [breathState, setBreathState] = useState<"Breathe In" | "Hold" | "Breathe Out" | "Complete">("Breathe In");
  const [breathProgress, setBreathProgress] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("ascendant_user_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("ascendant_quests", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem("ascendant_phantoms", JSON.stringify(phantoms));
  }, [phantoms]);

  useEffect(() => {
    localStorage.setItem("ascendant_stages", JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem("ascendant_bazaar_items", JSON.stringify(bazaarItems));
  }, [bazaarItems]);

  useEffect(() => {
    localStorage.setItem("ascendant_journal", JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem("ascendant_unlock_soundtrack", JSON.stringify(unlockSoundtrack));
  }, [unlockSoundtrack]);

  // Add notification event logs
  const addLogMessage = (text: string) => {
    setLogFeed(prev => [text, ...prev.slice(0, 48)]);
  };

  // Meditate breath flow simulator
  const startMeditationSession = () => {
    setShowMeditate(true);
    setBreathState("Breathe In");
    setBreathProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setBreathProgress(Math.min(100, progress));

      if (progress < 30) {
        setBreathState("Breathe In");
      } else if (progress < 65) {
        setBreathState("Hold");
      } else if (progress < 96) {
        setBreathState("Breathe Out");
      } else {
        setBreathState("Complete");
        clearInterval(interval);
        
        // Reward user
        setStats(prev => ({
          ...prev,
          coins: prev.coins + 15,
          stamina: Math.min(100, prev.stamina + 20)
        }));
        addLogMessage("Finished focused 4-7-8 deep breathing session! Unlocked +20 Stamina and +15 Coins.");
      }
    }, 280);
  };

  // Determine progression tier theme & background gradient matching active tier
  const getProgressTierBg = () => {
    return "bg-[#fff8f0] text-[#201b0c]";
  };

  const dynamicFrameBg = getProgressTierBg();

  return (
    <div className="bg-[#f4ebe1] min-h-screen w-full flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-[#ffddb1] overflow-hidden relative">
      
      {/* Absolute Decorative Cartographer Grid Background for Desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(#817567_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Decorative runic marks in bottom-right/left margins for desktop sizes */}
      <div className="fixed top-24 left-12 opacity-5 pointer-events-none select-none hidden lg:block text-[#7e5714]">
        <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-current fill-none" strokeWidth="2">
          <polygon points="50,15 80,35 80,75 50,95 20,75 20,35" />
          <line x1="50" y1="15" x2="50" y2="95" />
          <line x1="20" y1="35" x2="80" y2="75" />
          <line x1="80" y1="35" x2="20" y2="75" />
        </svg>
      </div>
      <div className="fixed bottom-24 right-12 opacity-5 pointer-events-none select-none hidden lg:block text-[#7e5714]">
        <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-current fill-none" strokeWidth="2">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="28" strokeDasharray="4,4" />
          <polygon points="50,15 65,50 50,85 35,50" />
        </svg>
      </div>

      {/* Centered Phone Container Frame */}
      <div className={`w-full max-w-[480px] h-[100dvh] sm:h-[840px] sm:rounded-3xl flex flex-col relative overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.92)] border-[#7e5714]/30 sm:border-[5px] sm:border-[#2d2417] ${dynamicFrameBg}`}>
        
        {/* Pinned Header Block (TopAppBar HUD & Alerts ticker) */}
        <div className="flex-shrink-0 z-40 bg-[#fff8f0] border-b border-[#817567]/20 shadow-sm relative text-[#201b0c]">
          <TopAppBar 
            stats={stats} 
            doubleXp={bazaarItems.find(i => i.id === "crystal_boost")?.active || false}
            protectedStreak={bazaarItems.find(i => i.id === "streak_shield")?.active || false}
          />

          {/* Floating live feed logs alert strip */}
          <div className="bg-[#ede1c8]/95 text-[#4f4538] text-center py-1.5 px-4 text-[10px] sm:text-[11px] font-bold border-t border-[#817567]/10 tracking-wider font-mono flex items-center justify-center gap-2 w-full">
            <Bell className="w-3.5 h-3.5 animate-bounce text-[#7e5714] flex-shrink-0" />
            <span className="truncate max-w-[340px] block">
              {logFeed[0]}
            </span>
          </div>
        </div>

        {/* Scrolling Viewport Area */}
        <div className="flex-grow overflow-y-auto px-1 pt-4 pb-28 scroll-smooth scrollbar-none relative">
          
          {/* Optional Procedural Soundscape Module */}
          <SoundtrackPlayer isUnlocked={unlockSoundtrack} />

          {/* Main Router Content */}
          <main className="w-full">
            {activeTab === "arena" && (
              <ArenaView
                stats={stats}
                quests={quests}
                setStats={setStats}
                setQuests={setQuests}
                addLogMessage={addLogMessage}
              />
            )}

            {activeTab === "bestiary" && (
              <BestiaryView
                stats={stats}
                phantoms={phantoms}
                setStats={setStats}
                setPhantoms={setPhantoms}
                addLogMessage={addLogMessage}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsView
                stats={stats}
                quests={quests}
                journalCount={journal.length}
              />
            )}

            {activeTab === "evolution" && (
              <EvolutionView
                stats={stats}
                stages={stages}
                setStats={setStats}
                setStages={setStages}
                addLogMessage={addLogMessage}
              />
            )}

            {activeTab === "bazaar" && (
              <BazaarView
                stats={stats}
                bazaarItems={bazaarItems}
                setStats={setStats}
                setBazaarItems={setBazaarItems}
                addLogMessage={addLogMessage}
                setUnlockSoundtrack={setUnlockSoundtrack}
              />
            )}

            {activeTab === "profile" && (
              <ProfileView
                stats={stats}
                journal={journal}
                setStats={setStats}
                setJournal={setJournal}
                addLogMessage={addLogMessage}
                bazaarItems={bazaarItems}
              />
            )}
          </main>
        </div>

        {/* Meditate FAB button inside phone coordinates */}
        <div className="absolute bottom-24 right-5 z-40">
          <button 
            onClick={startMeditationSession}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#7e5714] hover:bg-[#805533] text-white hard-offset flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg border-[1.5px] border-[#201b0c]"
            title="Begin deep focus meditation"
          >
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current">
              <path d="M 50,20 Q 40,40 50,65 Q 60,40 50,20 Z" />
              <path d="M 50,28 Q 30,52 50,75 Q 70,52 50,28 Z" opacity="0.6" />
              <circle cx="50" cy="50" r="4" fill="#ffddb1" />
            </svg>
          </button>
        </div>

        {/* Meditate modal breathing box overlay locked within phone viewport bounds */}
        {showMeditate && (
          <div className="absolute inset-0 bg-[#201b0c]/90 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#fff8f0] border-2 border-[#7e5714] p-6 rounded-2xl w-full max-w-xs text-center hard-offset relative font-sans text-[#201b0c]">
              <h3 className="font-serif text-base font-extrabold text-[#7e5714] mb-1">
                SOVEREIGN BREATH SANCTUARY
              </h3>
              <p className="text-[10px] text-[#4f4538] font-bold mb-5">Recovering focus clarity... Do not exit the sanctuary scroll.</p>
              
              <div className="w-32 h-32 rounded-full border-[1.5px] border-[#d4a35a] bg-[#fdf3da]/50 mx-auto flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner mb-5">
                <div 
                  className="absolute bg-[#e4a54a]/25 rounded-full transition-all duration-300 pointer-events-none" 
                  style={{ 
                    width: `${30 + (breathProgress * 0.7)}%`, 
                    height: `${30 + (breathProgress * 0.7)}%` 
                  }}
                />
                <span className="font-serif text-sm font-extrabold text-[#7e5714] z-10 block animate-pulse">
                  {breathState}
                </span>
                <span className="text-[9px] text-gray-500 font-mono mt-1 z-10">
                  {breathProgress}% Complete
                </span>
              </div>

              <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto mb-5 italic">
                &quot;Follow the sphere expanding cycle. Slowly inhale clean mountain cold air, hold focus, and exhale impurities into the void.&quot;
              </p>

              <div className="flex gap-3">
                {breathState === "Complete" ? (
                  <button
                    type="button"
                    onClick={() => setShowMeditate(false)}
                    className="w-full py-2 bg-[#7e5714] text-white text-xs font-bold uppercase tracking-widest rounded transition-all hard-offset hover:bg-[#805533]"
                  >
                    Conclude Session
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMeditate(false);
                      addLogMessage("Withdrew prematurely from focus breathing session.");
                    }}
                    className="w-full py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest rounded"
                  >
                    Exit Early
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav App Bar Selector Component */}
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>

    </div>
  );
}
