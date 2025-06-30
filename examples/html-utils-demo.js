#!/usr/bin/env node

const htmlUtils = require('../tools/html-utils');

async function demonstrarHtmlUtils() {
  console.log('🎨 DEMONSTRAÇÃO HTML UTILS - MCP DEV TOOLS\n');
  console.log('=' .repeat(60));

  const htmlExemplo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <title>Página de Exemplo</title>
        <meta name="description" content="Uma página de exemplo para demonstração">
      </head>
      <body>
        <header>
          <h1>Título Principal</h1>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#sobre">Sobre</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <section>
            <h2>Seção Principal</h2>
            <p>Este é um parágrafo com <strong>texto em negrito</strong> e <em>texto em itálico</em>.</p>
            <img src="exemplo.jpg" alt="Imagem de exemplo">
            <div class="card card">
              <p></p>
            </div>
          </section>
        </main>
        <footer>
          <p>&copy; 2024 Exemplo</p>
        </footer>
      </body>
    </html>
  `;

  const htmlPerigoso = '<p>Texto seguro</p><script>alert("XSS")</script><div onclick="malicious()">Clique aqui</div>';

  try {
    console.log('\n📝 1. FORMATAÇÃO HTML');
    console.log('-'.repeat(30));
    const formatResult = await htmlUtils.execute({
      operacao: 'formatar',
      html_string: '<div><p>HTML não formatado</p><span>Texto</span></div>',
      indentacao: 2
    });
    console.log(formatResult.content[0].text);

    console.log('\n🗜️ 2. MINIFICAÇÃO HTML');
    console.log('-'.repeat(30));
    const minifyResult = await htmlUtils.execute({
      operacao: 'minificar',
      html_string: htmlExemplo,
      preservar_comentarios: false
    });
    console.log(minifyResult.content[0].text);

    console.log('\n✅ 3. VALIDAÇÃO HTML');
    console.log('-'.repeat(30));
    const validateResult = await htmlUtils.execute({
      operacao: 'validar',
      html_string: '<div><p>Parágrafo não fechado<span>Span</span></div>'
    });
    console.log(validateResult.content[0].text);

    console.log('\n🔄 4. CONVERSÃO HTML → MARKDOWN');
    console.log('-'.repeat(30));
    const convertResult = await htmlUtils.execute({
      operacao: 'converter',
      html_string: '<h1>Título</h1><p>Parágrafo com <strong>negrito</strong> e <em>itálico</em>.</p><ul><li>Item 1</li><li>Item 2</li></ul>',
      formato_destino: 'markdown'
    });
    console.log(convertResult.content[0].text);

    console.log('\n📊 5. CONVERSÃO HTML → JSON');
    console.log('-'.repeat(30));
    const jsonResult = await htmlUtils.execute({
      operacao: 'converter',
      html_string: '<html><head><title>Teste</title></head><body><h1>Título</h1><p>Texto</p></body></html>',
      formato_destino: 'json'
    });
    console.log(jsonResult.content[0].text);

    console.log('\n🔒 6. ESCAPE DE CARACTERES');
    console.log('-'.repeat(30));
    const escapeResult = await htmlUtils.execute({
      operacao: 'escapar',
      texto_para_escapar: '<script>alert("XSS")</script>'
    });
    console.log(escapeResult.content[0].text);

    console.log('\n🎯 7. EXTRAÇÃO DE ELEMENTOS');
    console.log('-'.repeat(30));
    const extractResult = await htmlUtils.execute({
      operacao: 'extrair',
      html_string: htmlExemplo,
      seletor_css: 'a'
    });
    console.log(extractResult.content[0].text);

    console.log('\n📊 8. ANÁLISE COMPLETA');
    console.log('-'.repeat(30));
    const analyzeResult = await htmlUtils.execute({
      operacao: 'analisar',
      html_string: htmlExemplo,
      incluir_estatisticas: true,
      incluir_seo: true,
      incluir_acessibilidade: true
    });
    console.log(analyzeResult.content[0].text);

    console.log('\n🧹 9. SANITIZAÇÃO HTML');
    console.log('-'.repeat(30));
    const sanitizeResult = await htmlUtils.execute({
      operacao: 'sanitizar',
      html_string: htmlPerigoso,
      nivel_sanitizacao: 'basico'
    });
    console.log(sanitizeResult.content[0].text);

    console.log('\n⚡ 10. OTIMIZAÇÃO HTML');
    console.log('-'.repeat(30));
    const optimizeResult = await htmlUtils.execute({
      operacao: 'otimizar',
      html_string: htmlExemplo
    });
    console.log(optimizeResult.content[0].text);

    console.log('\n🏗️ 11. GERAÇÃO DE TEMPLATES');
    console.log('-'.repeat(30));
    const templateResult = await htmlUtils.execute({
      operacao: 'gerar',
      template_tipo: 'formulario'
    });
    console.log(templateResult.content[0].text);

    console.log('\n🔍 12. COMPARAÇÃO DE HTMLs');
    console.log('-'.repeat(30));
    const compareResult = await htmlUtils.execute({
      operacao: 'comparar',
      html_string: '<div><p>Versão 1</p></div>',
      html_comparacao: '<div><p>Versão 1</p><p>Versão 2</p></div>'
    });
    console.log(compareResult.content[0].text);

    console.log('\n📋 13. GERAÇÃO DE SCHEMA');
    console.log('-'.repeat(30));
    const schemaResult = await htmlUtils.execute({
      operacao: 'gerar_schema',
      html_string: htmlExemplo
    });
    console.log(schemaResult.content[0].text);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('✅ Todas as 13 funcionalidades da HTML Utils foram demonstradas');
    console.log('🚀 Ferramenta pronta para uso em projetos MCP');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Erro na demonstração:', error.message);
    console.error('Stack:', error.stack);
  }
}

if (require.main === module) {
  demonstrarHtmlUtils();
}

module.exports = { demonstrarHtmlUtils };
