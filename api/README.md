# API Book Demo

Arquivos para o endpoint de agendamento de demo:

- `.env` - credenciais de conexão com o banco de dados (MySQL). Ajuste conforme o ambiente.
- `config.php` - carrega variáveis do `.env` e define constantes.
- `db.php` - cria conexão PDO com o MySQL.
- `book_demo.php` - endpoint POST para receber dados de agendamento.

## Consumir via Fetch

POST /api/book_demo.php

Payload JSON:

{
  "name": "Fulano",
  "email": "fulano@example.com",
  "phone": "+244912345678",
  "business_type": "Loja",
  "order_management": "WhatsApp",
  "order_volume": "10 - 30",
  "challenge": "Preciso organizar pedidos",
  "source_url": "https://example.com",
  "submitted_at": "2026-03-20T10:00:00Z"
}
