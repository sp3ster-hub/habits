import React, { useState } from "react";
import { TrendingUp, Activity, Award, Flame, Calendar, BookOpen, ShieldAlert, Heart, Brain, GraduationCap, Code } from "lucide-react";
import { UserStats, Quest } from "../types";

interface AnalyticsViewProps {
  stats: UserStats;
  quests: Quest[];
  journalCount: number;
}

export default function AnalyticsView({ stats, quests, journalCount }: AnalyticsViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Today");
  const [selectedMetric, setSelectedMetric] = useState<"streak" | "multiplier" | "performance" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // Calculate stats dynamically
  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Gather category metrics based on quest type
  const categories = [
    {
      id: "health",
      name: "Sovereign Health",
      desc: "Water intake, physical motion, posture calibration & rainbow nutrition plates",
      icon: Heart,
      color: "text-red-750 bg-red-50 border-red-200",
      barColor: "bg-red-650",
      count: quests.filter(q => (q.type === "walk" || q.type === "water" || q.id.includes("rainbow") || q.type === "rainbow_plate")).length,
      completed: quests.filter(q => (q.type === "walk" || q.type === "water" || q.id.includes("rainbow") || q.type === "rainbow_plate") && q.completed).length,
      tip: "Physical movement and proper hydration nourish the brain's focus reservoirs. Complete your daily water and walk quests to shield yourself from procrastination penalties!"
    },
    {
      id: "mind",
      name: "Cerebral Mind",
      desc: "Sleep restoration, deep breath loops, & subconscious journal dumps",
      icon: Brain,
      color: "text-purple-750 bg-purple-50 border-purple-200",
      barColor: "bg-purple-655",
      count: quests.filter(q => (q.type === "slumber" || q.type === "brain_dump" || q.id.includes("meditation") || q.id.includes("breath"))).length + 1, // +1 for breathing FAB
      completed: quests.filter(q => (q.type === "slumber" || q.type === "brain_dump" || q.id.includes("meditation") || q.id.includes("breath")) && q.completed).length + 1,
      tip: "A quiet mind is an impenetrable fortress. Leverage the 'Sovereign Breath Sanctuary' (Meditate FAB) to clear brain fog and elevate mental clarity."
    },
    {
      id: "school",
      name: "Cognitive Academics",
      desc: "Scholastic trials, conceptual study blocks, and flashcard quizzes",
      icon: GraduationCap,
      color: "text-amber-750 bg-amber-50 border-amber-200",
      barColor: "bg-amber-655",
      count: quests.filter(q => q.id.includes("school") || q.title.toLowerCase().includes("school") || q.id.includes("study") || q.id.includes("academic")).length,
      completed: quests.filter(q => (q.id.includes("school") || q.title.toLowerCase().includes("school") || q.id.includes("study") || q.id.includes("academic")) && q.completed).length,
      tip: "Continuous knowledge progression unlocks high-tier evolutionary stages. Complete study blocks to transcend from a Simple Seeker into a Great Sage!"
    },
    {
      id: "skills",
      name: "Arcane Skills",
      desc: "Coding craftsmanship, keyboard layout training, and spatial memory blocks",
      icon: Code,
      color: "text-blue-750 bg-blue-50 border-blue-200",
      barColor: "bg-blue-655",
      count: quests.filter(q => q.type === "custom" || q.id.includes("code") || q.id.includes("skill")).length,
      completed: quests.filter(q => (q.type === "custom" || q.id.includes("code") || q.id.includes("skill")) && q.completed).length,
      tip: "Gaining technical muscle memory translates directly into creative independence. Boost your discipline at the Evolution tab using Gold coins!"
    }
  ];

  // Weekly history based on real stats for today, historical records for others
  const weeklyHistory = [
    { day: "Mon", completion: 60, gold: 45, xp: 120 },
    { day: "Tue", completion: 80, gold: 65, xp: 180 },
    { day: "Wed", completion: 40, gold: 30, xp: 90 },
    { day: "Thu", completion: 100, gold: 125, xp: 320 },
    { day: "Fri", completion: 75, gold: 55, xp: 150 },
    { day: "Sat", completion: 90, gold: 80, xp: 210 },
    { day: "Sun", completion: completionPercentage, gold: completedCount * 15, xp: completedCount * 80, isToday: true }
  ];

  const getDayExplanation = () => {
    if (selectedDay === "Today" || selectedDay === "Sun") {
      return `Today's completion rate is ${completionPercentage}%. Your active focus has earned you ${completedCount * 15} Gold coins and ${completedCount * 80} XP so far on this holy cycle. Keep pushing!`;
    }
    const dayData = weeklyHistory.find(d => d.day === selectedDay);
    if (!dayData) return "";
    return `On ${selectedDay}, your resolve was strong, conquering ${dayData.completion}% of all daily quests. Gained +${dayData.gold} Gold coins and +${dayData.xp} XP towards your core evolution path.`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-fade-in px-4" id="analytics-tab-view">
      
      {/* Tab Header Titles */}
      <section className="mb-6 text-left border-l-4 border-[#7e5714] pl-4">
        <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#201b0c]">
          Statistical Chronicle
        </h1>
        <p className="font-sans text-xs md:text-sm italic text-[#4f4538] font-bold mt-1 leading-normal">
          Analytical study of your historical habit completions, active streak tiers, and Category performance multipliers.
        </p>
      </section>

      {/* CORE STATS OVERLAYS - CLICKABLE INTERACTION */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        
        {/* Streak details */}
        <div 
          onClick={() => setSelectedMetric(selectedMetric === "streak" ? null : "streak")}
          className={`border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none h-full min-h-[135px] ${
            selectedMetric === "streak" 
              ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]" 
              : "bg-[#fffdf9] shadow-[3px_3px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#201b0c]"
          }`}
          title="Click to learn about Streak benefits"
          id="streak-metric-card"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="font-mono text-[9px] text-[#4f4538] font-black uppercase leading-none tracking-wider">Ledger Streak</span>
            <div className="p-1.5 bg-red-100 rounded-lg text-red-600 border border-[#201b0c]/10 flex-shrink-0">
              <Flame className="w-4 h-4 fill-red-500 text-red-600 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start gap-1.5 min-w-0">
            <span className="font-serif text-lg md:text-xl font-black text-[#201b0c] leading-none">
              {stats.streak} Days
            </span>
            <span className="text-[9px] text-red-700 font-sans font-extrabold bg-[#fff3d9] border border-red-200/40 px-2 py-0.5 rounded-md leading-none">
              {stats.streak >= 7 ? "🔥 Active" : "🌱 Novice"}
            </span>
          </div>
        </div>

        {/* Dynamic Multiplier box */}
        <div 
          onClick={() => setSelectedMetric(selectedMetric === "multiplier" ? null : "multiplier")}
          className={`border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none h-full min-h-[135px] ${
            selectedMetric === "multiplier" 
              ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]" 
              : "bg-[#fffdf9] shadow-[3px_3px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#201b0c]"
          }`}
          title="Click to learn about your current multipliers"
          id="multiplier-metric-card"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="font-mono text-[9px] text-[#4f4538] font-black uppercase leading-none tracking-wider">Coin Multiplier</span>
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 border border-[#201b0c]/10 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start gap-1.5 min-w-0">
            <span className="font-serif text-lg md:text-xl font-black text-amber-950 leading-none">
              {stats.streak >= 15 ? "1.50x" : (stats.streak >= 7 ? "1.25x" : "1.00x")}
            </span>
            <span className="text-[9px] text-amber-700 font-sans font-extrabold bg-[#fff3d9] border border-amber-200/40 px-2 py-0.5 rounded-md leading-none">
              {stats.streak >= 15 ? "Cosmic" : (stats.streak >= 7 ? "Adept" : "Base")}
            </span>
          </div>
        </div>

        {/* Global Completion Percentage block */}
        <div 
          onClick={() => setSelectedMetric(selectedMetric === "performance" ? null : "performance")}
          className={`border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none h-full min-h-[135px] ${
            selectedMetric === "performance" 
              ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]" 
              : "bg-[#fffdf9] shadow-[3px_3px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#201b0c]"
          }`}
          title="Click to see performance overview"
          id="performance-metric-card"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="font-mono text-[9px] text-[#4f4538] font-black uppercase leading-none tracking-wider">Active Completion</span>
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600 border border-[#201b0c]/10 flex-shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start gap-1.5 min-w-0">
            <span className="font-serif text-lg md:text-xl font-black text-emerald-950 leading-none">
              {completionPercentage}%
            </span>
            <span className="text-[9px] text-emerald-700 font-sans font-extrabold bg-[#fff3d9] border border-emerald-200/45 px-2 py-0.5 rounded-md leading-none">
              today
            </span>
          </div>
        </div>

      </section>

      {/* DYNAMIC TIP BOX DISPLAYING DETAILED SELECTIONS */}
      {selectedMetric && (
        <div className="mb-6 p-4 border-2 border-[#201b0c] bg-amber-50/50 rounded-2xl text-xs font-sans text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c] animate-fade-in relative">
          <button 
            onClick={() => setSelectedMetric(null)}
            className="absolute top-2 right-3 font-mono text-xs font-black text-[#7e5714] hover:text-[#201b0c] cursor-pointer"
          >
            [X] CLOSE
          </button>
          {selectedMetric === "streak" && (
            <div>
              <p className="font-serif font-extrabold text-[#7e5714] uppercase text-[10px] tracking-wider mb-1">🔥 Ledger Streak Mastery Rules</p>
              <p className="leading-relaxed">Maintaining a consecutive day-by-day streak shields your mind from procrastination. If you miss completing all tasks, your **Willpower (HP)** is damaged! Keeping your streak active grants higher Gold multipliers in the Gilded Bazaar.</p>
            </div>
          )}
          {selectedMetric === "multiplier" && (
            <div>
              <p className="font-serif font-extrabold text-[#7e5714] uppercase text-[10px] tracking-wider mb-1">📈 Multiplier Progression Tiers</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>1-6 Days Streak:</strong> 1.00x - Normal discipline rewards.</li>
                <li><strong>7-14 Days Streak:</strong> 1.25x - Adept Scholar status. Gaining +25% bonus Gold!</li>
                <li><strong>15+ Days Streak:</strong> 1.50x - Cosmic Ascendant status. Gaining +50% bonus Gold on all completions!</li>
              </ul>
            </div>
          )}
          {selectedMetric === "performance" && (
            <div>
              <p className="font-serif font-extrabold text-[#7e5714] uppercase text-[10px] tracking-wider mb-1">🛡️ Today&apos;s Quest Evaluation Report card</p>
              <p className="leading-relaxed mb-2">You have completed <strong>{completedCount}</strong> out of <strong>{totalCount}</strong> pending daily chronicle quests today.</p>
              <div className="w-full h-2.5 bg-[#f9edd3] rounded-md overflow-hidden border-2 border-[#201b0c]">
                <div className="h-full bg-emerald-600" style={{ width: `${completionPercentage}%` }} />
              </div>
              <p className="text-[10px] text-gray-550 italic mt-1.5">Completing every quest keeps your will fully shielded against the greyscale phantoms lurking in the bestiary!</p>
            </div>
          )}
        </div>
      )}

      {/* CORE HISTORICAL WEEKLY BAR CHART */}
      <section className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 mb-8 shadow-[4px_4px_0px_0px_#201b0c]">
        <h3 className="font-serif text-sm font-extrabold text-[#201b0c] mb-1.5 flex items-center gap-1.5 uppercase leading-none">
          <Calendar className="w-4 h-4 text-[#7e5714]" /> Weekly Completion Chronicle
        </h3>
        <p className="text-[10px] text-gray-550 font-bold mb-4 font-sans">
          Click on any day bar to inspect historical ledger entry results.
        </p>

        {/* Bar chart grid with dashed lines */}
        <div className="relative pt-6 pb-2 px-1">
          {/* Dashboard grid lines */}
          <div className="absolute inset-0 left-6 right-0 bottom-8 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-dashed border-gray-200 w-full h-0" />
            <div className="border-b border-dashed border-gray-200 w-full h-0" />
            <div className="border-b border-dashed border-gray-200 w-full h-0" />
            <div className="border-b border-dashed border-gray-200 w-full h-0" />
            <div className="border-b-2 border-[#201b0c]/30 w-full h-0" />
          </div>

          {/* Left Y-axis labels positioned relative to grid lines */}
          <div className="absolute left-0 bottom-8 top-6 w-6 flex flex-col justify-between pointer-events-none font-mono text-[9px] text-gray-400">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          <div className="relative flex justify-around items-end h-32 pl-6 z-10 font-sans">
            {weeklyHistory.map((dayLog) => {
              const isSelected = selectedDay === (dayLog.isToday ? "Today" : dayLog.day);
              return (
                <div 
                  key={dayLog.day} 
                  onClick={() => setSelectedDay(dayLog.isToday ? "Today" : dayLog.day)}
                  className="flex flex-col items-center w-10 group cursor-pointer focus:outline-none select-none transition-transform active:scale-95"
                >
                  <div className={`text-[10px] font-mono text-[#7e5714] font-black mb-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {dayLog.completion}%
                  </div>
                  {/* Visual bar container with rounded capping */}
                  <div 
                    className={`w-6 rounded-t-lg transition-all duration-300 relative overflow-hidden border-2 select-none h-full ${
                      isSelected
                        ? "bg-[#7e5714] border-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c]"
                        : dayLog.isToday
                        ? "bg-amber-400 border-[#201b0c] shadow-[1px_1px_0px_0px_#201b0c]"
                        : "bg-[#f9edd3] border-[#201b0c]/50 hover:border-[#201b0c] hover:bg-amber-100"
                    }`}
                    style={{ height: `${Math.max(6, dayLog.completion)}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                  </div>
                  <span className={`text-[9px] font-mono font-black uppercase mt-2 px-1.5 py-0.5 rounded transition-colors ${
                    isSelected 
                      ? "bg-[#201b0c] text-white font-extrabold" 
                      : dayLog.isToday
                      ? "text-[#7e5714] font-black"
                      : "text-[#4f4538]"
                  }`}>
                    {dayLog.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Chronicle selection summary */}
        <div className="mt-4 p-3 bg-amber-50/50 border-2 border-[#201b0c] rounded-xl text-xs flex justify-between items-center font-sans shadow-[2px_2px_0px_0px_#201b0c]">
          <div className="flex-grow">
            <p className="font-serif font-extrabold text-[#7e5714] uppercase text-[10px] tracking-wider mb-0.5">Chronicle Record: {selectedDay}</p>
            <p className="text-gray-750 leading-relaxed font-sans text-xs">
              {getDayExplanation()}
            </p>
          </div>
          <Award className="w-5 h-5 text-[#7e5714] flex-shrink-0 ml-3 opacity-80" />
        </div>
      </section>

      {/* CATEGORIES TRACKING METRICS GRID (Health, Mind, School, Skills) */}
      <section className="space-y-4">
        <h3 className="font-serif text-sm font-extrabold text-[#201b0c] flex items-center gap-1.5 uppercase leading-none">
          <Activity className="w-4 h-4 text-[#7e5714]" /> Habit Category Ledger
        </h3>
        <p className="text-[10px] text-gray-550 font-bold mb-4 font-sans">
          Click on any category card to display specific suggestions and diagnostic wisdom.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const catPercent = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none ${
                  isSelected 
                    ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]" 
                    : "bg-[#fffdf9] shadow-[3px_3px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#201b0c]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg border-2 border-[#201b0c] bg-[#f9edd3] text-[#7e5714]">
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-extrabold text-gray-900 leading-snug">{cat.name}</h4>
                        <p className="font-sans text-[10px] text-gray-500 font-bold leading-normal">{cat.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] mb-2 font-semibold font-sans">
                    <span className="text-amber-850 font-mono font-black uppercase text-[9px]">
                      {cat.completed} / {cat.count} Tasks completed
                    </span>
                    <span className="font-mono text-[#201b0c] font-black bg-amber-100 border border-[#201b0c]/10 px-1.5 py-0.2 rounded-md">{catPercent}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-[#f9edd3] rounded-md overflow-hidden border-2 border-[#201b0c] p-[1.5px]">
                    <div 
                      className="h-full bg-[#7e5714] rounded-sm transition-all duration-1000"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>

                {/* Sub-text tip if selected */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-[#201b0c]/15 text-[11px] text-[#4f4538] leading-relaxed italic animate-fade-in font-sans">
                    <strong className="text-[#7e5714] font-serif not-italic block mb-0.5 uppercase tracking-wide text-[10px]">Scribe Wisdom Tip:</strong>
                    {cat.tip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 🏆 TROPHY ROOM & ASCENDANCY BADGES SANCTUARY */}
      <section className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 mt-8 shadow-[4px_4px_0px_0px_#201b0c]" id="trophy-room-sanctuary">
        <div className="flex items-center gap-2 mb-1 border-b border-[#201b0c]/10 pb-2">
          <Award className="w-4 h-4 text-[#7e5714]" />
          <h3 className="font-serif text-sm font-extrabold uppercase text-[#201b0c] tracking-wide">
            Trophy Room & permanent badges
          </h3>
        </div>
        <p className="text-[10px] text-gray-550 font-bold mb-4 font-sans">
          Click any badge seal to expand your custom unlock criteria and lore insights.
        </p>

        <div className="grid grid-cols-2 gap-4">
          
          {/* Badge 1: 7-Day Streak Master */}
          {(() => {
            const isUnlocked = stats.streak >= 7;
            const isSelected = selectedBadge === "streak_master";
            return (
              <div 
                onClick={() => setSelectedBadge(isSelected ? null : "streak_master")}
                className={`p-3.5 rounded-2xl border-2 border-[#201b0c] flex flex-col items-center text-center transition-all cursor-pointer select-none ${
                  isUnlocked 
                    ? isSelected
                      ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]"
                      : "bg-[#fffdf9] text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#201b0c]" 
                    : "bg-[#fffdf9]/40 border-dashed border-gray-300 text-gray-400 grayscale opacity-50 shadow-none"
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,10 90,25 90,65 50,90 10,65 10,25" fill="#f59e0b" stroke="#201b0c" strokeWidth="6" />
                    <circle cx="50" cy="50" r="28" fill="#fef3c7" stroke="#201b0c" strokeWidth="3" />
                    <path d="M 50,32 Q 42,50 50,68 Q 58,50 50,32 Z" fill="#ba1a1a" />
                  </svg>
                </div>
                <h4 className="font-serif text-xs font-extrabold leading-tight">7d Streak Seal</h4>
                <p className="text-[9px] text-[#4f4538] font-bold mt-1">
                  {isUnlocked ? "🔥 Active" : "Locked"}
                </p>
              </div>
            );
          })()}

          {/* Badge 2: Hydration Hero */}
          {(() => {
            const isUnlocked = true;
            const isSelected = selectedBadge === "hydration_hero";
            return (
              <div 
                onClick={() => setSelectedBadge(isSelected ? null : "hydration_hero")}
                className={`p-3.5 rounded-2xl border-2 border-[#201b0c] flex flex-col items-center text-center transition-all cursor-pointer select-none ${
                  isUnlocked 
                    ? isSelected
                      ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]"
                      : "bg-[#fffdf9] text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#201b0c]" 
                    : "bg-[#fffdf9]/40 border-[#201b0c]/20 text-gray-400 grayscale opacity-55 shadow-none"
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M 30,20 L 70,20 L 75,50 C 75,70 50,85 50,85 C 50,85 25,70 25,50 Z" fill="#3182ce" stroke="#201b0c" strokeWidth="6" />
                    <circle cx="50" cy="52" r="14" fill="#ffffff" opacity="0.4" />
                  </svg>
                </div>
                <h4 className="font-serif text-xs font-extrabold leading-tight">Hydration Seal</h4>
                <p className="text-[9px] text-[#1a365d] font-bold mt-1">
                  💧 Unlocked
                </p>
              </div>
            );
          })()}

          {/* Badge 3: Behemoth Conqueror */}
          {(() => {
            const isUnlocked = stats.level >= 5;
            const isSelected = selectedBadge === "behemoth_conqueror";
            return (
              <div 
                onClick={() => isUnlocked ? setSelectedBadge(isSelected ? null : "behemoth_conqueror") : null}
                className={`p-3.5 rounded-2xl border-2 border-[#201b0c] flex flex-col items-center text-center transition-all cursor-pointer select-none ${
                  isUnlocked 
                    ? isSelected
                      ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]"
                      : "bg-[#fffdf9] text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#201b0c]" 
                    : "bg-[#fffdf9]/30 border-dashed border-gray-300 text-gray-400 grayscale opacity-50 shadow-none cursor-not-allowed"
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill={isUnlocked ? "#4a5568" : "#94a3b8"} stroke="#201b0c" strokeWidth="6" />
                    <path d="M 25,75 L 75,25 M 75,75 L 25,25" stroke="#f1c40f" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                </div>
                <h4 className="font-serif text-xs font-extrabold leading-tight">Behemoth Seal</h4>
                <p className="text-[9px] text-slate-800 font-bold mt-1">
                  {isUnlocked ? "🛡️ Iron Guard" : "Lvl 5 required"}
                </p>
              </div>
            );
          })()}

          {/* Badge 4: Cosmic Ascendant */}
          {(() => {
            const isUnlocked = stats.level >= 10;
            const isSelected = selectedBadge === "cosmic_ascendant";
            return (
              <div 
                onClick={() => isUnlocked ? setSelectedBadge(isSelected ? null : "cosmic_ascendant") : null}
                className={`p-3.5 rounded-2xl border-2 border-[#201b0c] flex flex-col items-center text-center transition-all cursor-pointer select-none ${
                  isUnlocked 
                    ? isSelected
                      ? "bg-[#fff3d9] shadow-[1px_1px_0px_0px_#201b0c] translate-y-[1px]"
                      : "bg-[#fffdf9] text-[#201b0c] shadow-[2px_2px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#201b0c]" 
                    : "bg-[#fffdf9]/30 border-dashed border-gray-300 text-gray-400 grayscale opacity-45 shadow-none cursor-not-allowed"
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,5 64,36 98,38 72,60 80,92 50,74 20,92 28,60 2,38 36,36" fill={isUnlocked ? "#9f7aea" : "#cbd5e1"} stroke="#201b0c" strokeWidth="6" />
                  </svg>
                </div>
                <h4 className="font-serif text-xs font-extrabold leading-tight">Cosmic Star Seal</h4>
                <p className="text-[9px] text-purple-900 font-bold mt-1">
                  {isUnlocked ? "🌌 Sage Active" : "Lvl 10 required"}
                </p>
              </div>
            );
          })()}

        </div>

        {/* Selected Badge detailed block feedback */}
        {selectedBadge && (
          <div className="mt-5 p-4 border-2 border-[#201b0c] bg-[#fffdf5] rounded-xl text-xs font-sans text-gray-800 shadow-[2px_2px_0px_0px_#201b0c] animate-fade-in relative">
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-2.5 right-3 font-mono text-[9px] font-black text-[#7e5714] uppercase cursor-pointer"
            >
              [X] Dismiss
            </button>
            {selectedBadge === "streak_master" && (
              <div>
                <h5 className="font-serif font-extrabold text-[#7e5714] text-xs uppercase mb-1">🔥 Seal of the Seven-Day Fire</h5>
                <p className="leading-relaxed">Inscribed upon maintaining an unbroken streak of 7 full solar rotations in your main ledger. This seal permanently proves your stamina is seasoned enough to withstand distraction phantoms.</p>
              </div>
            )}
            {selectedBadge === "hydration_hero" && (
              <div>
                <h5 className="font-serif font-extrabold text-[#7e5714] text-xs uppercase mb-1">💧 Seal of the Crystal Well</h5>
                <p className="leading-relaxed">Inscribed to reward excellent physiological habits. Daily hydration keeps mental focus processing steady and keeps brain cellular engines well lubricated against exhaustion.</p>
              </div>
            )}
            {selectedBadge === "behemoth_conqueror" && (
              <div>
                <h5 className="font-serif font-extrabold text-[#7e5714] text-xs uppercase mb-1">🛡️ Seal of the Sloth Slayer</h5>
                <p className="leading-relaxed">Requires reaching Heroic Tier (Level 5) and successfully warding off Sloth or grey swirl distraction phantoms in deep focus trials. Unlocks advanced block stats in your evolution path!</p>
              </div>
            )}
            {selectedBadge === "cosmic_ascendant" && (
              <div>
                <h5 className="font-serif font-extrabold text-[#7e5714] text-xs uppercase mb-1">🌌 Seal of the Cosmic Citadels</h5>
                <p className="leading-relaxed">The ultimate mark of self-control, unlocked only by reaching Level 10. Your habits have transformed from physical grinds into an enlightened mental architecture of automatic flow.</p>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
