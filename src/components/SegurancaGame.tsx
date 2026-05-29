/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MascotSpeechBubble } from './MascotExplorer';
import { Shield, ShieldCheck, ShieldAlert, KeyRound, Copyleft, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface SegurancaGameProps {
  onGainXp: (xp: number, badgeId?: string) => void;
  completedQuests: string[];
  onCompleteQuest: (questId: string) => void;
}

export const SegurancaGame: React.FC<SegurancaGameProps> = ({
  onGainXp,
  completedQuests,
  onCompleteQuest,
}) => {
  const [activeStage, setActiveStage] = useState<'intro' | 'permissions' | 'wifi' | 'copyright' | 'finished'>('intro');
  const [feedback, setFeedback] = useState<string>('Olá, comandante de dados! Vamos testar as tuas capacidades de proteção cibernética!');
  const [mascotFace, setMascotFace] = useState<'happy' | 'thinking' | 'warning' | 'victory'>('happy');

  // Stage 1: Permission Management
  const [appPermissions, setAppPermissions] = useState([
    { id: 'cam', name: 'Câmara fotográfica', necessary: true, purpose: 'Tirar fotos com filtros engraçados', granted: null as boolean | null },
    { id: 'storage', name: 'Armazenamento de Ficheiros', necessary: true, purpose: 'Guardar as tuas criações na galeria do telemóvel', granted: null as boolean | null },
    { id: 'contacts', name: 'Lista de Contactos', necessary: false, purpose: 'Partilhar os telemóveis dos teus pais com servidores de publicidade', granted: null as boolean | null },
    { id: 'gps', name: 'Localização GPS exata', necessary: false, purpose: 'Rastrear onde te encontras a cada minuto', granted: null as boolean | null },
    { id: 'mic', name: 'Microfone em segundo plano', necessary: false, purpose: 'Gravar conversas quando o ecrã estiver desligado', granted: null as boolean | null },
  ]);

  // Stage 2: Wi-Fi Evaluator
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);

  // Stage 3: Copyright Matching
  const [copyrightMatches, setCopyrightMatches] = useState([
    { id: 'copyright', title: 'Copyright (Todos os direitos reservados)', desc: 'Nenhuma cópia ou alteração é permitida sem autorização expressa do autor.', matchedWith: null as string | null },
    { id: 'cc', title: 'Creative Commons (CC BY-NC)', desc: 'Permite partilhar e adaptar a obra, desde que dês os créditos e NÃO a vendas.', matchedWith: null as string | null },
    { id: 'pub', title: 'Domínio Público', desc: 'A obra pertence à humanidade. Podes usar, editar e partilhar como desejares!', matchedWith: null as string | null },
  ]);

  const copyrightOptions = [
    { id: 'cc', label: 'Uso Livre não-comercial com créditos ao criador' },
    { id: 'copyright', label: 'Proteção Total e estrita pelo criador original' },
    { id: 'pub', label: 'Livre de direitos de autor, uso universal' },
  ];

  const handlePermissionDecision = (id: string, decision: boolean) => {
    setAppPermissions(prev =>
      prev.map(perm => {
        if (perm.id === id) {
          return { ...perm, granted: decision };
        }
        return perm;
      })
    );
    
    const target = appPermissions.find(p => p.id === id);
    if (target) {
      if (decision === target.necessary) {
        setFeedback(`Excelente escolha! ${decision ? 'Precisamos' : 'Não necessitamos'} de conceder esta permissão de ${target.name}.`);
        setMascotFace('happy');
      } else {
        setFeedback(`Atenção: ${target.necessary ? 'Precisamos' : 'Não devias dar'} acesso à permissão: ${target.name}. ${target.purpose}.`);
        setMascotFace('warning');
      }
    }
  };

  const verifyPermissionsStage = () => {
    const uncompleted = appPermissions.every(p => p.granted !== null);
    if (!uncompleted) {
      setFeedback('Completa todas as tuas decisões sobre as permissões de privacidade primeiro!');
      return;
    }

    const correctCount = appPermissions.filter(p => p.granted === p.necessary).length;
    if (correctCount === appPermissions.length) {
      onGainXp(30);
      setFeedback('Incrível! Protegeste a tua privacidade a 100%! Vamos agora examinar conexões seguras!');
      setMascotFace('victory');
      setTimeout(() => {
        setActiveStage('wifi');
      }, 3000);
    } else {
      setMascotFace('warning');
      setFeedback(`Fizeste algumas escolhas inseguras (${correctCount}/${appPermissions.length} corretas). Revê as decisões de privacidade antes de prosseguir.`);
    }
  };

  const handleWifiChoice = (id: string) => {
    setSelectedWifi(id);
    if (id === 'safe') {
      setFeedback('Muito bem! O EDU_WIFI_SEGURA requer autenticação, cifra os dados e protege a tua navegação.');
      setMascotFace('happy');
    } else if (id === 'public') {
      setFeedback('Cuidado! Redes abertas de café público não barram intrusos. Podem capturar os teus dados.');
      setMascotFace('warning');
    } else {
      setMascotFace('warning');
      setFeedback('Alerta de Perigo! Conexões desconhecidas com ofertas grátis são armadilhas para roubo de senhas!');
    }
  };

  const verifyWifiStage = () => {
    if (!selectedWifi) {
      setFeedback('Escolhe uma rede para te conectares e avançares.');
      return;
    }
    if (selectedWifi === 'safe') {
      onGainXp(30);
      setFeedback('Conectado de forma segura! Desafio concluído! Vamos agora falar sobre direitos de autor.');
      setMascotFace('victory');
      setTimeout(() => {
        setActiveStage('copyright');
      }, 3000);
    } else {
      setFeedback('Inseguro! Coneta-te a uma rede Wi-Fi fidedigna e encriptada para prosseguires a tua viagem.');
    }
  };

  const matchCopyright = (licenseId: string, value: string) => {
    setCopyrightMatches(prev =>
      prev.map(item => {
        if (item.id === licenseId) {
          return { ...item, matchedWith: value };
        }
        return item;
      })
    );
  };

  const verifyCopyrightStage = () => {
    const allMatched = copyrightMatches.every(item => item.matchedWith !== null);
    if (!allMatched) {
      setFeedback('Associa todos os três tipos de licenças com os seus significados correctos!');
      return;
    }

    const correct = copyrightMatches.every(item => item.id === item.matchedWith);
    if (correct) {
      onGainXp(40, 'defensor_dados');
      onCompleteQuest('seguranca_hero');
      setFeedback('Espetacular! Sabes identificar Copyright, Creative Commons e Domínio Público na perfeição!');
      setMascotFace('victory');
      setTimeout(() => {
        setActiveStage('finished');
      }, 3000);
    } else {
      setMascotFace('warning');
      setFeedback('Algumas correspondências de direitos de autor estão incorretas. Tenta novamente para aprender as regras!');
    }
  };

  const restartGame = () => {
    setAppPermissions(prev => prev.map(p => ({ ...p, granted: null })));
    setCopyrightMatches(prev => prev.map(p => ({ ...p, matchedWith: null })));
    setSelectedWifi(null);
    setActiveStage('intro');
    setMascotFace('happy');
    setFeedback('Reiniciaste a simulação de segurança. Prepara-te!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 border-b-8 flex items-center gap-4 shadow-xl">
        <div className="p-3 bg-red-100 text-red-600 rounded-2xl border-2 border-red-300">
          <Shield className="w-8 h-8" />
        </div>
        <div className="text-left font-display">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Segurança, Responsabilidade e Respeito</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Domínio Transversal TIC - Adota uma conduta crítica e segura online!</p>
        </div>
      </div>

      {/* Mascot Guidance */}
      <MascotSpeechBubble mascotId="teca" text={feedback} expression={mascotFace} />

      {/* Game Stage Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 border-b-8 p-6 shadow-xl min-h-[350px] transition-all relative overflow-hidden">
        
        {activeStage === 'intro' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in text-center">
            <div className="text-6xl animate-bounce">🛡️</div>
            <h3 className="text-2xl font-black text-slate-800 font-display">Ciber-Explorador de Segurança</h3>
            <p className="text-slate-500 max-w-md font-semibold leading-relaxed">
              Aprende a proteger os teus dispositivos móveis, a configurar permissões de aplicações de forma autónoma e a respeitar os direitos de autor das tuas publicações digitais!
            </p>
            <button
              onClick={() => {
                setActiveStage('permissions');
                setFeedback('Tens à tua frente uma aplicação de câmara-selfie "FiltroFixe". Decide se as permissões que ela pede são razoáveis ou abusivas!');
              }}
              className="px-8 py-4 bg-orange-400 hover:bg-orange-500 text-white font-black text-lg rounded-2xl border-b-6 border-orange-600 shadow-md active:translate-y-1 active:border-b-2 transform transition-all cursor-pointer"
            >
              Iniciar Desafios! (+100 XP)
            </button>
          </div>
        )}

        {activeStage === 'permissions' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1 font-display">
                <CheckCircle2 className="w-4 h-4" /> Desafio 1/3: Painel de Privacidade
              </span>
              <span className="text-xs font-bold text-slate-400">Instalação da App "FiltroFixe"</span>
            </div>

            <p className="text-slate-600 font-semibold text-sm leading-relaxed">
              Esta aplicação de filtros de selfie móvel está a pedir acesso a vários componentes do teu dispositivo. Analisa os pedidos de privacidade criticamente e protege os teus dados!
            </p>

            <div className="space-y-3">
              {appPermissions.map((perm) => (
                <div key={perm.id} className="p-4 rounded-2xl border-2 border-slate-200 border-b-4 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">
                      {perm.id === 'cam' ? '📸' : perm.id === 'storage' ? '💾' : perm.id === 'contacts' ? '👥' : perm.id === 'gps' ? '📍' : '🎙️'}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 flex items-center gap-2 font-display">
                        {perm.name}
                        {perm.necessary ? (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase">Essencial</span>
                        ) : (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-black uppercase">Excessiva</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">Sabor real de utilização: <strong className="text-slate-700">{perm.purpose}</strong></p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handlePermissionDecision(perm.id, true)}
                      className={`px-4 py-2 font-black text-xs rounded-xl border-2 tracking-wider uppercase transition-all cursor-pointer ${
                        perm.granted === true
                          ? 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm'
                          : 'bg-white border-2 border-slate-200 border-b-4 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      Permitir ✔️
                    </button>
                    <button
                      onClick={() => handlePermissionDecision(perm.id, false)}
                      className={`px-4 py-2 font-black text-xs rounded-xl border-2 tracking-wider uppercase transition-all cursor-pointer ${
                        perm.granted === false
                          ? 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm'
                          : 'bg-white border-2 border-slate-200 border-b-4 text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      Negar ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveStage('intro')}
                className="px-4 py-2 border-2 border-slate-200 border-b-4 hover:bg-slate-50 text-slate-500 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={verifyPermissionsStage}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase border-b-4 border-indigo-800 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                Verificar Permissões
              </button>
            </div>
          </div>
        )}

        {activeStage === 'wifi' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1 font-display">
                <AlertTriangle className="w-4 h-4" /> Desafio 2/3: Avaliação de Redes Wi-Fi
              </span>
              <span className="text-xs font-bold text-slate-400">Ao ar livre numa Biblioteca municipal</span>
            </div>

            <p className="text-slate-600 font-semibold text-sm leading-relaxed">
              Estás prestes a pesquisar sobre o Perfil dos Alunos à Saída da Escolaridade Obrigatória e queres ligar o teu telemóvel à Internet. O teu detetor capta três redes Wi-Fi disponíveis. Onde te conetas com segurança?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A */}
              <div
                onClick={() => handleWifiChoice('public')}
                className={`p-5 rounded-2xl border-2 border-b-8 transition-all cursor-pointer relative flex flex-col items-center text-center justify-between min-h-[160px] ${
                  selectedWifi === 'public'
                    ? 'border-yellow-400 bg-yellow-50/50 shadow-md'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-4xl">📶</span>
                <h4 className="font-black text-slate-800 text-xs mt-2 font-display">Wifi_Gratuito_Cafe</h4>
                <p className="text-[10px] text-yellow-600 font-black uppercase mt-1">Aberta, Pública, Sem Senha</p>
                {selectedWifi === 'public' && <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 border border-yellow-300 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">⚠️ Risco Médio</div>}
              </div>

              {/* Option B */}
              <div
                onClick={() => handleWifiChoice('safe')}
                className={`p-5 rounded-2xl border-2 border-b-8 transition-all cursor-pointer relative flex flex-col items-center text-center justify-between min-h-[160px] ${
                  selectedWifi === 'safe'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-4xl text-emerald-500">🔒</span>
                <h4 className="font-black text-slate-800 text-xs mt-2 font-display">EDU_WIFI_SEGURA</h4>
                <p className="text-[10px] text-emerald-600 font-black uppercase mt-1">Cifrada (WPA3), Autenticação</p>
                {selectedWifi === 'safe' && <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">✔️ Seguro</div>}
              </div>

              {/* Option C */}
              <div
                onClick={() => handleWifiChoice('danger')}
                className={`p-5 rounded-2xl border-2 border-b-8 transition-all cursor-pointer relative flex flex-col items-center text-center justify-between min-h-[160px] ${
                  selectedWifi === 'danger'
                    ? 'border-rose-500 bg-rose-50/50 shadow-md animate-shake'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-4xl">🎁</span>
                <h4 className="font-black text-slate-800 text-xs mt-2 font-display">PREMIOS_VIAGENS_GRATIS</h4>
                <p className="text-[10px] text-rose-600 font-black uppercase mt-1">Sem Dono Identificável</p>
                {selectedWifi === 'danger' && <div className="absolute top-2 right-2 bg-rose-100 text-rose-800 border border-rose-300 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">❌ Fraude Grave</div>}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveStage('permissions')}
                className="px-4 py-2 border-2 border-slate-200 border-b-4 hover:bg-slate-50 text-slate-500 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={verifyWifiStage}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase border-b-4 border-emerald-700 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                Confirmar Conexão
              </button>
            </div>
          </div>
        )}

        {activeStage === 'copyright' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1 font-display">
                <Copyleft className="w-4 h-4" /> Desafio 3/3: Licenciamento de Obras
              </span>
              <span className="text-xs font-bold text-slate-400">Criação de Artefactos e Direitos de Autor</span>
            </div>

            <p className="text-slate-600 font-semibold text-sm leading-relaxed">
              Ao criar a tua própria aplicação ou ao publicar um trabalho, deves dominar as regras de propriedade intelectual. Faz corresponder cada tipo de licença de direitos de autor com a sua descrição!
            </p>

            <div className="space-y-4">
              {copyrightMatches.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border-2 border-slate-200 border-b-4 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="md:w-1/2">
                    <h4 className="font-extrabold text-slate-800 text-sm font-display">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold">{item.desc}</p>
                  </div>
                  <div className="md:w-1/2 flex items-center gap-2">
                    <select
                      value={item.matchedWith || ''}
                      onChange={(e) => matchCopyright(item.id, e.target.value)}
                      className="w-full text-xs font-black bg-white text-slate-700 border-2 border-slate-200 p-2.5 rounded-xl focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
                    >
                      <option value="">-- Associa o significado correcto --</option>
                      {copyrightOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                    {item.matchedWith && (
                      <span className="text-sm">
                        {item.matchedWith === item.id ? '✅' : '❓'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveStage('wifi')}
                className="px-4 py-2 border-2 border-slate-200 border-b-4 hover:bg-slate-50 text-slate-500 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={verifyCopyrightStage}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs uppercase border-b-4 border-red-800 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                Validar Direitos de Autor
              </button>
            </div>
          </div>
        )}

        {activeStage === 'finished' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-fade-in">
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-3xl font-black text-emerald-600 font-display">Simulador de Segurança Concluído!</h3>
            <p className="text-slate-600 max-w-md font-semibold leading-relaxed">
              Muitos parabéns! Aprendeste a configurar privacidade, evitar hotspots fraudulentos públicos e o valor de respeitar os direitos e o licenciamento ético das criações!
            </p>
            {completedQuests.includes('seguranca_hero') ? (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 bg-emerald-50 rounded-full border border-emerald-300">
                ⭐ Medalha Desbloqueada: Defensor de Dados
              </span>
            ) : null}
            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black border-2 border-b-4 border-slate-300 rounded-xl text-xs uppercase transition-colors cursor-pointer"
              >
                Jogar Novamente 🔄
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
