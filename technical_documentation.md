# Documento Técnico: Projeto Sellex

## 1. Visão Geral do Projeto
O **Sellex** é descrito como uma "Plataforma Inteligente para Gestão de Vendas e Negócios". O projecto tem como objetivo ajudar pequenos negócios, como lojas virtuais, restaurantes, barbearias e prestadores de serviços, a organizar vendas, pedidos, clientes e atendimentos através de um único sistema com catálogo digital, gestão de clientes e atendimento automático com recurso a Inteligência Artificial (IA).

O estado actual da aplicação em `/sellex_app/` representa principalmente um **Site Landing Page / Waitlist (Lista de Espera)** destinado à capitação de leads para agendamento de uma demonstração ("Agendar Demo") da futura plataforma. 

## 2. Requisitos do Sistema (Com base na Landing Page)

### 2.1 Requisitos Funcionais
* **Captação de Leads:** O sistema deve permitir que potenciais clientes agendem uma demonstração fornecendo o seu e-mail, nome, número do WhatsApp, tipo de negócio, método atual de gestão de pedidos, volume diário de pedidos e o seu maior desafio atual.
* **Validação de Formulário:** O sistema deve validar no lado do cliente (frontend) e no lado do servidor (backend) a validade dos e-mails, telefone (>7 dígitos) e presenças de informações obrigatórias.
* **Mecanismos de Passos (Wizard):** O formulário de agendamento de demo funciona como um wizard passo a passo visível no qual o utilizador progride gradualmente ao invés de um único formulário longo.
* **Notificações por Email:** Ao submeter os dados com sucesso, o sistema deve disparar automaticamente um e-mail de boas-vindas com integração fallback (HTML e Texto Simples) e convite para um grupo na comunidade de WhatsApp.
* **Integração Externa (CORS e Chaves):** O frontend comunica com uma API remota (`https://api.fiji.org.ao/book_demo.php` com uma `x-api-key`) ou localmente com o script PHP do servidor.

### 2.2 Requisitos Técnicos e Não-Funcionais
* **Responsividade:** A interface precisa adaptar-se a vários dispositivos, tirando partido de propriedades do `style-flex.css` e animações de scroll (`WOW.js` / `Animate.css`).
* **Segurança na API:** A API backend deverá proteger-se com variáveis de ambiente num ficheiro `.env` e responder apenas ao método `POST`.
* **Tratamento de Excepções:** O backend PHP tem tratamento avançado com fallback de erros fatals para devolver JSON em vez de deitar o código PHP nu.
* **Padrão de Desenho Backend:** O ficheiro `db.php` usa localmente o padrão de desenho *Singleton* para reutilizar a ligação PDO evitando esgotamento de conexões na base de dados (MySQL).

## 3. Pilha Tecnológica (Tech Stack)

### Frontend (User Interface)
O frontend não utiliza frameworks Javascript complexas como React ou Vue (embora o projeto possa vir a utilizá-las no dashboard real). A landing page utiliza desenvolvimento web padrão com uma arquitetura simples:
* **Linguagens:** HTML5 semântico, Vanilla Javascript (ES6), CSS3.
* **Tipografia e Ícones:** Fontes "DMSans" e "Poppins", juntamente com "Remix Icon" guardadas / usadas via CDN/Locais.
* **Bibliotecas Excedentes:** 
  * *Animate.css*: para animações CSS declarativas.
  * *WOW.js*: desencadeador de animações ao fazer o scroll.

### Backend (Servidor e API)
* **Linguagens/Plataforma:** PHP (presumivelmente 8.x devido ao uso da interface `Throwable` e `PDO`).
* **Abordagem de Estrutura:** Sem frameworks globais (ex: Laravel não incluído). PHP Nativo.
* **Bibliotecas/Ambientes:** Suporte a ficheiros `.env` usando uma leitura nativa feita em `config.php` `parse_ini_file()`. Correio enviado pela função nativa do PHP `mail()` construindo formatação `multipart/alternative`.

### Base de Dados
* **SGBD:** MySQL ou MariaDB.
* **Comunicação de DB:** Biblioteca PDO do PHP garantindo que inserções sejam sanitizadas por Prepared Statements.

## 4. Arquitetura de Software

A arquitetura do projecto pode ser definida em 2 camadas primárias dentro desta landing page mono-liticamente armazenada:

**1. Roteamento Estático/View Layer:** Entregue pelas páginas `index.html` ou `/pages/{sobre|termo|privacidade}/`. Carrega todos os scripts em `./utils/` e `./assets/script/`.

**2. API e Persistência Layer (`./api/`):**
A API encontra-se na diretoria /api. O frontend em `script.js` faz um `fetch(BOOK_DEMO_API, ...)` passando conteúdo JSON e enviando pelos cabeçalhos a `x-api-key`. O backend recebe o Payload via `php://input`, procede a validação e constrói dinamicamente base de dados caso não exista, procedendo ao `INSERT INTO` e disparando um e-mail.

## 5. Esquema de Base de Dados (Database Schema)

O backend possui uma automigração em `book_demo.php` gerindo a tabela única: `book_demo_requests`.

| Campo | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `id` | INT UNSIGNED | Chave Primária Artificial | AUTO_INCREMENT, PRIMARY KEY |
| `name` | VARCHAR(255) | Nome Completo | NOT NULL |
| `email` | VARCHAR(255) | Endereço E-mail do utilizador | NOT NULL |
| `phone` | VARCHAR(50) | Número de Telefone | NOT NULL |
| `business_type` | VARCHAR(100) | Tipo de negócio associado | NOT NULL |
| `order_management` | VARCHAR(100) | Método como geridos pedidos antes | NOT NULL |
| `order_volume` | VARCHAR(100) | Volume diário de vendas | NOT NULL |
| `challenge` | TEXT | Texto descritivo das dores do cliente| NOT NULL |
| `source_url` | VARCHAR(255) | URL onde formou a captura | DEFAULT NULL |
| `submitted_at`| DATETIME | Timestamp submetido no evento (JS)| DEFAULT CURRENT_TIMESTAMP |
| `created_at` | DATETIME | Registo da criação da BD | DEFAULT CURRENT_TIMESTAMP |

## 6. Observações e Pontos Críticos Encontrados
1. A API de requisição definida de fábrica em `script.js` (`const BOOK_DEMO_API = 'https://api.fiji.org.ao/book_demo.php';`) aponta para um subdomínio de fiji.org.ao em vez do localhost/ambiente local o que pode criar problemas CORS localmente se o backend original (`./api/book_demo.php`) estiver preterido.
2. Não foram encontrados directórios relacionados ao real desenvolvimento da plataforma final/dashboard (o projeto inteiro contido nos ficheiros foca-se na aterragem e captura para "Agendar Demo"), implicando que o verdadeiro software "SaaS" está noutro repositório ou por desenvolver.
3. Tratamentos e boas práticas em uso notáveis: Existe proteções para envios de inputs, respostas unificadas (`json_encode`) em caso de exceções severas para a não-visibilidade do lado do cliente do código PHP subjacente.
