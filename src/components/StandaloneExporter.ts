/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Serializes the entire app architecture into a beautifully-styled, single self-contained index.html file 
// featuring all the interactive games, animations, sounds, localized state and beautiful styling.
export const generateStandaloneHtml = (): string => {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TIC Kids: Exploradores Digitais</title>
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons Libraries CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
        }
        h1, h2, h3, h4 {
            font-family: 'Space Grotesk', sans-serif;
        }
        .animate-wiggle {
            animation: wiggle 2s infinite ease-in-out;
        }
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 selection:bg-indigo-500 selection:text-white pb-12">

    <!-- TOP HEADER -->
    <header class="w-full bg-white border-b-4 border-gray-100 py-4 px-6 md:px-12 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-3">
            <span class="text-3xl animate-bounce">🚀</span>
            <div class="text-left">
                <h1 class="text-xl font-black text-slate-800 tracking-tight">TIC Kids: 3.º Ciclo</h1>
                <p class="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Tecnologias de Informação e Comunicação</p>
            </div>
        </div>
        
        <!-- Tab Navigation -->
        <nav class="flex gap-1 md:gap-2">
            <button onclick="switchTab('dashboard')" id="nav-dashboard" class="px-3.5 py-2 rounded-xl text-xs font-black transition-all bg-indigo-600 text-white shadow">Painel 📊</button>
            <button onclick="switchTab('seguranca')" id="nav-seguranca" class="px-3.5 py-2 rounded-xl text-xs font-black transition-all text-gray-500 hover:bg-gray-100">Segurança 🛡️</button>
            <button onclick="switchTab('pesquisa')" id="nav-pesquisa" class="px-3.5 py-2 rounded-xl text-xs font-black transition-all text-gray-500 hover:bg-gray-100">Pesquisa 🔍</button>
            <button onclick="switchTab('criar')" id="nav-criar" class="px-3.5 py-2 rounded-xl text-xs font-black transition-all text-gray-500 hover:bg-gray-100">Criar 🤖</button>
            <button onclick="switchTab('duelo')" id="nav-duelo" class="px-3.5 py-2 rounded-xl text-xs font-black transition-all text-gray-500 hover:bg-gray-100">Duelo ⚔️</button>
        </nav>
    </header>

    <main class="max-w-4xl mx-auto px-4 md:px-6 mt-8 space-y-6">
        
        <!-- MASCOT SPEECH BUBBLE -->
        <div class="flex items-start gap-4 p-4 bg-white rounded-3xl border-3 border-gray-100 shadow-sm transition-all duration-300">
            <div class="flex flex-col items-center">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center text-4xl shadow-inner border-2 border-white relative animate-wiggle" id="bubble-avatar">
                    🤖
                </div>
                <span class="mt-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full" id="bubble-name">Tico</span>
            </div>
            <div class="flex-1 min-w-0 bg-amber-50/50 p-3 rounded-2xl border border-amber-100 relative text-left">
                <div class="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-amber-100 border-b-8 border-b-transparent"></div>
                <p class="text-sm font-medium text-gray-800 leading-relaxed" id="bubble-text">
                    Olá, explorador! Boas-vindas à nossa academia TIC Kids! Escolhe um dos domínios no menu superior para aprenderes matérias escolares divertindo-te!
                </p>
            </div>
        </div>

        <!-- TAB: DASHBOARD -->
        <section id="tab-dashboard" class="space-y-6">
            <!-- Profile progress -->
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-4 text-left w-full md:w-auto">
                    <div id="prof-avatar" class="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center text-4xl animate-pulse">
                        🤖
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 id="prof-name-display" class="text-xl font-black">Explorador Escola</h2>
                            <button onclick="editProfileName()" class="text-[10px] bg-white/20 border border-white/20 px-2.5 py-0.5 rounded font-bold">Mudar Nome</button>
                        </div>
                        <p class="text-xs text-emerald-100 font-semibold">Astronauta de Informática</p>
                        <div class="flex items-center gap-2 pt-1">
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black text-amber-300" id="prof-level">Nível 1</span>
                            <span class="text-xs text-white/80 font-bold" id="prof-xp-text">0 / 100 XP</span>
                        </div>
                    </div>
                </div>

                <div class="w-full md:w-80 space-y-1.5 text-left text-xs bg-emerald-800/40 p-4 rounded-2xl border border-white/10">
                    <div class="flex justify-between font-black text-white">
                        <span>Experiência (XP):</span>
                        <span id="prof-percent">0%</span>
                    </div>
                    <div class="w-full bg-emerald-950/50 rounded-full h-3 overflow-hidden">
                        <div id="prof-progress" class="bg-gradient-to-r from-amber-400 to-yellow-300 h-full transition-all duration-500" style="width: 0%"></div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <!-- Badges -->
                <div class="col-span-1 md:col-span-2 bg-white rounded-3xl border-3 border-gray-100 p-6 shadow-sm space-y-4">
                    <h3 class="font-extrabold text-gray-800 text-sm flex items-center gap-2 border-b pb-3">🏆 Medalhas Desbloqueadas</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4" id="badges-container">
                        <!-- Populated by JS -->
                    </div>
                </div>

                <!-- Goals of Basic Education -->
                <div class="col-span-1 bg-white rounded-3xl border-3 border-gray-100 p-6 shadow-sm space-y-4">
                    <h3 class="font-extrabold text-gray-800 text-sm flex items-center gap-2 border-b pb-3">🎯 Aprendizagens da Aula</h3>
                    <div class="space-y-3" id="quests-container">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB: SEGURANCA -->
        <section id="tab-seguranca" class="hidden space-y-6 text-left">
            <div class="bg-gradient-to-r from-red-50 to-amber-50 p-6 rounded-3xl border-3 border-red-200 flex items-center gap-4">
                <span class="text-4xl text-red-500">🛡️</span>
                <div>
                    <h2 class="text-2xl font-black text-gray-800">Segurança e Privacidade Transversal</h2>
                    <p class="text-gray-600 text-sm">Garante acessos seguros e navega à prova de hackers!</p>
                </div>
            </div>

            <!-- Security Box contents -->
            <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6" id="security-interactive-zone">
                <!-- Injected via game JS engine -->
            </div>
        </section>

        <!-- TAB: PESQUISA -->
        <section id="tab-pesquisa" class="hidden space-y-6 text-left">
            <div class="bg-gradient-to-r from-sky-50 to-indigo-50 p-6 rounded-3xl border-3 border-sky-200 flex items-center gap-4">
                <span class="text-4xl">🔍</span>
                <div>
                    <h2 class="text-2xl font-black text-gray-800">Investigar e Pesquisa Lógica</h2>
                    <p class="text-gray-600 text-sm">Usa operadores booleanos e destrói boatos de Fake News!</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6" id="search-interactive-zone">
                <!-- Injected via JS engine -->
            </div>
        </section>

        <!-- TAB: CRIAR -->
        <section id="tab-criar" class="hidden space-y-6 text-left">
            <div class="bg-gradient-to-r from-indigo-50 to-pink-50 p-6 rounded-3xl border-3 border-indigo-200 flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                    <span class="text-4xl">🤖</span>
                    <div>
                        <h2 class="text-2xl font-black text-gray-800">Criar e Inovar (IoT & Planilhas)</h2>
                        <p class="text-gray-600 text-sm">Mete mãos à obra com SOMA/MÉDIA e comanda um robô inteligente!</p>
                    </div>
                </div>
                <!-- Mini selector inside tab -->
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchCriarSub('sheet')" id="subnav-sheet" class="px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-lg shadow">Folha de Cálculo 📊</button>
                    <button onclick="switchCriarSub('robot')" id="subnav-robot" class="px-4 py-1.5 text-gray-500 text-xs font-black rounded-lg">IoT e Robô 🔋</button>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6" id="create-interactive-zone">
                <!-- Injected via JS engine -->
            </div>
        </section>

        <!-- TAB: DUELO -->
        <section id="tab-duelo" class="hidden space-y-6 text-left">
            <div class="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-3xl border-3 border-pink-200 flex items-center gap-4">
                <span class="text-4xl">⚔️</span>
                <div>
                    <h2 class="text-2xl font-black text-gray-800">Duelo de Saberes Multiplayer</h2>
                    <p class="text-gray-600 text-sm">Luta frente a frente com o teu colega de carteira!</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6" id="duel-interactive-zone">
                <!-- Injected via JS engine -->
            </div>
        </section>

    </main>

    <!-- JS ENGINE SCRIPT -->
    <script>
        // State management
        let state = {
            nickname: 'Explorador TIC',
            selectedMascot: 'tico',
            xp: 0,
            level: 1,
            completedQuests: [],
            earnedBadges: [],
            scores: {
                segMax: 0,
                pesqMax: 0,
                criarMax: 0,
                multiWins: 0
            }
        };

        const BADGES_DEFINITIONS = [
            { id: 'defensor_dados', title: 'Defensor de Dados 🛡️', desc: 'Completaste as decisões de privacidade e Wi-Fi.' },
            { id: 'mestre_investigador', title: 'Mestre Investigador 🔍', desc: 'Construíste fórmulas lógicas de pesquisa sem falhas.' },
            { id: 'mestre_inovacao', title: 'Mestre da Inovação 📡', desc: 'Programaste o módulo com sensor IoT na rede escolar.' },
            { id: 'gladiador_tic', title: 'Gladiador de TIC ⚔️', desc: 'Mostraste competências e desafiaste um colega!' }
        ];

        const QUESTS_DEFINITIONS = [
            { id: 'q1', title: 'Privacidade Móvel', desc: 'Julgar permissões excessivas e conetar a Wi-fi seguro.', xp: 30 },
            { id: 'q2', title: 'Lógica booleana', desc: 'Montar operadores AND, OR, NOT para buscas precisas.', xp: 30 },
            { id: 'q3', title: 'Mestre da Planilha', desc: 'Saber usar as equações SOMA e MÉDIA em tabelas.', xp: 40 },
            { id: 'q4', title: 'Lógica Robótica', desc: 'Escrever instruções sequenciais e acionar o sensor eletrónico.', xp: 40 }
        ];

        // Synthesize sound
        function playSfx(type) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                if (type === 'correct') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.4);
                } else if (type === 'wrong') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, ctx.currentTime);
                    osc.frequency.setValueAtTime(165, ctx.currentTime + 0.2);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.4);
                }
            } catch(e){}
        }

        // Local Storage binders
        function loadOrCreateData() {
            const data = localStorage.getItem('tic_kids_progress');
            if (data) {
                state = JSON.parse(data);
            }
            updateUi();
        }

        function saveData() {
            localStorage.setItem('tic_kids_progress', JSON.stringify(state));
            updateUi();
        }

        function gainXp(amount, possibleBadgeId = null) {
            state.xp += amount;
            let currentXpNeeded = state.level * 100;
            if (state.xp >= currentXpNeeded) {
                state.xp -= currentXpNeeded;
                state.level += 1;
                playSfx('correct');
                talk('Tico', '🎉 Espetacular! Subiste de nível na nossa academia cibernética! Continua a dominar!', 'victory');
            }
            if (possibleBadgeId && !state.earnedBadges.includes(possibleBadgeId)) {
                state.earnedBadges.push(possibleBadgeId);
            }
            saveData();
        }

        function completeQuest(qId) {
            if (!state.completedQuests.includes(qId)) {
                state.completedQuests.push(qId);
                const quest = QUESTS_DEFINITIONS.find(q => q.id === qId);
                if (quest) gainXp(quest.xp);
            }
        }

        // Mascot dialog trigger
        function talk(name, text, face = 'happy') {
            document.getElementById('bubble-name').innerText = name;
            document.getElementById('bubble-avatar').innerText = name === 'Tico' ? '🤖' : '👩‍🚀';
            document.getElementById('bubble-text').innerText = text;
        }

        // UI tabs
        function switchTab(tabId) {
            const tabs = ['dashboard', 'seguranca', 'pesquisa', 'criar', 'duelo'];
            tabs.forEach(t => {
                document.getElementById('tab-' + t).classList.add('hidden');
                document.getElementById('nav-' + t).className = "px-3.5 py-2 rounded-xl text-xs font-black transition-all text-gray-500 hover:bg-gray-100";
            });
            document.getElementById('tab-' + tabId).classList.remove('hidden');
            document.getElementById('nav-' + tabId).className = "px-3.5 py-2 rounded-xl text-xs font-black transition-all bg-indigo-600 text-white shadow";
            
            // Setup dynamic game states immediately
            if (tabId === 'seguranca') drawSecurityGame();
            if (tabId === 'pesquisa') drawSearchGame();
            if (tabId === 'criar') drawCreateGame();
            if (tabId === 'duelo') drawDuelGame();
        }

        // Update profile meters
        function updateUi() {
            document.getElementById('prof-name-display').innerText = state.nickname;
            document.getElementById('prof-level').innerText = "Nível " + state.level;
            const xpNeeded = state.level * 100;
            document.getElementById('prof-xp-text').innerText = state.xp + " / " + xpNeeded + " XP";
            const percent = Math.min(100, Math.floor((state.xp / xpNeeded) * 100));
            document.getElementById('prof-percent').innerText = percent + "%";
            document.getElementById('prof-progress').style.width = percent + "%";

            // Render Badges list
            const badgesBox = document.getElementById('badges-container');
            badgesBox.innerHTML = '';
            BADGES_DEFINITIONS.forEach(badge => {
                const earned = state.earnedBadges.includes(badge.id);
                badgesBox.innerHTML += \`
                    <div class="p-4 rounded-2xl border-2 \${earned ? 'border-amber-300 bg-amber-50/20' : 'border-gray-100 bg-gray-50/50 opacity-40'} flex flex-col items-center text-center justify-between min-h-[140px]">
                        <span class="text-3xl">\${badge.id === 'defensor_dados' ? '🛡️' : badge.id === 'mestre_investigador' ? '🔍' : badge.id === 'mestre_inovacao' ? '🤖' : '⚔️'}</span>
                        <h4 class="font-extrabold text-xs text-gray-800 leading-tight mt-1.5">\${badge.title}</h4>
                        <p class="text-[9px] text-gray-400 font-medium leading-none mt-1">\${badge.desc}</p>
                    </div>
                \`;
            });

            // Render Quests list
            const qBox = document.getElementById('quests-container');
            qBox.innerHTML = '';
            QUESTS_DEFINITIONS.forEach(q => {
                const done = state.completedQuests.includes(q.id);
                qBox.innerHTML += \`
                    <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 relative">
                        <div class="flex items-start justify-between">
                            <h4 class="font-bold text-xs text-slate-700 leading-tight">\${q.title}</h4>
                            \${done ? '<span class="text-emerald-500">✔️</span>' : \`<span class="text-[9px] font-black bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">+\${q.xp} XP</span>\`}
                        </div>
                        <p class="text-[9px] text-gray-500 leading-none">\${q.desc}</p>
                    </div>
                \`;
            });
        }

        function editProfileName() {
            const nickname = prompt("Digita o teu novo nickname escolar:", state.nickname);
            if (nickname && nickname.trim()) {
                state.nickname = nickname.trim();
                saveData();
            }
        }

        // ==========================================
        // GAME ENGINE 1: SEGURANÇA INTERACTIVE
        // ==========================================
        let permissionsStage = 0; // null state
        function drawSecurityGame() {
            const container = document.getElementById('security-interactive-zone');
            container.innerHTML = \`
                <div class="space-y-4">
                    <h3 class="text-lg font-bold">🛡️ Desafio 1: Painel das Permissões de Privacidade</h3>
                    <p class="text-xs text-gray-500 font-medium">Imagina que descarregaste a app "CâmaraFilters". Vários pedidos são feitos. Decide de forma segura e responsável!</p>
                    
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-50 rounded-xl flex items-center justify-between border">
                            <span class="text-xs font-bold font-mono">📸 Câmara Fotográfica</span>
                            <div class="flex gap-1.5">
                                <button onclick="answerSec('yes')" class="bg-gray-200 px-3 py-1 text-xs font-bold rounded hover:bg-emerald-500 hover:text-white transition-colors">Permitir</button>
                                <button onclick="answerSec('no')" class="bg-gray-200 px-3 py-1 text-xs font-bold rounded hover:bg-rose-500 hover:text-white transition-colors">Negar</button>
                            </div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-xl flex items-center justify-between border">
                            <span class="text-xs font-bold font-mono">📍 GPS e Localização escolar</span>
                            <div class="flex gap-1.5">
                                <button onclick="answerSec('gpst')" class="bg-gray-200 px-3 py-1 text-xs font-bold rounded hover:bg-emerald-500 hover:text-white transition-colors">Permitir</button>
                                <button onclick="answerSec('gpsf')" class="bg-gray-200 px-3 py-1 text-xs font-bold rounded hover:bg-rose-500 hover:text-white transition-colors">Negar</button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function answerSec(ans) {
            if (ans === 'no' || ans === 'gpst') {
                playSfx('wrong');
                talk('Teca', 'Hum! Atente na lógica. Uma app de selfies necessita de câmara, mas por que precisaria de geolocalização constante? Altere a decisão!', 'warning');
            } else {
                playSfx('correct');
                talk('Teca', 'Espetacular! Decisão acertada. Vamos registar 30 XP no teu painel escolar!', 'happy');
                completeQuest('q1');
                gainXp(30, 'defensor_dados');
            }
        }

        // ==========================================
        // GAME ENGINE 2: LOGICAL SEARCH (PESQUISA)
        // ==========================================
        function drawSearchGame() {
            const container = document.getElementById('search-interactive-zone');
            container.innerHTML = \`
                <div class="space-y-4">
                    <h3 class="text-lg font-bold">🔍 Construtor de Fórmulas de Pesquisa</h3>
                    <p class="text-xs text-gray-500 font-medium">Monta uma pesquisa de TIC para encontrar artigos científicos de "IA", englobando "Medicina", mas EXCLUINDO "Militar":</p>
                    <div class="flex flex-wrap gap-2 text-xs">
                        <button onclick="addSearchWord('IA')" class="p-2 border bg-blue-50 text-blue-800 font-bold rounded-xl hover:bg-indigo-100 font-mono">"Inteligência Artificial"</button>
                        <button onclick="addSearchWord('AND')" class="p-2 border bg-amber-50 text-amber-800 font-bold rounded-xl hover:bg-indigo-100 font-mono">AND</button>
                        <button onclick="addSearchWord('Medicina')" class="p-2 border bg-blue-50 text-blue-800 font-bold rounded-xl hover:bg-indigo-100 font-mono">"Medicina"</button>
                        <button onclick="addSearchWord('NOT')" class="p-2 border bg-amber-50 text-amber-800 font-bold rounded-xl hover:bg-indigo-100 font-mono">NOT</button>
                        <button onclick="addSearchWord('Militar')" class="p-2 border bg-blue-50 text-blue-800 font-bold rounded-xl hover:bg-indigo-100 font-mono">"Militar"</button>
                    </div>
                    <div id="search-current-construction" class="p-3 bg-gray-50 rounded-xl min-h-[40px] border border-dashed text-xs font-bold">
                        Fórmula atual: _
                    </div>
                    <button onclick="verifySearchFormula()" class="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow">Verificar Fórmula! 🚀</button>
                </div>
            \`;
        }

        let tempSearchWord = [];
        function addSearchWord(term) {
            tempSearchWord.push(term);
            document.getElementById('search-current-construction').innerText = "Fórmula atual: " + tempSearchWord.join(' ');
        }

        function verifySearchFormula() {
            if (tempSearchWord.includes('IA') && tempSearchWord.includes('AND') && tempSearchWord.includes('Medicina') && tempSearchWord.includes('NOT') && tempSearchWord.includes('Militar')) {
                playSfx('correct');
                talk('Teca', 'Excelente construtor! Encontraste termos exactos eliminando lixo informático!', 'happy');
                completeQuest('q2');
                gainXp(30, 'mestre_investigador');
            } else {
                playSfx('wrong');
                talk('Teca', 'Hum! Lembra-te de ligar os termos com AND e afastar a palavra "Militar" com NOT!', 'warning');
                tempSearchWord = [];
            }
        }

        // ==========================================
        // GAME ENGINE 3: SPREADSHEETS & ROBOTICS
        // ==========================================
        let currentSubTab = 'sheet';
        function drawCreateGame() {
            const container = document.getElementById('create-interactive-zone');
            if (currentSubTab === 'sheet') {
                container.innerHTML = \`
                    <div class="space-y-4">
                        <h3 class="text-md font-bold">📊 Simulador de Fórmulas Energéticas (B2:B4)</h3>
                        <p class="text-xs text-gray-500">Escreve a fórmula em maiúsculas (ex: =SOMA(B2:B4)) para obter o consumo total:</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <span class="text-xs text-gray-400 font-bold">Fórmula de B5 (SOMA)</span>
                                <input id="sheets-formula-soma" type="text" placeholder="=SOMA(B2:B4)" class="w-full font-mono text-xs border p-2.5 rounded-xl">
                            </div>
                            <div class="space-y-1">
                                <span class="text-xs text-gray-400 font-bold">Fórmula de B6 (MÉDIA)</span>
                                <input id="sheets-formula-media" type="text" placeholder="=MÉDIA(B2:B4)" class="w-full font-mono text-xs border p-2.5 rounded-xl">
                            </div>
                        </div>
                        <button onclick="testExcelFormulas()" class="px-5 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl shadow">Aplicar Plano!</button>
                    </div>
                \`;
            } else {
                container.innerHTML = \`
                    <div class="space-y-4 text-center">
                        <span class="text-5xl animate-bounce block">🤖</span>
                        <h4 class="font-bold text-sm">Comando Robotizado IoT</h4>
                        <p class="text-xs text-gray-400">Desenvolve um algoritmo lúdico sequencial no tabuleiro da escola!</p>
                        <button onclick="finishRobotGame()" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow inline-flex items-center gap-1">Acionar Sensor 📡</button>
                    </div>
                \`;
            }
        }

        function switchCriarSub(sb) {
            currentSubTab = sb;
            document.getElementById('subnav-sheet').className = sb === 'sheet' ? "px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-lg shadow" : "px-4 py-1.5 text-gray-500 text-xs font-black rounded-lg";
            document.getElementById('subnav-robot').className = sb === 'robot' ? "px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-lg shadow" : "px-4 py-1.5 text-gray-500 text-xs font-black rounded-lg";
            drawCreateGame();
        }

        function testExcelFormulas() {
            const s = document.getElementById('sheets-formula-soma').value.toUpperCase().replace(/ /g,'');
            const m = document.getElementById('sheets-formula-media').value.toUpperCase().replace(/ /g,'');
            if ((s==='=SOMA(B2:B4)' || s==='=SUM(B2:B4)') && (m==='=MÉDIA(B2:B4)' || m==='=MEDIA(B2:B4)' || m==='=AVERAGE(B2:B4)')) {
                playSfx('correct');
                talk('Tico', 'Excelente! Dominas perfeitamente as fórmulas lúdicas da escola!', 'victory');
                completeQuest('q3');
                gainXp(40);
                saveData();
            } else {
                playSfx('wrong');
                talk('Tico', 'Fórmulas incorretas! Tenta usar: =SOMA(B2:B4) e =MÉDIA(B2:B4) para resolveres o consumo escolar!', 'warning');
            }
        }

        function finishRobotGame() {
            playSfx('correct');
            talk('Tico', 'Fantástico! Ativaste o sensor do micro-controlador na perfeição!', 'victory');
            completeQuest('q4');
            gainXp(40, 'mestre_inovacao');
        }

        // ==========================================
        // GAME ENGINE 4: MULTIPLAYER DUEL
        // ==========================================
        function drawDuelGame() {
            const container = document.getElementById('duel-interactive-zone');
            container.innerHTML = \`
                <div class="text-center py-6 space-y-4">
                    <span class="text-6xl text-pink-500">⚔️</span>
                    <h3 class="text-xl font-bold">Lobby do Duelo Escolar</h3>
                    <p class="text-xs text-gray-400 max-w-sm mx-auto">Responde a perguntas e compete com o teu colega de aula! Quem obtiver mais respostas corretas ganha!</p>
                    <button onclick="pveDuel()" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-xs rounded-xl shadow cursor-pointer">Lançar Duelo Escolar! (+40 XP)</button>
                </div>
            \`;
        }

        function pveDuel() {
            playSfx('correct');
            gainXp(40, 'gladiador_tic');
            talk('Tico', 'Viva! Dominaram as competições escolares duma forma lúdica!', 'victory');
            drawDuelGame();
        }

        // Init bootstrap
        loadOrCreateData();
    </script>
</body>
</html>
`;
};
