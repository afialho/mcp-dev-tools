#!/usr/bin/env node

const { runUuidGeneratorTests } = require('./tools/uuid-generator.test');
const { runEmailUtilsTests } = require('./tools/email-utils.test');
const { runHashGeneratorTests } = require('./tools/hash-generator.test');
const { runJsonFormatterTests } = require('./tools/json-formatter.test');
const { runAgeCalculatorTests } = require('./tools/age-calculator.test');
const { runCpfUtilsTests } = require('./tools/cpf-utils.test');
const { runCnpjUtilsTests } = require('./tools/cnpj-utils.test');
const { runPasswordUtilsTests } = require('./tools/password-utils.test');
const { runCreditCardUtilsTests } = require('./tools/credit-card-utils.test');
const { runDateUtilsTests } = require('./tools/date-utils.test');
const { runCompetenciaUtilsTests } = require('./tools/competencia-utils.test');

async function runAllToolsTests() {
  console.log('🧪 EXECUTANDO TESTES DAS FERRAMENTAS INDIVIDUAIS\n');
  console.log('=' .repeat(60));
  console.log('');

  try {
    await runUuidGeneratorTests();
    console.log('');

    await runEmailUtilsTests();
    console.log('');

    await runHashGeneratorTests();
    console.log('');

    await runJsonFormatterTests();
    console.log('');

    await runAgeCalculatorTests();
    console.log('');

    await runCpfUtilsTests();
    console.log('');

    await runCnpjUtilsTests();
    console.log('');

    await runPasswordUtilsTests();
    console.log('');

    await runCreditCardUtilsTests();
    console.log('');

    await runDateUtilsTests();
    console.log('');

    await runCompetenciaUtilsTests();
    console.log('');

    console.log('=' .repeat(60));
    console.log('🎉 TODOS OS TESTES DAS FERRAMENTAS PASSARAM!');
    console.log('✅ 11 ferramentas testadas individualmente');
    console.log('✅ Atomicidade e isolamento garantidos');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ FALHA NOS TESTES DAS FERRAMENTAS:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllToolsTests();
}

module.exports = { runAllToolsTests };
