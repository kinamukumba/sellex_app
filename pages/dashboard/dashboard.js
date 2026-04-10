// ==============================================================
// Admin Dashboard JS Logic
// ==============================================================

const DASHBOARD_API = 'https://api.at-investimentos.ao/api/dashboard_stats.php';
const API_KEY = 'SELLEX_2026_SECRET';

async function fetchDashboardData() {
    try {
        const res = await fetch(DASHBOARD_API, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            if(res.status === 401) throw new Error("Acesso Negado: A chave da API é inválida ou o endereço está incorreto.");
            if(res.status === 404) throw new Error("API não encontrada. Garantiste que subiste a nova api 'dashboard_stats.php' para o servidor da AT-Investimento?");
            throw new Error(`Erro de rede do servidor. Estado: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.success) {
            throw new Error(json.message || "Falha não especificada ao tentar analisar os dados do servidor.");
        }

        populateUI(json.data);
    } catch(err) {
        console.error(err);
        showError(err.message);
    }
}

function showError(msg) {
    const el = document.getElementById('error-alert');
    if (el) {
        el.innerText = msg;
        el.style.display = 'block';
    }
    document.querySelectorAll('.loading-state').forEach(loader => {
        loader.innerText = 'Falha no carregamento. Verifique o alerta a cima.';
        loader.style.color = '#FCA5A5';
    });
}

function populateUI(data) {
    // Update KPI Cards
    const kpiTotal = document.getElementById('kpi-total');
    const kpiBiz = document.getElementById('kpi-top-business');
    const kpiVol = document.getElementById('kpi-top-volume');
    
    if (kpiTotal) kpiTotal.innerText = data.total_demos || 0;
    
    if (kpiBiz) {
        if (data.by_business_type && data.by_business_type.length > 0) {
            kpiBiz.innerText = data.by_business_type[0].business_type;
        } else {
            kpiBiz.innerText = '-';
        }
    }

    if (kpiVol) {
        if (data.by_order_volume && data.by_order_volume.length > 0) {
            kpiVol.innerText = data.by_order_volume[0].order_volume;
        } else {
            kpiVol.innerText = '-';
        }
    }

    // Populate Group By Business
    const bizList = document.getElementById('biz-list');
    if (bizList) {
        bizList.innerHTML = '';
        if (data.by_business_type && data.by_business_type.length > 0) {
            data.by_business_type.forEach(item => {
                bizList.innerHTML += `<div class="stat-item"><span class="label"><i class="ri-store-3-line"></i> ${item.business_type}</span> <span class="value">${item.count}</span></div>`;
            });
        } else {
            bizList.innerHTML = '<p class="loading-state">Sem dados estatísticos ainda.</p>';
        }
    }

    // Populate Group By Order Volume
    const volumeList = document.getElementById('volume-list');
    if (volumeList) {
        volumeList.innerHTML = '';
        if (data.by_order_volume && data.by_order_volume.length > 0) {
            data.by_order_volume.forEach(item => {
                volumeList.innerHTML += `<div class="stat-item"><span class="label"><i class="ri-wallet-3-line"></i> ${item.order_volume}</span> <span class="value">${item.count}</span></div>`;
            });
        } else {
            volumeList.innerHTML = '<p class="loading-state">Sem dados de lucro/volume ainda.</p>';
        }
    }

    // Populate Challenges/Problems Card Array
    const challengesList = document.getElementById('challenges-list');
    const badge = document.getElementById('count-challenges');
    if (challengesList && badge) {
        const listData = data.recent_challenges || [];
        badge.innerText = listData.length;
        challengesList.innerHTML = '';
        
        if(listData.length === 0) {
            challengesList.innerHTML = '<p class="loading-state">Nenhum contacto / desafio submetido recentemente.</p>';
        } else {
            listData.forEach(item => {
                // Formatação simples da Data se existir
                let dateStr = item.submitted_at;
                
                challengesList.innerHTML += `
                    <div class="challenge-item">
                        <div class="head">
                            <span class="name"><i class="ri-user-line"></i> ${item.name || 'Desconhecido'}</span>
                            <span class="tag">${item.business_type || 'Geral'}</span>
                        </div>
                        <p class="message">${item.challenge}</p>
                        <div class="footer-info">
                            <span><b>Gestão Antiga:</b> ${item.order_management}</span>
                            <span class="date">${dateStr}</span>
                        </div>
                    </div>
                `;
            });
        }
    }
}

// Initial Fetch Trigger
document.addEventListener('DOMContentLoaded', fetchDashboardData);
