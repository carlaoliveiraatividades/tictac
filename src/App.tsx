/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProgress, Badge, Quest } from './types';
import { Dashboard } from './components/Dashboard';
import { SegurancaGame } from './components/SegurancaGame';
import { PesquisaGame } from './components/PesquisaGame';
import { CriarInovarGame } from './components/CriarInovarGame';
import { MultiplayerDuel } from './components/MultiplayerDuel';
import { generateStandaloneHtml } from './components/StandaloneExporter';

// Lucide icon components strictly imported
import { Shield, Search, Lightbulb, Swords, Award, Sparkles, BookOpen } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  nickname: 'Explorador TIC',
  selectedMascot: 'tico',
  xp: 0,
  level: 1,
  completedQuests: [],
  earnedBadges: [],
  lastActive: new Date().toISOString(),
  scores: {
    segurancaMaxScore: 0,
    pesquisaMaxScore: 0,
    criarInovarMaxScore: 0,
    multiplayerWins: 0,
  }
};

const SYSTEM_BADGES: Badge[] = [
  {
    id: 'defensor_dados',
    title: 'Defensor de Dados 🛡️',
    description: 'Completaste os desafios de segurança cibernética e privacidade móvel sem cair em armadilhas de Wi-Fi ou permissões.',
    icon: 'Shield',
    color: 'emerald',
    category: 'seguranca'
  },
  {
    id: 'mestre_investigador',
    title: 'Mestre Investigador 🔍',
    description: 'Sabes pesquisar com operadores lógicos avançados e tens um olho afiado para identificar e combater Fake News.',
    icon: 'Search',
    color: 'sky',
    category: 'pesquisa'
  },
  {
    id: 'mestre_inovacao',
    title: 'Mestre da Inovação 🤖',
    description: 'Escreveste programas lógicos sequenciais de robótica e acionaste sensores inteligentes de IoT com sucesso.',
    icon: 'Lightbulb',
    color: 'indigo',
    category: 'criacao'
  },
  {
    id: 'gladiador_tic',
    title: 'Gladiador de TIC ⚔️',
    description: 'Completaste o Duelo de Saberes Multiplayer com um colega, respondendo a perguntas do Perfil dos Alunos.',
    icon: 'Swords',
    color: 'pink',
    category: 'geral'
  },
  {
    id: 'curioso',
    title: 'Explorador Curioso 🚀',
    description: 'Iniciaste a tua caminhada escolar personalizando o teu perfil e mascote na nossa plataforma de TIC.',
    icon: 'Award',
    color: 'amber',
    category: 'geral'
  }
];

const SCHOOL_QUESTS: Quest[] = [
  {
    id: 'seguranca_hero',
    title: 'Privacidade Móvel & Wi-Fi',
    description: 'Saber configurar as permissões corretas de uma app e avaliar riscos em redes públicas abertas.',
    rewardXp: 30,
    category: 'seguranca',
    completed: false
  },
  {
    id: 'pesquisa_pro',
    title: 'Indiana Jones da Web',
    description: 'Combinar termos usando operadores AND, OR, NOT e identificar notícias tendenciosas ou falsas.',
    rewardXp: 30,
    category: 'pesquisa',
    completed: false
  },
  {
    id: 'criar_inovar_champion',
    title: 'Mestre do Código de Robôs',
    description: 'Criar um algoritmo lógico com blocos de instrução sequenciais para mover o robô robotizado até à meta.',
    rewardXp: 40,
    category: 'criacao',
    completed: false
  },
  {
    id: 'multiplayer_badge',
    title: 'Competição Saudável',
    description: 'Terminar um combate amigável Multiplayer de 5 rondas contra um colega no mesmo computador.',
    rewardXp: 40,
    category: 'colaboracao',
    completed: false
  }
];

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'seguranca' | 'pesquisa' | 'criar' | 'duelo'>('dashboard');
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);

  // Load progress from local storage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('tic_kids_user_state');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        setProgress(INITIAL_PROGRESS);
      }
    } else {
      // First boot, gain a start badge
      const bootProgress = {
        ...INITIAL_PROGRESS,
        earnedBadges: ['curioso']
      };
      setProgress(bootProgress);
      localStorage.setItem('tic_kids_user_state', JSON.stringify(bootProgress));
    }
  }, []);

  // Save progress helper
  const saveProgressState = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('tic_kids_user_state', JSON.stringify(newProgress));
  };

  // Give Experience & Manage Level-ups
  const handleGainXp = (amount: number, possibleBadgeId?: string) => {
    let currentXp = progress.xp + amount;
    let currentLevel = progress.level;
    const xpNeeded = currentLevel * 100;

    let leveledUp = false;
    if (currentXp >= xpNeeded) {
      currentXp -= xpNeeded;
      currentLevel += 1;
      leveledUp = true;
    }

    const updatedBadges = [...progress.earnedBadges];
    if (possibleBadgeId && !updatedBadges.includes(possibleBadgeId)) {
      updatedBadges.push(possibleBadgeId);
    }

    const updated = {
      ...progress,
      xp: currentXp,
      level: currentLevel,
      earnedBadges: updatedBadges,
      lastActive: new Date().toISOString()
    };

    saveProgressState(updated);

    if (leveledUp) {
      setShowLevelUpAlert(true);
      // Play a small synthetic beep sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (err) {}
    }
  };

  const handleCompleteQuest = (questId: string) => {
    if (!progress.completedQuests.includes(questId)) {
      const updatedQuests = [...progress.completedQuests, questId];
      const xpReward = SCHOOL_QUESTS.find(q => q.id === questId)?.rewardXp || 20;

      const updated = {
        ...progress,
        completedQuests: updatedQuests
      };
      
      saveProgressState(updated);
      handleGainXp(xpReward);
    }
  };

  const handleUpdateNickname = (newName: string) => {
    const updated = {
      ...progress,
      nickname: newName
    };
    saveProgressState(updated);
  };

  const handleUpdateMascot = (mascot: 'tico' | 'teca') => {
    const updated = {
      ...progress,
      selectedMascot: mascot
    };
    saveProgressState(updated);
  };

  const handleResetProgress = () => {
    if (window.confirm('Tens a certeza que queres reiniciar todo o teu progresso escolar, medalhas e pontos XP?')) {
      saveProgressState({
        ...INITIAL_PROGRESS,
        earnedBadges: ['curioso']
      });
      setActiveTab('dashboard');
    }
  };

  // Triggers the download of the fully standalone HTML file for direct Github Pages hosting
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tic_kids_exploradores_digitais.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-sky-100 min-h-screen font-sans text-slate-800 pb-12 transition-colors duration-300">
      {/* Dynamic level up modal */}
      {showLevelUpAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-amber-400 shadow-2xl relative animate-fade-in space-y-4">
            <div className="text-7xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-black text-amber-500 font-display">Subiste de Nível!</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-semibold">
              Parabéns, {progress.nickname}! Chegaste ao <strong>Nível {progress.level}</strong> de explorador escolar de Tecnologias da Informação!
            </p>
            <button
              onClick={() => setShowLevelUpAlert(false)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl cursor-pointer shadow-md border-b-4 border-amber-700 active:translate-y-1 transform transition-all"
            >
              Continuar Exploração! 🌟
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVBAR CARD - GEOMETRIC BALANCE THEME */}
      <header className="w-full bg-white border-b-4 border-yellow-400 py-4 px-6 md:px-12 sticky top-0 z-40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-indigo-400">
            {progress.selectedMascot === 'tico' ? '🤖' : '👩‍🚀'}
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight font-display">TIC Kids: 3.º Ciclo</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Nível {progress.level}: Aprendizagem Interativa</p>
          </div>
        </div>

        {/* Tab options menu - Playful 3D styling */}
        <nav className="flex flex-wrap items-center justify-center gap-2 bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-4 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-[0_3px_0_rgb(67,56,202)] active:translate-y-0.5'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Painel 📊
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-4 ${
              activeTab === 'seguranca'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-[0_3px_0_rgb(67,56,202)] active:translate-y-0.5'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Segurança 🛡️
          </button>
          <button
            onClick={() => setActiveTab('pesquisa')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-4 ${
              activeTab === 'pesquisa'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-[0_3px_0_rgb(67,56,202)] active:translate-y-0.5'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Pesquisa 🔍
          </button>
          <button
            onClick={() => setActiveTab('criar')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-4 ${
              activeTab === 'criar'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-[0_3px_0_rgb(67,56,202)] active:translate-y-0.5'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Criar 🤖
          </button>
          <button
            onClick={() => setActiveTab('duelo')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-4 ${
              activeTab === 'duelo'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-[0_3px_0_rgb(67,56,202)] active:translate-y-0.5'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Duelo ⚔️
          </button>
        </nav>

        {/* Stats segment */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full border-2 border-yellow-400">
            <span className="text-sm">⭐</span>
            <span className="font-black text-yellow-700 text-xs">{progress.xp} XP</span>
          </div>
          <div className="flex items-center gap-2 bg-pink-100 px-4 py-1.5 rounded-full border-2 border-pink-400">
            <span className="text-sm">🏆</span>
            <span className="font-black text-pink-700 text-xs">NL {progress.level}</span>
          </div>
        </div>
      </header>

      {/* Main Core section */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 mt-8">
        <div className="transition-all duration-300 ease-out">
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <Dashboard
                progress={progress}
                onUpdateNickname={handleUpdateNickname}
                onUpdateMascot={(m) => handleUpdateMascot(m)}
                onResetProgress={handleResetProgress}
                badges={SYSTEM_BADGES}
                quests={SCHOOL_QUESTS}
                onTriggerDownloadHtml={handleDownloadStandaloneHtml}
              />
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="animate-fade-in">
              <SegurancaGame
                onGainXp={handleGainXp}
                completedQuests={progress.completedQuests}
                onCompleteQuest={handleCompleteQuest}
              />
            </div>
          )}

          {activeTab === 'pesquisa' && (
            <div className="animate-fade-in">
              <PesquisaGame
                onGainXp={handleGainXp}
                completedQuests={progress.completedQuests}
                onCompleteQuest={handleCompleteQuest}
              />
            </div>
          )}

          {activeTab === 'criar' && (
            <div className="animate-fade-in">
              <CriarInovarGame
                onGainXp={handleGainXp}
                completedQuests={progress.completedQuests}
                onCompleteQuest={handleCompleteQuest}
              />
            </div>
          )}

          {activeTab === 'duelo' && (
            <div className="animate-fade-in">
              <MultiplayerDuel
                onRegisterWin={() => {
                  handleCompleteQuest('multiplayer_badge');
                  handleGainXp(30, 'gladiador_tic');
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
