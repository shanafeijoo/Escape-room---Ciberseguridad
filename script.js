// =========================================================
// 0. DEFINICIONES GLOBALES (sin cambios en la lógica)
// =========================================================

const CLAVES = {
    intro: "CONFIDENCIALIDAD",
    hackers: "NINGUNA",
    credenciales: "4321",
    ing_social: "URGENCIA",
    iot: "ACTUALIZAR",
    caso_final: "VERIFICAR"
};

const SUSPECT_IMAGES = {
    'Agente Vega': 'vega.png',
    'Agente Leo': 'leo.png',
    'Agente Kael': 'kael.png'
};

const BOSS_VIDEOS = {
    "Dra. Vega": "ZbT5b0vhKEU",
    "Kai Byte": "9enczDlsgAU",
    "Dra. Cipher": "7kuHR6ecctI",
    "Agente Phish": "BvYvB1Y1cUM",
    "Ing. Nodea": "ct_5oRsCrdE"
};

const MISSION_BRIEFERS = {
    "intro": { name: "Dra. Vega", avatar: "vega.png" },
    "hackers": { name: "Kai Byte", avatar: "kai.png" },
    "credenciales": { name: "Dra. Cipher", avatar: "Cipher.png" },
    "ing_social": { name: "Agente Phish", avatar: "phish.png" },
    "iot": { name: "Ing. Nodea", avatar: "nodea.png" },
    "caso_final": { name: "Soporte", avatar: "kai.png" }
};

const BRIEF = {
    intro: {
        description: "Son las 07:30 y en Dirección hay lío: un documento de planificación amaneció cambiado, como si ‘alguien’ hubiera movido fechas y criterios. Antes de culpar, usamos la **Tríada C‑I‑D**: *Confidencialidad* (quién puede ver), *Integridad* (quién puede modificar y dejar rastro) y *Disponibilidad* (que el sistema funcione cuando lo necesitás).",
        post_mission_concern: "Bien. Ahora el foco pasa a la Sala de Informática: los equipos compartidos y las sesiones abiertas suelen ser el verdadero agujero.",
        diaryClue: "Diario: En el carrito de préstamos apareció una sesión de CREA abierta. Vega dice que no fue; Kael insiste en que vio a Leo usando esa PC ‘solo un minuto’."
    },
    hackers: {
        description: "Llegás a la sala de informática y una PC de préstamo prende con Gmail y CREA abiertos. No suena a ‘hackeo sofisticado’: suena a hábitos peligrosos. Clasificá prácticas (buenas/malas) y elegí a quién seguir: acá la higiene digital es la pista.",
        post_mission_concern: "Seguimos con Identidad Digital: si alguien consigue tu contraseña, sin doble verificación (MFA) entra igual.",
        diaryClue: "Diario: Alguien dejó contraseñas guardadas en el navegador de un equipo del INSTITUTO. Leo acusa a Kael por ‘apurar y salir’, pero Vega comenta que vio a Leo usando autocompletar."
    },
    credenciales: {
        description: "Secretaría reporta intentos de ingreso desde otros países. Acá entra **MFA** (doble verificación): además de contraseña, un segundo paso (código en el celu o app). La idea es simple: si roban la contraseña, igual no deberían poder entrar. Tu misión: encontrar el código y entender por qué esto cambia el juego.",
        post_mission_concern: "Ahora viene lo más común: correos falsos que imitan a Dirección y apuran con urgencia. Vamos a phishing.",
        diaryClue: "Diario: El intento de acceso venía desde una computadora que ‘no debía estar en ese salón’. Kael dice que fue por préstamo; Leo dice que él nunca presta su usuario."
    },
    ing_social: {
        description: "Te llega un correo ‘de Dirección’ con foto, tono formal y un **URGENTE** que mete presión. Pide datos y te manda a un enlace. Eso es **phishing**: un engaño pensado para que actúes rápido y sin verificar. Revisá señales y resolvé el chequeo.",
        post_mission_concern: "Bien visto. Pero aún queda una fuente de riesgo: dispositivos personales conectados (IoT).",
        diaryClue: "Diario: El mail tenía la foto real de Dirección, pero el tono era raro. Vega dice ‘yo no mando links acortados’. Leo responde que ‘todo el mundo usa acortadores’."
    },
    iot: {
        description: "La WiFi del INSTITUTO muestra dispositivos que no son del INSTITUTO: relojes, tablets, auriculares. Eso es **IoT** (internet de las cosas): objetos conectados. Si se sincronizan con cuentas institucionales o están desactualizados, pueden filtrar datos sin que nadie lo note.",
        post_mission_concern: "Último paso: el Caso final. Hay un enlace acortado y un documento WPS con permisos mal puestos.",
        diaryClue: "Diario: El reloj de Kael se conectó a la Wi‑Fi del INSTITUTO ese día… pero también el celular de Leo. Nada concluyente."
    },
    caso_final: {
        description: "Caso final: alguien reenvió por Gmail un enlace acortado a un documento **WPS** (tipo Word/Docs). El documento está compartido con permisos demasiado abiertos. Tu objetivo: reconstruir la cadena de riesgo y decidir qué acción corta el problema en el INSTITUTO.",
        post_mission_concern: "Con esto, la TERMINAL queda lista para tu decisión final.",
        diaryClue: "Diario: El documento WPS estaba en ‘cualquiera puede editar’. Eso explica el caos… pero no dice quién lo configuró así (o quién compartió el link)."
    }
};

const ORDER = ["intro", "hackers", "credenciales", "ing_social", "iot", "caso_final"];

const M1_SCORE_LOSS_KEY = 50;
const M3_SCORE_LOSS_KEY = 75;
const M4_SCORE_LOSS_KEY = 75;
const M5_SCORE_LOSS_KEY = 100;
const M2_SCORE_SELECT_SUSPECT = 500;
const COMPLETION_POINTS = 1000;

// =========================================================
// 1. LOCAL STORAGE: carga/guardado de estado
// =========================================================

function loadState() {
    const defaultState = {
        score: 0,
        keys: { intro: false, hackers: false, credenciales: false, ing_social: false, iot: false, caso_final: false },
        suspect: null,
        final_suspect_choice: null,
        quiz: {}
    };
    try {
        const stored = localStorage.getItem('atlas_firewall_state');
        return stored ? Object.assign(defaultState, JSON.parse(stored)) : defaultState;
    } catch (e) {
        console.error("Error cargando estado:", e);
        return defaultState;
    }
}

function saveState(state) {
    try {
        localStorage.setItem('atlas_firewall_state', JSON.stringify(state));
    } catch (e) {
        console.error("Error guardando estado:", e);
    }
}


// =========================================================
// 1.b QUIZZES: evitar bonus infinitos + restaurar estado
// =========================================================
function ensureQuizState(state){
    if (!state.quiz || typeof state.quiz !== 'object') state.quiz = {};
    return state;
}

function markQuizPassed(quizId){
    const state = ensureQuizState(loadState());
    if (state.quiz[quizId]) return false;
    state.quiz[quizId] = true;
    saveState(state);
    return true;
}

function isQuizPassed(quizId){
    const state = ensureQuizState(loadState());
    return !!state.quiz[quizId];
}

function setQuizUI(btnId, outId, html){
    const btn = document.getElementById(btnId);
    const out = document.getElementById(outId);
    if (out && html) out.innerHTML = html;
    if (btn){
        btn.disabled = true;
        btn.classList.add('secondary');
        btn.classList.remove('success');
        btn.textContent = 'Listo';
    }
}

// =========================================================
// 2. UTILIDADES DOM / RESILIENTES (arregla problema de IDs)
// =========================================================

// Devuelve el elemento submit (prueba varios patrones de id)
function getSubmitButton(missionId) {
    const candidates = [
        `${missionId}-btn-submit`,                 // ej: intro-btn-submit
        `${missionId}-btnsubmit`,
        `${MISSION_SCREENS?.[missionId] || missionId}-btn-submit`, // ej: mission1-btn-submit
        `${MISSION_SCREENS?.[missionId] || missionId}-btnsubmit`,
        `btn-confirm-suspect`,
        `mission${ORDER.indexOf(missionId)+1}-btn-submit`, // fallback antiguo
        `${missionId}-submit`,
        `${missionId}-btn`
    ];
    for (const id of candidates) {
        if (!id) continue;
        const el = document.getElementById(id);
        if (el) return el;
    }
    // última opción: buscar un botón dentro del panel de la misión
    const panel = document.getElementById(MISSION_SCREENS[missionId]);
    if (panel) {
        const btn = panel.querySelector('button.btn, button[type="button"], button[type="submit"]');
        if (btn) return btn;
    }
    return null;
}

// Devuelve el input de clave probando varios patrones
function getChallengeKeyInput(missionId) {
    const candidates = [
        `${missionId}-challenge-key`,
        `${MISSION_SCREENS?.[missionId] || missionId}-challenge-key`,
        `mission${ORDER.indexOf(missionId)+1}-challenge-key`,
        `${missionId}-key`,
        `${missionId}-challenge_key`,
        `${missionId}-input`
    ];
    for (const id of candidates) {
        if (!id) continue;
        const el = document.getElementById(id);
        if (el) return el;
    }
    // fallback: buscar un input dentro de la pantalla de la misión
    const panel = document.getElementById(MISSION_SCREENS[missionId]);
    if (panel) {
        const input = panel.querySelector('input[type="text"], input[type="search"], textarea');
        if (input) return input;
    }
    return null;
}

// Devuelve elemento feedback probando nombres
function getFeedbackElement(missionId) {
    const candidates = [
        `${missionId}-feedback`,
        `${MISSION_SCREENS?.[missionId] || missionId}-feedback`,
        `mission${ORDER.indexOf(missionId)+1}-feedback`,
        `${missionId}-msg`,
        `${missionId}-status`,
        `${missionId}-resultado`
    ];
    for (const id of candidates) {
        if (!id) continue;
        const el = document.getElementById(id);
        if (el) return el;
    }
    // fallback: buscar .feedback dentro de la pantalla de la misión
    const panel = document.getElementById(MISSION_SCREENS[missionId]);
    if (panel) {
        const fb = panel.querySelector('.feedback');
        if (fb) return fb;
    }
    return null;
}

// =========================================================
// 3. FUNCIONES UI Y PANTALLAS (sin cambios funcionales mayores)
// =========================================================

function setScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function setSubScreen(id) {
    document.querySelectorAll('.sub-screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('active');
        const wrapper = el.querySelector('.content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }
}

function updateHUD() {
    const state = loadState();
    const collectedKeys = Object.values(state.keys).filter(Boolean).length;
    const hudScore = document.getElementById('hud-score');
    if (hudScore) hudScore.textContent = state.score;
    const hudKeys = document.getElementById('hud-keys');
    if (hudKeys) hudKeys.textContent = `${collectedKeys}/6`;
    const hudSuspect = document.getElementById('hud-suspect') || document.getElementById('hud-suspect-display');
    if (hudSuspect) hudSuspect.textContent = `🔎 Sospechoso: ${state.suspect ? state.suspect.replace('Agente ', '') : 'PENDIENTE'}`;

    updateMapFolders(state, collectedKeys);
}

function updateMapFolders(state, collectedKeys) {
    const folders = document.querySelectorAll('.folder[data-mission-id]');
    folders.forEach((folder, index) => {
        const missionId = ORDER[index];
        const statusText = folder.querySelector('.mission-status');
        let avatarContainer = folder.querySelector('.mission-avatar-container');
        if (!avatarContainer) {
            avatarContainer = document.createElement('div');
            avatarContainer.className = 'mission-avatar-container';
            folder.insertBefore(avatarContainer, folder.querySelector('h3') || folder.firstChild);
        }
        avatarContainer.innerHTML = '';

        if (state.keys[missionId]) {
            folder.classList.add('unlocked');
            if (statusText) statusText.textContent = '✅ COMPLETADA';
            const brieferInfo = MISSION_BRIEFERS[missionId];
            if (brieferInfo && brieferInfo.avatar) {
                const img = document.createElement('img');
                img.src = brieferInfo.avatar;
                img.alt = brieferInfo.name;
                img.className = 'briefer-avatar';
                avatarContainer.appendChild(img);
            }
        } else {
            folder.classList.remove('unlocked');
            if (statusText) statusText.textContent = 'Pendiente';
        }

        let isAvailable = false;
        if (index === 0) isAvailable = true;
        else {
            const prev = ORDER[index - 1];
            isAvailable = state.keys[prev];
        }

        const button = folder.querySelector('button');
        if (isAvailable || state.keys[missionId]) {
            folder.setAttribute('aria-disabled', 'false');
            if (button) { button.disabled = false; button.classList.remove('disabled-btn'); }
        } else {
            folder.setAttribute('aria-disabled', 'true');
            if (button) { button.disabled = true; button.classList.add('disabled-btn'); }
        }
    });

    const terminalBtn = document.getElementById('btn-terminal');
    if (terminalBtn) {
        terminalBtn.disabled = collectedKeys < 6;
        const terminalStatus = document.querySelector('.folder.terminal-folder .mission-status');
        if (collectedKeys < 6) {
            if (terminalStatus) terminalStatus.textContent = 'Bloqueado';
            terminalBtn.classList.add('disabled-btn');
        } else {
            if (terminalStatus) terminalStatus.textContent = 'Listo para la Decisión Final';
            terminalBtn.classList.remove('disabled-btn');
        }
    }
}

// =========================================================
// LÓGICA DEL DIARIO
// =========================================================

function toggleDiary() {
    const panel = document.getElementById('diary-panel');
    const notif = document.getElementById('diary-notification');
    panel.classList.toggle('hidden');
    // Al abrir, quitamos la notificación de "nuevo"
    if (!panel.classList.contains('hidden')) {
        notif.classList.add('hidden');
    }
}

function updateDiaryUI() {
    const state = loadState();
    const list = document.getElementById('diary-list');
    const notif = document.getElementById('diary-notification');

    // El diario solo existe en el MAPA. Si no estamos en esa pantalla/página, salimos sin error.
    if (!list) return;
    
    // Limpiar lista
    list.innerHTML = '';

    // Si no hay pistas
    if (!state.collectedClues || state.collectedClues.length === 0) {
        list.innerHTML = '<li class="empty-msg">Sin datos recolectados.</li>';
        return;
    }

    // Renderizar pistas
    state.collectedClues.forEach(clue => {
        const li = document.createElement('li');
        li.innerHTML = clue; // Usamos innerHTML para permitir negritas
        list.appendChild(li);
    });
}

// Inicializar el botón del diario
document.addEventListener('DOMContentLoaded', () => {
    // ... tu código existente ...
    
    // Listener para el botón del diario
    document.getElementById('diary-toggle-btn')?.addEventListener('click', toggleDiary);
    
    // Cargar diario al inicio
    updateDiaryUI();
});

// =========================================================
// 4. LÓGICA DE PUNTAJE / GENIALLY / YOUTUBE (sin cambios)
// =========================================================

function updateScore(points) {
    let state = loadState();

    // Restaurar quizzes (evita repetir bonus y re‑muestra resultados)
    state = ensureQuizState(state);
    saveState(state);

    if (state.quiz.m1){
        const inp = document.getElementById('mission1-challenge-key');
        if (inp && !inp.value) inp.value = CLAVES.intro;
        setQuizUI('btn-check-m1-quiz','m1-quiz-result',`✅ ¡Bien! Clave revelada: <b>${CLAVES.intro}</b>.`);
    }
    if (state.quiz.m2){
        setQuizUI('btn-check-m2-quiz','m2-quiz-result',`✅ ¡Perfecto! Bonus ya otorgado.`);
    }
    if (state.quiz.m3){
        setQuizUI('btn-check-m3-quiz','m3-quiz-result',`✅ Bonus ya otorgado. Ahora buscá el <b>código</b> en la Habitación Oscura.`);
    }
    if (state.quiz.m5){
        const inp = document.getElementById('mission5-challenge-key');
        if (inp && !inp.value) inp.value = CLAVES.iot;
        setQuizUI('btn-check-m5-quiz','m5-quiz-result',`✅ Clave revelada: <b>${CLAVES.iot}</b>.`);
    }

    state.score = Math.max(0, state.score + points);
    saveState(state);
    updateHUD();
    if (points > 0) play("#sfx-ok");
    else if (points < 0) play("#sfx-error");
}

// =========================================================
// FUNCIÓN FINAL: Carga de Genially (Soporte Enlace Completo)
// =========================================================

function loadGeniallyIframe(containerId, resourceUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpiar contenedor previo para asegurar recarga limpia
    container.innerHTML = ''; 
    
    const iframe = document.createElement('iframe');
    
    // LÓGICA INTELIGENTE:
    // Si el usuario puso un enlace completo (https://...), lo usa tal cual.
    // Si puso solo un ID (ej: 68f...), construye la URL genérica.
    if (resourceUrl.includes('http')) {
        iframe.src = resourceUrl;
    } else {
        iframe.src = `https://view.genially.com/${resourceUrl}`;
    }

    // AJUSTES VISUALES CRÍTICOS
    iframe.style.width = '100%';
    iframe.style.height = '500px'; // Forzamos altura fija para evitar colapso (pantalla negra pequeña)
    iframe.style.border = '0';
    iframe.allow = "fullscreen";
    
    container.appendChild(iframe);
}

// =========================================================
// FUNCIÓN MEJORADA: Carga de YouTube con Control de Audio
// =========================================================

function loadYoutubeVideo(containerId, videoId, audioOn = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "315";
    
    // LÓGICA DE AUDIO INDEPENDIENTE
    // Si audioOn es true -> mute=0 (Con sonido)
    // Si audioOn es false -> mute=1 (Silencio, para que el autoplay no se bloquee)
    const muteParam = audioOn ? "0" : "1";
    
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&mute=${muteParam}&modestbranding=1`;
    
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    
    container.appendChild(iframe);
}

function play(id) {
    const audio = document.querySelector(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(()=>{});
    }
}

// MAPA de pantallas (posible dependencia con HTML)
const MISSION_SCREENS = {
    "intro": "mission1",
    "hackers": "mission2",
    "credenciales": "mission3",
    "ing_social": "mission4",
    "iot": "mission5",
    "caso_final": "mission6",
};

// =========================================================
// 5. FLUJO DE FIN DE MISION: marcar como completada
// =========================================================

function handleMissionCompletion(missionId, isSuccess) {
    if (!isSuccess) return;
    let state = loadState();
    if (state.keys[missionId]) { setSubScreen('screen-map'); return; }
    state.keys[missionId] = true;
    saveState(state);
    updateScore(COMPLETION_POINTS);
    const missionBriefingContainer = document.getElementById(`${MISSION_SCREENS[missionId]}-briefing`);
    if (missionBriefingContainer) {
        const missionDescriptionElement = missionBriefingContainer.querySelector('.briefing-text');
        if (missionDescriptionElement && BRIEF[missionId] && BRIEF[missionId].post_mission_concern) {
            missionDescriptionElement.innerHTML = BRIEF[missionId].post_mission_concern;
        }
        const challengeUi = missionBriefingContainer.querySelector('.challenge-ui');
        if (challengeUi) challengeUi.style.display = 'none';
        const unlockSection = missionBriefingContainer.parentElement.querySelector('.unlock');
        if (unlockSection) unlockSection.style.display = 'none';
    }
    setSubScreen('screen-map');
    updateHUD();
}

// =========================================================
// 6. BOTÓN ÚNICO: manejo robusto del submit (reparado)
// =========================================================

// =========================================================
// NUEVA FUNCIÓN: Control del Modal
// =========================================================
function showModal(title, htmlContent, isSuccess) {
    const overlay = document.getElementById('modal-overlay');
    const box = overlay.querySelector('.modal-box');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close-btn');

    // Configurar contenido
    titleEl.textContent = title;
    bodyEl.innerHTML = htmlContent; // Usamos innerHTML para que se vean las negritas y saltos de línea

    // Configurar estilos (verde o rojo)
    box.classList.remove('success-mode', 'error-mode');
    box.classList.add(isSuccess ? 'success-mode' : 'error-mode');

    // Mostrar
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    // Sonido
    if(isSuccess) play("#sfx-ok");
    else play("#sfx-error");

    // Lógica de cierre única
    closeBtn.onclick = () => {
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
    };
}
// =========================================================
// FUNCIÓN RECUPERADA: resetSubmitButton
// =========================================================

function resetSubmitButton(missionId, submitButton, challengeKeyInput) {
    const fb = getFeedbackElement(missionId);
    
    // Limpiamos feedback visual antiguo
    if (fb) {
        fb.className = 'feedback';
        fb.textContent = '';
        fb.style.display = 'none'; // Lo ocultamos porque ahora usamos Modales
    }

    if (submitButton) {
        // Restaurar texto original o por defecto
        submitButton.textContent = submitButton.dataset.originalText || 'Desbloquear Firewall';
        
        // Restaurar colores (verde éxito, quitar gris continue)
        submitButton.classList.remove('primary', 'continue-btn', 'secondary');
        submitButton.classList.add('success');
        
        // Habilitar
        submitButton.disabled = false;
        
        // Asegurar que el evento onclick sea el del handleMissionSubmitClick
        // (Esto previene que se quede con la función de "Volver al mapa")
        submitButton.onclick = function() { handleMissionSubmitClick(missionId); };
    }

    if (challengeKeyInput) {
        challengeKeyInput.disabled = false;
        challengeKeyInput.value = ''; // Limpiar input para nuevo intento
    }
}
// =========================================================
// FUNCIÓN MAESTRA: handleMissionSubmitClick (INTEGRADA)
// =========================================================

function handleMissionSubmitClick(missionId) {
    const submitButton = getSubmitButton(missionId);
    const challengeKeyInput = getChallengeKeyInput(missionId);
    
    // Ocultar feedback antiguo si existe (limpieza visual)
    const feedbackElement = getFeedbackElement(missionId);
    if(feedbackElement) feedbackElement.style.display = 'none';

    // Verificar si el botón está en modo navegación ("Volver" o "Continuar")
    const isContinue = submitButton && (/Continuar/i.test(submitButton.textContent) || /Volver/i.test(submitButton.textContent));

    if (!submitButton) return;

    // 1) Si el botón ya es para salir, nos lleva al mapa directamente
    if (isContinue) {
        setSubScreen('screen-map');
        return;
    }

    // 2) Preparación de variables de lógica
    let isKeyCorrect = false;
    let feedbackMessage = "";
    let modalTitle = ""; 
    let state = loadState(); // Cargar estado actual

    // Si la misión ya estaba completada (seguridad), solo actualizamos la UI
    if (state.keys[missionId]) {
        // En este punto, el botón debería tener texto 'Volver al mapa'
        setSubScreen('screen-map');
        return; 
    }

    // 3) Switch de Validación por Misión
    switch (missionId) {
        case 'intro': {
            const input = (challengeKeyInput && challengeKeyInput.value) ? challengeKeyInput.value.toUpperCase().trim() : '';
            isKeyCorrect = input === CLAVES.intro;
            if (isKeyCorrect) {
                modalTitle = "✅ ACCESO CONCEDIDO";
                feedbackMessage = `Firewall Misión 1 Desbloqueado.<br><br>${BRIEF.intro?.post_mission_concern || ''}`;
            } else {
                updateScore(-M1_SCORE_LOSS_KEY); // Penalización
                modalTitle = "🚨 ACCESO DENEGADO";
                feedbackMessage = "Clave incorrecta.<br>Revisa el <strong>Principio C.I.D.</strong> y las pistas.";
            }
            break;
        }
        case 'hackers': {
            // Validación especial: requiere haber elegido un sospechoso en el state
            if (!state.suspect) {
                isKeyCorrect = false;
                modalTitle = "⚠️ ATENCIÓN";
                feedbackMessage = "Debes seleccionar un sospechoso principal antes de continuar.";
            } else {
                isKeyCorrect = true;
                updateScore(M2_SCORE_SELECT_SUSPECT); // Puntos por elegir sospechoso
                modalTitle = "✅ SOSPECHOSO REGISTRADO";
                feedbackMessage = `Misión 2 completada. Sospechoso: <strong>${state.suspect.replace('Agente ', '')}</strong>.<br><br>${BRIEF.hackers?.post_mission_concern || ''}`;
                
                // Bloquear la interfaz de selección de sospechosos
                document.querySelectorAll('.suspect-option').forEach(btn => btn.style.pointerEvents = 'none');
            }
            break;
        }
        case 'credenciales': {
            const input = (challengeKeyInput && challengeKeyInput.value) ? challengeKeyInput.value.trim() : '';
            isKeyCorrect = input === CLAVES.credenciales;
            if (isKeyCorrect) {
                modalTitle = "✅ SISTEMA RESTAURADO";
                feedbackMessage = `Firewall Misión 3 Desbloqueado.<br><br>${BRIEF.credenciales?.post_mission_concern || ''} <br><br> ${BRIEF.credenciales?.pistaIntriga || ''}`;
            } else {
                updateScore(-M3_SCORE_LOSS_KEY);
                modalTitle = "🚨 ERROR DE AUTENTICACIÓN";
                feedbackMessage = "Clave incorrecta. Volvé a la Habitación Oscura (Genially) y buscá el código de 4 cifras. Si estás trancado/a, repasá el mini‑quiz de MFA para ordenar ideas.";
            }
            break;
        }
        case 'ing_social': {
            const input = (challengeKeyInput && challengeKeyInput.value) ? challengeKeyInput.value.toUpperCase().trim() : '';
            isKeyCorrect = input === CLAVES.ing_social;
            if (isKeyCorrect) {
                modalTitle = "✅ ENTRENAMIENTO COMPLETADO";
                feedbackMessage = `Simulación de Ing. Social superada.<br><br>${BRIEF.ing_social?.post_mission_concern || ''} <br><br> ${BRIEF.ing_social?.pistaIntriga || ''}`;
            } else {
                updateScore(-M4_SCORE_LOSS_KEY);
                modalTitle = "🚨 RESPUESTA INCORRECTA";
                feedbackMessage = "Esa no es la emoción principal que usan los atacantes. ¡Revisa la conversación con el chatbot!";
            }
            break;
        }
        case 'iot': {
            const input = (challengeKeyInput && challengeKeyInput.value) ? challengeKeyInput.value.toUpperCase().trim() : '';
            isKeyCorrect = input === CLAVES.iot;
            if (isKeyCorrect) {
                modalTitle = "✅ RED IOT SEGURA";
                feedbackMessage = `Misión 5 completada.<br><br>${BRIEF.iot?.post_mission_concern || ''}`;
            } else {
                updateScore(-M5_SCORE_LOSS_KEY);
                modalTitle = "🚨 CREDENCIALES INVÁLIDAS";
                feedbackMessage = "Clave incorrecta. Pista: es la acción más importante que reduce fallas conocidas en dispositivos.";
            }
            break;
        }
        case 'caso_final': {
            const input = (challengeKeyInput && challengeKeyInput.value) ? challengeKeyInput.value.toUpperCase().trim() : '';
            isKeyCorrect = input === CLAVES.caso_final;
            if (isKeyCorrect) {
                modalTitle = "✅ CASO RESUELTO";
                feedbackMessage = "Caso final completado. La TERMINAL ya puede activarse para la decisión final.";
            } else {
                updateScore(-M5_SCORE_LOSS_KEY);
                modalTitle = "🚨 AÚN NO";
                feedbackMessage = "Clave incorrecta. Pista: primero se VERIFICA por otro canal.";
            }
            break;
        }
    }

    // 4) Procesamiento de Éxito (Guardado + Diario + UI)
    if (isKeyCorrect) {
        // Recargar state para asegurar consistencia
        state = loadState(); 

        if (!state.keys[missionId]) {
            // A. Marcar como completada
            state.keys[missionId] = true;
            
            // B. Sumar puntos finales (excepto M2 que ya sumó arriba)
            if (missionId !== 'hackers') {
                state.score += COMPLETION_POINTS; 
            }
            
            // C. Lógica del DIARIO: Guardar pista si existe
            if (!state.collectedClues) state.collectedClues = [];
            const clueText = BRIEF[missionId]?.diaryClue; // Obtenemos la pista del objeto BRIEF
            
            if (clueText && !state.collectedClues.includes(clueText)) {
                state.collectedClues.push(clueText);
                // Mostrar notificación visual (!) en el botón del diario
                document.getElementById('diary-notification')?.classList.remove('hidden');
            }

            // D. Guardar todo en localStorage
            saveState(state);
        }
        
        // E. Actualizaciones Visuales Inmediatas
        updateHUD();       // Actualiza puntaje y firewalls (arriba)
        updateDiaryUI();   // Actualiza la lista del diario (abajo)

        // F. Transformar el botón a "Volver al Mapa"
        if (submitButton) {
            submitButton.textContent = "Volver al Mapa";
            submitButton.classList.remove('success', 'primary'); 
            submitButton.classList.add('secondary'); 
            submitButton.disabled = false;
            // Aseguramos que el click lo devuelva al mapa
            submitButton.onclick = function() { setSubScreen('screen-map'); };
        }
        if (challengeKeyInput) challengeKeyInput.disabled = true;

        // G. Desbloquear visualmente la siguiente carpeta en el mapa
        updateMapFolders(state, Object.values(state.keys).filter(Boolean).length);
    } else {
        // Si falló, aseguramos que el botón siga habilitado para reintentar
        submitButton.disabled = false;
    }

    // 5) Mostrar el resultado en el Modal Popup
    showModal(modalTitle, feedbackMessage, isKeyCorrect);
}

// =========================================================
// 7. LÓGICA DE INTERACCIÓN (listeners) - AUDIO CORREGIDO
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. REPORTES
    const INNOCENCE_REPORT = {
        'Agente Vega': { name: 'Dra. Vega', avatar: 'vega.png', justification: "Su actividad múltiple era por sobrecarga de trabajo." },
        'Agente Leo': { name: 'Agente Leo', avatar: 'leo.png', justification: "Investigaba vulnerabilidades proactivamente (Hacker Gris)." },
        'Agente Kael': { name: 'Agente Kael', avatar: 'kael.png', justification: "Sus credenciales fueron robadas antes de entrar. Es víctima." },
        'Caso final (Enlace + WPS)': { name: 'Enlace acortado + WPS mal compartido', avatar: 'iot.png', justification: "El problema real fue un enlace acortado que llevó a un documento WPS con permisos de edición para cualquiera. Se aprovechó de malas configuraciones y apuro." }
    };

    let state = loadState();

    // Botón Start
    document.getElementById('btn-start')?.addEventListener('click', () => {
        setScreen('screen-game'); setSubScreen('screen-map'); updateHUD();
    });

    // --- LÓGICA DE CARPETAS Y MISIONES ---
    document.querySelectorAll('.folder button[data-target-screen], .folder button[data-targetscreen]').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetSubScreenId = e.target.dataset.targetScreen || e.target.dataset.targetscreen;
            const folderElement = e.target.closest('.folder');
            if (!folderElement) return;
            
            const missionId = folderElement.dataset.missionId || folderElement.getAttribute('data-mission-id');
            const index = ORDER.indexOf(missionId);
            state = loadState(); 

            if (index > 0 && !state.keys[ORDER[index - 1]] && !state.keys[missionId]) {
                if (typeof showModal === 'function') showModal("⛔ ACCESO DENEGADO", "Completa la misión anterior.", false);
                else alert('Misión Bloqueada.');
                e.preventDefault(); return;
            }

            if (targetSubScreenId) {
                setSubScreen(targetSubScreenId);
                const brieferInfo = MISSION_BRIEFERS[missionId];
                if (brieferInfo) {
                    const container = document.getElementById(`${targetSubScreenId}-briefing`);
                    if (container) {
                        // Carga de info básica
                        const vidId = BOSS_VIDEOS[brieferInfo.name];
                        const vidWrap = container.querySelector('.video-wrapper');
                        
                        // CONFIGURACIÓN 1: Briefings normales -> SIN SONIDO (false) para que no se bloqueen
                        if (vidId && vidWrap) loadYoutubeVideo(vidWrap.id, vidId, false); 

                        container.querySelector('.briefer-name').textContent = `Informe de: ${brieferInfo.name}`;
                        container.querySelector('img.avatar').src = brieferInfo.avatar;

                        const descEl = container.querySelector('.briefing-text');
                        if (descEl) descEl.innerHTML = state.keys[missionId] ? BRIEF[missionId].post_mission_concern : BRIEF[missionId].description;

                        // UI
                        // Cada misión puede tener varios bloques interactivos.
                        // Mostramos/ocultamos TODOS para evitar que queden partes “colgadas”
                        // cuando una misión se marca como completada.
                        const uiBlocks = container.querySelectorAll('.challenge-ui');
                        const unlock = container.parentElement.querySelector('.unlock');
                        const btn = getSubmitButton(missionId);
                        const inp = getChallengeKeyInput(missionId);

                        if (typeof resetSubmitButton === 'function') resetSubmitButton(missionId, btn, inp);

                        if (state.keys[missionId]) {
                            uiBlocks.forEach(b => b.style.display = 'none');
                            if (unlock) unlock.style.display = 'none';
                            if (btn) {
                                btn.textContent = 'Volver al Mapa';
                                btn.className = 'btn secondary';
                                btn.onclick = () => setSubScreen('screen-map');
                            }
                            if (inp) inp.disabled = true;
                        } else {
                            uiBlocks.forEach(b => b.style.display = 'block');
                            if (unlock) unlock.style.display = 'block';
                        }
                    }
                }

                // Cargas específicas
                if (targetSubScreenId === 'mission2') renderSuspectChoiceUI(state);
                if (targetSubScreenId === 'mission3') loadGeniallyIframe('genially-container-wrapper-m3', 'https://view.genially.com/68f7f6a5e20bb1a9756973c5/interactive-content-3m-cuarto-oscuro');
                // Misión 4 y Caso final ahora son simulaciones en HTML (sin Genially).
            }
        });
    });

    // Footer
    document.querySelectorAll('.footer-actions button[data-target-screen="screen-map"]').forEach(b => {
        b.addEventListener('click', () => { setSubScreen('screen-map'); updateHUD(); });
    });

    // Eventos Submit
    const tryAttach = (ids, fn) => { ids.forEach(id => { const el = document.getElementById(id); if (el) { const n = el.cloneNode(true); el.parentNode.replaceChild(n, el); n.addEventListener('click', fn); }}); };
    tryAttach(['mission1-btn-submit', 'intro-btn-submit'], () => handleMissionSubmitClick('intro'));
    tryAttach(['btn-confirm-suspect', 'hackers-btn-confirm'], () => handleMissionSubmitClick('hackers'));
    tryAttach(['mission3-btn-submit', 'credenciales-btn-submit'], () => handleMissionSubmitClick('credenciales'));
    tryAttach(['mission4-btn-submit', 'ing_social-btn-submit'], () => handleMissionSubmitClick('ing_social'));
    tryAttach(['mission5-btn-submit', 'iot-btn-submit'], () => handleMissionSubmitClick('iot'));
    tryAttach(['mission6-btn-submit', 'caso_final-btn-submit'], () => handleMissionSubmitClick('caso_final'));

    // ---------------------------------------------------------
    // Misiones con quiz (phishing / caso final): al aprobar, revelan y precargan la clave
    // ---------------------------------------------------------
    function evaluateMcqBlock(containerEl) {
        if (!containerEl) return { ok: false, total: 0, correct: 0, message: 'No se encontró el quiz.' };
        const blocks = [...containerEl.querySelectorAll('.mcq')];
        let correct = 0;
        blocks.forEach(b => { if (b.dataset.answered === 'true' && b.dataset.isCorrect === 'true') correct++; });
        const ok = blocks.length > 0 && correct === blocks.length;
        const message = ok ? '' : `Te faltan respuestas correctas (${correct}/${blocks.length}).`;
        return { ok, total: blocks.length, correct, message };
    }

    function attachMcqPickers(scopeSelector) {
        document.querySelectorAll(`${scopeSelector} .mcq .choice[data-mcq]`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mcq = e.target.closest('.mcq');
                if (!mcq) return;

                const pickedBtn = e.target;
                const picked = pickedBtn.dataset.mcq;
                const correct = (mcq.dataset.correct || '').trim();

                // reset
                mcq.querySelectorAll('.choice').forEach(b => b.classList.remove('picked','correct','incorrect'));
                pickedBtn.classList.add('picked');

                // mark state
                mcq.dataset.answered = 'true';
                const isCorrect = picked === correct;
                mcq.dataset.isCorrect = isCorrect ? 'true' : 'false';
                pickedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

                // explanation / feedback per question
                const explain = pickedBtn.dataset.explain;
                let fb = mcq.querySelector('.mcq-feedback');
                if (!fb) {
                    fb = document.createElement('div');
                    fb.className = 'mcq-feedback';
                    mcq.appendChild(fb);
                }
                fb.innerHTML = (isCorrect ? '✅ ' : '❌ ') + (explain || (isCorrect ? 'Correcto.' : 'No es la mejor opción en este caso.'));

                if (!isCorrect) updateScore(-10);
            });
        });
    }


    ['#quiz-m1','#quiz-m2','#quiz-m3','#phishing-quiz','#quiz-m5','#casefinal-quiz'].forEach(sel => attachMcqPickers(sel));


    // Restaurar estado de quizzes (si el usuario recarga la página)
    (function restoreQuizzes(){
        if (isQuizPassed('m1')) {
            const inp = document.getElementById('mission1-challenge-key');
            if (inp && !inp.value) inp.value = CLAVES.intro;
            setQuizUI('btn-check-m1-quiz','m1-quiz-result', `✅ ¡Bien! Clave revelada: <b>${CLAVES.intro}</b>.`);
        }
        if (isQuizPassed('m2')) {
            setQuizUI('btn-check-m2-quiz','m2-quiz-result', `✅ ¡Perfecto! Bonus ya otorgado.`);
        }
        if (isQuizPassed('m3')) {
            setQuizUI('btn-check-m3-quiz','m3-quiz-result', `✅ Ya habías obtenido el bonus. El código se busca en la <b>Habitación Oscura</b> (Genially).`);
        }
        if (isQuizPassed('m5')) {
            const inp = document.getElementById('mission5-challenge-key');
            if (inp && !inp.value) inp.value = CLAVES.iot;
            setQuizUI('btn-check-m5-quiz','m5-quiz-result', `✅ Clave revelada: <b>${CLAVES.iot}</b>.`);
        }
    })();

    document.getElementById('btn-check-m1-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('quiz-m1'));
        const out = document.getElementById('m1-quiz-result');
        if (!out) return;
        if (!res.ok) { out.innerHTML = `⚠️ ${res.message}`; return; }
        const inp = document.getElementById('mission1-challenge-key');
        if (inp) inp.value = CLAVES.intro;
        markQuizPassed('m1');
        setQuizUI('btn-check-m1-quiz', 'm1-quiz-result', `✅ ¡Bien! Clave revelada: <b>${CLAVES.intro}</b>.`);
    });

    document.getElementById('btn-check-m2-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('quiz-m2'));
        const out = document.getElementById('m2-quiz-result');
        if (!out) return;
        if (!res.ok) { out.innerHTML = `⚠️ ${res.message}`; return; }
        const first = markQuizPassed('m2');
        if (first) updateScore(75);
        setQuizUI('btn-check-m2-quiz', 'm2-quiz-result', `✅ ${first ? '¡Perfecto! <b>Bonus +75</b> puntos por buenas prácticas.' : '¡Perfecto! Bonus ya otorgado.'}`);
    });

    document.getElementById('btn-check-m3-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('quiz-m3'));
        const out = document.getElementById('m3-quiz-result');
        if (!out) return;
        if (!res.ok) { out.innerHTML = `⚠️ ${res.message}`; return; }
        const first = markQuizPassed('m3');
        if (first) updateScore(75);
        setQuizUI('btn-check-m3-quiz','m3-quiz-result', `✅ ¡Bien! ${first ? 'Bonus: <b>+75</b> puntos.' : 'Ya habías obtenido el bonus.'} Ahora el código se busca arriba en la <b>Habitación Oscura</b> (Genially).`);
    });

    document.getElementById('btn-check-m5-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('quiz-m5'));
        const out = document.getElementById('m5-quiz-result');
        if (!out) return;
        if (!res.ok) { out.innerHTML = `⚠️ ${res.message}`; return; }
        const inp = document.getElementById('mission5-challenge-key');
        if (inp) inp.value = CLAVES.iot;
        markQuizPassed('m5');
        setQuizUI('btn-check-m5-quiz', 'm5-quiz-result', `✅ Clave revelada: <b>${CLAVES.iot}</b>.`);
    });

    document.getElementById('btn-check-phishing-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('phishing-quiz'));
        const out = document.getElementById('phishing-quiz-result');
        if (!out) return;
        if (res.ok) {
            out.innerHTML = `✅ Bien. Clave: <b>${CLAVES.ing_social}</b>`;
            const inp = document.getElementById('mission4-challenge-key');
            if (inp) inp.value = CLAVES.ing_social;
        } else {
            out.innerHTML = `❌ Te faltan respuestas correctas (${res.correct}/${res.total}). Revisa las señales del mail.`;
        }
    });

    document.getElementById('btn-check-casefinal-quiz')?.addEventListener('click', () => {
        const res = evaluateMcqBlock(document.getElementById('casefinal-quiz'));
        const out = document.getElementById('casefinal-quiz-result');
        if (!out) return;
        if (res.ok) {
            out.innerHTML = `✅ Caso entendido. Clave final: <b>${CLAVES.caso_final}</b>`;
            const inp = document.getElementById('mission6-challenge-key');
            if (inp) inp.value = CLAVES.caso_final;
        } else {
            out.innerHTML = `❌ Aún no (${res.correct}/${res.total}). Pista: primero se verifica y se controlan permisos.`;
        }
    });

    // Puzzles (CID, Hackers, IoT)
    document.querySelectorAll('#challenge-cid .choice').forEach(b => b.addEventListener('click', (e) => {
        const p = e.target.closest('.challenge-item');
        p.querySelectorAll('.choice').forEach(x => x.classList.remove('picked','correct','incorrect'));
        e.target.classList.add('picked');
        if (e.target.dataset.key === p.dataset.cidCorrect) { 
            if (!p.dataset.scored) {
                updateScore(166);
                p.dataset.scored = 'true';
            }
            e.target.classList.add('correct'); 
        }
        else { updateScore(-25); e.target.classList.add('incorrect'); }
    }));
    
    // =========================================================
    // CORRECCIÓN CRÍTICA DE LA MISIÓN 2
    // =========================================================
    document.querySelectorAll('#challenge-hackers .choice').forEach(b => b.addEventListener('click', (e) => {
        const p = e.target.closest('.challenge-item');
        p.querySelectorAll('.choice').forEach(x => x.classList.remove('picked','correct','incorrect'));
        e.target.classList.add('picked');
        if (e.target.dataset.hackerType === p.dataset.hackerCorrect) { 
            if (!p.dataset.scored) { // Verifica si no ha sido puntuado antes
                updateScore(50);
                p.dataset.scored = 'true'; // <--- LA LÍNEA CRÍTICA AÑADIDA
            } 
            e.target.classList.add('correct'); 
        }
        else { updateScore(-25); e.target.classList.add('incorrect'); }
        renderSuspectChoiceUI(loadState()); // Llama a la función para re-renderizar y comprobar si habilita
    }));
    // =========================================================

    document.querySelectorAll('#challenge-iot .choice').forEach(b => b.addEventListener('click', (e) => {
        const p = e.target.closest('.challenge-item');
        p.querySelectorAll('.choice').forEach(x => x.classList.remove('picked','correct','incorrect'));
        e.target.classList.add('picked');
        if (e.target.dataset.iotOption === p.dataset.iotCorrect) { 
            if (!p.dataset.scored) {
                updateScore(166);
                p.dataset.scored = 'true';
            }
            e.target.classList.add('correct'); 
        }
        else { updateScore(-50); e.target.classList.add('incorrect'); }
    }));

    // =========================================================
    // 7. EVENTO FINAL (CONFIGURACIÓN INDEPENDIENTE)
    // =========================================================
    document.getElementById('btn-confirm-final-suspect')?.addEventListener('click', () => {
        let cur = loadState();
        if (!cur.final_suspect_choice) { 
            if (typeof showModal === 'function') showModal("⚠️ ATENCIÓN", "Por favor, selecciona al Código Fantasma.", false);
            else alert('Selecciona al culpable.'); 
            return; 
        }
        
        const REAL_CULPRIT_KEY = 'Caso final (Enlace + WPS)';
        let finalMessage = ""; 
        let finalScoreAdjustment = 0;
        let isVictory = (cur.final_suspect_choice === REAL_CULPRIT_KEY);

        if (isVictory) {
            // VICTORIA
            finalMessage = `
                <h3 style="color: var(--success); margin-bottom: 15px;">✅ ¡HAS DESENMASCARADO AL CÓDIGO FANTASMA!</h3>
                <p>La infiltración se originó en el <b>combo del Caso final</b>: un <b>enlace acortado</b> que llevó a un documento en <b>WPS</b> mal compartido ("cualquiera con el enlace puede editar"). No era “un villano”: fue una cadena de decisiones inseguras.</p>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 15px;">
                    ${['Agente Vega', 'Agente Leo', 'Agente Kael'].map(agentKey => `
                        <div style="text-align: center; width: 120px;">
                            <img src="${INNOCENCE_REPORT[agentKey].avatar}" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--accent);">
                            <p style="font-size: 0.8em; margin:0;"><strong>${INNOCENCE_REPORT[agentKey].name}</strong></p>
                        </div>
                    `).join('')}
                </div>
            `;
            finalScoreAdjustment = 5000;
        } else {
            // DERROTA
            const chosen = INNOCENCE_REPORT[cur.final_suspect_choice];
            finalMessage = `
                <h3 style="color: var(--error); margin-bottom: 15px;">⚠️ CULPABLE INCORRECTO</h3>
                <div style="text-align: center;">
                    <img src="${chosen.avatar}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--error);">
                    <p>Acusaste a <strong>${chosen.name}</strong>.</p>
                </div>
                <p>${chosen.justification}</p>
                <p style="margin-top: 15px;">El verdadero culpable era: <strong>${INNOCENCE_REPORT[REAL_CULPRIT_KEY].name}</strong></p>
            `;
            finalScoreAdjustment = -2000;
        }

        // SECCIÓN COMÚN: Cierre atrapante + síntesis de aprendizajes
        finalMessage += `
            <div style="margin-top: 30px; border-top: 1px dashed var(--line); padding-top: 20px;">
                <h3 style="margin: 0 0 10px;">🧾 Protocolo de Finalización</h3>
                <p style="margin: 0 0 12px;">Lo importante no fue “atrapar a alguien”, sino ver la <b>cadena</b>: un descuido habilita otro, y así se arma el camino.</p>
                <div style="text-align:left; max-width: 680px; margin: 0 auto;">
                    <p style="margin: 10px 0 6px;"><b>Lo que hoy quedó claro:</b></p>
                    <ul style="margin: 0 0 12px 18px;">
                        <li><b>CID</b>: si cambia un documento, no es “solo un error”: puede romper <b>integridad</b> (y afectar decisiones reales).</li>
                        <li><b>Higiene digital</b>: una sesión abierta o contraseñas guardadas son puertas “listas para usar”.</li>
                        <li><b>Contraseñas + MFA</b>: protegen tu <b>privacidad</b> (mensajes, fotos, calificaciones) y la del INSTITUTO.</li>
                        <li><b>Phishing</b>: la urgencia y la autoridad son trampas. Verificar por otro canal corta el ataque.</li>
                        <li><b>IoT</b>: dispositivos y apps “útiles” pueden recolectar datos de más si das permisos sin mirar.</li>
                        <li><b>Compartir con criterio</b>: “cualquiera con el enlace edita” es el atajo que más caro sale.</li>
                    </ul>
                    <p style="margin: 10px 0 6px;"><b>Plan mínimo (3 hábitos que cambian todo):</b></p>
                    <ol style="margin: 0 0 0 18px;">
                        <li><b>Cerrá sesión</b> en PCs compartidas + no guardes contraseñas en el navegador.</li>
                        <li>Usá <b>contraseñas únicas</b> (mejor frase larga) + activá <b>MFA</b> en cuentas institucionales.</li>
                        <li>Antes de compartir: revisá <b>permisos</b> y el <b>destino real</b> de los enlaces.</li>
                    </ol>
                </div>
                <div style="margin-top: 14px; text-align:center;">
                    <p style="margin: 0; color: var(--muted);">Listo. El INSTITUTO no necesita “hackers”, necesita hábitos.</p>
                </div>
            </div>
        `;
        
        let stateNow = loadState();
        stateNow.score = Math.round(Math.max(0, stateNow.score + finalScoreAdjustment)); 
        saveState(stateNow);
        
        const msgContainer = document.getElementById('final-message');
        if (msgContainer) msgContainer.innerHTML = finalMessage;
        
        document.getElementById('final-score') && (document.getElementById('final-score').textContent = stateNow.score);
        
        // No agregamos “misiones extra” aquí: el cierre termina el caso.

        setSubScreen('screen-end');
        updateHUD(); 
    });

    // Replay
    document.getElementById('btn-replay')?.addEventListener('click', () => {
        localStorage.removeItem('atlas_firewall_state');
        location.reload();
    });

    // Inicialización
    document.getElementById('diary-toggle-btn')?.addEventListener('click', toggleDiary);
    if(typeof updateDiaryUI === 'function') updateDiaryUI();
    updateHUD();
    setScreen('screen-start');

    // Terminal (Decisión Final)
    document.getElementById('btn-terminal')?.addEventListener('click', () => {
        const cur = loadState();
        const collected = Object.values(cur.keys).filter(Boolean).length;
        if (collected < 6) {
            showModal('⛔ TERMINAL BLOQUEADA', 'Completa todas las misiones para acceder a la decisión final.', false);
            return;
        }

        // Pantalla final en página aparte (mejor visualización en mobile)
        window.location.href = './final.html';
    });
});


// =========================================================
// FINAL (PÁGINA APARTE) — Operación "Aula Segura"
// =========================================================

function initFinalPage() {
    const root = document.getElementById('final-page');
    if (!root) return; // No estamos en final.html

    const state = loadState();
    const collected = Object.values(state.keys || {}).filter(Boolean).length;

    const lockedBox = document.getElementById('final-locked');
    const unlockedBox = document.getElementById('final-unlocked');

    if (collected < 6) {
        if (lockedBox) lockedBox.classList.remove('hidden');
        if (unlockedBox) unlockedBox.classList.add('hidden');
        document.getElementById('go-back-map')?.addEventListener('click', () => {
            window.location.href = './game.html';
        });
        return;
    }

    if (lockedBox) lockedBox.classList.add('hidden');
    if (unlockedBox) unlockedBox.classList.remove('hidden');

    const suspects = [
        {
            id: 'A',
            title: 'Perfil A — Eficiencia sobre protocolo',
            short: 'Apuro + atajos: sesión abierta, claves guardadas, “después lo cierro”.',
            img: 'suspect_a.svg'
        },
        {
            id: 'B',
            title: 'Perfil B — Confianza institucional',
            short: 'Cree en lo “oficial”: logo, firma, urgencia… y hace clic sin verificar.',
            img: 'suspect_b.svg'
        },
        {
            id: 'C',
            title: 'Perfil C — Colaboración sin límites',
            short: 'Comparte de más: permisos abiertos, reenviar enlaces, “edición para cualquiera”.',
            img: 'suspect_c.svg'
        }
    ];

    const cards = document.getElementById('suspect-cards');
    const hint = document.getElementById('final-hint');
    const confirmBtn = document.getElementById('btn-confirm-verdict');
    const verdictArea = document.getElementById('verdict-area');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictBody = document.getElementById('verdict-body');

    let choice = state.final_suspect_choice || null;

    function renderCards() {
        if (!cards) return;
        cards.innerHTML = '';
        suspects.forEach(s => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'suspect-card' + (choice === s.id ? ' selected' : '');
            card.setAttribute('aria-pressed', choice === s.id ? 'true' : 'false');
            card.dataset.suspectId = s.id;

            card.innerHTML = `
                <div class="suspect-photo">
                    <img src="${s.img}" alt="Foto del ${s.title}" loading="lazy">
                </div>
                <div class="suspect-info">
                    <div class="suspect-title">${s.title}</div>
                    <div class="suspect-short">${s.short}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                choice = s.id;
                // Guardamos, pero NO pedimos justificación
                const cur = loadState();
                cur.final_suspect_choice = choice;
                saveState(cur);

                renderCards();
                if (hint) hint.classList.add('hidden');
            });

            cards.appendChild(card);
        });
    }

    renderCards();

    confirmBtn?.addEventListener('click', () => {
        if (!choice) {
            if (hint) {
                hint.textContent = 'Elegí un perfil. Si cambiaste de idea, podés cambiarlo sin justificar. Antes de confirmar, leé las pistas.';
                hint.classList.remove('hidden');
            }
            return;
        }

        const cur = loadState();
        cur.final_suspect_choice = choice;
        saveState(cur);

        // Bloqueamos selección visualmente (pero si querés permitir cambiar, quitar este bloque)
        document.querySelectorAll('.suspect-card').forEach(btn => btn.setAttribute('disabled','disabled'));

        if (verdictArea) verdictArea.classList.remove('hidden');

        const chosen = suspects.find(s => s.id === choice);
        if (verdictTitle) verdictTitle.textContent = `Tu veredicto: ${chosen ? chosen.title : 'Perfil seleccionado'}`;

        const whyNotSolo = {
            A: `Si fuera “solo” el Perfil A, el daño habría quedado en una cuenta o una PC. Pero el ataque escaló porque también hubo clics impulsivos y permisos abiertos: sin eso, no se modificaba un documento clave ni se propagaba el caos.`,
            B: `Si fuera “solo” el Perfil B, alguien podría caer en el correo… pero sin sesiones abiertas, contraseñas guardadas o permisos mal configurados, el atacante no habría tenido cómo avanzar ni sostener el acceso.`,
            C: `Si fuera “solo” el Perfil C, compartir de más sería riesgoso… pero sin cuentas expuestas (sesiones/contraseñas) y sin phishing que multiplique víctimas, el ataque no habría tomado volumen ni velocidad.`
        };

        const body = `
            <p><b>Importante:</b> el entrenamiento terminó, pero el “culpable real” no es una sola persona. El caso muestra algo más incómodo: <b>la brecha ocurrió por una cadena de malos hábitos</b> que se fueron sumando.</p>

            <p><b>Por qué NO es “solo” tu sospechoso:</b> ${whyNotSolo[choice] || 'Porque un solo eslabón no explica toda la cadena.'}</p>

            <div class="verdict-box">
                <h4>✅ Culpables reales: hábitos que abren puertas</h4>
                <ul>
                    <li><b>Sesiones abiertas</b> en equipos compartidos (“vuelvo en 5 minutos”).</li>
                    <li><b>Contraseñas guardadas</b> en el navegador y reutilizadas.</li>
                    <li><b>Sin MFA</b> (doble verificación): una contraseña sola no alcanza.</li>
                    <li><b>Clic sin verificar</b> cuando aparece urgencia/autoridad (phishing).</li>
                    <li><b>Reenvíos</b> de enlaces “por ayudar” sin confirmar origen.</li>
                    <li><b>Permisos abiertos</b> en documentos (“cualquiera puede editar”).</li>
                    <li><b>Apps/dispositivos</b> con permisos excesivos o sin control.</li>
                </ul>
            </div>

            <p class="closing-line">Desde hoy, estás listo/a para actuar como <b>Agente Aula Segura</b> en tu INSTITUTO: detectar, frenar y corregir malos hábitos en el momento, sin culpar… pero sin dejar pasar.</p>
        `;

        if (verdictBody) verdictBody.innerHTML = body;

        // Mostrar video + medalla al final del debrief
        document.getElementById('final-video')?.classList.remove('hidden');
        document.getElementById('medal-section')?.classList.remove('hidden');

        // Scroll a la sección de video para “cierre”
        setTimeout(() => document.getElementById('final-video')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    });

    // Video YT (cambiar ID en final.html)
    const iframe = document.getElementById('final-youtube-iframe');
    const videoId = iframe?.dataset?.videoId;
    if (iframe && videoId && !iframe.src) {
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
    }

    // Generador de medalla
    const nameInput = document.getElementById('player-name');
    const genBtn = document.getElementById('btn-generate-medal');
    const medalCanvas = document.getElementById('medal-canvas');
    const medalPreview = document.getElementById('medal-preview');
    const dlBtn = document.getElementById('btn-download-medal');
    const msg = document.getElementById('medal-msg');

    function drawMedal(name) {
        if (!medalCanvas) return null;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const size = 900;
        medalCanvas.width = size * dpr;
        medalCanvas.height = size * dpr;
        medalCanvas.style.width = '300px';
        medalCanvas.style.height = '300px';

        const ctx = medalCanvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Fondo
        ctx.clearRect(0,0,size,size);

        // Cinta
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, size, size);

        // Cintas laterales
        ctx.fillStyle = '#2d2d44';
        ctx.fillRect(140, 80, 180, 300);
        ctx.fillRect(580, 80, 180, 300);

        // Medalla (círculo)
        const cx = size/2, cy = 520, r = 260;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = '#ffeb3b';
        ctx.fill();

        // Borde
        ctx.lineWidth = 18;
        ctx.strokeStyle = '#d4af37';
        ctx.stroke();

        // Estrella simple
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = 90;
        const innerRadius = 40;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;
        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Texto
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 48px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SÚPER CIUDADANO', cx, 420);
        ctx.fillText('SEGURO', cx, 470);

        // Nombre (wrap simple)
        const safeName = (name || '').trim().slice(0, 28) || 'AGENTE';
        ctx.font = 'bold 52px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.fillText(safeName.toUpperCase(), cx, 645);

        ctx.font = '24px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.fillText('INSTITUTO — Operación "Aula Segura"', cx, 700);

        // Fecha
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-UY');
        ctx.fillText(dateStr, cx, 735);

        // Devuelve dataURL
        return medalCanvas.toDataURL('image/png');
    }

    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    }

    genBtn?.addEventListener('click', () => {
        const name = nameInput?.value || '';
        if (msg) msg.textContent = '';
        const dataUrl = drawMedal(name);

        if (!dataUrl) {
            if (msg) msg.textContent = 'No se pudo generar la medalla en este dispositivo.';
            return;
        }

        if (medalPreview) {
            medalPreview.src = dataUrl;
            medalPreview.classList.remove('hidden');
        }

        if (dlBtn) {
            // Descarga robusta (evita popups bloqueados)
            const blob = dataURLToBlob(dataUrl);
            const url = URL.createObjectURL(blob);
            dlBtn.dataset.blobUrl = url;
            dlBtn.classList.remove('hidden');
        }

        const cur = loadState();
        cur.player_name = name;
        saveState(cur);
    });

    dlBtn?.addEventListener('click', () => {
        const url = dlBtn.dataset.blobUrl;
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = `medalla_super_ciudadano_seguro.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
            try { URL.revokeObjectURL(url); } catch(_) {}
            dlBtn.dataset.blobUrl = '';
        }, 2500);
    });

    document.getElementById('btn-restart-training')?.addEventListener('click', () => {
        // Reset completo del entrenamiento
        localStorage.removeItem('atlas_firewall_state');
        localStorage.removeItem('INSTITUTO_prank_seen');
        window.location.href = './index.html';
    });
}

// Ejecutar initFinalPage sin interferir con el juego
document.addEventListener('DOMContentLoaded', () => {
    initFinalPage();
});
