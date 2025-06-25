const jsonFormatter = require('../../tools/json-formatter');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidJSON() {
  console.log('🧪 Testando JSON válido...');

  const validJson = '{"name":"test","value":123}';
  await testTool(
    jsonFormatter,
    { json_string: validJson, indentacao: 2 },
    ['```json', '"name": "test"', '✅']
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
    ['```json', '"test": true', '✅']
  );

  console.log('  ✅ Indentação customizada funcionando');
}

async function runJsonFormatterTests() {
  console.log('🚀 Testando JSON Formatter...\n');

  try {
    await testValidJSON();
    await testInvalidJSON();
    await testCustomIndentation();

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
