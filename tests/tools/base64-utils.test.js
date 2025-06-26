const base64Utils = require('../../tools/base64-utils');
const { testTool } = require('../helpers/test-utils');

async function testEncode() {
  console.log('🧪 Testando encode básico...');

  await testTool(
    base64Utils,
    { operacao: 'encode', texto: 'Hello World!' },
    ['Base64 Encode', 'Hello World!', 'SGVsbG8gV29ybGQh', '✅']
  );

  console.log('  ✅ Encode básico funcionando');
}

async function testEncodeUnicode() {
  console.log('🧪 Testando encode com Unicode...');

  await testTool(
    base64Utils,
    { operacao: 'encode', texto: 'Olá, mundo! 🌍' },
    ['Base64 Encode', 'Olá, mundo! 🌍', '✅']
  );

  console.log('  ✅ Encode Unicode funcionando');
}

async function testDecode() {
  console.log('🧪 Testando decode básico...');

  await testTool(
    base64Utils,
    { operacao: 'decode', dados_base64: ['SGVsbG8gV29ybGQh'] },
    ['Base64 Decode', 'Hello World!', '✅']
  );

  console.log('  ✅ Decode básico funcionando');
}

async function testDecodeMultiple() {
  console.log('🧪 Testando decode múltiplo...');

  await testTool(
    base64Utils,
    { 
      operacao: 'decode', 
      dados_base64: ['SGVsbG8=', 'V29ybGQ='],
      incluir_estatisticas: true
    },
    ['Base64 Decode', 'Hello', 'World', 'Eficiência', '✅']
  );

  console.log('  ✅ Decode múltiplo funcionando');
}

async function testUrlEncode() {
  console.log('🧪 Testando URL-safe encode...');

  await testTool(
    base64Utils,
    { operacao: 'url_encode', texto: 'Hello+World/Test=' },
    ['Base64 URL-Safe Encode', 'Hello+World/Test=', '✅']
  );

  console.log('  ✅ URL-safe encode funcionando');
}

async function testUrlDecode() {
  console.log('🧪 Testando URL-safe decode...');

  await testTool(
    base64Utils,
    { operacao: 'url_decode', dados_base64: ['SGVsbG8tV29ybGQ'] },
    ['Base64 URL-Safe Decode', '✅']
  );

  console.log('  ✅ URL-safe decode funcionando');
}

async function testValidacao() {
  console.log('🧪 Testando validação...');

  await testTool(
    base64Utils,
    { 
      operacao: 'validar', 
      dados_base64: ['SGVsbG8=', 'invalid!@#', 'V29ybGQ='] 
    },
    ['Validação Base64', 'Válido', 'Inválido', 'Resumo', '✅']
  );

  console.log('  ✅ Validação funcionando');
}

async function testAnalise() {
  console.log('🧪 Testando análise...');

  await testTool(
    base64Utils,
    { 
      operacao: 'analisar', 
      dados_base64: ['SGVsbG8gV29ybGQh', 'SGVsbG8tV29ybGQ'],
      incluir_estatisticas: true
    },
    ['Análise Base64', 'STANDARD', 'Eficiência', 'Estatísticas Gerais', '✅']
  );

  console.log('  ✅ Análise funcionando');
}

async function testFormatacao() {
  console.log('🧪 Testando formatação...');

  await testTool(
    base64Utils,
    { 
      operacao: 'formatar', 
      dados_base64: ['SGVsbG9Xb3JsZEhlbGxvV29ybGRIZWxsb1dvcmxkSGVsbG9Xb3JsZA=='],
      quebrar_linhas: true,
      largura_linha: 20
    },
    ['Formatação Base64', 'Formatado', '✅']
  );

  console.log('  ✅ Formatação funcionando');
}

async function testDeteccao() {
  console.log('🧪 Testando detecção...');

  await testTool(
    base64Utils,
    { 
      operacao: 'detectar', 
      dados_base64: ['SGVsbG8=', 'SGVsbG8tV29ybGQ', 'invalid!@#'] 
    },
    ['Detecção de Tipo Base64', 'Base64 Padrão', 'URL-Safe', 'inválido', '✅']
  );

  console.log('  ✅ Detecção funcionando');
}

async function testErrorHandling() {
  console.log('🧪 Testando tratamento de erros...');

  // Teste encode sem texto
  await testTool(
    base64Utils,
    { operacao: 'encode' },
    ['❌', 'Erro de Parâmetro', 'obrigatório']
  );

  // Teste decode sem dados
  await testTool(
    base64Utils,
    { operacao: 'decode' },
    ['❌', 'Erro de Parâmetro', 'obrigatório']
  );

  // Teste operação inválida
  await testTool(
    base64Utils,
    { operacao: 'invalid_operation' },
    ['❌', 'Operação Inválida']
  );

  console.log('  ✅ Tratamento de erros funcionando');
}

async function testEdgeCases() {
  console.log('🧪 Testando casos extremos...');

  // String vazia
  await testTool(
    base64Utils,
    { operacao: 'encode', texto: '' },
    ['Base64 Encode', '✅']
  );

  // Base64 com quebras de linha
  await testTool(
    base64Utils,
    { 
      operacao: 'decode', 
      dados_base64: ['SGVs\nbG8g\nV29y\nbGQh'] 
    },
    ['Base64 Decode', 'Hello World!', '✅']
  );

  // Caracteres especiais
  await testTool(
    base64Utils,
    { operacao: 'encode', texto: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    ['Base64 Encode', '✅']
  );

  console.log('  ✅ Casos extremos funcionando');
}

async function testFormatos() {
  console.log('🧪 Testando diferentes formatos de saída...');

  // Formato hex
  await testTool(
    base64Utils,
    { 
      operacao: 'decode', 
      dados_base64: ['SGVsbG8='],
      formato_saida: 'hex'
    },
    ['Base64 Decode', 'hex', '✅']
  );

  // Formato buffer
  await testTool(
    base64Utils,
    { 
      operacao: 'decode', 
      dados_base64: ['SGVsbG8='],
      formato_saida: 'buffer'
    },
    ['Base64 Decode', 'Buffer', '✅']
  );

  console.log('  ✅ Diferentes formatos funcionando');
}

async function runBase64UtilsTests() {
  console.log('🚀 Testando Base64 Utils...\n');

  try {
    await testEncode();
    await testEncodeUnicode();
    await testDecode();
    await testDecodeMultiple();
    await testUrlEncode();
    await testUrlDecode();
    await testValidacao();
    await testAnalise();
    await testFormatacao();
    await testDeteccao();
    await testErrorHandling();
    await testEdgeCases();
    await testFormatos();

    console.log('\n✅ Base64 Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Base64 Utils - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runBase64UtilsTests().catch(console.error);
}

module.exports = { runBase64UtilsTests };
