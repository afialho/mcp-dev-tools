const DevToolsServer = require('../../bin/server');
const { validateMcpResponse } = require('../helpers/test-utils');
const assert = require('assert');

async function testServerInitialization() {
  console.log('🧪 Testando inicialização do servidor...');

  const server = new DevToolsServer();

  assert(server.toolRegistry, 'ToolRegistry deve estar inicializado');
  assert.strictEqual(server.toolRegistry.getToolCount(), 11, 'Deve ter 11 ferramentas');

  const toolNames = server.toolRegistry.getToolNames();
  const expectedTools = ['gerar_uuid', 'email_utils', 'gerar_hash', 'json_utils_dev-tools', 'calcular_idade', 'cpf_utils', 'cnpj_utils', 'password_utils', 'credit_card_utils', 'date_utils', 'competencia_utils'];

  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar disponível`);
  }

  console.log('  ✅ Servidor inicializado corretamente');
}

async function testServerToolExecution() {
  console.log('🧪 Testando execução via servidor...');

  const server = new DevToolsServer();

  // Teste UUID via servidor
  const uuidResult = await server.toolRegistry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  validateMcpResponse(uuidResult);
  assert(uuidResult.content[0].text.includes('UUID'), 'Resultado deve conter UUID');

  // Teste Email via servidor
  const emailResult = await server.toolRegistry.executeTool('email_utils', { operacao: 'validar', emails: ['test@example.com'] });
  validateMcpResponse(emailResult);
  assert(emailResult.content[0].text.includes('Validação de Emails'), 'Resultado deve conter validação de emails');

  console.log('  ✅ Execução via servidor funcionando');
}

async function testServerSchemas() {
  console.log('🧪 Testando schemas do servidor...');

  const server = new DevToolsServer();
  const schemas = server.toolRegistry.getToolSchemas();

  assert.strictEqual(schemas.length, 11, 'Deve ter 11 schemas');

  // Validar schema específico do UUID
  const uuidSchema = schemas.find(s => s.name === 'gerar_uuid');
  assert(uuidSchema, 'Schema do UUID deve existir');
  assert(uuidSchema.inputSchema.properties.versao, 'UUID deve ter propriedade versao');

  console.log('  ✅ Schemas do servidor validados');
}

async function runServerIntegrationTests() {
  console.log('🚀 Testando Integração do Servidor...\n');

  try {
    await testServerInitialization();
    await testServerToolExecution();
    await testServerSchemas();

    console.log('\n✅ Server Integration - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Server Integration - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runServerIntegrationTests().catch(console.error);
}

module.exports = { runServerIntegrationTests };
