/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserStats {
  level: number;
  xp: number;
  xpNeeded: number;
  coins: number;
  legendCoins: number;
  stamina: number; // 0 to 100
  streak: number;
  name: string;
  title: string;
  avatarClass: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  difficulty: "COMMON" | "EPIC" | "LEGENDARY";
  type: "walk" | "water" | "slumber" | "custom" | "rainbow_plate" | "brain_dump";
}

export interface Phantom {
  id: string;
  name: string;
  level: number;
  description: string;
  penalties: string[];
  resolveEfficiency: number; // percentage
  resolved: boolean;
  image: string;
  icon: string;
}

export interface EvolutionStage {
  id: number;
  name: string;
  description: string;
  status: "COMPLETED" | "ACTIVE" | "LOCKED";
  xpToUnlock?: number;
  image: string;
  bonus?: {
    title: string;
    description: string;
    icon: string;
  };
}

export interface BazaarItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  purchased: boolean;
  active: boolean;
  effect: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  text: string;
  mood: string;
}
