/**
 * ==============================================================================
 * SELLEX CHAT — MOTOR DE INTELIGÊNCIA ARTIFICIAL CONTEXTUAL (chat.sellex.ao)
 * Sistema de PLN / NLP com ponderação de intenção, relevância e argumentação
 * Scroll 100% responsivo e ilimitado
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const heroSection = document.getElementById('chatHeroSection');
    const conversationWrapper = document.getElementById('chatConversationWrapper');
    const messagesList = document.getElementById('chatMessagesList');
    const bottomDock = document.getElementById('chatBottomDock');
    const mainContainer = document.querySelector('.chat-main-container');
    
    // Inputs and Send buttons
    const heroTextarea = document.getElementById('heroChatInput');
    const heroSendBtn = document.getElementById('heroSendBtn');
    const dockTextarea = document.getElementById('dockChatInput');
    const dockSendBtn = document.getElementById('dockSendBtn');
    
    // Actions & Chips
    const chips = document.querySelectorAll('.chip-item');
    const btnNewChat = document.getElementById('btnNewChat');
    
    // Theme elements
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');

    // Mobile Menu elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');

    // Mobile Menu Logic
    if (mobileMenuBtn && mobileDropdownMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDropdownMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!mobileDropdownMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileDropdownMenu.classList.remove('open');
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    // BASE DE CONHECIMENTO PROFUNDA & ARGUMENTAÇÃO SELLEX
    // ─────────────────────────────────────────────────────────
    const sellexKnowledgeBase = [
        // 1. O que é a Sellex e Proposta de Valor
        {
            id: 'sobre_sellex',
            intents: ['o que e a sellex', 'o que faz', 'quem sao voces', 'como funciona a sellex', 'apresentacao sellex', 'para que serve', 'resumo'],
            keywords: [
                { word: 'sellex', weight: 2 },
                { word: 'funciona', weight: 2 },
                { word: 'plataforma', weight: 2 },
                { word: 'serve', weight: 2 },
                { word: 'empresa', weight: 1 },
                { word: 'software', weight: 2 },
                { word: 'sistema', weight: 2 },
                { word: 'objetivo', weight: 2 },
                { word: 'negocio', weight: 1 },
                { word: 'loja', weight: 1 }
            ],
            argument: `
                <p>A <strong>Sellex</strong> é uma plataforma inteligente concebida especificamente para transformar e modernizar a gestão de vendas e o atendimento comercial em Angola.</p>
                <p>Nós unificamos tudo o que o seu negócio precisa num único ecossistema ágil:</p>
                <ul>
                    <li><strong>Catálogo Digital Dinâmico:</strong> Seus produtos expostos com fotos, descrições e preços em Kwanzas (AOA) com link direto para bio das redes sociais.</li>
                    <li><strong>Vendas Integradas ao WhatsApp:</strong> Seus clientes montam o carrinho e o pedido chega pronto, discriminado e sem conversas confusas.</li>
                    <li><strong>Gestão de Pedidos em Tempo Real:</strong> Controle de status (Pendente, Preparação, Entrega, Concluído) e relatórios financeiros claros.</li>
                    <li><strong>Atendimento Automatizado com IA:</strong> Assistência contínua para tirar dúvidas e capturar vendas 24 horas por dia.</li>
                </ul>
                <p>Em suma: eliminamos a desorganização de cadernos e mensagens perdidas, aumentando o seu faturamento.</p>
            `
        },

        // 2. Vantagens competitivas e por que escolher a Sellex
        {
            id: 'vantagens_comparacao',
            intents: ['por que escolher a sellex', 'vantagens', 'beneficios', 'diferenciais', 'melhor que outros', 'por que usar', 'motivos'],
            keywords: [
                { word: 'vantagem', weight: 3 },
                { word: 'vantagens', weight: 3 },
                { word: 'beneficio', weight: 3 },
                { word: 'beneficios', weight: 3 },
                { word: 'diferencial', weight: 3 },
                { word: 'melhor', weight: 2 },
                { word: 'motivo', weight: 2 },
                { word: 'escolher', weight: 2 },
                { word: 'concorrente', weight: 2 },
                { word: 'ajuda', weight: 1 }
            ],
            argument: `
                <p><strong>Por que a Sellex é a escolha certa para o seu negócio?</strong></p>
                <p>Ao contrário de plataformas genéricas ou softwares pesados, a Sellex foi desenhada considerando a realidade do mercado angolano:</p>
                <ul>
                    <li><strong>Pronto para Mobile:</strong> Mais de 90% das compras começam no telemóvel. O catálogo da Sellex carrega instantaneamente em qualquer smartphone.</li>
                    <li><strong>Foco em Conversão no WhatsApp:</strong> O canal mais utilizado em Angola funciona como seu caixa registrador sincronizado.</li>
                    <li><strong>Sem Custos Fixos Abusivos:</strong> Não cobramos mensalidades exorbitantes de adesão; trabalhamos com transparência e foco no seu sucesso (comissão de apenas 8%).</li>
                    <li><strong>Suporte Local e Dedicado:</strong> Plataforma em português com atendimento humanizado e assistência técnica próxima.</li>
                </ul>
            `
        },

        // 3. Integração com WhatsApp e Redes Sociais (Instagram, TikTok, Facebook)
        {
            id: 'whatsapp_social',
            intents: ['como funciona whatsapp', 'integrar redes sociais', 'vender no instagram', 'vender no tiktok', 'conectar whatsapp', 'link da bio'],
            keywords: [
                { word: 'whatsapp', weight: 4 },
                { word: 'zap', weight: 3 },
                { word: 'instagram', weight: 3 },
                { word: 'tiktok', weight: 3 },
                { word: 'facebook', weight: 2 },
                { word: 'social', weight: 2 },
                { word: 'redes', weight: 2 },
                { word: 'bio', weight: 3 },
                { word: 'link', weight: 1 }
            ],
            argument: `
                <p><strong>Integração Estratégica com WhatsApp e Redes Sociais:</strong></p>
                <p>A Sellex transforma suas redes sociais em canais diretos de venda sem fricção:</p>
                <ul>
                    <li><strong>Link Único na Bio:</strong> Coloque o link da sua loja no perfil do Instagram e TikTok. O cliente navega por categorias e escolhe produtos sem sair da aplicação.</li>
                    <li><strong>Pedido Estruturado via WhatsApp:</strong> O cliente fecha a compra no catálogo e o WhatsApp da sua loja recebe uma mensagem com: nome, número, itens escolhidos, quantidades, morada de entrega e total em AOA.</li>
                    <li><strong>Fim dos Prints Confusos:</strong> Diga adeus aos clientes enviando prints de fotos perguntando "tem esse disponível?". O stock é atualizado na hora.</li>
                </ul>
            `
        },

        // 4. Catálogo Digital e Gestão de Produtos / Stock
        {
            id: 'catalogo_produtos',
            intents: ['como criar catalogo', 'cadastrar produto', 'gestao de estoque', 'variacoes de tamanho e cor', 'menu digital', 'cardapio'],
            keywords: [
                { word: 'catalogo', weight: 4 },
                { word: 'catálogo', weight: 4 },
                { word: 'produto', weight: 3 },
                { word: 'produtos', weight: 3 },
                { word: 'estoque', weight: 3 },
                { word: 'stock', weight: 3 },
                { word: 'variacao', weight: 2 },
                { word: 'variacoes', weight: 2 },
                { word: 'cardapio', weight: 2 },
                { word: 'cardápio', weight: 2 },
                { word: 'foto', weight: 1 },
                { word: 'preco', weight: 2 }
            ],
            argument: `
                <p><strong>Catálogo Digital Profissional Sellex:</strong></p>
                <p>Seus produtos ganham uma vitrine interativa com alta velocidade de carregamento:</p>
                <ul>
                    <li><strong>Variações Avançadas:</strong> Cadastre produtos com múltiplos tamanhos (P, M, G, 42, 44), cores, sabores ou complementos personalizados.</li>
                    <li><strong>Gestão de Stock Inteligente:</strong> Ao concluir pedidos, o stock diminui automaticamente, evitando vender produtos esgotados.</li>
                    <li><strong>Categorização Clara:</strong> Organize seus itens por coleções, promoções da semana ou categorias principais para guiar a compra.</li>
                    <li><strong>Fotos em Alta Definição:</strong> Otimizadas para carregar rápido mesmo com conexões de dados móveis limitadas.</li>
                </ul>
            `
        },

        // 5. Gestão de Pedidos, Dashboard e Relatórios
        {
            id: 'pedidos_dashboard',
            intents: ['gestao de pedidos', 'como ver vendas', 'painel administrativo', 'relatorios de faturamento', 'dashboard', 'historico de clientes'],
            keywords: [
                { word: 'pedido', weight: 3 },
                { word: 'pedidos', weight: 3 },
                { word: 'dashboard', weight: 3 },
                { word: 'painel', weight: 3 },
                { word: 'relatorio', weight: 2 },
                { word: 'relatorios', weight: 2 },
                { word: 'vendas', weight: 2 },
                { word: 'historico', weight: 2 },
                { word: 'cliente', weight: 2 },
                { word: 'clientes', weight: 2 },
                { word: 'faturamento', weight: 2 }
            ],
            argument: `
                <p><strong>Dashboard e Gestão Completa de Pedidos:</strong></p>
                <p>Assuma o controle total do seu fluxo operacional através do painel <strong>app.sellex.ao</strong>:</p>
                <ul>
                    <li><strong>Kanban de Status:</strong> Acompanhe pedidos em tempo real: <em>Pendente &rarr; Em Preparação &rarr; Em Rota de Entrega &rarr; Concluído</em>.</li>
                    <li><strong>Histórico de Clientes:</strong> Saiba quem são seus melhores compradores, quanto gastaram e quais produtos mais compram.</li>
                    <li><strong>Métricas de Desempenho:</strong> Gráficos intuitivos de volume de vendas diárias, semanais e faturamento bruto e líquido.</li>
                </ul>
            `
        },

        // 6. Preços, Taxas de Comissão (8%) e Cobranças
        {
            id: 'precos_taxas',
            intents: ['quanto custa', 'qual o preco', 'qual a taxa', 'como funciona os 8%', 'comissao', 'mensalidade', 'plano gratuito', 'como pagar'],
            keywords: [
                { word: 'preco', weight: 4 },
                { word: 'preço', weight: 4 },
                { word: 'custo', weight: 4 },
                { word: 'taxa', weight: 4 },
                { word: 'taxas', weight: 4 },
                { word: 'comissao', weight: 4 },
                { word: 'comissão', weight: 4 },
                { word: '8%', weight: 4 },
                { word: 'porcentagem', weight: 3 },
                { word: 'mensalidade', weight: 3 },
                { word: 'pagamento', weight: 2 },
                { word: 'cobrado', weight: 2 },
                { word: 'gratis', weight: 2 },
                { word: 'gratuito', weight: 2 }
            ],
            argument: `
                <p><strong>Estrutura de Preços & Comissão Transparente da Sellex:</strong></p>
                <p>A Sellex adota um modelo de parceria sustentável: <em>você só paga quando vende</em>.</p>
                <ul>
                    <li><strong>Comissão de 8%:</strong> A taxa aplicável é de apenas <strong>8% sobre o valor dos pedidos/vendas concluídas</strong> através da plataforma.</li>
                    <li><strong>Sem Mensalidades Fixas Abusivas:</strong> Você não fica preso a planos mensais caros quando suas vendas oscilam.</li>
                    <li><strong>Acompanhamento em Tempo Real:</strong> No seu painel financeiro, você visualiza exatamente o total vendido e o extrato de comissões de forma 100% transparente.</li>
                    <li><strong>Recebimento Direto:</strong> Os pagamentos dos seus clientes vão diretamente para você pelos métodos acordados (TPA Multicaixa, Transferência Express/IBAN ou Dinheiro).</li>
                </ul>
            `
        },

        // 7. Inteligência Artificial Nativa Sellex
        {
            id: 'ia_sellex',
            intents: ['inteligencia artificial', 'como funciona a ia', 'atendimento automatico', 'bot de vendas', 'ia sellex', 'automacao de mensagens'],
            keywords: [
                { word: 'ia', weight: 4 },
                { word: 'inteligencia', weight: 4 },
                { word: 'inteligência', weight: 4 },
                { word: 'artificial', weight: 4 },
                { word: 'bot', weight: 3 },
                { word: 'automacao', weight: 3 },
                { word: 'automação', weight: 3 },
                { word: 'atendente', weight: 2 },
                { word: 'automatico', weight: 2 },
                { word: 'automatica', weight: 2 },
                { word: 'atendimento', weight: 2 }
            ],
            argument: `
                <p><strong>Inteligência Artificial Nativa da Sellex:</strong></p>
                <p>Nossa IA funciona como um assistente comercial sénior dedicado à sua empresa:</p>
                <ul>
                    <li><strong>Compreensão em Linguagem Natural:</strong> Entende o que o cliente escreve, tira dúvidas sobre disponibilidade, tamanhos e formas de envio.</li>
                    <li><strong>Cross-Selling e Up-Selling:</strong> Recomenda produtos complementares aos clientes durante a navegação, aumentando o ticket médio.</li>
                    <li><strong>Atendimento 24/7:</strong> Mesmo fora do horário comercial, seus clientes recebem respostas imediatas e fecham pedidos.</li>
                </ul>
            `
        },

        // 8. Integração Técnica, API e Webhooks (api.sellex.ao)
        {
            id: 'api_desenvolvedores',
            intents: ['documentacao de api', 'como integrar api', 'webhooks', 'para desenvolvedores', 'api rest', 'sdk python', 'node js'],
            keywords: [
                { word: 'api', weight: 4 },
                { word: 'webhook', weight: 4 },
                { word: 'webhooks', weight: 4 },
                { word: 'desenvolvedor', weight: 3 },
                { word: 'developer', weight: 3 },
                { word: 'codigo', weight: 3 },
                { word: 'código', weight: 3 },
                { word: 'integrar', weight: 2 },
                { word: 'erp', weight: 3 },
                { word: 'python', weight: 2 },
                { word: 'nodejs', weight: 2 },
                { word: 'endpoints', weight: 2 }
            ],
            argument: `
                <p><strong>Recursos para Desenvolvedores & API (api.sellex.ao):</strong></p>
                <p>Para empresas com sistemas legados, ERPs ou aplicações próprias:</p>
                <ul>
                    <li><strong>API RESTful Padronizada:</strong> Autenticação segura por chave de API (<code>x-api-key</code>) e payloads em JSON estruturado.</li>
                    <li><strong>Webhooks em Tempo Real:</strong> Notificações instantâneas disparadas para novos pedidos, atualizações de estoque e alterações de status.</li>
                    <li><strong>Tutoriais Práticos:</strong> Acesse a <a href="./academia/index.html">Academia Sellex</a> para tutoriais em Node.js, JavaScript e Python com exemplos prontos de integração.</li>
                </ul>
            `
        },

        // 9. Quem pode usar (Restaurantes, Lojas de Roupas, Cosméticos, Barbearias, etc.)
        {
            id: 'segmentos_atendidos',
            intents: ['serve para meu negocio', 'funciona para restaurante', 'serve para roupas', 'barbearia', 'farmacia', 'quem pode usar', 'lojas fisicas'],
            keywords: [
                { word: 'restaurante', weight: 3 },
                { word: 'roupa', weight: 3 },
                { word: 'roupas', weight: 3 },
                { word: 'moda', weight: 3 },
                { word: 'calcado', weight: 2 },
                { word: 'cosmetico', weight: 2 },
                { word: 'farmacia', weight: 2 },
                { word: 'barbearia', weight: 2 },
                { word: 'mercado', weight: 2 },
                { word: 'delivery', weight: 3 },
                { word: 'comida', weight: 2 },
                { word: 'segmento', weight: 2 },
                { word: 'tipo', weight: 1 }
            ],
            argument: `
                <p><strong>A Sellex adapta-se a múltiplos modelos de negócio:</strong></p>
                <p>Nossa arquitetura flexível atende perfeitamente:</p>
                <ul>
                    <li><strong>Lojas de Moda e Vestuário:</strong> Exibição impecável de coleções com grades de tamanhos, cores e controle de stock.</li>
                    <li><strong>Restaurantes, Pastelarias e Delivery:</strong> Menus interativos com opções de adicionais, combos e agilidade nos pedidos de entrega.</li>
                    <li><strong>Beleza, Cosméticos e Cuidados:</strong> Vitrines digitais com produtos organizados e atendimento rápido.</li>
                    <li><strong>Eletrónicos e Acessórios:</strong> Descrições técnicas detalhadas e garantia de procedência.</li>
                </ul>
            `
        },

        // 10. Como começar / Criar conta / Agendar Demo
        {
            id: 'como_comecar',
            intents: ['como criar conta', 'como me cadastrar', 'como comecar', 'quero me cadastrar', 'criar loja', 'abrir loja', 'demonstracao'],
            keywords: [
                { word: 'criar', weight: 3 },
                { word: 'abrir', weight: 3 },
                { word: 'cadastrar', weight: 3 },
                { word: 'cadastro', weight: 3 },
                { word: 'comecar', weight: 3 },
                { word: 'começar', weight: 3 },
                { word: 'conta', weight: 3 },
                { word: 'registro', weight: 2 },
                { word: 'entrar', weight: 2 },
                { word: 'demonstracao', weight: 3 },
                { word: 'demo', weight: 3 }
            ],
            argument: `
                <p><strong>Como começar a vender com a Sellex hoje mesmo:</strong></p>
                <p>O processo é simples e leva menos de 5 minutos:</p>
                <ol style="margin: 8px 0 8px 18px; display: flex; flex-direction: column; gap: 4px; color: var(--text-secondary);">
                    <li>Acesse o painel oficial em <a href="https://app.sellex.ao" target="_blank">app.sellex.ao</a> ou solicite uma demonstração no nosso site.</li>
                    <li>Cadastre as informações da sua loja (nome, logotipo, contacto de WhatsApp).</li>
                    <li>Adicione seus produtos com fotos, preços e categorias.</li>
                    <li>Copie o link exclusivo do seu catálogo e adicione na bio do seu Instagram, TikTok e status do WhatsApp!</li>
                </ol>
                <p>Pronto! Sua empresa já está apta a receber pedidos automatizados.</p>
            `
        },

        // 11. Segurança, Privacidade e Termos
        {
            id: 'seguranca_privacidade',
            intents: ['e seguro', 'privacidade dos dados', 'seguranca da plataforma', 'termos de uso', 'confiabilidade'],
            keywords: [
                { word: 'seguro', weight: 3 },
                { word: 'seguranca', weight: 3 },
                { word: 'segurança', weight: 3 },
                { word: 'privacidade', weight: 3 },
                { word: 'dados', weight: 2 },
                { word: 'confiavel', weight: 3 },
                { word: 'garantia', weight: 2 }
            ],
            argument: `
                <p><strong>Segurança & Proteção de Dados na Sellex:</strong></p>
                <p>A integridade e o sigilo das informações do seu negócio são prioridades absolutas:</p>
                <ul>
                    <li><strong>Criptografia de Ponta a Ponta:</strong> Toda a navegação e transmissão de dados é protegida com certificados SSL/TLS modernos.</li>
                    <li><strong>Privacidade do Cliente:</strong> As informações de pedidos e clientes pertencem exclusivamente à sua loja e nunca são comercializadas.</li>
                    <li><strong>Termos Transparentes:</strong> Nossos termos de uso e política de privacidade cumprem as melhores práticas de conformidade e legislação.</li>
                </ul>
            `
        },

        // 12. Saudações e Cumprimentos
        {
            id: 'saudacoes',
            intents: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'ola assistente', 'e ai'],
            keywords: [
                { word: 'ola', weight: 2 },
                { word: 'olá', weight: 2 },
                { word: 'oi', weight: 2 },
                { word: 'bom dia', weight: 3 },
                { word: 'boa tarde', weight: 3 },
                { word: 'boa noite', weight: 3 },
                { word: 'tudo bem', weight: 2 },
                { word: 'saudacoes', weight: 2 }
            ],
            argument: `
                <p>Olá! Seja muito bem-vindo ao <strong>Sellex Chat</strong>.</p>
                <p>Sou o assistente inteligente da Sellex, especialista em aceleração de vendas e gestão de negócios em Angola.</p>
                <p>Como posso te ajudar hoje? Você pode me perguntar sobre:</p>
                <ul>
                    <li>Como funciona o catálogo digital e integração com <strong>WhatsApp</strong>.</li>
                    <li>Gestão de pedidos, stock e dashboard.</li>
                    <li>A taxa de comissão de <strong>8%</strong>.</li>
                    <li>Como criar a sua loja no <strong>app.sellex.ao</strong>.</li>
                </ul>
            `
        }
    ];

    // ─────────────────────────────────────────────────────────
    // MOTOR DE PROCESSAMENTO DE LINGUAGEM NATURAL (NLP)
    // ─────────────────────────────────────────────────────────
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/[^\w\s%]/gi, ' ')     // Mantém apenas letras, números e %
            .replace(/\s+/g, ' ')
            .trim();
    }

    function findBestMatch(userInput) {
        const cleanInput = normalizeText(userInput);
        const inputTokens = cleanInput.split(' ').filter(token => token.length > 1);

        let bestMatch = null;
        let highestScore = 0;

        for (const topic of sellexKnowledgeBase) {
            let score = 0;

            // 1. Verificação de correspondência exata de intenção/frase
            for (const intent of topic.intents) {
                const cleanIntent = normalizeText(intent);
                if (cleanInput.includes(cleanIntent) || cleanIntent.includes(cleanInput)) {
                    score += 15;
                }
            }

            // 2. Pontuação por palavras-chave com pesos
            for (const kw of topic.keywords) {
                const cleanKw = normalizeText(kw.word);
                
                // Match exato do termo
                if (cleanInput.includes(cleanKw)) {
                    score += (kw.weight * 3);
                } else {
                    // Match por token / palavra individual
                    for (const token of inputTokens) {
                        if (token === cleanKw) {
                            score += (kw.weight * 2);
                        } else if (token.length > 4 && cleanKw.length > 4 && (token.includes(cleanKw) || cleanKw.includes(token))) {
                            score += kw.weight; // Aproximação morfológica
                        }
                    }
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = topic;
            }
        }

        // Se o score for satisfatório, retorna a resposta do tópico
        if (bestMatch && highestScore >= 3) {
            return bestMatch.argument;
        }

        // Resposta de Argumentação Geral Inteligente (Fallback contextual)
        return `
            <p>Compreendo a sua questão sobre <em>"${escapeHtml(userInput)}"</em>.</p>
            <p>Na <strong>Sellex</strong>, nosso principal compromisso é simplificar a gestão comercial de empresas em Angola através de soluções práticas:</p>
            <ul>
                <li><strong>Catálogo Digital:</strong> Criação rápida da sua vitrine com controle de produtos e preços em Kwanzas.</li>
                <li><strong>Automação no WhatsApp & Redes:</strong> Pedidos recebidos prontos e organizados sem ruído na comunicação.</li>
                <li><strong>Gestão Operacional:</strong> Controle de fluxo de pedidos, estoque e relatórios de vendas.</li>
                <li><strong>Comissão Justa:</strong> Apenas 8% sobre vendas concluídas, sem custos surpresa.</li>
            </ul>
            <p>Gostaria de saber mais sobre algum destes pontos ou como criar a sua loja no <strong>app.sellex.ao</strong>?</p>
        `;
    }

    // Alternar Tema (Dark / Light)
    function applyTheme(isLight) {
        if (isLight) {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'ri-sun-line';
            if (mobileThemeIcon) mobileThemeIcon.className = 'ri-sun-line';
            if (themeLabel) themeLabel.textContent = 'Modo Claro';
        } else {
            document.body.classList.remove('light-theme');
            if (themeIcon) themeIcon.className = 'ri-moon-line';
            if (mobileThemeIcon) mobileThemeIcon.className = 'ri-moon-line';
            if (themeLabel) themeLabel.textContent = 'Modo Escuro';
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('sellex_chat_theme') || 'dark';
        applyTheme(savedTheme === 'light');
    }

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('sellex_chat_theme', isLight ? 'light' : 'dark');
        applyTheme(isLight);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    initTheme();

    // Resetar para Novo Chat
    function resetChat() {
        heroSection.classList.remove('hidden');
        conversationWrapper.classList.remove('active');
        bottomDock.classList.add('hidden');
        messagesList.innerHTML = '';
        if (heroTextarea) {
            heroTextarea.value = '';
            heroTextarea.focus();
        }
    }

    if (btnNewChat) {
        btnNewChat.addEventListener('click', resetChat);
    }

    // Auto-ajuste de altura dos textareas
    function autoResize(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
    }

    [heroTextarea, dockTextarea].forEach(ta => {
        if (ta) {
            ta.addEventListener('input', () => {
                autoResize(ta);
                const sendBtn = ta === heroTextarea ? heroSendBtn : dockSendBtn;
                if (sendBtn) sendBtn.disabled = !ta.value.trim();
            });
            ta.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(ta);
                }
            });
        }
    });

    if (heroSendBtn) {
        heroSendBtn.addEventListener('click', () => handleSend(heroTextarea));
    }
    if (dockSendBtn) {
        dockSendBtn.addEventListener('click', () => handleSend(dockTextarea));
    }

    // Clique nas sugestões / chips rápidos
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query') || chip.innerText.trim();
            sendMessage(query);
        });
    });

    // Enviar Mensagem
    function handleSend(textarea) {
        if (!textarea) return;
        const text = textarea.value.trim();
        if (!text) return;
        textarea.value = '';
        autoResize(textarea);
        sendMessage(text);
    }

    function sendMessage(text) {
        // Transicionar da tela inicial para a tela de conversa
        heroSection.classList.add('hidden');
        conversationWrapper.classList.add('active');
        bottomDock.classList.remove('hidden');

        // Adicionar mensagem do Usuário
        appendMessage('user', text);

        // Rolar para a base
        scrollToBottom();

        // Mostrar indicador de digitação da IA
        const typingId = showTypingIndicator();

        // Gerar resposta inteligente e argumentativa
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const botReply = findBestMatch(text);
            appendMessage('assistant', botReply);
            scrollToBottom();
            if (dockTextarea) dockTextarea.focus();
        }, 700);
    }

    function appendMessage(role, content) {
        const msgItem = document.createElement('div');
        msgItem.className = `message-item ${role}`;

        if (role === 'assistant') {
            msgItem.innerHTML = `
                <div class="message-avatar">
                    <img src="../assets/img/favicon/Sellexsimbolo2.png" alt="Sellex AI">
                </div>
                <div class="message-bubble">${content}</div>
            `;
        } else {
            msgItem.innerHTML = `
                <div class="message-bubble">
                    <p>${escapeHtml(content)}</p>
                </div>
            `;
        }

        messagesList.appendChild(msgItem);
    }

    function showTypingIndicator() {
        const id = 'typing_' + Date.now();
        const typingItem = document.createElement('div');
        typingItem.className = 'message-item assistant';
        typingItem.id = id;
        typingItem.innerHTML = `
            <div class="message-avatar">
                <img src="../assets/img/favicon/Sellexsimbolo2.png" alt="Sellex AI">
            </div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        messagesList.appendChild(typingItem);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Função de Rolagem de Alta Precisão (Sem limites e sempre acessível)
    function scrollToBottom() {
        requestAnimationFrame(() => {
            // Rola o container principal de desktop
            if (mainContainer) {
                mainContainer.scrollTo({
                    top: mainContainer.scrollHeight + 1000,
                    behavior: 'smooth'
                });
            }

            // Rola a janela global no mobile
            window.scrollTo({
                top: document.documentElement.scrollHeight + 1000,
                behavior: 'smooth'
            });

            // Garante visibilidade da última mensagem
            const lastMsg = messagesList ? messagesList.lastElementChild : null;
            if (lastMsg) {
                lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
