const hashGenerator = require('../../tools/hash-generator');
const { testTool } = require('../helpers/test-utils');

async function testSHA256Hash() {
  console.log('🧪 Testando hash SHA256...');

  await testTool(
    hashGenerator,
    { texto: 'hello' },
    ['Hash Gerado', 'SHA256', 'hello', '✅']
  );

  console.log('  ✅ Hash SHA256 gerado com sucesso');
}

async function testMD5Hash() {
  console.log('🧪 Testando hash MD5...');

  await testTool(
    hashGenerator,
    { texto: 'world', algoritmo: 'md5' },
    ['Hash Gerado', 'MD5', 'world', '✅']
  );

  console.log('  ✅ Hash MD5 gerado com sucesso');
}

async function testSHA1Hash() {
  console.log('🧪 Testando hash SHA1...');

  await testTool(
    hashGenerator,
    { texto: 'test', algoritmo: 'sha1' },
    ['Hash Gerado', 'SHA1', 'test', '✅']
  );

  console.log('  ✅ Hash SHA1 gerado com sucesso');
}

async function runHashGeneratorTests() {
  console.log('🚀 Testando Hash Generator...\n');

  try {
    await testSHA256Hash();
    await testMD5Hash();
    await testSHA1Hash();

    console.log('\n✅ Hash Generator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Hash Generator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runHashGeneratorTests().catch(console.error);
}

module.exports = { runHashGeneratorTests };
