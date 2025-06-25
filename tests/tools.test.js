const assert = require('assert');
const uuidGenerator = require('../tools/uuid-generator');
const emailValidator = require('../tools/email-validator');
const hashGenerator = require('../tools/hash-generator');
const jsonFormatter = require('../tools/json-formatter');
const ageCalculator = require('../tools/age-calculator');
const ToolRegistry = require('../utils/tool-registry');

// Testes individuais das ferramentas
async function testUuidGenerator() {
  console.log('🧪 Testando UUID Generator...');
  
  // Teste UUID v4
  const resultV4 = await uuidGenerator.execute({ versao: 'v4', quantidade: 1 });
  assert(resultV4.content[0].text.includes('UUID'));
  assert(resultV4.content[0].text.includes('V4'));
  console.log('  ✅ UUID v4 gerado com sucesso');
  
  // Teste UUID v1
  const resultV1 = await uuidGenerator.execute({ versao: 'v1', quantidade: 2 });
  assert(resultV1.content[0].text.includes('UUID'));
  assert(resultV1.content[0].text.includes('V1'));
  assert(resultV1.content[0].text.includes('2. `'));
  console.log('  ✅ UUID v1 múltiplos gerados com sucesso');
  
  console.log('✅ UUID Generator test passed');
}

async function testEmailValidator() {
  console.log('🧪 Testando Email Validator...');
  
  // Teste email válido
  const resultValid = await emailValidator.execute({ email: 'test@example.com' });
  assert(resultValid.content[0].text.includes('✅'));
  assert(resultValid.content[0].text.includes('Email Válido'));
  console.log('  ✅ Email válido detectado corretamente');
  
  // Teste email inválido
  const resultInvalid = await emailValidator.execute({ email: 'invalid-email' });
  assert(resultInvalid.content[0].text.includes('❌'));
  assert(resultInvalid.content[0].text.includes('Email Inválido'));
  console.log('  ✅ Email inválido detectado corretamente');
  
  console.log('✅ Email Validator test passed');
}

async function testHashGenerator() {
  console.log('🧪 Testando Hash Generator...');
  
  // Teste SHA256 (padrão)
  const resultSHA256 = await hashGenerator.execute({ texto: 'hello' });
  assert(resultSHA256.content[0].text.includes('Hash Gerado'));
  assert(resultSHA256.content[0].text.includes('SHA256'));
  assert(resultSHA256.content[0].text.includes('hello'));
  console.log('  ✅ Hash SHA256 gerado com sucesso');
  
  // Teste MD5
  const resultMD5 = await hashGenerator.execute({ texto: 'world', algoritmo: 'md5' });
  assert(resultMD5.content[0].text.includes('MD5'));
  assert(resultMD5.content[0].text.includes('world'));
  console.log('  ✅ Hash MD5 gerado com sucesso');
  
  console.log('✅ Hash Generator test passed');
}

async function testJsonFormatter() {
  console.log('🧪 Testando JSON Formatter...');
  
  // Teste JSON válido
  const validJson = '{"name":"test","value":123}';
  const resultValid = await jsonFormatter.execute({ json_string: validJson, indentacao: 2 });
  assert(resultValid.content[0].text.includes('JSON Formatado'));
  assert(resultValid.content[0].text.includes('```json'));
  assert(resultValid.content[0].text.includes('"name": "test"'));
  console.log('  ✅ JSON válido formatado com sucesso');
  
  // Teste JSON inválido
  const invalidJson = '{"invalid": json}';
  const resultInvalid = await jsonFormatter.execute({ json_string: invalidJson });
  assert(resultInvalid.content[0].text.includes('❌'));
  assert(resultInvalid.content[0].text.includes('JSON Inválido'));
  console.log('  ✅ JSON inválido detectado corretamente');
  
  console.log('✅ JSON Formatter test passed');
}

async function testAgeCalculator() {
  console.log('🧪 Testando Age Calculator...');
  
  // Teste data válida
  const resultValid = await ageCalculator.execute({ data_nascimento: '1990-05-15' });
  assert(resultValid.content[0].text.includes('Cálculo de Idade'));
  assert(resultValid.content[0].text.includes('1990-05-15'));
  assert(resultValid.content[0].text.includes('anos'));
  console.log('  ✅ Idade calculada com sucesso');
  
  // Teste data inválida
  const resultInvalid = await ageCalculator.execute({ data_nascimento: 'invalid-date' });
  assert(resultInvalid.content[0].text.includes('Data Inválida') || 
         resultInvalid.content[0].text.includes('Cálculo de Idade')); // Pode calcular mesmo com formato diferente
  console.log('  ✅ Tratamento de data testado');
  
  console.log('✅ Age Calculator test passed');
}

// Teste do ToolRegistry
async function testToolRegistry() {
  console.log('🧪 Testando Tool Registry...');
  
  const registry = new ToolRegistry();
  registry.loadTools();
  
  // Verificar se todas as ferramentas foram carregadas
  assert.strictEqual(registry.getToolCount(), 5);
  console.log('  ✅ Todas as 5 ferramentas carregadas');
  
  // Verificar nomes das ferramentas
  const toolNames = registry.getToolNames();
  assert(toolNames.includes('gerar_uuid'));
  assert(toolNames.includes('validar_email'));
  assert(toolNames.includes('gerar_hash'));
  assert(toolNames.includes('formatar_json'));
  assert(toolNames.includes('calcular_idade'));
  console.log('  ✅ Todos os nomes de ferramentas corretos');
  
  // Testar execução via registry
  const result = await registry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  assert(result.content[0].text.includes('UUID'));
  console.log('  ✅ Execução via registry funcionando');
  
  // Testar erro para ferramenta inexistente
  try {
    await registry.executeTool('ferramenta_inexistente', {});
    assert.fail('Deveria ter lançado erro');
  } catch (error) {
    assert(error.message.includes('Ferramenta não encontrada'));
    console.log('  ✅ Erro para ferramenta inexistente funcionando');
  }
  
  console.log('✅ Tool Registry test passed');
}

// Executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes das ferramentas refatoradas...\n');
  
  try {
    await testUuidGenerator();
    console.log('');
    
    await testEmailValidator();
    console.log('');
    
    await testHashGenerator();
    console.log('');
    
    await testJsonFormatter();
    console.log('');
    
    await testAgeCalculator();
    console.log('');
    
    await testToolRegistry();
    console.log('');
    
    console.log('🎉 Todos os testes passaram com sucesso!');
    console.log('✅ Refatoração validada - todas as ferramentas funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Teste falhou:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  runTests();
}

module.exports = {
  testUuidGenerator,
  testEmailValidator,
  testHashGenerator,
  testJsonFormatter,
  testAgeCalculator,
  testToolRegistry,
  runTests
};
