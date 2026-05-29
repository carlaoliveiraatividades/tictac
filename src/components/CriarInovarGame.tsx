/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MascotSpeechBubble } from './MascotExplorer';
import { Lightbulb, Code2, Play, Power, RotateCcw, Sparkles } from 'lucide-react';

interface CriarInovarGameProps {
  onGainXp: (xp: number, badgeId?: string) => void;
  completedQuests: string[];
  onCompleteQuest: (questId: string) => void;
}

export const CriarInovarGame: React.FC<CriarInovarGameProps> = ({
  onGainXp,
  completedQuests,
  onCompleteQuest,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'robot'>('sheet');
  const [feedback, setFeedback] = useState<string>('Prepara-te para criar! Podes começar a treinar folhas de cálculo ou programar o nosso robot inteligente IoT!');
  const [mascotFace, setMascotFace] = useState<'happy' | 'thinking' | 'warning' | 'victory'>('happy');

  // ==========================================
  // GAME 1: SPREADSHEET CHALLENGE
  // ==========================================
  const [sheetCells, setSheetCells] = useState({
    B2: '150', // Computador 1 Consumo (kWh)
    B3: '120', // Computador 2 Consumo (kWh)
    B4: '210', // Computador 3 Consumo (kWh)
    B5: '',    // TOTAL formula goes here
    B6: '',    // MÉDIA formula goes here
  });

  const [formulaB5Input, setFormulaB5Input] = useState('');
  const [formulaB6Input, setFormulaB6Input] = useState('');
  const [sheetSuccess, setSheetSuccess] = useState(false);

  const checkSpreadsheetFormulas = () => {
    const f5 = formulaB5Input.toUpperCase().replace(/\s/g, '');
    const f6 = formulaB6Input.toUpperCase().replace(/\s/g, '');

    // Accept typical formats: =SOMA(B2:B4), =SOMA(B2;B3;B4), =SUM(B2:B4)
    const isF5Correct = f5 === '=SOMA(B2:B4)' || f5 === '=SOMA(B2;B3;B4)' || f5 === '=SUM(B2:B4)';
    const isF6Correct = f6 === '=MÉDIA(B2:B4)' || f6 === '=MEDIA(B2:B4)' || f6 === '=AVERAGE(B2:B4)';

    if (isF5Correct && isF6Correct) {
      setSheetCells(prev => ({
        ...prev,
        B5: '480',
        B6: '160'
      }));
      setSheetSuccess(true);
      onGainXp(40);
      setFeedback('Sensacional! Escreveste as fórmulas perfeitamente! Nota como as planilhas poupam tempo na análise de dados!');
      setMascotFace('victory');
    } else {
      setFeedback('Quase lá! Lembra-te de usar as fórmulas em português: =SOMA(B2:B4) para faturar e =MÉDIA(B2:B4) para calcular a média!');
      setMascotFace('warning');
    }
  };

  const resetSheet = () => {
    setSheetCells({
      B2: '150',
      B3: '120',
      B4: '210',
      B5: '',
      B6: '',
    });
    setFormulaB5Input('');
    setFormulaB6Input('');
    setSheetSuccess(false);
    setFeedback('Planilha de consumo limpa!');
    setMascotFace('happy');
  };

  // ==========================================
  // GAME 2: IOT BLOCK ROBOT CODING
  // ==========================================
  // 5x5 Grid. Robot starting at cell 0,0, target IoT chip at cell 3,3.
  const [robotPos, setRobotPos] = useState({ row: 0, col: 0, dir: 'EAST' }); // EAST, SOUTH, WEST, NORTH
  const [botCommands, setBotCommands] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [robotSuccess, setRobotSuccess] = useState(false);
  const [gridItems, setGridItems] = useState([
    { row: 0, col: 0, type: 'start' },
    { row: 1, col: 1, type: 'obstacle' },
    { row: 2, col: 3, type: 'obstacle' },
    { row: 3, col: 1, type: 'obstacle' },
    { row: 3, col: 3, type: 'chip' }, // Target sensor chip!
  ]);

  const addCommand = (cmd: string) => {
    if (isRunning) return;
    if (botCommands.length >= 10) {
      setFeedback('O buffer de memória do Robô está cheio! (Máx. 10 comandos)');
      return;
    }
    setBotCommands(prev => [...prev, cmd]);
    setFeedback(`Adicionado: ${cmd === 'FORWARD' ? 'Avançar' : cmd === 'TURN_LEFT' ? 'Rodar à Esquerda ↺' : cmd === 'TURN_RIGHT' ? 'Rodar à Direita ↻' : 'Ativar Sensor IoT 📡'}`);
  };

  const clearRobotCommands = () => {
    setBotCommands([]);
    setRobotPos({ row: 0, col: 0, dir: 'EAST' });
    setIsRunning(false);
    setRobotSuccess(false);
    setFeedback('Fila de comandos limpa!');
    setMascotFace('happy');
  };

  const getNextDir = (currentDir: string, turn: 'LEFT' | 'RIGHT') => {
    const dirs = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    let idx = dirs.indexOf(currentDir);
    if (turn === 'LEFT') {
      idx = (idx - 1 + 4) % 4;
    } else {
      idx = (idx + 1) % 4;
    }
    return dirs[idx];
  };

  const runRobotCode = async () => {
    if (botCommands.length === 0) {
      setFeedback('Adiciona pelo menos um comando à fila de execução do Robô!');
      return;
    }
    setIsRunning(true);
    setFeedback('🤖 Tico em movimento inicializando o plano...');
    setMascotFace('thinking');

    let currentPos = { row: 0, col: 0, dir: 'EAST' };
    setRobotPos(currentPos);

    for (let i = 0; i < botCommands.length; i++) {
      const cmd = botCommands[i];

      // Delay between robot actions (800ms)
      await new Promise(resolve => setTimeout(resolve, 800));

      if (cmd === 'FORWARD') {
        const nextPos = { ...currentPos };
        if (currentPos.dir === 'EAST') nextPos.col += 1;
        else if (currentPos.dir === 'SOUTH') nextPos.row += 1;
        else if (currentPos.dir === 'WEST') nextPos.col -= 1;
        else if (currentPos.dir === 'NORTH') nextPos.row -= 1;

        // Check grid boundary & obstacle hits
        const isObstacle = gridItems.some(item => item.row === nextPos.row && item.col === nextPos.col && item.type === 'obstacle');
        const outOfBounds = nextPos.row < 0 || nextPos.row >= 5 || nextPos.col < 0 || nextPos.col >= 5;

        if (outOfBounds || isObstacle) {
          setFeedback('🚨 BATESTE! O robô colidiu e parou para fusão de segurança. Tenta uma nova rota!');
          setMascotFace('warning');
          setIsRunning(false);
          return;
        }
        currentPos = nextPos;
        setRobotPos(currentPos);
      } else if (cmd === 'TURN_LEFT') {
        currentPos.dir = getNextDir(currentPos.dir, 'LEFT');
        setRobotPos({ ...currentPos });
      } else if (cmd === 'TURN_RIGHT') {
        currentPos.dir = getNextDir(currentPos.dir, 'RIGHT');
        setRobotPos({ ...currentPos });
      } else if (cmd === 'ACTIVATE_SENSOR') {
        // Must activate on the chip target (3, 3)
        if (currentPos.row === 3 && currentPos.col === 3) {
          setRobotSuccess(true);
          onGainXp(60, 'mestre_inovacao');
          onCompleteQuest('criar_inovar_champion');
          setFeedback('📡 INCRÍVEL! Sensor ativado com sucesso! Carregaste dados do micro-processador para o servidor escolar!');
          setMascotFace('victory');
          setIsRunning(false);
          return;
        } else {
          setFeedback('📡 Tentaste carregar o sensor, mas não estás na casa do chip IoT (3,3)!');
          setMascotFace('warning');
          setIsRunning(false);
          return;
        }
      }
    }

    setIsRunning(false);
    if (currentPos.row === 3 && currentPos.col === 3) {
      setFeedback('Chegaste ao chip IoT! Mas esqueceste-te de programar o bloco "Ativar Sensor" no fim da viagem!');
    } else {
      setFeedback('O código terminou mas o robô não chegou à coordenda do sensor (3,3) ou não ativou o sensor.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 border-b-8 flex items-center justify-between shadow-xl flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl border-2 border-indigo-300">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div className="font-display">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Criar e Inovar (IoT & Ferramentas)</h2>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Pensamento Computacional - Formula planilhas e programa robótica!</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 border-2 border-slate-200 shrink-0">
          <button
            onClick={() => { setActiveTab('sheet'); setFeedback('Usa fórmulas como =SOMA e =MÉDIA para processar o consumo de eletricidade da escola!'); }}
            className={`px-4 py-2 font-black text-xs rounded-xl transition-all cursor-pointer border-b-4 ${
              activeTab === 'sheet'
                ? 'bg-indigo-600 text-white border-indigo-800'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm'
            }`}
          >
            Planilha 📊
          </button>
          <button
            onClick={() => { setActiveTab('robot'); setFeedback('Usa blocos lógicos estruturados para programar o Tico a chegar à torre de sensores no ponto (3,3)!'); }}
            className={`px-4 py-2 font-black text-xs rounded-xl transition-all cursor-pointer border-b-4 ${
              activeTab === 'robot'
                ? 'bg-indigo-600 text-white border-indigo-800'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm'
            }`}
          >
            IoT & Robôs 🤖
          </button>
        </div>
      </div>

      {/* Mascot Bubble */}
      <MascotSpeechBubble mascotId="tico" text={feedback} expression={mascotFace} />

      {/* Main Playable Board */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 border-b-8 p-6 shadow-xl min-h-[380px] text-left">
        {activeTab === 'sheet' ? (
          /* SHEET SIMULATOR */
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-display">
                📊 Desafio 1: Eficiência Energética computacional
              </span>
              <span className="text-xs font-bold text-slate-400 font-display">Microsoft Sheets / Excel Sim</span>
            </div>

            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
              Temos um conjunto de dados do consumo energético diário dos computadores do laboratório escolar de TIC. Escreve as fórmulas corretas no formulário para efetuar a <strong>SOMA</strong> de energia e a <strong>MÉDIA</strong> aritmética do consumo!
            </p>

            {/* Simulating Excel Sheet */}
            <div className="overflow-x-auto border-2 border-slate-200 rounded-2xl shadow-inner">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-xs font-black text-slate-600 uppercase">
                    <th className="py-2.5 border-r border-slate-205 w-16">#</th>
                    <th className="py-2.5 border-r border-slate-205">A (Dispositivo)</th>
                    <th className="py-2.5">B (Consumo em kWh)</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 font-extrabold">
                  <tr className="border-b border-slate-200">
                    <td className="py-2 border-r border-slate-200 bg-slate-50 font-black">2</td>
                    <td className="py-2 border-r border-slate-200 text-left px-4">Computador Professor</td>
                    <td className="py-2">{sheetCells.B2}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 border-r border-slate-200 bg-slate-50 font-black">3</td>
                    <td className="py-2 border-r border-slate-200 text-left px-4">Computador Aluno 01</td>
                    <td className="py-2">{sheetCells.B3}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 border-r border-slate-200 bg-slate-50 font-black">4</td>
                    <td className="py-2 border-r border-slate-200 text-left px-4">Computador Aluno 02</td>
                    <td className="py-2">{sheetCells.B4}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-indigo-50/20">
                    <td className="py-2 border-r border-slate-200 bg-indigo-50/50 text-indigo-950 font-black font-display">5</td>
                    <td className="py-2 border-r border-slate-200 text-left px-4 font-black text-indigo-950">CONSUMO TOTAL</td>
                    <td className="py-2 text-indigo-605 font-black font-display">
                      {sheetCells.B5 ? sheetCells.B5 : <span className="text-slate-400 font-semibold italic">Fórmula em falta</span>}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/20">
                    <td className="py-2 border-r border-slate-200 bg-emerald-50/50 text-emerald-950 font-black font-display">6</td>
                    <td className="py-2 border-r border-slate-200 text-left px-4 font-black text-emerald-950">CONSUMO MÉDIO</td>
                    <td className="py-2 text-emerald-600 font-black font-display">
                      {sheetCells.B6 ? sheetCells.B6 : <span className="text-slate-400 font-semibold italic">Fórmula em falta</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Formulas interactive Form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider font-display">Fórmula para TOTAL (Célula B5)</label>
                <input
                  type="text"
                  placeholder="EX: =SOMA(B2:B4)"
                  disabled={sheetSuccess}
                  value={formulaB5Input}
                  onChange={(e) => setFormulaB5Input(e.target.value)}
                  className="w-full text-sm font-mono border-2 border-slate-200 border-b-4 focus:border-indigo-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-350"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider font-display">Fórmula para MÉDIA (Célula B6)</label>
                <input
                  type="text"
                  placeholder="EX: =MÉDIA(B2:B4)"
                  disabled={sheetSuccess}
                  value={formulaB6Input}
                  onChange={(e) => setFormulaB6Input(e.target.value)}
                  className="w-full text-sm font-mono border-2 border-slate-200 border-b-4 focus:border-indigo-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-350"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={resetSheet}
                className="px-4 py-2 border-2 border-slate-200 border-b-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold rounded-xl text-xs uppercase cursor-pointer active:translate-y-0.5"
              >
                Reset
              </button>
              <button
                onClick={checkSpreadsheetFormulas}
                disabled={sheetSuccess}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase border-b-4 border-indigo-800 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                Executar Fórmulas! ⚡
              </button>
            </div>
          </div>
        ) : (
          /* IoT CODE ROBOT */
          <div className="space-y-6 animate-fade-in font-display">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-display">
                🤖 Desafio 2: Carregar Sensor IoT Inteligente
              </span>
              <span className="text-xs font-bold text-slate-400">Computational Thinking & IoT</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Grid map (Left side) */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="grid grid-cols-5 gap-2 p-4 bg-slate-100 rounded-3xl border-2 border-slate-200 shadow-inner w-full max-w-[320px]">
                  {Array.from({ length: 5 }).map((_, rIdx) => (
                    Array.from({ length: 5 }).map((_, cIdx) => {
                      const isRobot = robotPos.row === rIdx && robotPos.col === cIdx;
                      const matchedItem = gridItems.find(item => item.row === rIdx && item.col === cIdx);

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`aspect-square rounded-xl flex items-center justify-center text-xl relative transition-all border-2 border-b-4 duration-300 ${
                            isRobot
                              ? 'bg-indigo-600 text-white scale-102 border-indigo-800'
                              : matchedItem?.type === 'obstacle'
                              ? 'bg-rose-100 text-gray-650 border-rose-300 font-bold text-xs'
                              : matchedItem?.type === 'chip'
                              ? 'bg-amber-100 text-amber-600 border-amber-300'
                              : 'bg-white text-slate-350 border-slate-150'
                          }`}
                        >
                          {isRobot ? (
                            <span className="leading-none transform animate-pulse font-black text-sm">
                              {robotPos.dir === 'EAST' ? '➡️🤖' : robotPos.dir === 'SOUTH' ? '⬇️🤖' : robotPos.dir === 'WEST' ? '⬅️🤖' : '⬆️🤖'}
                            </span>
                          ) : matchedItem?.type === 'obstacle' ? (
                            '🧱'
                          ) : matchedItem?.type === 'chip' ? (
                            '📡'
                          ) : (
                            <span className="text-[9px] text-slate-300 font-semibold">{rIdx},{cIdx}</span>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              {/* Logical Stack and actions (Right side) */}
              <div className="w-full lg:w-1/2 space-y-4 text-left">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 font-display">Comandos da Máquina (+):</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isRunning}
                      onClick={() => addCommand('FORWARD')}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-705 border-2 border-slate-200 border-b-4 text-xs font-black rounded-xl cursor-pointer active:translate-y-0.5"
                    >
                      Avançar 1 Casa
                    </button>
                    <button
                      disabled={isRunning}
                      onClick={() => addCommand('TURN_LEFT')}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-705 border-2 border-slate-200 border-b-4 text-xs font-black rounded-xl cursor-pointer active:translate-y-0.5"
                    >
                      Rodar à Esquerda ↺
                    </button>
                    <button
                      disabled={isRunning}
                      onClick={() => addCommand('TURN_RIGHT')}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-705 border-2 border-slate-200 border-b-4 text-xs font-black rounded-xl cursor-pointer active:translate-y-0.5"
                    >
                      Rodar à Direita ↻
                    </button>
                    <button
                      disabled={isRunning}
                      onClick={() => addCommand('ACTIVATE_SENSOR')}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 border-b-4 text-xs font-black rounded-xl cursor-pointer active:translate-y-0.5"
                    >
                      📡 Ativar Sensor
                    </button>
                  </div>
                </div>

                {/* Queue Display */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 font-display">Blocos Lógicos de Execução:</h4>
                  <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 min-h-[50px] flex flex-wrap gap-1.5">
                    {botCommands.length === 0 ? (
                      <span className="text-slate-400 text-[10px] italic font-semibold">Empilha comandos para o motor de IoT correr a rotina...</span>
                    ) : (
                      botCommands.map((cmd, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1.5 rounded-md border-b-2 border-indigo-805"
                        >
                          {idx + 1}. {cmd}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    disabled={isRunning}
                    onClick={clearRobotCommands}
                    className="p-2.5 border-2 border-slate-200 border-b-4 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer active:translate-y-0.5"
                    title="Limpar Programa"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    disabled={isRunning}
                    onClick={runRobotCode}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase border-b-4 border-emerald-700 active:translate-y-0.5 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Carregar Programa !
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
