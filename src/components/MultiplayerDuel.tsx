/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, Trophy, Users, Sword, Swords, RotateCcw } from 'lucide-react';

interface MultiplayerDuelProps {
  onRegisterWin: () => void;
}

interface Player {
  name: string;
  avatar: string;
  points: number;
}

const DUEL_QUESTIONS = [
  {
    question: 'Se recebes uma mensagem suspeita de alguém desconhecido a pedir o teu número de telemóvel para dar recompensas num jogo, o que deves fazer?',
    options: [
      'Dar logo o telemóvel para não perder os prémios grátis.',
      'Ignorar a mensagem e avisar imediatamente o teu professor ou encarregado de educação.',
      'Partilhar com os teus colegas de turma em grupos públicos.'
    ],
    correct: 1,
    points: 15,
  },
  {
    question: 'Para encontrar um documento específico na Web que contenha obrigatoriamente duas palavras-chave "Segurança" e "Internet", qual operador deves usar entre elas?',
    options: [
      'Operador OR',
      'Operador NOT',
      'Operador AND'
    ],
    correct: 2,
    points: 15,
  },
  {
    question: 'Numa folha de cálculo Excel ou Google Sheets, qual é o símbolo obrigatório que deves escrever antes de iniciar qualquer fórmula?',
    options: [
      'O sinal de igual ( = )',
      'A palavra "Fórmula:"',
      'O sinal de somatório ( + )'
    ],
    correct: 0,
    points: 15,
  },
  {
    question: 'O que representa o conceito de "Internet das Coisas" (IoT) no domínio tecnológico das comunicações?',
    options: [
      'Ligar objetos do dia a dia (como lâmpadas ou sensores) à Internet para recolha e troca de dados.',
      'Um motor de pesquisa secreto feito por faraós.',
      'Partilhar publicidade não solicitada por e-mail.'
    ],
    correct: 0,
    points: 15,
  },
  {
    question: 'A Teca quer usar uma imagem criativa recolhida do Google num projeto escolar. Que licença permite isso livremente, desde que atribua autoria e não faça comércio?',
    options: [
      'Copyright (Todos os direitos reservados estritamente)',
      'Creative Commons com restrição BY-NC (Atribuição, Não Comercial)',
      'Nenhum tipo de licença.'
    ],
    correct: 1,
    points: 15,
  },
];

// Helper to play synthesized chiptune arcade sounds using Web Audio API
const playTune = (type: 'win' | 'lose' | 'click') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'lose') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(147, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    // Audio engine blocked or not supported
  }
};

export const MultiplayerDuel: React.FC<MultiplayerDuelProps> = ({ onRegisterWin }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'round_feedback' | 'ended'>('lobby');
  
  // Players configuration
  const [p1Name, setP1Name] = useState('Jogador 1');
  const [p1Mascot, setP1Mascot] = useState('🤖');
  const [p2Name, setP2Name] = useState('Jogador 2');
  const [p2Mascot, setP2Mascot] = useState('👩‍🚀');

  const [p1Points, setP1Points] = useState(0);
  const [p2Points, setP2Points] = useState(0);

  const [currentRound, setCurrentRound] = useState(0);
  const [activeTurn, setActiveTurn] = useState<1 | 2>(1); // Player whose turn it is to answer

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const startDuel = () => {
    setActiveTurn(1);
    setCurrentRound(0);
    setP1Points(0);
    setP2Points(0);
    setGameState('playing');
    playTune('click');
  };

  const handleOptionClick = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    
    const correctIdx = DUEL_QUESTIONS[currentRound].correct;
    const correct = optIdx === correctIdx;
    setIsAnswerCorrect(correct);

    if (correct) {
      playTune('win');
      if (activeTurn === 1) {
        setP1Points(prev => prev + DUEL_QUESTIONS[currentRound].points);
      } else {
        setP2Points(prev => prev + DUEL_QUESTIONS[currentRound].points);
      }
    } else {
      playTune('lose');
    }

    setGameState('round_feedback');
  };

  const nextTurn = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);

    if (activeTurn === 1) {
      setActiveTurn(2);
      setGameState('playing');
    } else {
      // Completed a full round of two turns
      if (currentRound < DUEL_QUESTIONS.length - 1) {
        setCurrentRound(prev => prev + 1);
        setActiveTurn(1);
        setGameState('playing');
      } else {
        // Match ended! Register win
        onRegisterWin();
        setGameState('ended');
      }
    }
  };

  const currentQuestion = DUEL_QUESTIONS[currentRound];
  const activePlayerName = activeTurn === 1 ? p1Name : p2Name;
  const activePlayerAvatar = activeTurn === 1 ? p1Mascot : p2Mascot;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-3xl border-3 border-pink-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <Swords className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Duelo de Saberes Multiplayer</h2>
            <p className="text-gray-600 text-sm font-medium">Competição Saudável - Desafia um colega no mesmo computador!</p>
          </div>
        </div>
      </div>

      {/* LOBBY AREA */}
      {gameState === 'lobby' && (
        <div className="bg-white rounded-3xl border-3 border-gray-100 p-8 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="text-6xl animate-pulse">🥊</div>
          <h3 className="text-2xl font-extrabold text-gray-800">Criam a Vossa Arena Escolar</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Escrevam os vossos nomes e escolham o vosso herói TIC para iniciarem um questionário duelista de 5 rondas!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Player 1 Box */}
            <div className="bg-indigo-50/50 p-5 rounded-2xl border-2 border-indigo-100 space-y-3 text-left">
              <label className="text-xs font-black text-indigo-700 uppercase">Nickname Jogador 1</label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full text-sm font-bold bg-white border-2 border-indigo-100 p-2.5 rounded-xl focus:border-indigo-400 focus:outline-none"
              />
              <div className="flex justify-around pt-2">
                {['🤖', '🦖', '😼', '🐼'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setP1Mascot(emoji)}
                    className={`text-2xl p-2 rounded-xl border-2 transition-all cursor-pointer ${p1Mascot === emoji ? 'border-indigo-500 bg-white shadow scale-110' : 'border-transparent'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 Box */}
            <div className="bg-rose-50/50 p-5 rounded-2xl border-2 border-rose-100 space-y-3 text-left">
              <label className="text-xs font-black text-rose-700 uppercase">Nickname Jogador 2</label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full text-sm font-bold bg-white border-2 border-rose-100 p-2.5 rounded-xl focus:border-rose-400 focus:outline-none"
              />
              <div className="flex justify-around pt-2">
                {['👩‍🚀', '🦄', '🦊', '🐨'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setP2Mascot(emoji)}
                    className={`text-2xl p-2 rounded-xl border-2 transition-all cursor-pointer ${p2Mascot === emoji ? 'border-rose-500 bg-white shadow scale-110' : 'border-transparent'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startDuel}
            className="w-full max-w-sm py-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-102 transition-all text-white font-black text-lg rounded-2xl shadow-md cursor-pointer"
          >
            Iniciar Combate de TIC! 💥
          </button>
        </div>
      )}

      {/* GAME arena running layout */}
      {(gameState === 'playing' || gameState === 'round_feedback') && (
        <div className="bg-white rounded-3xl border-3 border-gray-100 p-6 shadow-md text-left space-y-6">
          
          {/* Top scoreboard header panel */}
          <div className="grid grid-cols-3 items-center py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4">
            {/* Player 1 info */}
            <div className="text-center font-bold">
              <span className="text-3xl block">{p1Mascot}</span>
              <span className="text-xs text-gray-800 break-words">{p1Name}</span>
              <span className="text-sm font-black text-indigo-600 block">{p1Points} Pts</span>
            </div>

            {/* Versus mid logo */}
            <div className="text-center flex flex-col items-center justify-center">
              <span className="text-xs font-black bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Ronda {currentRound + 1}/5
              </span>
              <span className="text-xs text-gray-400 font-extrabold mt-1">Luta de Cérebros</span>
            </div>

            {/* Player 2 info */}
            <div className="text-center font-bold">
              <span className="text-3xl block">{p2Mascot}</span>
              <span className="text-xs text-gray-800 break-words">{p2Name}</span>
              <span className="text-sm font-black text-rose-600 block">{p2Points} Pts</span>
            </div>
          </div>

          {/* TURN WHO CARD indicator */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center gap-3">
            <span className="text-3xl animate-bounce">{activePlayerAvatar}</span>
            <div>
              <h4 className="text-sm font-black text-indigo-900">Na vez de responder: <span className="text-pink-600 underline">{activePlayerName}</span>!</h4>
              <p className="text-xs text-indigo-700">Analisa com calma a pergunta e clica numa hipótese para responderes.</p>
            </div>
          </div>

          {/* CURRENT QUESTION TEXT AND BLOCKS */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-md text-gray-800">
              {currentRound + 1}. {currentQuestion.question}
            </h3>

            {/* MCQ Options list */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => {
                let btnStyle = "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30";

                if (selectedOption !== null) {
                  if (idx === currentQuestion.correct) {
                    btnStyle = "bg-emerald-500 border-emerald-600 text-white shadow";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-rose-500 border-rose-600 text-white shadow";
                  } else {
                    btnStyle = "opacity-40 border-gray-100 bg-white text-gray-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQuestion.correct && <span>✅</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEEDBACK FOR ACTIVE ROUND */}
          {gameState === 'round_feedback' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
              <p className="text-xs font-semibold text-amber-900">
                {isAnswerCorrect
                  ? `✔️ Resposta correta, ${activePlayerName}! Ganhaste +${DUEL_QUESTIONS[currentRound].points} pontos!`
                  : `❌ Que pena! Resposta errada. Mas não desistas, o conhecimento constrói-se tentando!`}
              </p>
              <button
                onClick={nextTurn}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Continuar Desafio 👉
              </button>
            </div>
          )}

        </div>
      )}

      {/* MATCH END SUMMARY PLATFORM */}
      {gameState === 'ended' && (
        <div className="bg-white rounded-3xl border-3 border-gray-100 p-8 shadow-md text-center max-w-xl mx-auto space-y-6 animate-fade-in">
          <div className="text-7xl animate-bounce">👑</div>
          
          <div>
            <h3 className="text-2xl font-black text-gray-800">Duelo de Saberes Concluído!</h3>
            <p className="text-xs text-gray-400 mt-1">Eis a pontuação final dos duelistas escolares:</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="p-3">
              <span className="text-3xl block">{p1Mascot}</span>
              <span className="text-xs font-extrabold text-gray-600 block leading-tight">{p1Name}</span>
              <span className="text-md font-black text-indigo-600 mt-1 block">{p1Points} Pts</span>
            </div>
            <div className="p-3">
              <span className="text-3xl block">{p2Mascot}</span>
              <span className="text-xs font-extrabold text-gray-600 block leading-tight">{p2Name}</span>
              <span className="text-md font-black text-rose-600 mt-1 block">{p2Points} Pts</span>
            </div>
          </div>

          {/* CROWNING THE WINNER */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            {p1Points === p2Points ? (
              <p className="text-sm font-black text-amber-800">
                🤝 Empate técnico! Ambos demonstraram ser exímios conhecedores de TIC do 9.º Ano! Parabéns aos dois!
              </p>
            ) : (
              <p className="text-sm font-black text-amber-800">
                🎉 O grande vencedor é <span className="underline">{p1Points > p2Points ? p1Name : p2Name}</span>! <br />
                Recebeste a coroa honorífica de Líder Tecnológico Escolar!
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setGameState('lobby')}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Lobby Inicial
            </button>
            <button
              onClick={startDuel}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Revanche Direta!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
