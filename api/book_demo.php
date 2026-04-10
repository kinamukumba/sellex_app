<?php
// =============================================================================
// book_demo.php — Endpoint para agendamento de demo
// =============================================================================

// ── 1. Buffer de saída: garante que NENHUM output HTML escapa antes do JSON
//       (erros fatais do PHP, notices, warnings, etc.)
ob_start();

// ── 2. Suprimir output HTML de erros nativos do PHP
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(0);

// ── 3. Capturar erros fatais (E_ERROR, E_PARSE) que os handlers normais não apanham
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Erro interno do servidor.',
            'debug'   => $error['message'] . ' — ' . basename($error['file']) . ':' . $error['line'],
        ]);
    } else {
        ob_end_flush();
    }
});

// ── 4. Capturar excepções não tratadas
set_exception_handler(function (Throwable $e) {
    ob_clean();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor.',
        'debug'   => $e->getMessage() . ' — ' . basename($e->getFile()) . ':' . $e->getLine(),
    ]);
    exit;
});

// ── 5. Headers CORS e Content-Type
header('Access-Control-Allow-Origin: *'); // Mude o * para o domínio do Vercel caso queira mais segurança (ex: https://seu-frontend.vercel.app)
header('Access-Control-Allow-Headers: Content-Type, x-api-key');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// ── 6. Responder preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── 7. Apenas aceitar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não autorizado. Use POST.']);
    exit;
}

// ── 8. Carregar dependências (config + PDO)
require_once __DIR__ . '/db.php';

// ── 8.5 Verificar a Segurança da API (Validação do x-api-key)
$providedApiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($providedApiKey !== API_KEY) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acesso Negado: Chave da API inválida ou ausente.']);
    exit;
}

// ── 9. Ler e validar o body JSON
$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON inválido ou ausente.']);
    exit;
}

$fields = [
    'name'             => 'Nome completo',
    'email'            => 'Email',
    'phone'            => 'Telefone',
    'business_type'    => 'Tipo de negócio',
    'order_management' => 'Gestão de pedidos',
    'order_volume'     => 'Volume de pedidos',
    'challenge'        => 'Desafio',
];

$errors = [];
foreach ($fields as $key => $label) {
    if (empty(trim((string)($data[$key] ?? '')))) {
        $errors[] = "Campo '{$label}' é obrigatório.";
    }
}

if (!empty($data['email']) && !filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) {
    $errors[] = "O campo 'Email' não é válido.";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Validação falhou.', 'errors' => $errors]);
    exit;
}

// ── 10. Gravar na base de dados
try {
    $pdo = getPDO();

    // Criar tabela se ainda não existir
    $pdo->exec("CREATE TABLE IF NOT EXISTS book_demo_requests (
        id               INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
        name             VARCHAR(255)  NOT NULL,
        email            VARCHAR(255)  NOT NULL,
        phone            VARCHAR(50)   NOT NULL,
        business_type    VARCHAR(100)  NOT NULL,
        order_management VARCHAR(100)  NOT NULL,
        order_volume     VARCHAR(100)  NOT NULL,
        challenge        TEXT          NOT NULL,
        source_url       VARCHAR(255)  DEFAULT NULL,
        submitted_at     DATETIME      DEFAULT CURRENT_TIMESTAMP,
        created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("
        INSERT INTO book_demo_requests
            (name, email, phone, business_type, order_management, order_volume, challenge, source_url, submitted_at)
        VALUES
            (:name, :email, :phone, :business_type, :order_management, :order_volume, :challenge, :source_url, :submitted_at)
    ");

    $stmt->execute([
        ':name'             => trim($data['name']),
        ':email'            => trim($data['email']),
        ':phone'            => trim($data['phone']),
        ':business_type'    => trim($data['business_type']),
        ':order_management' => trim($data['order_management']),
        ':order_volume'     => trim($data['order_volume']),
        ':challenge'        => trim($data['challenge']),
        ':source_url'       => trim((string)($data['source_url'] ?? '')),
        ':submitted_at'     => date('Y-m-d H:i:s', strtotime($data['submitted_at'] ?? 'now')),
    ]);

} catch (PDOException $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao gravar dados na base de dados.',
        'debug'   => $e->getMessage(),
    ]);
    exit;
}

// ── 11. Enviar email de boas-vindas
//        Falha silenciosa: não bloqueia a resposta ao cliente
try {
    sendWelcomeEmail(trim($data['name']), trim($data['email']));
} catch (Throwable $e) {
    error_log('[Sellex] Falha no envio de email para ' . $data['email'] . ': ' . $e->getMessage());
}

// ── 12. Resposta final de sucesso
ob_clean();
echo json_encode(['success' => true, 'message' => 'Agendar demo recebido com sucesso.']);
exit;


// =============================================================================
// Funções de Email
// =============================================================================

/**
 * Envia email HTML de boas-vindas ao utilizador.
 *
 * @param string $userName  Nome completo do utilizador.
 * @param string $userEmail Endereço de email do utilizador.
 */
function sendWelcomeEmail(string $userName, string $userEmail): void
{
    $firstName   = explode(' ', $userName)[0];
    $subject     = "Bem-vindo, {$firstName}!";
    $currentDate = date('d/m/Y');
    $boundary    = '----=_Part_' . md5(uniqid('sellex_', true));

    $htmlBody  = buildWelcomeEmailHtml($firstName, WHATSAPP_URL, $currentDate);
    $plainBody = buildWelcomeEmailPlain($firstName, WHATSAPP_URL);

    $headers  = 'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM_EMAIL . ">\r\n";
    $headers .= 'Reply-To: ' . MAIL_FROM_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

    $body  = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $body .= quoted_printable_encode($plainBody) . "\r\n\r\n";

    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $body .= quoted_printable_encode($htmlBody) . "\r\n\r\n";

    $body .= "--{$boundary}--";

    mail($userEmail, $subject, $body, $headers);
}

/**
 * Constrói o HTML do email de boas-vindas.
 *
 * @param string $firstName   Primeiro nome do utilizador.
 * @param string $whatsappUrl Link para o grupo de WhatsApp.
 * @param string $date        Data formatada do envio.
 * @return string
 */
function buildWelcomeEmailHtml(string $firstName, string $whatsappUrl, string $date): string
{
    return <<<HTML
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Bem-vindo, {$firstName}!</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#F4F4F5;font-family:'Inter',Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#18181B}
    .wrap{width:100%;padding:40px 16px;background:#F4F4F5}
    .card{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)}
    .hdr{background:#0A0A0A;padding:28px 40px;text-align:center}
    .logo{font-size:22px;font-weight:700;letter-spacing:-.5px;color:#fff;text-decoration:none}
    .logo-accent{color:#22C55E}
    .badge{display:inline-block;margin-top:8px;font-size:11px;color:#71717A;letter-spacing:.5px;text-transform:uppercase}
    .hero{background:linear-gradient(135deg,#0A0A0A,#18181B);padding:48px 40px 40px;text-align:center}
    .check{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:#22C55E;border-radius:50%;margin-bottom:20px}
    .hero h1{font-size:26px;font-weight:700;color:#fff;line-height:1.25;letter-spacing:-.5px}
    .hero-accent{color:#22C55E}
    .hero p{margin-top:14px;font-size:15px;line-height:1.65;color:#A1A1AA}
    .body{padding:40px 40px 32px}
    .section-label{display:block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#22C55E;margin-bottom:8px}
    .body h2{font-size:18px;font-weight:700;color:#18181B;letter-spacing:-.3px;margin-bottom:10px}
    .body p{font-size:14px;line-height:1.7;color:#52525B}
    .cta-block{margin-top:28px;background:#F4F4F5;border-radius:12px;padding:24px;text-align:center}
    .cta-block p{font-size:13px;color:#71717A;margin-bottom:16px;line-height:1.6}
    .cta-btn{display:inline-block;padding:14px 28px;background:#25D366;color:#fff!important;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;letter-spacing:.2px}
    .ftr{padding:20px 40px 28px;border-top:1px solid #F4F4F5;text-align:center}
    .ftr p{font-size:11px;color:#A1A1AA;line-height:1.7}
    @media(max-width:600px){.hdr,.hero,.body,.ftr{padding-left:24px;padding-right:24px}}
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">

    <div class="hdr">
      <span class="logo">Sell<span class="logo-accent">ex</span></span><br/>
      <span class="badge">{$date}</span>
    </div>

    <div class="hero">
      <div class="check">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1>Bem-vindo, <span class="hero-accent">{$firstName}</span>!</h1>
      <p>Estás oficialmente na lista de Demo da Sellex.<br/>Serás um dos primeiros a saber quando lançarmos a plataforma.</p>
    </div>

    <div class="body">
      <span class="section-label">Comunidade</span>
      <h2>Entre no grupo do WhatsApp</h2>
      <p>Quer ser o primeiro a experimentar a Sellex? Entre no nosso grupo do WhatsApp e receba novidades, acesso antecipado e muito mais.</p>
      <div class="cta-block">
        <p>Junte-se à comunidade de empreendedores que estão a transformar a forma como gerem os seus negócios.</p>
        <a href="{$whatsappUrl}" class="cta-btn" target="_blank" rel="noopener noreferrer">&#128172;&nbsp; Entrar na comunidade</a>
      </div>
    </div>

    <div class="ftr">
      <p>Recebeste este email porque te inscreveste na lista de espera da Sellex.<br/>&copy; {$date} Sellex &mdash; Luanda, Angola</p>
    </div>

  </div>
</div>
</body>
</html>
HTML;
}

/**
 * Fallback em texto simples para clientes que não renderizam HTML.
 *
 * @param string $firstName   Primeiro nome do utilizador.
 * @param string $whatsappUrl Link para o grupo de WhatsApp.
 * @return string
 */
function buildWelcomeEmailPlain(string $firstName, string $whatsappUrl): string
{
    return "Bem-vindo, {$firstName}!\n\n"
         . "Estás oficialmente na lista de Demo da Sellex.\n"
         . "Serás um dos primeiros a saber quando lançarmos a plataforma.\n\n"
         . str_repeat('-', 40) . "\n"
         . "COMUNIDADE — Entre no grupo do WhatsApp\n"
         . str_repeat('-', 40) . "\n\n"
         . "Quer ser o primeiro a experimentar a Sellex?\n"
         . "Entre no nosso grupo do WhatsApp e receba novidades, acesso antecipado e muito mais.\n\n"
         . ">> Entrar na comunidade: {$whatsappUrl}\n\n"
         . str_repeat('-', 40) . "\n"
         . "Recebeste este email porque te inscreveste na lista de espera da Sellex.\n"
         . "Sellex — Luanda, Angola\n";
}