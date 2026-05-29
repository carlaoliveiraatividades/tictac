/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mascot, MascotType } from '../types';
import { ShieldAlert, Sparkles, Smile, Trophy } from 'lucide-react';

export const MASCOTS: Mascot[] = [
  {
    id: 'tico',
    name: 'Tico',
    avatar: '🤖',
    description: 'Um robozinho flutuante super inteligente que adora código, planilhas e novas tecnologias! Sempre pronto para ajudar nas contas e no pensamento computacional.',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-300 hover:bg-indigo-200',
    greeting: 'Olá, explorador! Pronto para comandar robôs e analisar dados comigo? Segue-me para o domínio Criar e Inovar!',
  },
  {
    id: 'teca',
    name: 'Teca',
    avatar: '👩‍🚀',
    description: 'Uma exploradora cibernética destemida que viaja pela Web. Ela conhece todos os caminhos seguros, truques de pesquisa e regras de privacidade online.',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-200',
    greeting: 'Viva! A Internet é um oceano gigante, mas eu ensino-te as melhores estratégias de pesquisa e como navegar de forma super segura!',
  },
];

interface MascotSpeechBubbleProps {
  mascotId: MascotType;
  text: string;
  expression?: 'happy' | 'thinking' | 'warning' | 'victory';
}

export const MascotSpeechBubble: React.FC<MascotSpeechBubbleProps> = ({
  mascotId,
  text,
  expression = 'happy',
}) => {
  const mascot = MASCOTS.find((m) => m.id === mascotId) || MASCOTS[0];

  const getExpressionIcon = () => {
    switch (expression) {
      case 'victory':
        return <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'thinking':
        return <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />;
      default:
        return <Smile className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white/90 backdrop-blur rounded-3xl border-3 border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center text-4xl shadow-inner border-2 border-white relative animate-wiggle">
          {mascot.avatar}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-gray-100">
            {getExpressionIcon()}
          </div>
        </div>
        <span className="mt-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
          {mascot.name}
        </span>
      </div>
      <div className="flex-1 min-w-0 bg-amber-50/50 p-3 rounded-2xl border border-amber-100 relative">
        <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-amber-100 border-b-8 border-b-transparent"></div>
        <p className="text-sm font-medium text-gray-800 leading-relaxed text-left">
          {text}
        </p>
      </div>
    </div>
  );
};
