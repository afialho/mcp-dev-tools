const DevUtilsServer = require('../../bin/server');
const { validateMcpResponse } = require('../helpers/test-utils');
const assert = require('assert');

async function testServerInitialization() {
  console.log('🧪 Testando inicialização do servidor...');

  const server = new DevUtilsServer();

  assert(server.toolRegistry, 'ToolRegistry deve estar inicializado');
  assert.strictEqual(server.toolRegistry.getToolCount(), 5, 'Deve ter 5 ferramentas');

  const toolNames = server.toolRegistry.getToolNames();
  const expectedTools = ['gerar_uuid', 'validar_email', 'gerar_hash', 'formatar_json', 'calcular_idade'];

  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar disponível`);
  }

  console.log('  ✅ Servidor inicializado corretamente');
}

async function testServerToolExecution() {
  console.log('🧪 Testando execução via servidor...');

  const server = new DevUtilsServer();

  // Teste UUID via servidor
  const uuidResult = await server.toolRegistry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  validateMcpResponse(uuidResult);
  assert(uuidResult.content[0].text.includes('UUID'), 'Resultado deve conter UUID');

  // Teste Email via servidor
  const emailResult = await server.toolRegistry.executeTool('validar_email', { email: 'test@example.com' });
  validateMcpResponse(emailResult);
  assert(emailResult.content[0].text.includes('Email Válido'), 'Email deve ser válido');

  console.log('  ✅ Execução via servidor funcionando');
}

async function testServerSchemas() {
  console.log('🧪 Testando schemas do servidor...');

  const server = new DevUtilsServer();
  const schemas = server.toolRegistry.getToolSchemas();

  assert.strictEqual(schemas.length, 5, 'Deve ter 5 schemas');

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
