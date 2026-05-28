import React, { useState } from "react";
import { Skull, Eye, HeartHandshake, ShieldAlert, Sparkles, BookOpen, AlertCircle, HelpCircle } from "lucide-react";
import { UserStats, Phantom } from "../types";

interface BestiaryViewProps {
  stats: UserStats;
  phantoms: Phantom[];
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setPhantoms: React.Dispatch<React.SetStateAction<Phantom[]>>;
  addLogMessage: (text: string) => void;
}

export default function BestiaryView({ stats, phantoms, setStats, setPhantoms, addLogMessage }: BestiaryViewProps) {
  const [activeTrial, setActiveTrial] = useState<{ phantomId: string; question: string; answer: string; options: string[] } | null>(null);
  const [trialInput, setTrialInput] = useState<string>("");
  const [trialStatus, setTrialStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");
  const [searchNotice, setSearchNotice] = useState<string | null>(null);

  // Prompts representing wisdom trials to clear character distortions (the phantoms)
  const trialsMap: { [key: string]: { question: string; options: string[]; answer: string } } = {
    phantom_1: {
      question: "Which virtue is the ultimate antidote to the passive decay of the Dustwraith?",
      options: ["Prompt Procrastination", "Consistent Daily Action", "Awaiting Ideal Moments", "Loud Self-Praise"],
      answer: "Consistent Daily Action"
    },
    phantom_2: {
      question: "How does one secure lessons from the Memory Thief?",
      options: ["Taking detailed reflections", "Reading quickly without writing", "Ignoring mistakes", "Hoping for good luck"],
      answer: "Taking detailed reflections"
    },
    phantom_3: {
      question: "The Corrupted Scholar burns burning manuscripts. What snuffs out this deep intellectual doubt?",
      options: ["Blind arrogance", "Fear of failing", "Humble discipline and practice", "Spiteful competition"],
      answer: "Humble discipline and practice"
    }
  };

  const startTrial = (id: string) => {
    const trialData = trialsMap[id];
    if (trialData) {
      setActiveTrial({
        phantomId: id,
        ...trialData
      });
      setTrialInput("");
      setTrialStatus("IDLE");
    }
  };

  const handleAnswerSubmit = (optionSelected: string) => {
    if (!activeTrial) return;

    if (optionSelected === activeTrial.answer) {
      setTrialStatus("SUCCESS");
      
      // Update resolve efficiency
      setPhantoms(prev => prev.map(p => {
        if (p.id === activeTrial.phantomId) {
          const nextEff = Math.min(100, p.resolveEfficiency + 15);
          const solved = nextEff >= 100;
          return {
            ...p,
            resolveEfficiency: nextEff,
            resolved: solved
          };
        }
        return p;
      }));

      // Reward User representation
      setStats(prev => ({
        ...prev,
        xp: Math.min(prev.xpNeeded, prev.xp + 80),
        coins: prev.coins + 30
      }));

      addLogMessage(`Successfully solved the discipline trial of ${activeTrial.phantomId === 'phantom_1' ? 'Dustwraith' : activeTrial.phantomId === 'phantom_2' ? 'Memory Thief' : 'Corrupted Scholar'}! Resolve efficiency ascended.`);
    } else {
      setTrialStatus("FAILED");
      setStats(prev => ({
        ...prev,
        stamina: Math.max(10, prev.stamina - 15) // losing focus energy on incorrect answers
      }));
      addLogMessage(`The distortion deflected your response. Gained -15 Stamina and focus strain.`);
    }
  };

  const triggerExpandSearch = () => {
    addLogMessage("Searching the outer margins... High tier quests required to unveil rare level 4 & 5 phantoms!");
    setSearchNotice("You search the scroll borders, but the shadows here are quiet. Complete level 15 evolution daily quests to unlock the epic Dread Lord of Indecision!");
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in px-4">
      
      {/* Scroll Header Titles */}
      <section className="mb-10 text-left border-l-4 border-[#7e5714] pl-4">
        <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#7e5714]">
          BESTIARY OF PHANTOMS
        </h1>
        <p className="font-sans text-xs md:text-sm italic text-[#4f4538] font-bold mt-1.5 leading-normal">
          The ledger of those who thrive on the periphery of your progress. To master oneself, one must first recognize the phantoms of your own failure.
        </p>
      </section>

      {/* Trial Challenge Overlay Card */}
      {activeTrial && (
        <div className="mb-8 p-5 bg-[#fff3d9] border-[#201b0c] border-[1.5px] rounded-xl hard-offset font-sans">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-serif text-md font-bold text-[#7e5714] flex items-center gap-1.5 uppercase">
              <HelpCircle className="w-4.5 h-4.5" /> Core Cognitive Trial
            </h3>
            <button 
              onClick={() => setActiveTrial(null)} 
              className="text-gray-500 hover:text-black font-extrabold text-[#7e5714] pr-2 text-sm"
            >
              [Dismiss]
            </button>
          </div>
          
          <p className="text-xs md:text-sm text-[#201b0c] font-semibold mb-4 leading-relaxed">
            {activeTrial.question}
          </p>

          {trialStatus === "IDLE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTrial.options.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswerSubmit(option)}
                  className="w-full text-left p-3 text-xs bg-white hover:bg-[#ffddb1] border border-[#817567]/50 rounded font-medium transition-colors cursor-pointer"
                >
                  <span className="font-serif font-bold text-[#7e5714] mr-1">{i + 1}.</span> {option}
                </button>
              ))}
            </div>
          )}

          {trialStatus === "SUCCESS" && (
            <div className="bg-green-100 border border-green-500 text-green-800 p-4 rounded text-xs">
              <p className="font-bold">✓ DISCIPLINE CONFIRMED!</p>
              <p className="mt-1">The distortion recedes. You gained <span className="font-bold">+80 XP</span> and <span className="font-bold">+30 Coins</span> as your focus strengthens.</p>
              <button 
                type="button"
                onClick={() => setActiveTrial(null)}
                className="mt-3 px-3 py-1 bg-green-700 text-white font-bold uppercase tracking-wider rounded"
              >
                Onwards
              </button>
            </div>
          )}

          {trialStatus === "FAILED" && (
            <div className="bg-red-100 border border-red-500 text-red-800 p-4 rounded text-xs">
              <p className="font-bold">✗ DEFUSED REFLECTION</p>
              <p className="mt-1">Wrong option. Your stamina and mental determination are strained. Try writing reflections to clarify your core ledger.</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setTrialStatus("IDLE")}
                  className="mt-3 px-3 py-1 bg-red-700 text-white font-bold uppercase tracking-wider rounded text-[10px]"
                >
                  Re-attempt Trial
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTrial(null)}
                  className="mt-3 px-3 py-1 bg-gray-200 text-gray-700 font-bold uppercase tracking-wider rounded text-[10px]"
                >
                  Withdraw For Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bestiary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phantoms.map((phantom) => (
          <div 
            key={phantom.id}
            className="flex flex-col bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 relative overflow-hidden shadow-[3px_3px_0px_0px_#201b0c] group hover:scale-[1.005] transition-transform duration-100"
          >
            {/* Top ghost icon indicator */}
            <div className="absolute top-2 right-2 opacity-15">
              <Skull className="w-10 h-10 text-[#7e5714]" />
            </div>

            {/* Header: Level & Title */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-mono text-[10px] font-black text-[#805533] uppercase tracking-widest leading-none">
                  PHANTOM LEVEL {phantom.level}
                </span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-[#201b0c] mt-0.5">
                  {phantom.name}
                </h3>
              </div>

              {/* Action Button styled as circular Wax Seal */}
              <button
                onClick={() => startTrial(phantom.id)}
                className="w-10 h-10 bg-[#7e5714] text-white flex items-center justify-center rounded-full border-2 border-[#201b0c] hover:bg-[#805533] active:translate-y-[1px] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#201b0c]"
                title="Banish phantom with focus test"
              >
                {phantom.id === 'phantom_1' ? (
                  <Skull className="w-4 h-4 fill-white flex-shrink-0" />
                ) : phantom.id === 'phantom_2' ? (
                  <Eye className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            </div>

            {/* Cinematic Portrait Card Container */}
            <div className="w-full aspect-video rounded-xl border-2 border-[#201b0c] overflow-hidden bg-gray-50 relative mb-4">
              <img 
                src={phantom.image} 
                className="w-full h-full object-cover object-top opacity-90 transition-all duration-300 group-hover:scale-105" 
                alt={phantom.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 smoke-overlay" />
            </div>

            {/* Attack Penalties */}
            <div className="mb-5 font-sans">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  ATTACK PENALTY
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {phantom.penalties.map((penalty, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-red-100/75 border border-[#201b0c] text-red-800 text-[10px] font-bold rounded"
                  >
                    {penalty}
                  </span>
                ))}
              </div>
            </div>

            {/* Resolve Efficiency Bar */}
            <div className="mt-auto font-sans">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f4538]">Resolve Mastery</span>
                <span className="text-[10px] font-bold text-[#7e5714]">{phantom.resolveEfficiency}%</span>
              </div>
              <div className="w-full h-3 bg-[#f9edd3] border-2 border-[#201b0c] rounded-md overflow-hidden">
                <div 
                  className="h-full bg-[#7e5714] transition-all duration-1000"
                  style={{ width: `${phantom.resolveEfficiency}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* expand section Call-to-action */}
      <section className="mt-8 p-6 border-2 border-dashed border-[#201b0c] bg-[#fffdf9] rounded-2xl flex flex-col items-center text-center shadow-[3px_3px_0px_0px_#201b0c]">
        <Sparkles className="w-6 h-6 text-[#7e5714] mb-3" />
        <h4 className="font-serif text-lg font-bold text-[#201b0c] uppercase">Seeking More Denizens?</h4>
        <p className="font-sans text-xs text-[#4f4538] font-bold max-w-sm mt-1 mb-4 leading-normal">
          Complete high-tier tasks and conquer the Sloth Behemoth to uncover rare phantoms hidden within the outer margins of your ledger.
        </p>
        <button
          onClick={triggerExpandSearch}
          className="px-6 py-2 border-2 border-[#201b0c] bg-[#7e5714] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-[2px_2px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none hover:bg-[#805533] cursor-pointer"
        >
          EXPAND SEARCH
        </button>
      </section>

      {/* Search Notice Modal */}
      {searchNotice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_#201b0c] relative">
            <h4 className="font-serif text-sm font-extrabold uppercase text-[#7e5714] mb-3 flex items-center gap-1.5 leading-none">
              <Sparkles className="w-4 h-4" /> Scroll Margins Notice
            </h4>
            <p className="text-xs text-[#201b0c] font-black leading-relaxed mb-5">
              {searchNotice}
            </p>
            <button
              onClick={() => setSearchNotice(null)}
              className="w-full py-2 bg-[#7e5714] border-2 border-[#201b0c] text-white font-sans text-xs font-black uppercase tracking-wider rounded-lg shadow-[2.5px_2.5px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Close Ledger Search
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
