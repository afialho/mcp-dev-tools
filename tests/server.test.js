const assert = require('assert');
const DevUtilsServer = require('../bin/server');

// Teste do servidor refatorado
async function testServerInitialization() {
  console.log('🧪 Testando inicialização do servidor...');
  
  const server = new DevUtilsServer();
  
  // Verificar se o ToolRegistry foi inicializado
  assert(server.toolRegistry, 'ToolRegistry deve estar inicializado');
  assert.strictEqual(server.toolRegistry.getToolCount(), 5, 'Deve ter 5 ferramentas carregadas');
  
  console.log('  ✅ Servidor inicializado com ToolRegistry');
  console.log('  ✅ Todas as 5 ferramentas carregadas no servidor');
  
  // Verificar se as ferramentas estão disponíveis
  const toolNames = server.toolRegistry.getToolNames();
  const expectedTools = ['gerar_uuid', 'validar_email', 'gerar_hash', 'formatar_json', 'calcular_idade'];
  
  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar disponível`);
  }
  
  console.log('  ✅ Todas as ferramentas esperadas estão disponíveis');
  console.log('✅ Server initialization test passed');
}

async function testServerToolExecution() {
  console.log('🧪 Testando execução de ferramentas via servidor...');
  
  const server = new DevUtilsServer();
  
  // Testar execução de UUID via servidor
  const uuidResult = await server.toolRegistry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  assert(uuidResult.content[0].text.includes('UUID'), 'Resultado deve conter UUID');
  console.log('  ✅ UUID executado via servidor');
  
  // Testar execução de Email via servidor
  const emailResult = await server.toolRegistry.executeTool('validar_email', { email: 'test@example.com' });
  assert(emailResult.content[0].text.includes('Email Válido'), 'Email deve ser válido');
  console.log('  ✅ Email validator executado via servidor');
  
  // Testar erro para ferramenta inexistente
  try {
    await server.toolRegistry.executeTool('ferramenta_inexistente', {});
    assert.fail('Deveria ter lançado erro para ferramenta inexistente');
  } catch (error) {
    assert(error.message.includes('Ferramenta não encontrada'), 'Erro deve indicar ferramenta não encontrada');
    console.log('  ✅ Erro para ferramenta inexistente tratado corretamente');
  }
  
  console.log('✅ Server tool execution test passed');
}

async function testServerSchemas() {
  console.log('🧪 Testando schemas do servidor...');
  
  const server = new DevUtilsServer();
  const schemas = server.toolRegistry.getToolSchemas();
  
  // Verificar se todos os schemas estão presentes
  assert.strictEqual(schemas.length, 5, 'Deve ter 5 schemas');
  
  // Verificar estrutura dos schemas
  for (const schema of schemas) {
    assert(schema.name, 'Schema deve ter nome');
    assert(schema.description, 'Schema deve ter descrição');
    assert(schema.inputSchema, 'Schema deve ter inputSchema');
    assert.strictEqual(schema.inputSchema.type, 'object', 'InputSchema deve ser do tipo object');
  }
  
  console.log('  ✅ Todos os schemas têm estrutura correta');
  
  // Verificar schemas específicos
  const uuidSchema = schemas.find(s => s.name === 'gerar_uuid');
  assert(uuidSchema, 'Schema do UUID deve existir');
  assert(uuidSchema.inputSchema.properties.versao, 'UUID deve ter propriedade versao');
  assert(uuidSchema.inputSchema.properties.quantidade, 'UUID deve ter propriedade quantidade');
  
  const emailSchema = schemas.find(s => s.name === 'validar_email');
  assert(emailSchema, 'Schema do Email deve existir');
  assert(emailSchema.inputSchema.required.includes('email'), 'Email deve ser obrigatório');
  
  console.log('  ✅ Schemas específicos validados');
  console.log('✅ Server schemas test passed');
}

// Executar todos os testes do servidor
async function runServerTests() {
  console.log('🚀 Iniciando testes do servidor refatorado...\n');
  
  try {
    await testServerInitialization();
    console.log('');
    
    await testServerToolExecution();
    console.log('');
    
    await testServerSchemas();
    console.log('');
    
    console.log('🎉 Todos os testes do servidor passaram com sucesso!');
    console.log('✅ Servidor refatorado funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Teste do servidor falhou:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  runServerTests();
}

module.exports = {
  testServerInitialization,
  testServerToolExecution,
  testServerSchemas,
  runServerTests
};
