const uuidGenerator = require('../../tools/uuid-generator');
const { testTool } = require('../helpers/test-utils');

async function testUuidV4() {
  console.log('🧪 Testando UUID v4...');
  
  await testTool(
    uuidGenerator, 
    { versao: 'v4', quantidade: 1 },
    ['UUID', 'V4', '✅']
  );
  
  console.log('  ✅ UUID v4 gerado com sucesso');
}

async function testUuidV1Multiple() {
  console.log('🧪 Testando UUID v1 múltiplos...');
  
  await testTool(
    uuidGenerator,
    { versao: 'v1', quantidade: 2 },
    ['UUID', 'V1', '2. `', '✅']
  );
  
  console.log('  ✅ UUID v1 múltiplos gerados com sucesso');
}

async function runUuidGeneratorTests() {
  console.log('🚀 Testando UUID Generator...\n');
  
  try {
    await testUuidV4();
    await testUuidV1Multiple();
    
    console.log('\n✅ UUID Generator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ UUID Generator - Teste falhou:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runUuidGeneratorTests().catch(console.error);
}

module.exports = { runUuidGeneratorTests };
