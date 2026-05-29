/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mascot types
export type MascotType = 'tico' | 'teca';

export interface Mascot {
  id: MascotType;
  name: string;
  avatar: string;
  description: string;
  color: string;
  greeting: string;
}

// System achievements/badges
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  category: 'seguranca' | 'pesquisa' | 'colaboracao' | 'criacao' | 'geral';
}

// User state interface (saved in localStorage)
export interface UserProgress {
  nickname: string;
  selectedMascot: MascotType;
  xp: number;
  level: number;
  completedQuests: string[]; // key of quests completed
  earnedBadges: string[]; // badge IDs
  lastActive: string;
  // Game scores
  scores: {
    segurancaMaxScore: number;
    pesquisaMaxScore: number;
    criarInovarMaxScore: number;
    multiplayerWins: number;
  };
}

// Quest/Task definitions
export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  category: 'seguranca' | 'pesquisa' | 'colaboracao' | 'criacao';
  completed: boolean;
}

// Quiz & Game question types
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hints?: string;
}

// Spreadsheet sheet cell
export interface SpreadsheetCell {
  row: number;
  col: string; // "A", "B", "C" etc.
  value: string;
  formula?: string;
  isCorrect?: boolean;
}

// IoT Grid Game block types
export type RobotCommand = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'ACTIVATE_SENSOR';

export interface GridItem {
  row: number;
  col: number;
  type: 'empty' | 'robot' | 'obstacle' | 'chip' | 'smart_bulb' | 'sensor_node' | 'server';
}
