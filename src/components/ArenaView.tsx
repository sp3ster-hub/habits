import React, { useState } from "react";
import { Swords, ClipboardList, CheckSquare, Plus, Trash2, Heart, Award, Sparkles, Check, Play, RefreshCw, Info, HelpCircle } from "lucide-react";
import { UserStats, Quest } from "../types";
import RainbowPlateModal from "./RainbowPlateModal";
import BrainDumpModal from "./BrainDumpModal";
import WalkVerificationModal from "./WalkVerificationModal";
import WaterVerificationModal from "./WaterVerificationModal";
import SlumberVerificationModal from "./SlumberVerificationModal";
import AvatarCharacter from "./AvatarCharacter";

interface ArenaViewProps {
  stats: UserStats;
  quests: Quest[];
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  addLogMessage: (text: string) => void;
}

export default function ArenaView({ stats, quests, setStats, setQuests, addLogMessage }: ArenaViewProps) {
  const [bossHealth, setBossHealth] = useState(45); // Representing the Behemoth's Stamina
  const [bossDefeatedCount, setBossDefeatedCount] = useState(0);

  // Dynamic bad habit boss name based on current human player level
  const bossName = stats.level >= 10
    ? "Blue Light Fiend"
    : stats.level >= 5
    ? "Junk Food Glutton"
    : "Procrastination Specter";

  // AI Modal states
  const [showRainbowPlate, setShowRainbowPlate] = useState(false);
  const [showBrainDump, setShowBrainDump] = useState(false);
  
  // High-Energy Habit Coach Verification Modals
  const [showWalkVerification, setShowWalkVerification] = useState(false);
  const [showWaterVerification, setShowWaterVerification] = useState(false);
  const [showSlumberVerification, setShowSlumberVerification] = useState(false);
  
  // Custom Quest states
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"COMMON" | "EPIC" | "LEGENDARY">("COMMON");

  // Dynamic coin reward streak multiplier
  const streakMultiplier = stats.streak >= 15 ? 1.5 : (stats.streak >= 7 ? 1.25 : 1.0);

  // Simulate missing a habit cycle / missed day to trigger boss strike
  const simulateMissedHabit = () => {
    setStats((prev) => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - 25),
      streak: 0,
    }));
    addLogMessage(`💥 CRITICAL DAMAGE! You missed a habit cycle. ${bossName} attacked your willpower, dealing -25 HP damage, and your streak dropped to 0 (multiplier reset back to 1.0x).`);
  };

  // Handle striking the boss / completing habit
  const toggleQuest = (id: string) => {
    // Intercept active uncompleted AI habits
    const qCheck = quests.find(q => q.id === id);
    if (qCheck && !qCheck.completed) {
      if (id === "rainbow_plate") {
        setShowRainbowPlate(true);
        return;
      }
      if (id === "brain_dump") {
        setShowBrainDump(true);
        return;
      }
      if (id === "walk_5_min" || qCheck.type === "walk") {
        setShowWalkVerification(true);
        return;
      }
      if (id === "drink_water" || qCheck.type === "water") {
        setShowWaterVerification(true);
        return;
      }
      if (id === "enter_slumber" || qCheck.type === "slumber") {
        setShowSlumberVerification(true);
        return;
      }
    }

    const updatedQuests = quests.map((q) => {
      if (q.id === id) {
        const targetState = !q.completed;
        
        // Rewards calculation
        let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0; // cape bonus
        const finalXp = Math.round(q.xpReward * multiplier);
        const finalCoins = Math.round(q.coinReward * multiplier * streakMultiplier);

        if (targetState) {
          // Gained rewards
          let newXp = stats.xp + finalXp;
          let newCoins = stats.coins + finalCoins;
          let newLevel = stats.level;
          let message = `You completed '${q.title}'! Gained +${finalXp} XP and +${finalCoins} Coins.`;

          // Level up logic
          if (newXp >= stats.xpNeeded) {
            newXp -= stats.xpNeeded;
            newLevel += 1;
            newCoins += 150; // extra reward
            message += ` 🎉 LEVEL UP TO ${newLevel}! Sovereign of discipline!`;
            addLogMessage(`Leveled up to Stage ${newLevel}!`);
          }

          setStats((prev) => ({
            ...prev,
            xp: newXp,
            level: newLevel,
            coins: newCoins,
            stamina: Math.min(100, prev.stamina + 5), // recovering energy
          }));
          
          // Strike the Behemoth!
          setBossHealth((prev) => {
            const damage = q.difficulty === "LEGENDARY" ? 35 : (q.difficulty === "EPIC" ? 20 : 10);
            const nextHealth = Math.max(0, prev - damage);
            
            if (nextHealth === 0) {
              // Boss vanquished!
              const bossRewards = 250;
              const bonusLegends = 10;
              setStats((prevStats) => ({
                ...prevStats,
                coins: prevStats.coins + bossRewards,
                legendCoins: prevStats.legendCoins + bonusLegends,
              }));
              addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              
              // Trigger a new boss arise in 2 seconds
              setTimeout(() => {
                setBossHealth(100);
                addLogMessage(`The dark mist swirls! ${bossName} has reconstituted with renewed health.`);
              }, 2500);

              setBossDefeatedCount(p => p + 1);
            } else {
              addLogMessage(`Discipline strike hits the monster for ${damage} damage!`);
            }
            return nextHealth;
          });
          
        } else {
          // Reverting complete
          setStats((prev) => ({
            ...prev,
            xp: Math.max(0, prev.xp - finalXp),
            coins: Math.max(0, prev.coins - finalCoins),
            stamina: Math.max(10, prev.stamina - 5),
          }));
          setBossHealth((prev) => Math.min(100, prev + 10));
        }

        return { ...q, completed: targetState };
      }
      return q;
    });

    setQuests(updatedQuests);
  };

  // Add custom habit quest
  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let xp = 100;
    let coins = 15;
    if (newDifficulty === "EPIC") {
      xp = 250;
      coins = 40;
    } else if (newDifficulty === "LEGENDARY") {
      xp = 500;
      coins = 80;
    }

    const newQuest: Quest = {
      id: "custom_" + Date.now(),
      title: newTitle,
      description: newDesc || "Lesser custom test of the soul's resolve.",
      xpReward: xp,
      coinReward: coins,
      completed: false,
      difficulty: newDifficulty,
      type: "custom",
    };

    setQuests([newQuest, ...quests]);
    addLogMessage(`Forged a new Ledger Quest: '${newTitle}' (${newDifficulty})`);
    
    // reset form
    setNewTitle("");
    setNewDesc("");
    setNewDifficulty("COMMON");
    setIsCreating(false);
  };

  // Delete quest
  const handleDeleteQuest = (id: string) => {
    setQuests(quests.filter((q) => q.id !== id));
    addLogMessage("Quest removed from ledger list.");
  };

  // Determine progression tier theme & boss styles
  const getTierAndBossStyles = () => {
    if (stats.level >= 10) {
      return {
        tierLabel: "🌌 Cosmic Citadel Tier (Level 10+)",
        containerStyle: "bg-gradient-to-br from-[#fffdf9] via-[#fdf7ea] to-[#f5edd5] border-[#817567] text-[#201b0c] shadow-sm",
        subtextStyle: "text-[#4f4538]",
        versusColor: "bg-[#7e5714] border-[#d4a35a] text-white ring-[#7e5714]/20",
        bossImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX8erzJe7uVcLchYbxXZKf0ncTOIgA7GeAvwf4tZ2Lr6RKg0miLgJViZXhtD5ppr2mUTxigO_iIAsxrQDz5WUgsWy4zerZPatvOCc8fIOU69rK02rCxNn3VM8yeXsln5zMbIoWl90QLxj5ox-7rZubLiQrLfYDf6xfR4Cb8xE_dmJK8Me8JsgwNSbTQ9_zvsZooBtHe-53gOV4kdQJbLZuVqIlcqK9OEVYdBNdS7QvtKDUy3_HQdVH4UEybM0apctX9ebrbGTpOvg",
        bossDesc: "Demon glowing with blue sapphire screen glare, disrupting slumber and deep work.",
      };
    } else if (stats.level >= 5) {
      return {
        tierLabel: "🧱 Iron Fortress Tier (Level 5-9)",
        containerStyle: "bg-gradient-to-br from-[#fffdf9] via-[#f9edd3] to-[#f4e7cd] border-[#817567] text-[#201b0c] shadow-sm",
        subtextStyle: "text-[#4f4538]",
        versusColor: "bg-[#805533] border-[#c2a695] text-white ring-[#805533]/20",
        bossImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo1qQ1ueayfIq8KLRXPhUGE1MZJbrqpTgaDPuSp3kIZ6HPQ58SDKQxLPq-nsNfowsJbkI7wn-Fuik8sLNgV6U1eWZ6P-Z0Z86_Ctg2vEUw8F-wYmxhYRwCbGS4gu2Lf8yhFiYBX88cOpWMJ8cAZ8s0N0g-YKyLvtfC10Kyg7nTf5xyrfzp1EXKkB6IJG2TBZrW5s8Ngilb6cTXb5C_pBW6QBDvWwTq4uzQrDJcpT5sfGJyWhSHdXh---AsjGp_Xr1PaHI1t_OX5oM",
        bossDesc: "Shadowy beast made of greasy snack wrappers and sugary syrups, draining physical stamina.",
      };
    } else {
      return {
        tierLabel: "🌿 Novice Forest Tier (Level 1-4)",
        containerStyle: "bg-gradient-to-br from-[#fffdf9] via-[#fffbeb] to-[#fff3d9] border-[#817567] text-[#201b0c] shadow-sm",
        subtextStyle: "text-[#4f4538]",
        versusColor: "bg-[#7e5714] border-[#ffdca5] text-white ring-[#7e5714]/20",
        bossImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK5xyOxpUHBT6vjL3pq5gERDxZCctfktMywg0qC3p2CyXLdo3QXmKcfOkLZGOfQnoaQkykK5RvTDpRQCJ2hKVSDjlQibrkbVEOe-xtJoyAo-8oRm1c_a7q5hJ3pmPxjIIZ9F51RiEGO9K7ySZyU2N-qp2U1349lbcCnkymSwKCUcsIJrEHaFh26BR5NvoJPslafXkVOfTZ8lONXz6-YDGnu9W1T_6xradcGArHNC-4d-HJOFfyS77aSBVpb44OFx84wO8YOKddZes",
        bossDesc: "Sluggish specter of Delayed clocks and distracting grey swirls delay active habits.",
      };
    }
  };

  const currentTierStyles = getTierAndBossStyles();

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in px-4">
      
      {/* Dynamic Standoff Arena Panel (Stitch Hero vs Antagonist Bad Habit Boss) */}
      <section className={`relative w-full rounded-2xl overflow-hidden border-[1.5px] p-4 md:p-6 mb-6 hard-offset flex flex-col gap-3 ${currentTierStyles.containerStyle}`}>
        
        {/* Tier Label and Defeat Trophy Counter */}
        <div className="flex justify-between items-center w-full pb-2 border-b border-dashed border-current/20 text-[10px] font-mono font-black tracking-wider uppercase">
          <span>{currentTierStyles.tierLabel}</span>
          {bossDefeatedCount > 0 && (
            <div className="bg-yellow-500 text-black px-2 py-0.5 rounded font-sans font-bold flex items-center gap-1 shadow-sm border border-yellow-700">
              <Award className="w-3.5 h-3.5" /> Vanquished {bossDefeatedCount}
            </div>
          )}
        </div>

        {/* Core Battle-Stance Faceoff layout */}
        <div className="grid grid-cols-12 items-center gap-2 md:gap-4 my-2">
          
          {/* Left Block: The Stitch Hero Avatar */}
          <div className="col-span-5 flex flex-col items-center text-center animate-fade-in">
            <div className="relative p-1 bg-white/20 rounded-xl border border-current/10 w-full max-w-[125px] overflow-hidden flex items-center justify-center">
              <AvatarCharacter 
                level={stats.level} 
                hasCape={stats.avatarClass === "special-cape"} 
                className="bg-transparent border-none shadow-none p-0 !w-24 !h-24 scale-105" 
              />
            </div>
            <span className="font-serif text-sm font-black mt-2 leading-tight block truncate w-full">
              {stats.name}
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono font-bold opacity-75">
              LV {stats.level} Hero
            </span>
          </div>

          {/* Center Block: VS Clashing Swords */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center ring-4 font-black text-xs font-mono select-none animate-pulse ${currentTierStyles.versusColor}`}>
              VS
            </div>
            <div className="h-4 w-[1px] bg-current/20 mt-1 hidden md:block" />
          </div>

          {/* Right Block: The Antagonist bad habit Boss */}
          <div className="col-span-5 flex flex-col items-center text-center animate-fade-in">
            <div className="relative p-1 bg-black/10 rounded-xl border border-current/15 w-full max-w-[125px] aspect-square overflow-hidden flex items-center justify-center">
              <img 
                src={currentTierStyles.bossImg}
                alt={bossName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-lg filter brightness-95 opacity-90 transition-all duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-red-600/5 mix-blend-color-burn pointer-events-none" />
            </div>
            <span className="font-serif text-sm font-black mt-2 leading-tight block truncate w-full">
              {bossName}
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-red-500">
              Active Phantom Threat
            </span>
          </div>

        </div>

        {/* Dynamic Boss Description Label */}
        <div className="text-center pt-2 border-t border-dashed border-current/20">
          <p className="text-[11px] leading-relaxed italic font-medium max-w-md mx-auto">
            &quot;{currentTierStyles.bossDesc}&quot;
          </p>
        </div>

      </section>

         {/* Boss Health Bar / STAMINA LEVEL & Missed Habit Trigger */}
      <section className="mb-8 bg-[#fff0f0] border-2 border-[#201b0c] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#201b0c] font-sans animate-fade-in">
        <div className="flex justify-between items-end mb-1.5">
          <span className="font-bold text-xs uppercase tracking-wide text-red-700 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            STAMINA OF {bossName.toUpperCase()}
          </span>
          <span className="font-serif text-base font-extrabold text-[#ba1a1a]">
            {bossHealth}%
          </span>
        </div>
        <div className="w-full h-6 bg-[#ede1c8] border-2 border-[#201b0c] rounded-lg relative overflow-hidden shadow-inner mb-3">
          <div 
            className="h-full bg-gradient-to-r from-red-650 to-red-800 bg-red-700 rough-edge transition-all duration-700 ease-out" 
            style={{ width: `${bossHealth}%` }}
          />
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        </div>

        {/* Missed habit damage trigger */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 border border-red-200/60 rounded-xl p-3 gap-2 text-xs">
          <p className="font-medium text-red-800 leading-snug">
            ⚠️ Missing a daily habit session triggers a heavy boss retaliatory strike, resetting your streak and gold boost multiplier!
          </p>
          <button
            type="button"
            onClick={simulateMissedHabit}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 text-white font-black text-[10px] tracking-wider uppercase rounded-xl transition-all border-2 border-[#201b0c] shadow-[2.5px_2.5px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            Trigger Boss Attack
          </button>
        </div>
      </section>

      {/* Main Statistics overlay / Leather logs */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#fffdf9] border-2 border-[#201b0c] px-4 py-3 flex items-center gap-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#201b0c]">
          <ClipboardList className="w-6 h-6 text-[#7e5714]" />
          <div>
            <p className="font-mono text-[9px] text-[#4f4538] leading-none uppercase font-black tracking-wider">TOTAL LEVEL XP</p>
            <p className="font-serif text-base md:text-lg font-bold text-[#201b0c] mt-1">{stats.xp + (stats.level * stats.xpNeeded)}</p>
          </div>
        </div>
        <div className="bg-[#fffdf9] border-2 border-[#201b0c] px-4 py-3 flex items-center gap-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#201b0c]">
          <Award className="w-6 h-6 text-[#805533]" />
          <div>
            <p className="font-mono text-[9px] text-[#4f4538] leading-none uppercase font-black tracking-wider">LEGENDARY TOKENS</p>
            <p className="font-serif text-base md:text-lg font-bold text-[#201b0c] mt-1">{stats.legendCoins} <span className="text-[10px] text-yellow-650 font-sans">T</span></p>
          </div>
        </div>
      </section>

      {/* Quests Container */}
      <section className="bg-[#fffdf9] border-2 border-[#201b0c] rounded-2xl p-5 mb-8 shadow-[4px_4px_0px_0px_#201b0c]">
        <div className="flex items-center justify-between mb-5 border-b-2 border-[#201b0c] pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#201b0c]" />
            <h3 className="font-serif text-lg font-black text-[#201b0c] uppercase">DAILY QUESTS</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7e5714] border-2 border-[#201b0c] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#201b0c] active:translate-y-[1px] active:shadow-none hover:bg-[#805533] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Forgery Scroll
          </button>
        </div>

        {/* Forge Custom Quest Form Panel */}
        {isCreating && (
          <form onSubmit={handleCreateQuest} className="bg-[#fff3d9] border-[1.5px] border-[#817567] rounded-lg p-4 mb-6 shadow-sm font-sans">
            <h4 className="font-serif text-base font-bold text-[#7e5714] mb-3">CONSTRUCT HEROIC TASK</h4>
            
            <div className="space-y-3 font-semibold text-xs">
              <div>
                <label className="block text-[#4f4538] uppercase mb-1">Quest Title (What is your habit goal?)</label>
                <input
                  type="text"
                  placeholder="e.g. Write 500 words or Code for 1 hour"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#817567]/50 rounded text-sm text-[#201b0c] placeholder-[#4f4538]/50 focus:outline-[#7e5714]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4f4538] uppercase mb-1">Quest Description</label>
                <input
                  type="text"
                  placeholder="Why is this quest vital for the soul's journey?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#817567]/50 rounded text-sm text-[#201b0c] placeholder-[#4f4538]/50 focus:outline-[#7e5714]"
                />
              </div>

              <div>
                <label className="block text-[#4f4538] uppercase mb-1">Difficulty & Aura Power</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#817567]/50 rounded text-xs tracking-wider"
                >
                  <option value="COMMON">COMMON (+100 XP / +15 Coins)</option>
                  <option value="EPIC">EPIC (+250 XP / +40 Coins)</option>
                  <option value="LEGENDARY">LEGENDARY (+500 XP / +80 Coins)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#7e5714] text-white text-xs font-bold uppercase tracking-widest rounded hard-offset hover:bg-[#805533]"
              >
                Sign Ledger
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Quests Checklist */}
        {/* Interactive Quests Walkthrough Helper */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100/30 border-2 border-dashed border-[#7e5714]/30 rounded-2xl p-4 text-[#4f4538] font-sans flex items-start gap-3.5 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-serif font-black tracking-wider text-[#7e5714] text-[11px] uppercase mb-1 flex items-center gap-1">
              📜 Sovereign Chronicle Verification Manual
            </h4>
            <p className="leading-relaxed">
              Standard tasks can be directly checked off. Interactive quests (indicated by the <span className="underline font-bold text-amber-900">glowing golden border</span> and sensor badges) need a real or simulated deed proof. 
              <strong> Tap any card or click 'Scan Proof ⚡'</strong> to launch its custom assessment scanner!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {quests.length === 0 ? (
            <div className="text-center py-6 text-sm italic text-gray-500">
              No active noble tasks in your ledger. Create some code or life tasks above!
            </div>
          ) : (
            quests.map((quest) => {
              const isVerified = 
                quest.id === "rainbow_plate" ||
                quest.id === "brain_dump" ||
                quest.id === "walk_5_min" ||
                quest.type === "walk" ||
                quest.id === "drink_water" ||
                quest.type === "water" ||
                quest.id === "enter_slumber" ||
                quest.type === "slumber";

              let badgeText = "";
              let badgeBg = "bg-gray-100 text-gray-800 border-gray-200";
              let actionText = "Tap Card to Verify";
              let iconEmoji = "✏️";

              if (isVerified) {
                if (quest.id === "rainbow_plate") {
                  badgeText = "📸 Vision Scan";
                  badgeBg = "bg-rose-50 border-rose-200/50 text-rose-700";
                  actionText = "Launch Vision Scan ⚡";
                  iconEmoji = "📸";
                } else if (quest.id === "brain_dump") {
                  badgeText = "🎙️ Voice NLP";
                  badgeBg = "bg-indigo-50 border-indigo-200/50 text-indigo-700";
                  actionText = "Record Voice ⚡";
                  iconEmoji = "🎙️";
                } else if (quest.id === "walk_5_min" || quest.type === "walk") {
                  badgeText = "🚶 Walk Proof";
                  badgeBg = "bg-blue-50 border-blue-200/50 text-blue-700";
                  actionText = "Verify Walk ⚡";
                  iconEmoji = "🚶";
                } else if (quest.id === "drink_water" || quest.type === "water") {
                  badgeText = "💧 Water Proof";
                  badgeBg = "bg-sky-50 border-sky-200/50 text-sky-700";
                  actionText = "Scan Liquid ⚡";
                  iconEmoji = "💧";
                } else if (quest.id === "enter_slumber" || quest.type === "slumber") {
                  badgeText = "💤 Sleep Audit";
                  badgeBg = "bg-purple-50 border-purple-200/50 text-purple-700";
                  actionText = "Verify Slumber ⚡";
                  iconEmoji = "💤";
                }
              }

              const isCurrentVerified = isVerified && !quest.completed;

              return (
                <div 
                  key={quest.id}
                  onClick={() => {
                    if (!quest.completed) {
                      if (quest.id === "rainbow_plate") {
                        setShowRainbowPlate(true);
                      } else if (quest.id === "brain_dump") {
                        setShowBrainDump(true);
                      } else if (quest.id === "walk_5_min" || quest.type === "walk") {
                        setShowWalkVerification(true);
                      } else if (quest.id === "drink_water" || quest.type === "water") {
                        setShowWaterVerification(true);
                      } else if (quest.id === "enter_slumber" || quest.type === "slumber") {
                        setShowSlumberVerification(true);
                      } else {
                        toggleQuest(quest.id);
                      }
                    } else {
                      toggleQuest(quest.id);
                    }
                  }}
                  className={`group relative border-2 border-[#201b0c] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 cursor-pointer select-none active:translate-y-[1px] active:shadow-none ${
                    quest.completed 
                      ? "opacity-60 bg-[#ede1c8]/35 shadow-none border-[#201b0c]/45" 
                      : isVerified
                      ? "bg-[#fffdf9] border-[#b08b49] shadow-[3px_3px_0px_0px_#b08b49] hover:translate-y-[-1.5px] hover:shadow-[5px_5px_0px_0px_#b08b49] hover:bg-amber-50/15"
                      : "bg-[#fffdf9] shadow-[2px_2px_0px_0px_#201b0c] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_0px_#201b0c] hover:bg-[#fffdf9]"
                  }`}
                  title={isVerified ? "Interactive Quest: Click card to assess completion proof!" : "Custom Quest: Select checkbox to standard complete"}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Visual action button / interactive placeholder representing sensor logic */}
                    <div 
                      className="relative flex items-center justify-center cursor-pointer min-w-[50px] min-h-[50px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleQuest(quest.id);
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={quest.completed}
                        onChange={() => toggleQuest(quest.id)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 border-2 border-[#201b0c] rounded-xl bg-white flex flex-col items-center justify-center transition-all shadow-inner relative ${
                        quest.completed 
                          ? "bg-stone-100" 
                          : isVerified 
                          ? "bg-amber-50 group-hover:bg-amber-100 group-hover:border-[#7e5714]" 
                          : "group-hover:border-[#7e5714] hover:bg-amber-50"
                      }`}>
                        {quest.completed ? (
                          <span className="font-serif text-red-600 font-extrabold text-2xl select-none leading-none animate-fade-in">
                            X
                          </span>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-lg leading-none filter drop-shadow">{iconEmoji}</span>
                            {isVerified && (
                              <span className="text-[7px] font-mono text-amber-700 font-extrabold tracking-tight mt-0.5 animate-pulse uppercase">
                                VERIFY
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`font-serif text-md md:text-[17px] font-bold text-[#201b0c] leading-tight ${
                          quest.completed ? "line-through opacity-75" : ""
                        }`}>
                          {quest.title}
                        </h4>
                        
                        {/* Interactive Verification Banner badges */}
                        {isVerified && (
                          <span className={`text-[8.5px] font-black tracking-wider px-2 py-0.5 rounded-full border leading-none ${badgeBg}`}>
                            {badgeText}
                          </span>
                        )}
                        {!isVerified && (
                          <span className="text-[8.5px] font-sans font-extrabold tracking-wider px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500 leading-none">
                            Self-Attested
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#4f4538] mt-1 font-medium leading-relaxed">
                        {quest.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t border-dashed border-[#201b0c]/10 md:border-none pt-2.5 md:pt-0">
                    {/* Rewards information */}
                    <div className="text-left md:text-right text-[11px] font-bold font-sans">
                      <p className="text-[#7e5714] font-extrabold">+ {quest.xpReward} XP</p>
                      <p className="text-[#805533] font-extrabold">+ {quest.coinReward} Coins</p>
                    </div>

                    {/* Interactive Scan Action Pin / Difficulty Indicator */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                      {quest.difficulty !== "COMMON" && (
                        <span className={`text-[8.5px] font-black tracking-wide px-2 py-0.5 rounded leading-none ${
                          quest.difficulty === "LEGENDARY" 
                            ? "bg-indigo-700 text-white" 
                            : quest.difficulty === "EPIC"
                            ? "bg-amber-700 text-white"
                            : "bg-[#7e5714] text-white"
                        }`}>
                          {quest.difficulty}
                        </span>
                      )}

                      {/* Explicit Interactive scanner action button - answers "someone might not understand" */}
                      {isCurrentVerified ? (
                        <button
                          type="button"
                          className="px-2.5 py-1.5 bg-[#7e5714] border-[1.5px] border-[#201b0c] text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-[1px_1px_0px_0px_#201b0c] group-hover:bg-[#805533] active:translate-y-[0.5px] active:shadow-none transition-all cursor-pointer flex items-center gap-1 leading-none text-center"
                        >
                          <span>{actionText}</span>
                        </button>
                      ) : (
                        isVerified && quest.completed && (
                          <span className="text-[9px] font-sans font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md leading-none">
                            Verified ✓
                          </span>
                        )
                      )}

                      {/* Delete button of custom quests */}
                      {quest.type === "custom" && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuest(quest.id);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                          title="Tear from scroll"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Meditate Daily focus tip panel */}
      <section className="bg-[#ede1c8]/40 border-[1.5px] border-[#817567] rounded-xl p-5 border-dashed relative">
        <p className="font-serif italic text-sm text-[#4f4538] leading-relaxed">
          "Each daily completed strike on the flesh of indolence is a brick laid in the cathedral of your destiny. Maintain the path. Burn away distractions, and manifest the mystic fire."
        </p>
        <p className="text-[10px] font-mono font-bold tracking-widest text-[#817567] uppercase mt-2.5 text-right">
          Sovereign Chronicle Ledger #38
        </p>
      </section>

      {/* [AI FEATURE - HABIT 1] Rainbow Plate Vision scan modal */}
      {showRainbowPlate && (
        <RainbowPlateModal
          onClose={() => setShowRainbowPlate(false)}
          onComplete={(xp, gold) => {
            const targetQuestId = "rainbow_plate";
            let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0;
            const finalXp = Math.round(xp * multiplier);
            const finalGold = Math.round(gold * multiplier * streakMultiplier);

            let newXp = stats.xp + finalXp;
            let newCoins = stats.coins + finalGold;
            let newLevel = stats.level;

            if (newXp >= stats.xpNeeded) {
              newXp -= stats.xpNeeded;
              newLevel += 1;
              newCoins += 150;
              addLogMessage(`Leveled up to Stage ${newLevel}!`);
            }

            setStats((prev) => ({
              ...prev,
              xp: newXp,
              level: newLevel,
              coins: newCoins,
              stamina: Math.min(100, prev.stamina + 5),
            }));

            // Strike the Behemoth (EPIC difficulty deals 20 damage)
            setBossHealth((prev) => {
              const nextHealth = Math.max(0, prev - 20);
              if (nextHealth === 0) {
                const bossRewards = 250;
                const bonusLegends = 10;
                setStats((prevStats) => ({
                  ...prevStats,
                  coins: prevStats.coins + bossRewards,
                  legendCoins: prevStats.legendCoins + bonusLegends,
                }));
                addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              } else {
                addLogMessage("Discipline strike hits the monster for 20 damage!");
              }
              return nextHealth;
            });

            setQuests((prev) => prev.map((q) => q.id === targetQuestId ? { ...q, completed: true } : q));
          }}
          addLogMessage={addLogMessage}
        />
      )}

      {/* [AI FEATURE - HABIT 2] Voice dump NLP modal */}
      {showBrainDump && (
        <BrainDumpModal
          onClose={() => setShowBrainDump(false)}
          onComplete={(xp, gold) => {
            const targetQuestId = "brain_dump";
            let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0;
            const finalXp = Math.round(xp * multiplier);
            const finalGold = Math.round(gold * multiplier * streakMultiplier);

            let newXp = stats.xp + finalXp;
            let newCoins = stats.coins + finalGold;
            let newLevel = stats.level;

            if (newXp >= stats.xpNeeded) {
              newXp -= stats.xpNeeded;
              newLevel += 1;
              newCoins += 150;
              addLogMessage(`Leveled up to Stage ${newLevel}!`);
            }

            setStats((prev) => ({
              ...prev,
              xp: newXp,
              level: newLevel,
              coins: newCoins,
              stamina: Math.min(100, prev.stamina + 5),
            }));

            // Strike the Behemoth (LEGENDARY difficulty deals 35 damage)
            setBossHealth((prev) => {
              const nextHealth = Math.max(0, prev - 35);
              if (nextHealth === 0) {
                const bossRewards = 250;
                const bonusLegends = 10;
                setStats((prevStats) => ({
                  ...prevStats,
                  coins: prevStats.coins + bossRewards,
                  legendCoins: prevStats.legendCoins + bonusLegends,
                }));
                addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              } else {
                addLogMessage("Lethal discipline strike hits the monster for 35 damage!");
              }
              return nextHealth;
            });

            setQuests((prev) => prev.map((q) => q.id === targetQuestId ? { ...q, completed: true } : q));
          }}
          addLogMessage={addLogMessage}
        />
      )}

      {/* [AI COACH HABIT] Walk 5 Minutes Verification Modal */}
      {showWalkVerification && (
        <WalkVerificationModal
          onClose={() => setShowWalkVerification(false)}
          onComplete={(xp, gold) => {
            const targetQuestId = "walk_5_min";
            let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0;
            const finalXp = Math.round(xp * multiplier);
            const finalGold = Math.round(gold * multiplier * streakMultiplier);

            let newXp = stats.xp + finalXp;
            let newCoins = stats.coins + finalGold;
            let newLevel = stats.level;

            if (newXp >= stats.xpNeeded) {
              newXp -= stats.xpNeeded;
              newLevel += 1;
              newCoins += 150;
              addLogMessage(`Leveled up to Stage ${newLevel}!`);
            }

            setStats((prev) => ({
              ...prev,
              xp: newXp,
              level: newLevel,
              coins: newCoins,
              stamina: Math.min(100, prev.stamina + 5),
            }));

            // Strike the Behemoth (COMMON difficulty deals 10 damage)
            setBossHealth((prev) => {
              const nextHealth = Math.max(0, prev - 10);
              if (nextHealth === 0) {
                const bossRewards = 250;
                const bonusLegends = 10;
                setStats((prevStats) => ({
                  ...prevStats,
                  coins: prevStats.coins + bossRewards,
                  legendCoins: prevStats.legendCoins + bonusLegends,
                }));
                addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              } else {
                addLogMessage("Walk completion strike hits the monster for 10 damage!");
              }
              return nextHealth;
            });

            setQuests((prev) => prev.map((q) => q.id === targetQuestId ? { ...q, completed: true } : q));
          }}
          addLogMessage={addLogMessage}
        />
      )}

      {/* [AI COACH HABIT] Drink Fresh Water Verification Modal */}
      {showWaterVerification && (
        <WaterVerificationModal
          onClose={() => setShowWaterVerification(false)}
          onComplete={(xp, gold) => {
            const targetQuestId = "drink_water";
            let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0;
            const finalXp = Math.round(xp * multiplier);
            const finalGold = Math.round(gold * multiplier * streakMultiplier);

            let newXp = stats.xp + finalXp;
            let newCoins = stats.coins + finalGold;
            let newLevel = stats.level;

            if (newXp >= stats.xpNeeded) {
              newXp -= stats.xpNeeded;
              newLevel += 1;
              newCoins += 150;
              addLogMessage(`Leveled up to Stage ${newLevel}!`);
            }

            setStats((prev) => ({
              ...prev,
              xp: newXp,
              level: newLevel,
              coins: newCoins,
              stamina: Math.min(100, prev.stamina + 5),
            }));

            // Strike the Behemoth (COMMON difficulty deals 10 damage)
            setBossHealth((prev) => {
              const nextHealth = Math.max(0, prev - 10);
              if (nextHealth === 0) {
                const bossRewards = 250;
                const bonusLegends = 10;
                setStats((prevStats) => ({
                  ...prevStats,
                  coins: prevStats.coins + bossRewards,
                  legendCoins: prevStats.legendCoins + bonusLegends,
                }));
                addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              } else {
                addLogMessage("Clarity water strike hits the monster for 10 damage!");
              }
              return nextHealth;
            });

            setQuests((prev) => prev.map((q) => q.id === targetQuestId ? { ...q, completed: true } : q));
          }}
          addLogMessage={addLogMessage}
        />
      )}

      {/* [AI COACH HABIT] Enter Slumber Verification Modal */}
      {showSlumberVerification && (
        <SlumberVerificationModal
          onClose={() => setShowSlumberVerification(false)}
          onComplete={(xp, gold) => {
            const targetQuestId = "enter_slumber";
            let multiplier = stats.avatarClass === "special-cape" ? 1.1 : 1.0;
            const finalXp = Math.round(xp * multiplier);
            const finalGold = Math.round(gold * multiplier * streakMultiplier);

            let newXp = stats.xp + finalXp;
            let newCoins = stats.coins + finalGold;
            let newLevel = stats.level;

            if (newXp >= stats.xpNeeded) {
              newXp -= stats.xpNeeded;
              newLevel += 1;
              newCoins += 150;
              addLogMessage(`Leveled up to Stage ${newLevel}!`);
            }

            setStats((prev) => ({
              ...prev,
              xp: newXp,
              level: newLevel,
              coins: newCoins,
              stamina: Math.min(100, prev.stamina + 5),
            }));

            // Strike the Behemoth (EPIC difficulty deals 20 damage)
            setBossHealth((prev) => {
              const nextHealth = Math.max(0, prev - 20);
              if (nextHealth === 0) {
                const bossRewards = 250;
                const bonusLegends = 10;
                setStats((prevStats) => ({
                  ...prevStats,
                  coins: prevStats.coins + bossRewards,
                  legendCoins: prevStats.legendCoins + bonusLegends,
                }));
                addLogMessage(`Defeated ${bossName}! Claimed +${bossRewards} Coins and +${bonusLegends} Legendary Credits.`);
              } else {
                addLogMessage("Deep slumber strike hits the monster for 20 damage!");
              }
              return nextHealth;
            });

            setQuests((prev) => prev.map((q) => q.id === targetQuestId ? { ...q, completed: true } : q));
          }}
          addLogMessage={addLogMessage}
        />
      )}

    </div>
  );
}
