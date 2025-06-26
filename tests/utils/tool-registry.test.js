const ToolRegistry = require('../../utils/tool-registry');
const { validateMcpResponse } = require('../helpers/test-utils');
const assert = require('assert');

async function testToolRegistryLoading() {
  console.log('🧪 Testando carregamento do ToolRegistry...');

  const registry = new ToolRegistry();
  registry.loadTools();

  assert.strictEqual(registry.getToolCount(), 14, 'Deve carregar 14 ferramentas');

  const toolNames = registry.getToolNames();
  const expectedTools = ['gerar_uuid', 'email_utils', 'gerar_hash', 'json_utils_dev-tools', 'calcular_idade', 'cpf_utils', 'cnpj_utils', 'password_utils', 'credit_card_utils', 'date_utils', 'competencia_utils', 'base64_utils_dev-tools', 'qr_code_utils_dev-tools', 'xml_utils_dev-tools'];

  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar carregada`);
  }

  console.log('  ✅ Todas as ferramentas carregadas corretamente');
}

async function testToolExecution() {
  console.log('🧪 Testando execução via ToolRegistry...');

  const registry = new ToolRegistry();
  registry.loadTools();

  const result = await registry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  validateMcpResponse(result);
  assert(result.content[0].text.includes('UUID'), 'Resultado deve conter UUID');

  console.log('  ✅ Execução via registry funcionando');
}

async function testToolNotFound() {
  console.log('🧪 Testando erro para ferramenta inexistente...');

  const registry = new ToolRegistry();
  registry.loadTools();

  try {
    await registry.executeTool('ferramenta_inexistente', {});
    assert.fail('Deveria ter lançado erro');
  } catch (error) {
    assert(error.message.includes('Ferramenta não encontrada'), 'Erro deve indicar ferramenta não encontrada');
  }

  console.log('  ✅ Erro para ferramenta inexistente tratado corretamente');
}

async function testToolSchemas() {
  console.log('🧪 Testando schemas das ferramentas...');

  const registry = new ToolRegistry();
  registry.loadTools();

  const schemas = registry.getToolSchemas();
  assert.strictEqual(schemas.length, 14, 'Deve ter 14 schemas');

  for (const schema of schemas) {
    assert(schema.name, 'Schema deve ter nome');
    assert(schema.description, 'Schema deve ter descrição');
    assert(schema.inputSchema, 'Schema deve ter inputSchema');
    assert.strictEqual(schema.inputSchema.type, 'object', 'InputSchema deve ser object');
  }

  console.log('  ✅ Todos os schemas válidos');
}

async function runToolRegistryTests() {
  console.log('🚀 Testando Tool Registry...\n');

  try {
    await testToolRegistryLoading();
    await testToolExecution();
    await testToolNotFound();
    await testToolSchemas();

    console.log('\n✅ Tool Registry - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Tool Registry - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runToolRegistryTests().catch(console.error);
}

module.exports = { runToolRegistryTests };
