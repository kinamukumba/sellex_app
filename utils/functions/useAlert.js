/* ==========================
   CREATEALERT.JS (PREMIUM VERSION)
   ========================== */

function createAlert(sms, type, icon, duration = 5000) {
    // Criar overlay + loader modernizado
    const overlay = document.createElement('div');
    overlay.classList.add('alert-overlay');

    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('alert-loader-container');

    const loader = document.createElement('div');
    loader.classList.add('alert-spinner');

    loaderContainer.appendChild(loader);
    overlay.appendChild(loaderContainer);
    document.body.appendChild(overlay);

    // Esperar processamento para criar uma percepção de carregamento (loader)
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        const div = document.createElement('div');
        const iconEl = document.createElement('i');
        const contentDiv = document.createElement('div');
        const title = document.createElement('h4');
        const p = document.createElement('p');
        const closeBtn = document.createElement('button');
        const progressBar = document.createElement('div');

        // Configuração conforme o type
        let defaultTitle = 'Notificação';
        let typeColor = '#3b82f6'; // Azul padrão (Info)

        if (type === 'error') {
            icon = icon || 'ri-error-warning-fill';
            defaultTitle = 'Erro Operacional';
            typeColor = '#ef4444'; // Red
        } else if (type === 'success') {
            icon = icon || 'ri-checkbox-circle-fill';
            defaultTitle = 'Ação Bem-sucedida';
            typeColor = '#10b981'; // Green
        } else if (type === 'warning') {
            icon = icon || 'ri-alert-fill';
            defaultTitle = 'Atenção Necessária';
            typeColor = '#f59e0b'; // Amber
        } else {
            icon = icon || 'ri-information-fill';
        }

        div.classList.add('premium-alert');
        div.classList.add(`alert-${type || 'info'}`);

        // Ícone
        iconEl.className = `${icon} alert-icon`;
        iconEl.style.color = typeColor;

        // Conteúdo
        contentDiv.classList.add('alert-content');
        title.innerText = defaultTitle;
        p.innerText = sms;
        contentDiv.appendChild(title);
        contentDiv.appendChild(p);

        // Botão de Fechar
        closeBtn.innerHTML = '<i class="ri-close-line"></i>';
        closeBtn.classList.add('alert-close-btn');
        closeBtn.setAttribute('aria-label', 'Fechar alerta');

        // Barra de progresso animada
        progressBar.classList.add('alert-progress');
        progressBar.style.backgroundColor = typeColor;
        progressBar.style.animationDuration = `${duration}ms`;

        // Montar Alerta
        div.appendChild(iconEl);
        div.appendChild(contentDiv);
        div.appendChild(closeBtn);
        div.appendChild(progressBar);

        // Obter ou criar container principal dos alertas
        let container = document.querySelector('.alert-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('alert-container');
            document.body.appendChild(container);
        }

        container.appendChild(div);

        // Trigger reflow para iniciar a animação corretamente de slide in
        void div.offsetWidth;
        div.classList.add('active');

        // Funcionalidade de Auto-close controlada robusta
        let isPaused = false;
        let timeoutId;
        let startTime = Date.now();
        let remainingDuration = duration;

        const removeAlert = () => {
            if (!div.classList.contains('fade-out')) {
                div.classList.add('fade-out');
                setTimeout(() => {
                    if (div.parentNode) {
                        div.parentNode.removeChild(div);
                    }
                    // Remover container de alertas se vazio
                    if (container.children.length === 0 && container.parentNode) {
                        container.parentNode.removeChild(container);
                    }
                }, 400); // Sincronizado com a duração do CSS transition
            }
        };

        const startTimer = () => {
            timeoutId = setTimeout(removeAlert, remainingDuration);
            progressBar.style.animationPlayState = 'running';
        };

        const pauseTimer = () => {
            clearTimeout(timeoutId);
            const elapsedTime = Date.now() - startTime;
            remainingDuration -= elapsedTime;
            progressBar.style.animationPlayState = 'paused';
        };

        startTimer();

        // Pausar toda vez que houver interação no alerta (hover mouse)
        div.addEventListener('mouseenter', () => {
            if (!isPaused) {
                isPaused = true;
                pauseTimer();
            }
        });

        // Retomar o tempo quando tirar o rato de cima
        div.addEventListener('mouseleave', () => {
            if (isPaused) {
                isPaused = false;
                startTime = Date.now(); // Resetar count inicial
                startTimer();
            }
        });

        closeBtn.addEventListener('click', removeAlert);

        // Garante que o fim da animação da barra dispare o fechamento visual perfeitamente
        progressBar.addEventListener('animationend', removeAlert);

    }, 1000); // 1s fixo do loader do backend proxy call
}

/* =========================================================
   ESTILOS DO ALERT PREMIUM (GLASSMORPHISM & MODERN UI APPS)
   ========================================================= */

const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
    --bg-overlay: rgba(15, 23, 42, 0.4);
    --alert-bg: #ffffff;
    --alert-text: #1e293b;
    --alert-desc: #64748b;
    --alert-border: rgba(203, 213, 225, 0.6);
    --alert-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    --alert-radius: 12px;
}

/* Compatibilidade perfeita para dark mode. */
[data-theme="dark"] body, 
body.dark-mode {
    --alert-bg: rgba(30, 41, 59, 0.95);
    --alert-text: #f8fafc;
    --alert-desc: #94a3b8;
    --alert-border: rgba(71, 85, 105, 0.4);
    --alert-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
}

.alert-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-end;
    z-index: 999999;
    max-width: 400px;
    width: 100%;
    pointer-events: none; /* Permite clicks atravessarem os espaços do container */
}

.premium-alert {
    position: relative;
    width: 100%;
    background-color: var(--alert-bg);
    border-radius: var(--alert-radius);
    box-shadow: var(--alert-shadow);
    border: 1px solid var(--alert-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: flex-start;
    padding: 16px 20px;
    gap: 16px;
    pointer-events: auto; /* Reativa os clicks dentro do alerta */
    overflow: hidden;
    transform: translateX(120%) scale(0.95);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
    font-family: 'Inter', system-ui, sans-serif;
    will-change: transform, opacity;
}

.premium-alert.active {
    transform: translateX(0) scale(1);
    opacity: 1;
}

.premium-alert.fade-out {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
}

.alert-icon {
    font-size: 26px;
    flex-shrink: 0;
    margin-top: 2px;
}

.alert-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.alert-content h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--alert-text);
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.alert-content p {
    margin: 0;
    font-size: 14px;
    color: var(--alert-desc);
    line-height: 1.5;
    word-break: break-word;
}

.alert-close-btn {
    background: transparent;
    border: none;
    color: var(--alert-desc);
    cursor: pointer;
    font-size: 22px;
    padding: 4px;
    margin: -4px -4px 0 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: color 0.2s, background-color 0.2s;
    flex-shrink: 0;
}

.alert-close-btn:hover {
    color: var(--alert-text);
    background-color: rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .alert-close-btn:hover,
body.dark-mode .alert-close-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.alert-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px; /* Barra de progresso para denotar o tempo restante */
    background-color: #3b82f6; 
    animation: alert-progress-shrink linear forwards;
    transform-origin: left;
    opacity: 0.8;
}

@keyframes alert-progress-shrink {
    0% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
}

@media(max-width: 480px) {
    .alert-container {
        right: 16px;
        left: 16px;
        bottom: 16px;
        max-width: calc(100% - 32px);
    }
}

/* OVERLAY + LOADER MODERNIZADO */
.alert-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000000;
    animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.alert-loader-container {
    background: var(--alert-bg);
    padding: 24px;
    border: 1px solid var(--alert-border);
    border-radius: 20px;
    box-shadow: var(--alert-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-spinner {
    width: 44px;
    height: 44px;
    border: 4px solid rgba(0,0,0,0.05);
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin-premium 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
}

[data-theme="dark"] .alert-spinner,
body.dark-mode .alert-spinner {
    border-color: rgba(255,255,255,0.05);
    border-top-color: #3b82f6;
}

@keyframes spin-premium {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);