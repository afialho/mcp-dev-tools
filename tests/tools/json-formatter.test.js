const jsonFormatter = require('../../tools/json-formatter');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidJSON() {
  console.log('🧪 Testando JSON válido...');

  const validJson = '{"name":"test","value":123}';
  await testTool(
    jsonFormatter,
    { json_string: validJson, indentacao: 2 },
    ['📝 **JSON Formatado**', '"name": "test"', '"value": 123']
  );

  console.log('  ✅ JSON válido formatado com sucesso');
}

async function testInvalidJSON() {
  console.log('🧪 Testando JSON inválido...');

  const invalidJson = '{"invalid": json}';
  await testToolError(
    jsonFormatter,
    { json_string: invalidJson },
    ['❌', 'JSON Inválido', 'Erro:']
  );

  console.log('  ✅ JSON inválido detectado corretamente');
}

async function testCustomIndentation() {
  console.log('🧪 Testando indentação customizada...');

  const json = '{"test":true}';
  await testTool(
    jsonFormatter,
    { json_string: json, indentacao: 4 },
    ['📝 **JSON Formatado**', '"test": true']
  );

  console.log('  ✅ Indentação customizada funcionando');
}

async function testDirectDisplay() {
  console.log('🧪 Testando exibição direta do JSON...');

  const json = '{"direct":"display","working":true}';
  const result = await jsonFormatter.execute({ json_string: json, indentacao: 2 });

  // Verifica se o resultado não contém blocos de código markdown
  const text = result.content[0].text;
  if (text.includes('```json')) {
    throw new Error('JSON não deveria estar em bloco de código markdown');
  }

  // Verifica se contém o cabeçalho esperado
  if (!text.includes('📝 **JSON Formatado**')) {
    throw new Error('Cabeçalho esperado não encontrado');
  }

  // Verifica se o JSON está formatado corretamente
  if (!text.includes('"direct": "display"') || !text.includes('"working": true')) {
    throw new Error('JSON não está formatado corretamente');
  }

  console.log('  ✅ JSON exibido diretamente sem bloco de código');
}

async function runJsonFormatterTests() {
  console.log('🚀 Testando JSON Formatter...\n');

  try {
    await testValidJSON();
    await testInvalidJSON();
    await testCustomIndentation();
    await testDirectDisplay();

    console.log('\n✅ JSON Formatter - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ JSON Formatter - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runJsonFormatterTests().catch(console.error);
}

module.exports = { runJsonFormatterTests };
