/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Badge, UserProgress, Quest } from '../types';
import { MascotSpeechBubble, MASCOTS } from './MascotExplorer';
import { Award, Trophy, UserCheck, Flame, BookMarked, Layers, Trash2, Download, Save } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onUpdateNickname: (name: string) => void;
  onUpdateMascot: (mascot: 'tico' | 'teca') => void;
  onResetProgress: () => void;
  badges: Badge[];
  quests: Quest[];
  onTriggerDownloadHtml: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onUpdateNickname,
  onUpdateMascot,
  onResetProgress,
  badges,
  quests,
  onTriggerDownloadHtml,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.nickname);

  // Compute stats
  const xpNeeded = progress.level * 100;
  const xpProgressPercent = Math.min(100, Math.floor((progress.xp / xpNeeded) * 100));
  const completedQuestCount = quests.filter((q) => progress.completedQuests.includes(q.id) || q.completed).length;

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateNickname(tempName.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profiling and level board */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl border-b-8 border-indigo-800 relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="flex items-center gap-4 text-left w-full md:w-auto z-10">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-yellow-400 flex items-center justify-center text-4xl shadow-lg">
            {progress.selectedMascot === 'tico' ? '🤖' : '👩‍🚀'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {editingName ? (
                <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/20">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-transparent border-none text-white font-black text-sm focus:outline-none w-28 md:w-40"
                  />
                  <button onClick={handleSaveName} className="p-1 hover:bg-white/20 rounded cursor-pointer" title="Guardar">
                    <Save className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black tracking-tight font-display">{progress.nickname}</h2>
                  <button onClick={() => setEditingName(true)} className="text-[10px] bg-white/20 hover:bg-white/30 border border-white/30 px-2 py-0.5 rounded-md font-black cursor-pointer uppercase tracking-wider">
                    Editar
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-indigo-100 font-extrabold uppercase tracking-wide">Astronauta de Informática Escolar</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">NÍVEL {progress.level}</span>
              <span className="text-xs text-indigo-200 font-bold">{progress.xp} / {xpNeeded} XP</span>
            </div>
          </div>
        </div>

        {/* Dynamic XP Progress Line */}
        <div className="w-full md:w-80 space-y-1.5 text-left text-xs bg-indigo-950/40 p-4 rounded-2xl border-2 border-indigo-500/50 z-10">
          <div className="flex justify-between font-black text-white uppercase tracking-wider">
            <span>Experiência:</span>
            <span>{xpProgressPercent}%</span>
          </div>
          <div className="w-full bg-indigo-950/60 rounded-full h-3 overflow-hidden border border-indigo-900/40">
            <div className="bg-yellow-400 h-full transition-all duration-500 rounded-full" style={{ width: `${xpProgressPercent}%` }}></div>
          </div>
          <p className="text-[10px] text-indigo-200 font-bold italic leading-none pt-0.5">Próximo Nível necessita de mais {xpNeeded - progress.xp} XP!</p>
        </div>
      </div>

      {/* Mascot Bubble feedback */}
      <MascotSpeechBubble
        mascotId={progress.selectedMascot}
        text={`Olá, amigo ${progress.nickname}! Estás com um progresso maravilhoso! Já concluíste ${completedQuestCount} metas da planificação anual de TIC. Explora os jogos e ganha medalhas!`}
        expression={completedQuestCount > 0 ? 'victory' : 'happy'}
      />

      {/* Grid of badges and Goals/Quests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* BADGES GALLERY CARD (Left side) */}
        <div className="col-span-1 md:col-span-2 card-geom-flat border-2 border-slate-100 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 uppercase tracking-tight font-display">
              <Trophy className="w-5 h-5 text-yellow-500" /> Medalhas Desbloqueadas ({progress.earnedBadges.length}/{badges.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const isEarned = progress.earnedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center min-h-[145px] relative ${
                    isEarned
                      ? 'border-yellow-400 border-b-6 bg-yellow-50/50 shadow-md'
                      : 'border-slate-100 bg-slate-50/50 opacity-40'
                  }`}
                >
                  <div className="text-4xl">
                    {badge.id === 'defensor_dados' ? '🛡️' : badge.id === 'mestre_investigador' ? '🔍' : badge.id === 'mestre_inovacao' ? '🤖' : badge.id === 'gladiador_tic' ? '⚔️' : '🚀'}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-800 leading-tight mt-2 font-display">{badge.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold leading-tight">{badge.description}</p>
                  </div>
                  {isEarned && (
                    <span className="absolute top-2 right-2 text-[9px] bg-yellow-400 text-yellow-950 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90 border border-yellow-500">
                      Ganho!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CURRICULUM METAS QUESTS LIST (Right card) */}
        <div className="col-span-1 card-geom-flat border-2 border-slate-100 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 uppercase tracking-tight font-display">
              <BookMarked className="w-5 h-5 text-indigo-500" /> Metas de Aprendizagem
            </h3>
          </div>

          <p className="text-slate-400 text-[10px] leading-tight font-bold uppercase tracking-wider">As metas da tua escola EB de Piscinas e as aprendizagens essenciais de TIC:</p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {quests.map((quest) => {
              const isFinished = progress.completedQuests.includes(quest.id) || quest.completed;

              return (
                <div key={quest.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 border-b-4 space-y-1 relative">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-black text-xs text-slate-700 leading-tight font-display">
                      {quest.title}
                    </h4>
                    {isFinished ? (
                      <span className="text-xs text-emerald-500 shrink-0">✔️</span>
                    ) : (
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded font-black shrink-0">+{quest.rewardXp} XP</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-tight">{quest.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FOOTER CONTROLS (RESET / DISCHARGE Standalone Webpage) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 border-b-8 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left shadow-xl">
        <div>
          <h4 className="font-black text-sm text-slate-800 flex items-center gap-1 uppercase tracking-tight font-display">
            <Download className="w-4 h-4 text-indigo-600" /> Exportar para GitHub Pages
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-semibold leading-tight">
            Descarrega a aplicação inteira num único ficheiro <strong className="text-slate-700">index.html</strong> ultra-rápido para publicar diretamente online sem compilação!
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onResetProgress}
            className="px-4 py-2 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border-b-4 active:translate-y-0.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpar Dados
          </button>
          <button
            onClick={onTriggerDownloadHtml}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-2 border-emerald-400 border-b-6 shadow-md active:translate-y-0.5"
          >
            Descarregar index.html Autónomo 📥
          </button>
        </div>
      </div>
    </div>
  );
};
