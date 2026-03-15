/* ==========================
   CREATEALERT.JS
   ========================== */

function createAlert(sms, type, icon, duration = 5000) {
    // Criar overlay + loader
    const overlay = document.createElement('div');
    overlay.classList.add('alert-overlay');

    const loader = document.createElement('div');
    loader.classList.add('alert-loader');
    overlay.appendChild(loader);

    document.body.appendChild(overlay);

    // Esperar 1s antes de mostrar o alerta
    setTimeout(() => {
        document.body.removeChild(overlay);

        const div = document.createElement('div')
        const i = document.createElement('i')
        const p = document.createElement('p')

        // assign a modifier class so the styles are handled in CSS
        if (type === 'error') {
            div.classList.add('alert-error');
            icon = 'ri-close-circle-line';
        }
        if (type === 'success') {
            div.classList.add('alert-success');
            icon = 'ri-checkbox-circle-line';
        }
        if (type === 'warning') {
            div.classList.add('alert-warning');
            icon = 'ri-information-line';
        }

        div.classList.add('alert-message');
        i.classList.add(icon);
        div.append(i);
        div.append(p);
        p.innerText = sms;

        // ensure there is a single alert container to stack messages
        let container = document.querySelector('.alert-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('alert-container');
            document.body.appendChild(container);
        }

        container.appendChild(div);
        div.classList.add('active')

        setTimeout(() => {
            const parent = div.parentNode;
            if (parent && parent.contains(div)) {
                div.classList.add('fade-out');
                // give the fade animation time to play before removing
                setTimeout(() => {
                    if (parent && parent.contains(div)) {
                        parent.removeChild(div);
                    }
                }, 300);
            }
        }, duration) // <-- tempo configurável
    }, 1000); // tempo fixo do loader (1s)
}

/* ==========================
   ESTILOS DO ALERT + LOADER
   ========================== */

const style = document.createElement("style");
style.innerHTML = `
/* ALERT */
:root {
    --alert-error-start: #ff4d4f;
    --alert-error-end: #ff7875;
    --alert-success-start: #52c41a;
    --alert-success-end: #95de64;
    --alert-warning-start: #faad14;
    --alert-warning-end: #ffd666;
    --alert-text-color: #fff;
}
.alert-container {
    position: fixed;
    bottom: 1%;
    right: 1%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
    z-index: 300000;
    max-width: 90vw;
    pointer-events: none; /* allow clicks to pass through gaps */
}

.alert-message {
    position: relative;
    width: auto;
    padding: 12px 20px;
    min-height: 40px;
    background-color: transparent;
    color: var(--alert-text-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    opacity: .95;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    display: none;
    backdrop-filter: blur(20px);
    transition: transform .3s ease, opacity .3s ease;
    font-family: system-ui, sans-serif;
    pointer-events: auto; /* make the alert itself interactive */
}
.alert-message p {
    font-size: 1rem;
    color: var(--alert-text-color);
    margin: 0;
    word-break: break-word;
}
.alert-message i {
    font-size: 1.25rem;
    color: var(--alert-text-color);
}
.alert-message.active {
    display: flex;
    animation: active-alert .5s ease-out;
}
.alert-message.fade-out {
    opacity: 0 !important;
    transform: translateX(20%);
}

.alert-message.alert-error {
    border: 1px solid var(--alert-error-start);
    background: linear-gradient(135deg, var(--alert-error-start), var(--alert-error-end));
}
.alert-message.alert-success {
    border: 1px solid var(--alert-success-start);
    background: linear-gradient(135deg, var(--alert-success-start), var(--alert-success-end));
}
.alert-message.alert-warning {
    border: 1px solid var(--alert-warning-start);
    background: linear-gradient(135deg, var(--alert-warning-start), var(--alert-warning-end));
}

@keyframes active-alert {
    0% { transform: translateX(5%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}
@keyframes progress-alert {
    0% { width: 100%; }
    100% { width: 5%; }
}
@media(max-width: 500px) {
    .alert-container {
        left: 5%;
        right: 5%;
        bottom: 5%;
        align-items: center;
    }
    .alert-message {
        width: 100%;
        max-width: 100%;
        max-height: auto;
        padding: 10px 16px;
    }
}

/* LOADER + OVERLAY */
.alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 400000;
}

.alert-loader {
    width: 60px;
    height: 60px;
    border: 6px solid #ddd;
    border-top: 6px solid #3333339b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);