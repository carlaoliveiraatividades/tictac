/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MascotSpeechBubble } from './MascotExplorer';
import { Search, Compass, BookOpen, AlertCircle, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

interface PesquisaGameProps {
  onGainXp: (xp: number, badgeId?: string) => void;
  completedQuests: string[];
  onCompleteQuest: (questId: string) => void;
}

export const PesquisaGame: React.FC<PesquisaGameProps> = ({
  onGainXp,
  completedQuests,
  onCompleteQuest,
}) => {
  const [stage, setStage] = useState<'intro' | 'operators' | 'fakenews' | 'finished'>('intro');
  const [feedback, setFeedback] = useState<string>('Boas-vindas ao laboratório dos segredos da Web! Vamos aprender a pesquisar como verdadeiros cientistas de informática!');
  const [mascotFace, setMascotFace] = useState<'happy' | 'thinking' | 'warning' | 'victory'>('happy');

  // Stage 1: Build search query
  const queryBlocks = [
    { text: '"Inteligência Artificial"', type: 'term' },
    { text: 'AND', type: 'operator' },
    { text: '"Medicina"', type: 'term' },
    { text: 'NOT', type: 'operator' },
    { text: '"Robótica Militar"', type: 'term' },
    { text: 'OR', type: 'operator' },
    { text: '"Receitas de Bolos"', type: 'term' },
  ];

  const [constructedQuery, setConstructedQuery] = useState<string[]>([]);

  // Stage 2: Fake News Detector
  const newsItems = [
    {
      id: 'news1',
      title: '🚨 EXCLUSIVO: Robôs substituem TODOS os professores nas escolas já no próximo mês!',
      preview: 'Um boato viral no TikTok alega que o Governo de Portugal comprou 50.000 robôs voadores automáticos programados com IA para ensinar matemática e português. O artigo não cita fontes oficiais nem apresenta assinaturas.',
      tone: 'Dramático, assustador, com muitos pontos de exclamação.',
      source: 'Blog desconhecido de teorias de conspiração "VerdadeSecularBlog".',
      isFake: true,
      explanation: 'Esta notícia é Falsa (Fake News). Apresenta um tom alarmista, não cita fontes oficiais (como o Ministério da Educação) e o autor é anónimo.',
    },
    {
      id: 'news2',
      title: 'Estudo universitário indica que uso ético de tecnologias emergentes apoia os alunos na escrita.',
      preview: 'Um relatório publicado pela Universidade de Coimbra detalha como aplicações educativas interativas de linguagem ajudam no desenvolvimento de competências de ortografia no 3.º ciclo de ensino básico.',
      tone: 'Neutro, objetivo e baseado em dados científicos.',
      source: 'Portal de Divulgação Científica da Universidade de Coimbra.',
      isFake: false,
      explanation: 'Esta notícia é Fidedigna (Confiável). Baseia-se num estudo de uma universidade pública fidedigna, expressa o autor académico clara e objectivamente com tom informativo.',
    },
    {
      id: 'news3',
      title: '⚠️ CIENTISTAS EM CHOQUE: Telemóvel secreto do Faraó Ramsés II foi descoberto numa pirâmide!',
      preview: 'Arqueólogos teriam escavado um telemóvel inteligente com ecrã tátil feito de ouro puro de há 3000 anos, com conexões a satélites egípcios de órbita antiga.',
      tone: 'Conspirativo, chamativo, sensacionalista.',
      source: 'Website de fofocas e mistérios extraterrestres.',
      isFake: true,
      explanation: 'Falso por completo. A história viola princípios da física e história arqueológica, as fontes são nulas e o tom visa apenas gerar cliques publicitários fáceis.',
    }
  ];

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<Record<string, 'fake' | 'legit'>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAddBlock = (blockText: string) => {
    if (constructedQuery.length >= 5) {
      setFeedback('O teu motor já tem blocos suficientes. Apaga ou envia se achares que está certo!');
      return;
    }
    setConstructedQuery(prev => [...prev, blockText]);
    setFeedback(`Adicionado: ${blockText}. Continua a construir!`);
  };

  const handleClearQuery = () => {
    setConstructedQuery([]);
    setFeedback('Fórmula limpa! Começa de novo a arrastar os teus termos.');
    setMascotFace('thinking');
  };

  const checkQueryFormula = () => {
    const finalString = constructedQuery.join(' ');
    // Correct string should contain "Inteligência Artificial", AND/or, Medicine, NOT, "Robótica militar"
    const isCorrect = 
      constructedQuery.includes('"Inteligência Artificial"') &&
      constructedQuery.includes('AND') &&
      constructedQuery.includes('"Medicina"') &&
      constructedQuery.includes('NOT') &&
      constructedQuery.includes('"Robótica Militar"');

    if (isCorrect) {
      onGainXp(35);
      setFeedback('Excelente pesquisa! Utilizaste os operadores lógicos booleanos perfeitos para filtrar os resultados exatos!');
      setMascotFace('victory');
      setTimeout(() => {
        setStage('fakenews');
        setFeedback('Bem-vindo à redação crítica de TIC! Usa o teu binóculo analítico para avaliar estas três notícias da Web!');
        setMascotFace('happy');
      }, 3500);
    } else {
      setFeedback('Hum, a fórmula não está ideal. Precisamos focar em "Inteligência Artificial" combinada com "Medicina" mas excluindo "Robótica Militar"!');
      setMascotFace('warning');
    }
  };

  const handleEvaluateNews = (choice: 'fake' | 'legit') => {
    const currentNews = newsItems[currentNewsIndex];
    const isCorrect = (choice === 'fake' && currentNews.isFake) || (choice === 'legit' && !currentNews.isFake);
    
    setEvaluatedAnswers(prev => ({ ...prev, [currentNews.id]: choice }));
    setShowExplanation(true);

    if (isCorrect) {
      setFeedback(`Excelente análise de literacia mediática! ${currentNews.explanation}`);
      setMascotFace('happy');
    } else {
      setFeedback(`Atenção às pistas! ${currentNews.explanation}`);
      setMascotFace('warning');
    }
  };

  const nextNews = () => {
    setShowExplanation(false);
    if (currentNewsIndex < newsItems.length - 1) {
      setCurrentNewsIndex(prev => prev + 1);
      setFeedback(`Avalia o próximo caso. Deves olhar para o Autor, a Fonte e o Tom geral do artigo!`);
    } else {
      // Finished all evaluations! Review scores.
      let correctCount = 0;
      newsItems.forEach(item => {
        const choice = evaluatedAnswers[item.id];
        const correct = (choice === 'fake' && item.isFake) || (choice === 'legit' && !item.isFake);
        if (correct) correctCount++;
      });

      if (correctCount === newsItems.length) {
        onGainXp(45, 'mestre_investigador');
        onCompleteQuest('pesquisa_pro');
        setFeedback('Espetacular! Sabes avaliar a qualidade e a credibilidade da informação na Web como ninguém!');
        setMascotFace('victory');
      } else {
        setFeedback(`Desafio concluído! Conseguiste detetar ${correctCount} notícias com precisão.`);
        setMascotFace('happy');
      }
      setTimeout(() => {
        setStage('finished');
      }, 3500);
    }
  };

  const restart = () => {
    setConstructedQuery([]);
    setCurrentNewsIndex(0);
    setEvaluatedAnswers({});
    setShowExplanation(false);
    setStage('intro');
    setMascotFace('happy');
    setFeedback('Fórmula de pesquisa reiniciada. Vamos pesquisar seguros!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 border-b-8 flex items-center gap-4 shadow-xl">
        <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl border-2 border-sky-300">
          <Search className="w-8 h-8 font-extrabold" />
        </div>
        <div className="text-left font-display">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Investigar e Pesquisar Online</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Domínio de Literacia Digital - Define palavras-chave e sê crítico com as fontes!</p>
        </div>
      </div>

      {/* Mascot Guidance */}
      <MascotSpeechBubble mascotId="teca" text={feedback} expression={mascotFace} />

      {/* Game Stage Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 border-b-8 p-6 shadow-xl min-h-[350px] transition-all relative overflow-hidden">
        
        {stage === 'intro' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-fade-in">
            <div className="text-6xl animate-bounce">🔍</div>
            <h3 className="text-2xl font-black text-slate-800 font-display">Indiana Jones da Web</h3>
            <p className="text-slate-500 max-w-md text-sm font-semibold leading-relaxed">
              Descobre técnicas ultra-rápidas para encontrar exatamente o que precisas na Internet usando termos lógicos e aprende os truques secretos para desmascarar notícias falsas!
            </p>
            <button
              onClick={() => {
                setStage('operators');
                setFeedback('Clica nos blocos de termos e operadores para montares um código de pesquisa que encontre "Inteligência Artificial" focado em "Medicina", mas tirando "Robótica militar".');
              }}
              className="px-8 py-4 bg-orange-400 hover:bg-orange-500 text-white font-black text-lg rounded-2xl border-b-6 border-orange-600 shadow-md active:translate-y-1 active:border-b-2 transform transition-all cursor-pointer"
            >
              Iniciar Desafios! (+100 XP)
            </button>
          </div>
        )}

        {stage === 'operators' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-1 font-display">
                <Compass className="w-4 h-4" /> Desafio 1/2: Fórmula de Alta Pesquisa
              </span>
              <span className="text-xs font-bold text-slate-400">Operadores Lógicos Booleanos</span>
            </div>

            <div className="text-slate-600 font-semibold text-sm leading-relaxed bg-sky-50/50 p-4 rounded-2xl border-2 border-sky-100">
              💡 <strong className="text-slate-800 font-black">Regra de Ouro:</strong> Os motores de pesquisa usam operadores especiais. <br />
              - <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200">AND</code> une termos obrigatórios. <br />
              - <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200">NOT</code> remove termos indesejados da pesquisa. <br />
              Clica nos blocos abaixo e constrói a fórmula para pesquisar sobre <strong className="text-slate-800 font-black">Inteligência Artificial</strong> na <strong className="text-slate-800 font-black">Medicina</strong>, excluindo <strong className="text-slate-800 font-black">Robótica Militar</strong>.
            </div>

            {/* Display Area */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[64px] flex flex-wrap items-center gap-2">
              {constructedQuery.length === 0 ? (
                <span className="text-slate-400 text-xs font-bold italic">Clica nos blocos abaixo para iniciar a construção da fórmula...</span>
              ) : (
                constructedQuery.map((word, idx) => (
                  <span
                    key={idx}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black select-none border-b-4 ${
                        word === 'AND' || word === 'NOT' || word === 'OR'
                          ? 'bg-amber-500 text-white border-amber-700'
                          : 'bg-indigo-600 text-white border-indigo-800'
                    }`}
                  >
                    {word}
                  </span>
                ))
              )}
            </div>

            {/* Clickable Blocks */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 font-display">Termos e Conetores Disponíveis:</h4>
              <div className="flex flex-wrap gap-2">
                {queryBlocks.map((block, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddBlock(block.text)}
                    className={`px-4 py-2 font-black text-xs rounded-xl border-2 border-b-4 transition-all cursor-pointer ${
                      block.type === 'operator'
                        ? 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 active:translate-y-0.5'
                        : 'border-indigo-400 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 active:translate-y-0.5'
                    }`}
                  >
                    {block.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={handleClearQuery}
                className="px-4 py-2 border-2 border-slate-200 border-b-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer active:translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Limpar Tudo
              </button>
              <button
                onClick={checkQueryFormula}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase border-b-4 border-indigo-800 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                Testar Pesquisa!
              </button>
            </div>
          </div>
        )}

        {stage === 'fakenews' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-1 font-display">
                <BookOpen className="w-4 h-4" /> Desafio 2/2: Detetor de Fake News
              </span>
              <span className="text-xs font-bold text-slate-400">Notícia {currentNewsIndex + 1} de {newsItems.length}</span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-b-4 border-slate-200 space-y-3">
              <h4 className="text-md font-black text-blue-900 flex items-center gap-2 font-display">
                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                {newsItems[currentNewsIndex].title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed italic font-semibold">
                "{newsItems[currentNewsIndex].preview}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t text-[11px] text-slate-500 font-bold">
                <div>📢 <strong>Fonte alegada:</strong> <span className="text-slate-600 font-extrabold">{newsItems[currentNewsIndex].source}</span></div>
                <div>🗣️ <strong>Tom da escrita:</strong> <span className="text-slate-600 font-extrabold">{newsItems[currentNewsIndex].tone}</span></div>
              </div>
            </div>

            {!showExplanation ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center py-4">
                <button
                  onClick={() => handleEvaluateNews('legit')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-xl border-b-4 border-emerald-700 cursor-pointer shadow flex items-center justify-center gap-1.5 active:translate-y-0.5 transition-all"
                >
                  🟢 Notícia Fidedigna (Verdadeira!)
                </button>
                <button
                  onClick={() => handleEvaluateNews('fake')}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase rounded-xl border-b-4 border-rose-700 cursor-pointer shadow flex items-center justify-center gap-1.5 active:translate-y-0.5 transition-all"
                >
                  🔴 Fake News (Falsa / Conspiração!)
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-100 border-b-4 space-y-4">
                <p className="text-xs text-indigo-900 font-bold">
                  {newsItems[currentNewsIndex].explanation}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={nextNews}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 font-black text-xs uppercase rounded-xl cursor-pointer active:translate-y-0.5"
                  >
                    {currentNewsIndex < newsItems.length - 1 ? 'Próxima Notícia 👉' : 'Concluir Análise 🏁'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'finished' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-fade-in">
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-3xl font-black text-sky-600 font-display">Investigador Concluído!</h3>
            <p className="text-slate-500 max-w-sm text-xs font-semibold leading-relaxed">
              Excelente! Adquiriste competências de Literacia Digital, Pesquisa e Pensamento crítico. De hoje em diante, nenhuma fake news te conseguirá enganar!
            </p>
            {completedQuests.includes('pesquisa_pro') ? (
              <span className="text-xs bg-sky-100 text-sky-800 font-extrabold px-3 py-1 bg-sky-50 rounded-full border border-sky-300">
                ⭐ Medalha Desbloqueada: Mestre Investigador
              </span>
            ) : null}
            <button
              onClick={restart}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black border-2 border-b-4 border-slate-300 rounded-xl text-xs uppercase transition-colors cursor-pointer"
            >
              Reiniciar Simulador 🔄
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
