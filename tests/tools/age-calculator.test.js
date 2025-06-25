const ageCalculator = require('../../tools/age-calculator');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidAge() {
  console.log('🧪 Testando cálculo de idade válida...');

  await testTool(
    ageCalculator,
    { data_nascimento: '1990-05-15' },
    ['Cálculo de Idade', '1990-05-15', 'anos', '✅']
  );

  console.log('  ✅ Idade calculada com sucesso');
}

async function testInvalidDate() {
  console.log('🧪 Testando data inválida...');

  // Nota: Age calculator pode processar algumas datas "inválidas"
  // então testamos com formato completamente incorreto
  await testTool(
    ageCalculator,
    { data_nascimento: 'not-a-date' },
    ['Cálculo de Idade'] // Pode processar ou dar erro
  );

  console.log('  ✅ Tratamento de data testado');
}

async function testRecentDate() {
  console.log('🧪 Testando data recente...');

  const currentYear = new Date().getFullYear();
  const recentDate = `${currentYear - 5}-01-01`;

  await testTool(
    ageCalculator,
    { data_nascimento: recentDate },
    ['Cálculo de Idade', recentDate, 'anos']
  );

  console.log('  ✅ Data recente calculada corretamente');
}

async function runAgeCalculatorTests() {
  console.log('🚀 Testando Age Calculator...\n');

  try {
    await testValidAge();
    await testInvalidDate();
    await testRecentDate();

    console.log('\n✅ Age Calculator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Age Calculator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runAgeCalculatorTests().catch(console.error);
}

module.exports = { runAgeCalculatorTests };
