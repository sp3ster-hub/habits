import React from "react";

interface AvatarCharacterProps {
  level: number;
  hasCape: boolean;
  className?: string;
}

export default function AvatarCharacter({ level, hasCape, className = "" }: AvatarCharacterProps) {
  // Determine progression tier
  let tier: "Starter" | "Upgraded" | "Master" = "Starter";
  if (level >= 10) {
    tier = "Master";
  } else if (level >= 5) {
    tier = "Upgraded";
  }

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#fdc39a]/15 to-transparent border border-[#d4a35a]/25 shadow-inner ${className}`} id="hero-avatar-character">
      
      {/* Dynamic Tier Title Header Badge */}
      <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider mb-2.5 shadow-sm border ${
        tier === "Master" 
          ? "bg-[#7e5714] text-amber-200 border-[#d4a35a]" 
          : tier === "Upgraded"
          ? "bg-[#4a5568] text-gray-100 border-gray-400"
          : "bg-amber-105 bg-[#c2a695]/40 text-[#5c4033] border-[#a0522d]/30"
      }`}>
        {tier} Tier Gear
      </div>

      <svg viewBox="0 0 100 120" className="w-28 h-32 select-none filter drop-shadow-md">
        
        {/* BACKGROUND GLOWS OR WINGS FOR MASTER */}
        {tier === "Master" && (
          <>
            {/* Celestial Wings of Willpower */}
            <path d="M 15,60 C -10,30 20,10 35,45 C 20,40 10,50 15,60 Z" fill="#ffe29a" opacity="0.8" stroke="#d4a35a" strokeWidth="1" />
            <path d="M 85,60 C 110,30 80,10 65,45 C 80,40 90,50 85,60 Z" fill="#ffe29a" opacity="0.8" stroke="#d4a35a" strokeWidth="1" />
            {/* Divine Radiance Halo */}
            <circle cx="50" cy="40" r="28" fill="none" stroke="#f1c40f" strokeWidth="1" strokeDasharray="5,3" className="animate-spin" style={{ animationDuration: "12s" }} />
          </>
        )}

        {/* ACTIVE CLOAK / CAPE INTEGRATION */}
        {hasCape && (
          <path 
            d="M 18,85 L 8,115 L 30,120 L 50,90 L 70,120 L 92,115 L 82,85 Z" 
            fill="#ba1a1a" 
            stroke="#7e0000" 
            strokeWidth="1.5" 
          />
        )}

        {/* HERO ARMS & SHADOWS */}
        <ellipse cx="50" cy="112" rx="25" ry="6" fill="rgba(0,0,0,0.15)" />

        {/* ARMOR AND OUTFIT BODY */}
        {tier === "Starter" && (
          // Basic ragged tunic & collar
          <path d="M 30,85 L 20,110 L 80,110 L 70,85 Z" fill="#7d6655" stroke="#4e3b31" strokeWidth="1.5" />
        )}
        {tier === "Upgraded" && (
          // Shining Steel Breastplate with iron rivets
          <>
            <path d="M 28,85 L 18,112 L 82,112 L 72,85 Z" fill="#718096" stroke="#4a5568" strokeWidth="2" />
            {/* Chest Emblem */}
            <polygon points="50,90 58,98 50,106 42,98" fill="#e2e8f0" stroke="#4a5568" strokeWidth="1" />
            {/* Shoulder Guards */}
            <circle cx="28" cy="86" r="6" fill="#4a5568" />
            <circle cx="72" cy="86" r="6" fill="#4a5568" />
          </>
        )}
        {tier === "Master" && (
          // Sovereign Gold-Gilded Sacred Robes and Plate Armor
          <>
            <path d="M 26,82 L 15,115 L 85,115 L 74,82 Z" fill="#2d3748" stroke="#1a202c" strokeWidth="2" />
            {/* Gold Plate Overlay */}
            <path d="M 32,85 L 25,110 L 75,110 L 68,85 Z" fill="#f1c40f" stroke="#7e5714" strokeWidth="1.5" />
            {/* Glowing Mana Core */}
            <circle cx="50" cy="98" r="5" fill="#3498db" className="animate-pulse" />
            <polygon points="50,88 56,94 50,100 44,94" fill="none" stroke="#fff" strokeWidth="1" />
          </>
        )}

        {/* HERO HEAD & FACE */}
        <circle cx="50" cy="55" r="21" fill="#fff" stroke="#3d2b1f" strokeWidth="2" />
        
        {/* Eyes (determined, peaceful yet focused) */}
        <circle cx="43" cy="52" r="2.5" fill="#3d2b1f" />
        <circle cx="57" cy="52" r="2.5" fill="#3d2b1f" />
        {/* Subtle determination eyebrow lines */}
        <path d="M 38,47 L 47,49" stroke="#3d2b1f" strokeWidth="1.5" />
        <path d="M 62,47 L 53,49" stroke="#3d2b1f" strokeWidth="1.5" />
        {/* Confident battle smirk */}
        <path d="M 46,62 Q 50,65 54,62" stroke="#3d2b1f" strokeWidth="2" fill="none" />

        {/* HEAD GEAR (Helmet, Cowl, Crown) */}
        {tier === "Starter" && (
          // Nomad cowl/ragged hood
          <path d="M 28,45 C 28,20 72,20 72,45 C 72,55 80,68 70,68 C 65,68 62,56 50,58 C 38,56 35,68 30,68 C 20,68 28,55 28,45 Z" fill="#8a6d55" stroke="#4e3b31" strokeWidth="1.5" opacity="0.95" />
        )}
        {tier === "Upgraded" && (
          // Iron Soldier Sallet Helmet with blue plume
          <>
            <path d="M 26,48 C 26,20 74,20 74,48 C 74,52 68,52 50,52 C 32,52 26,52 26,48 Z" fill="#a0aec0" stroke="#4a5568" strokeWidth="2" />
            <polygon points="50,22 55,34 45,34" fill="#a0aec0" stroke="#4a5568" strokeWidth="1.5" />
            {/* Visual Blue Crest plume */}
            <path d="M 50,22 Q 35,5 25,12" stroke="#3182ce" strokeWidth="4" fill="none" />
          </>
        )}
        {tier === "Master" && (
          // Gilded Archmage Sovereign Crown with embedding jewel
          <>
            {/* Flowing wizard hair or divine veil */}
            <path d="M 26,54 C 20,70 18,90 22,95 M 74,54 C 80,70 82,90 78,95" stroke="#eed4a3" strokeWidth="3" fill="none" />
            {/* Crown base */}
            <polygon points="26,42 35,22 43,33 50,15 57,33 65,22 74,42" fill="#ffd700" stroke="#7e5714" strokeWidth="2" />
            {/* Inlaid sapphire jewel */}
            <polygon points="50,25 54,30 50,35 46,30" fill="#3498db" stroke="#2980b9" strokeWidth="1" />
          </>
        )}

        {/* HELD ITEMS (Wooden sticks, Battle broadswords, Or runic shields) */}
        {tier === "Starter" && (
          // Small wooden club/practice sword
          <path d="M 75,70 L 92,60 L 90,56 L 73,66 Z M 71,68 L 74,73" stroke="#8a5a36" strokeWidth="2" fill="#ba8448" />
        )}
        {tier === "Upgraded" && (
          // Gleaming steel broadsword
          <>
            <path d="M 74,80 L 98,38 L 94,36 L 71,77 Z" fill="#edf2f7" stroke="#4a5568" strokeWidth="1.5" />
            {/* Guard and Hilt */}
            <path d="M 67,73 L 77,79" stroke="#718096" strokeWidth="3.5" />
            <circle cx="69" cy="79" r="2.5" fill="#dda15e" />
          </>
        )}
        {tier === "Master" && (
          // Sacred crystalline lightsaber-like runic beam sword
          <>
            <path d="M 72,78 L 102,18 L 98,16 L 69,75 Z" fill="#ebf8ff" stroke="#3182ce" strokeWidth="1.5" opacity="0.9" />
            {/* Visual core light glow */}
            <line x1="71" y1="76" x2="100" y2="17" stroke="#90cdf4" strokeWidth="3" />
            {/* Hilt and Gem */}
            <path d="M 64,71 L 76,77" stroke="#7e5714" strokeWidth="4" />
            <circle cx="66" cy="78" r="3.5" fill="#f1c40f" />
          </>
        )}

      </svg>
      
      {/* Current Title display */}
      <span className="font-serif text-[11px] font-bold text-[#7e5714] text-center max-w-[120px] leading-tight mt-1 truncate">
        {level >= 10 ? "Sovereign Sage" : level >= 5 ? "Adept Knight" : "Nomad Novice"}
      </span>
    </div>
  );
}
