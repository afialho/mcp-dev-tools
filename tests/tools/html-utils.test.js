const assert = require('assert');
const htmlUtils = require('../../tools/html-utils');

function validateMcpResponse(response) {
  assert(response, 'Response deve existir');
  assert(response.content, 'Response deve ter content');
  assert(Array.isArray(response.content), 'Content deve ser array');
  assert(response.content.length > 0, 'Content deve ter pelo menos um item');
  assert(response.content[0].type === 'text', 'Primeiro item deve ser text');
  assert(typeof response.content[0].text === 'string', 'Text deve ser string');
}

async function testTool(tool, args, expectedStrings = []) {
  const result = await tool.execute(args);
  validateMcpResponse(result);
  
  const text = result.content[0].text;
  for (const expected of expectedStrings) {
    assert(text.includes(expected), `Resultado deve conter: "${expected}"`);
  }
  
  return result;
}

async function testFormatar() {
  console.log('🧪 Testando formatação HTML...');

  const htmlDesordenado = '<div><p>Texto</p><span>Outro texto</span></div>';

  await testTool(
    htmlUtils,
    {
      operacao: 'formatar',
      html_string: htmlDesordenado,
      indentacao: 2
    },
    ['🎨 **HTML Formatado**', 'Tamanho Original:', 'Tamanho Formatado:', '```html']
  );

  console.log('  ✅ Formatação funcionando');
}

async function testMinificar() {
  console.log('🧪 Testando minificação HTML...');

  const htmlComEspacos = `
    <div>
      <p>Texto com espaços</p>
      <!-- Comentário -->
      <span>Outro texto</span>
    </div>
  `;

  await testTool(
    htmlUtils,
    {
      operacao: 'minificar',
      html_string: htmlComEspacos,
      preservar_comentarios: false
    },
    ['🗜️ **HTML Minificado**', 'Tamanho Original:', 'Tamanho Minificado:', 'Redução:', '```html']
  );

  console.log('  ✅ Minificação funcionando');
}

async function testValidar() {
  console.log('🧪 Testando validação HTML...');

  const htmlInvalido = '<div><p>Parágrafo não fechado<span>Span</span></div>';

  await testTool(
    htmlUtils,
    {
      operacao: 'validar',
      html_string: htmlInvalido
    },
    ['**Validação HTML**', 'Status:', 'Problemas:', 'Avisos:']
  );

  console.log('  ✅ Validação funcionando');
}

async function testConverter() {
  console.log('🧪 Testando conversão HTML...');

  const html = '<h1>Título</h1><p>Parágrafo com <strong>texto em negrito</strong>.</p>';

  // Teste HTML para Markdown
  await testTool(
    htmlUtils,
    {
      operacao: 'converter',
      html_string: html,
      formato_destino: 'markdown'
    },
    ['🔄 **Conversão HTML → Markdown**', 'Tamanho Original:', 'Tamanho Convertido:', '```markdown']
  );

  // Teste HTML para Texto
  await testTool(
    htmlUtils,
    {
      operacao: 'converter',
      html_string: html,
      formato_destino: 'texto'
    },
    ['🔄 **Conversão HTML → Texto**', 'Tamanho Original:', 'Tamanho Convertido:']
  );

  // Teste HTML para JSON
  await testTool(
    htmlUtils,
    {
      operacao: 'converter',
      html_string: html,
      formato_destino: 'json'
    },
    ['🔄 **Conversão HTML → JSON**', 'Tamanho Original:', 'Tamanho Convertido:', '```json']
  );

  console.log('  ✅ Conversão funcionando');
}

async function testEscapar() {
  console.log('🧪 Testando escape HTML...');

  const textoComCaracteresEspeciais = '<script>alert("XSS")</script>';

  await testTool(
    htmlUtils,
    {
      operacao: 'escapar',
      texto_para_escapar: textoComCaracteresEspeciais
    },
    ['🔒 **Texto → HTML Escapado**', 'Original:', 'Resultado:', '&lt;script&gt;']
  );

  console.log('  ✅ Escape funcionando');
}

async function testExtrair() {
  console.log('🧪 Testando extração HTML...');

  const htmlComElementos = `
    <html>
      <head><title>Página de Teste</title></head>
      <body>
        <h1>Título Principal</h1>
        <p>Parágrafo</p>
        <a href="https://example.com">Link</a>
        <img src="image.jpg" alt="Imagem">
      </body>
    </html>
  `;

  // Extração automática
  await testTool(
    htmlUtils,
    {
      operacao: 'extrair',
      html_string: htmlComElementos
    },
    ['📋 **Extração Automática de Elementos**', 'Título:', 'Cabeçalhos', 'Links', 'Imagens']
  );

  // Extração por seletor
  await testTool(
    htmlUtils,
    {
      operacao: 'extrair',
      html_string: htmlComElementos,
      seletor_css: 'a'
    },
    ['🎯 **Extração por Seletor CSS: `a`**', 'Elementos Encontrados:', 'href=']
  );

  console.log('  ✅ Extração funcionando');
}

async function testAnalisar() {
  console.log('🧪 Testando análise HTML...');

  const htmlCompleto = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Página de Teste</title>
        <meta name="description" content="Descrição da página">
      </head>
      <body>
        <h1>Título</h1>
        <p>Parágrafo</p>
        <div><span>Conteúdo</span></div>
        <a href="#">Link</a>
        <img src="test.jpg" alt="Teste">
      </body>
    </html>
  `;

  await testTool(
    htmlUtils,
    {
      operacao: 'analisar',
      html_string: htmlCompleto,
      incluir_estatisticas: true,
      incluir_seo: true,
      incluir_acessibilidade: true
    },
    ['📊 **Análise Completa do HTML**', 'Estatísticas Básicas:', 'Total de Elementos:', 'Análise de SEO:', 'Análise de Acessibilidade:']
  );

  console.log('  ✅ Análise funcionando');
}

async function testSanitizar() {
  console.log('🧪 Testando sanitização HTML...');

  const htmlPerigoso = '<p>Texto seguro</p><script>alert("XSS")</script><div onclick="malicious()">Div</div>';

  await testTool(
    htmlUtils,
    {
      operacao: 'sanitizar',
      html_string: htmlPerigoso,
      nivel_sanitizacao: 'basico'
    },
    ['🧹 **HTML Sanitizado**', 'Nível:** basico', 'Tamanho Original:', 'Tamanho Sanitizado:', '```html']
  );

  console.log('  ✅ Sanitização funcionando');
}

async function testOtimizar() {
  console.log('🧪 Testando otimização HTML...');

  const htmlDesotimizado = '<div class="class1 class1 class2" id=""><p></p><span title="">Texto</span></div>';

  await testTool(
    htmlUtils,
    {
      operacao: 'otimizar',
      html_string: htmlDesotimizado
    },
    ['⚡ **HTML Otimizado**', 'Otimizações Aplicadas:', 'Tamanho Original:', 'Tamanho Otimizado:', 'Otimizações:']
  );

  console.log('  ✅ Otimização funcionando');
}

async function testGerar() {
  console.log('🧪 Testando geração de templates...');

  await testTool(
    htmlUtils,
    {
      operacao: 'gerar',
      template_tipo: 'pagina_basica'
    },
    ['🏗️ **Template HTML Gerado**', 'Tipo:** pagina_basica', 'Características:', '```html', '<!DOCTYPE html>']
  );

  await testTool(
    htmlUtils,
    {
      operacao: 'gerar',
      template_tipo: 'formulario'
    },
    ['🏗️ **Template HTML Gerado**', 'Tipo:** formulario', '<form', '<input', '<label']
  );

  console.log('  ✅ Geração de templates funcionando');
}

async function testComparar() {
  console.log('🧪 Testando comparação HTML...');

  const html1 = '<div><p>Texto 1</p></div>';
  const html2 = '<div><p>Texto 1</p><p>Texto 2</p></div>';

  await testTool(
    htmlUtils,
    {
      operacao: 'comparar',
      html_string: html1,
      html_comparacao: html2
    },
    ['🔍 **Comparação de HTMLs**', 'Estatísticas Comparativas:', 'HTML 1', 'HTML 2', 'Diferença']
  );

  console.log('  ✅ Comparação funcionando');
}

async function testGerarSchema() {
  console.log('🧪 Testando geração de schema...');

  const html = '<html><head><title>Teste</title></head><body><h1>Título</h1></body></html>';

  await testTool(
    htmlUtils,
    {
      operacao: 'gerar_schema',
      html_string: html
    },
    ['📋 **Schema HTML Gerado**', 'Baseado em:', 'Formato:** JSON Schema', '```json']
  );

  console.log('  ✅ Geração de schema funcionando');
}

async function testErros() {
  console.log('🧪 Testando tratamento de erros...');

  // Teste sem parâmetros obrigatórios
  const result = await htmlUtils.execute({
    operacao: 'formatar'
  });

  validateMcpResponse(result);
  assert(result.content[0].text.includes('❌'), 'Deve retornar erro');
  assert(result.content[0].text.includes('obrigatório'), 'Deve mencionar parâmetro obrigatório');

  // Teste operação inválida
  const result2 = await htmlUtils.execute({
    operacao: 'operacao_inexistente'
  });

  validateMcpResponse(result2);
  assert(result2.content[0].text.includes('❌'), 'Deve retornar erro');
  assert(result2.content[0].text.includes('Operação Inválida'), 'Deve mencionar operação inválida');

  console.log('  ✅ Tratamento de erros funcionando');
}

async function runHtmlUtilsTests() {
  console.log('🚀 Testando HTML Utils...\n');

  try {
    await testFormatar();
    await testMinificar();
    await testValidar();
    await testConverter();
    await testEscapar();
    await testExtrair();
    await testAnalisar();
    await testSanitizar();
    await testOtimizar();
    await testGerar();
    await testComparar();
    await testGerarSchema();
    await testErros();

    console.log('\n✅ HTML Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ HTML Utils - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runHtmlUtilsTests().catch(console.error);
}

module.exports = { runHtmlUtilsTests };
