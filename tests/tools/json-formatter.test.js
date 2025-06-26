const jsonFormatter = require('../../tools/json-formatter');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidJSON() {
  console.log('🧪 Testando JSON válido...');

  const validJson = '{"name":"test","value":123}';
  await testTool(
    jsonFormatter,
    { json_string: validJson, indentacao: 2 },
    ['```', '{"name":"test","value":123}']
  );

  console.log('  ✅ JSON válido processado com sucesso');
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
    ['```', '{"test":true}']
  );

  console.log('  ✅ JSON processado com indentação customizada');
}

async function testDirectDisplay() {
  console.log('🧪 Testando exibição do JSON...');

  const json = '{"direct":"display","working":true}';
  const result = await jsonFormatter.execute({ json_string: json, indentacao: 2 });

  // Verifica se o resultado contém blocos de código simples (não markdown)
  const text = result.content[0].text;
  if (!text.includes('```')) {
    throw new Error('JSON deveria estar em bloco de código');
  }

  // Verifica se NÃO contém o cabeçalho (comportamento atual)
  if (text.includes('📝 **JSON Formatado**')) {
    throw new Error('Cabeçalho não deveria estar presente no comportamento atual');
  }

  // Verifica se o JSON original está presente
  if (!text.includes('{"direct":"display","working":true}')) {
    throw new Error('JSON original não está presente');
  }

  console.log('  ✅ JSON exibido em bloco de código simples');
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
