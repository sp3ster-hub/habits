import React, { useState } from "react";
import { User, Shield, PenTool, Calendar, Award, Sparkles, BookOpen, Clock, Heart, Sliders, ChevronDown } from "lucide-react";
import { UserStats, JournalEntry } from "../types";
import AvatarCharacter from "./AvatarCharacter";

interface ProfileViewProps {
  stats: UserStats;
  journal: JournalEntry[];
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setJournal: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  addLogMessage: (text: string) => void;
  bazaarItems: any[];
}

export default function ProfileView({
  stats,
  journal,
  setStats,
  setJournal,
  addLogMessage,
  bazaarItems
}: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(stats.name);
  const [isSelectingTitle, setIsSelectingTitle] = useState(false);

  // Journal writing states
  const [journalText, setJournalText] = useState("");
  const [journalMood, setJournalMood] = useState("Reflective");

  const availableTitles = [
    "Vigilant Wanderer",
    "Ascended Scholar",
    "Discipline Vanguard",
    "Scribe of Focus",
    "Behemoth Conqueror",
    "Chronicler of Fire",
    "Eternal Knight"
  ];

  // Handle edit name
  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;
    setStats(prev => ({
      ...prev,
      name: editedName
    }));
    setIsEditingName(false);
    addLogMessage(`Renamed traveler to '${editedName}'`);
  };

  // Change title
  const selectTitle = (title: string) => {
    setStats(prev => ({
      ...prev,
      title: title
    }));
    setIsSelectingTitle(false);
    addLogMessage(`Selected Title: '${title}'`);
  };

  // Submit journal reflection
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const newEntry: JournalEntry = {
      id: "j_" + Date.now(),
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      text: journalText,
      mood: journalMood
    };

    setJournal([newEntry, ...journal]);
    addLogMessage(`Inscribed daily focus journal entry: '${journalMood}'`);
    setJournalText("");
  };

  // Check achievements indicators
  const hasCape = stats.avatarClass === "special-cape";
  const numQuestsCompleted = stats.level > 12 ? 10 : 4;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in px-4">
      
      {/* Page Header */}
      <section className="mb-8 text-left border-l-4 border-[#7e5714] pl-4">
        <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#7e5714]">
          Traveler Profile
        </h1>
        <p className="font-sans text-xs md:text-sm font-bold text-[#4f4538] mt-1 italic">
          Review your legendary discipline records, select honors, and scribe your chronicler journal entries.
        </p>
      </section>

      {/* Main Grid: Info card left, journal list right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Profile card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#fffdf9] border-[1.5px] border-[#817567]/40 rounded-2xl p-6 hard-offset relative overflow-hidden shadow-sm">
            
            {/* Ambient gold aura glow on Cape purchased */}
            {hasCape && (
              <div className="absolute inset-0 bg-radial-gradient from-yellow-100/30 to-transparent pointer-events-none animate-pulse" />
            )}

            {/* Profile Avatar Frame with dynamic progress apparel/gear */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-full max-w-[180px] mb-2 animate-fade-in">
                <AvatarCharacter level={stats.level} hasCape={hasCape} />
              </div>

              {/* Name Editor Layout */}
              <div className="mt-4 text-center w-full">
                {isEditingName ? (
                  <form onSubmit={saveName} className="flex gap-2 justify-center max-w-xs mx-auto">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-2 py-1 border border-[#817567] rounded text-sm bg-white font-serif font-bold text-center w-full focus:outline-none"
                      maxLength={18}
                      autoFocus
                    />
                    <button type="submit" className="px-3 bg-[#7e5714] text-white rounded text-xs font-bold font-sans">
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 leading-tight">
                      {stats.name}
                    </h3>
                    <button 
                      onClick={() => {
                        setEditedName(stats.name);
                        setIsEditingName(true);
                      }}
                      className="text-xs text-[#805533] hover:underline font-bold font-sans cursor-pointer"
                    >
                      [rename]
                    </button>
                  </div>
                )}

                {/* Subtitle list manager selector dropdown */}
                <div className="relative mt-1">
                  <button
                    onClick={() => setIsSelectingTitle(!isSelectingTitle)}
                    className="px-3 py-1 bg-[#f9edd3]/50 rounded-full border border-[#817567]/20 text-xs font-bold text-[#805533] inline-flex items-center gap-1 hover:bg-[#ffe8bc] transition-all cursor-pointer shadow-sm"
                  >
                    🎗 {stats.title} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {isSelectingTitle && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-48 bg-[#fff] border border-[#817567] rounded-lg shadow-lg z-20 font-sans text-xs max-h-48 overflow-y-auto">
                      {availableTitles.map((titleOption) => (
                        <button
                          key={titleOption}
                          onClick={() => selectTitle(titleOption)}
                          className={`w-full text-left px-3 py-2 transition-colors ${
                            titleOption === stats.title 
                              ? "bg-[#7e5714] text-white font-bold" 
                              : "hover:bg-[#fff3d9]"
                          }`}
                        >
                          {titleOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Statistics List */}
            <div className="border-t-2 border-[#201b0c]/10 pt-4 space-y-3 font-mono text-[11px] font-bold">
              <div className="flex justify-between text-[#201b0c]">
                <span className="text-gray-500 font-medium font-sans">Evolution Status:</span>
                <span className="text-[#7e5714]">STAGE 2 (AWAKENED)</span>
              </div>
              <div className="flex justify-between text-[#201b0c]">
                <span className="text-gray-500 font-medium font-sans">Daily Streak:</span>
                <span className="text-orange-600 font-bold">🔥 {stats.streak} DAYS RUNNING</span>
              </div>
              <div className="flex justify-between text-[#201b0c]">
                <span className="text-gray-500 font-medium font-sans">Total Wealth Gained:</span>
                <span className="text-amber-800">💰 {stats.coins + 500} GOLD</span>
              </div>
              <div className="flex justify-between text-[#201b0c]">
                <span className="text-gray-500 font-medium font-sans">Active Outfit:</span>
                <span>{hasCape ? "✨ ASCENDANT CAPE" : "🛡 NORMAL TABARD"}</span>
              </div>
            </div>
          </div>

          {/* Locked Achievements scroll list */}
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] p-5 rounded-2xl shadow-[4px_4px_0px_0px_#201b0c] font-sans">
            <h4 className="font-serif text-sm font-extrabold text-[#201b0c] mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Award className="w-4 h-4 text-[#7e5714]" /> Chronology Achievements
            </h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-xl">💧</span>
                <div>
                  <p className="font-bold text-gray-900 leading-none">Vessel of Hydration (Conquered)</p>
                  <p className="text-gray-500 mt-1">Conquered 'Drink Fresh Water' from the daily quest boards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className={hasCape ? "text-xl filter-none" : "text-xl grayscale opacity-40"}>👘</span>
                <div>
                  <p className={`font-bold leading-none ${hasCape ? "text-gray-900" : "text-gray-400"}`}>
                    Cape of the Sovereign {hasCape ? "(Unlocked)" : "(Locked)"}
                  </p>
                  <p className="text-gray-500 mt-1">Acquire the high-tier Ancient Cape outfit in the Gilded Bazaar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className={stats.level >= 13 ? "text-xl" : "text-xl grayscale opacity-40"}>📜</span>
                <div>
                  <p className={`font-bold leading-none ${stats.level >= 13 ? "text-gray-900" : "text-gray-400"}`}>
                    Cradle of the Scholars
                  </p>
                  <p className="text-gray-500 mt-1">Ascend into stage 13 or write at least 5 journal logs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Chronicler Journal section */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Scribe Journal reflection writer form container */}
          <div className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#201b0c]">
            <h3 className="font-serif text-md md:text-lg font-extrabold text-[#201b0c] flex items-center gap-2 mb-4 uppercase tracking-wide">
              <PenTool className="text-[#7e5714] w-4.5 h-4.5" /> Inscribe Focused Reflection
            </h3>

            <form onSubmit={handleAddJournal} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[#201b0c] font-black mb-1 uppercase text-[10px] tracking-wider">
                  How does the fire of your discipline burn today?
                </label>
                <textarea
                  placeholder="Record your progress, struggles, or lessons learned during your focus hours..."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="w-full h-24 p-3 bg-white border-2 border-[#201b0c] rounded-lg text-xs md:text-sm text-[#201b0c] placeholder-[#4f4538]/50 focus:outline-[#7e5714] leading-relaxed resize-none font-sans"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto font-bold text-xs">
                  <span className="text-gray-500 font-sans">Reflection Mood:</span>
                  <select
                    value={journalMood}
                    onChange={(e) => setJournalMood(e.target.value)}
                    className="bg-white border-2 border-[#201b0c] rounded px-2.5 py-1 text-xs text-[#7e5714] font-bold"
                  >
                    <option value="Reflective">Reflective</option>
                    <option value="Determined">Determined</option>
                    <option value="Motivated">Motivated</option>
                    <option value="Fatigued">Fatigued</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#7e5714] border-2 border-[#201b0c] text-white font-sans text-xs font-black uppercase tracking-wider rounded-lg shadow-[2.5px_2.5px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Scribe into Scroll
                </button>
              </div>
            </form>
          </div>

          {/* Past reflections list block */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-extrabold text-[#201b0c] flex items-center gap-2 border-b-2 border-[#201b0c]/10 pb-1.5 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-[#7e5714]" /> INSCRIBED SCROLL LOGS
            </h4>

            {journal.length === 0 ? (
              <p className="text-center py-6 italic text-gray-500 font-sans text-xs">No inscribed log fragments in this chronicle.</p>
            ) : (
              journal.map((entry) => (
                <div 
                  key={entry.id}
                  className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-4 relative overflow-hidden transition-all shadow-[2px_2px_0px_0px_#201b0c] font-sans"
                >
                  <div className="flex justify-between items-center mb-2.5 text-xs text-gray-500 border-b border-[#201b0c]/10 pb-2">
                    <span className="font-mono font-bold tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7e5714]" /> {entry.timestamp}
                    </span>
                    <span className="px-2.5 py-0.5 bg-orange-100 border border-[#201b0c] text-orange-950 font-bold rounded text-[9px] uppercase tracking-wide">
                      {entry.mood}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed italic pr-2 font-medium">
                    &quot;{entry.text}&quot;
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
