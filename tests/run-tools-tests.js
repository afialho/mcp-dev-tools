#!/usr/bin/env node

const { runUuidGeneratorTests } = require('./tools/uuid-generator.test');
const { runEmailValidatorTests } = require('./tools/email-validator.test');
const { runHashGeneratorTests } = require('./tools/hash-generator.test');
const { runJsonFormatterTests } = require('./tools/json-formatter.test');
const { runAgeCalculatorTests } = require('./tools/age-calculator.test');

async function runAllToolsTests() {
  console.log('🧪 EXECUTANDO TESTES DAS FERRAMENTAS INDIVIDUAIS\n');
  console.log('=' .repeat(60));
  console.log('');

  try {
    await runUuidGeneratorTests();
    console.log('');

    await runEmailValidatorTests();
    console.log('');

    await runHashGeneratorTests();
    console.log('');

    await runJsonFormatterTests();
    console.log('');

    await runAgeCalculatorTests();
    console.log('');

    console.log('=' .repeat(60));
    console.log('🎉 TODOS OS TESTES DAS FERRAMENTAS PASSARAM!');
    console.log('✅ 5 ferramentas testadas individualmente');
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
