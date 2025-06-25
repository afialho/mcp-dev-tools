const emailValidator = require('../../tools/email-validator');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidEmail() {
  console.log('🧪 Testando email válido...');

  await testTool(
    emailValidator,
    { email: 'test@example.com' },
    ['✅', 'Email Válido', 'test@example.com']
  );

  console.log('  ✅ Email válido detectado corretamente');
}

async function testInvalidEmail() {
  console.log('🧪 Testando email inválido...');

  await testToolError(
    emailValidator,
    { email: 'invalid-email' },
    ['❌', 'Email Inválido', 'invalid-email']
  );

  console.log('  ✅ Email inválido detectado corretamente');
}

async function runEmailValidatorTests() {
  console.log('🚀 Testando Email Validator...\n');

  try {
    await testValidEmail();
    await testInvalidEmail();

    console.log('\n✅ Email Validator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Email Validator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runEmailValidatorTests().catch(console.error);
}

module.exports = { runEmailValidatorTests };
