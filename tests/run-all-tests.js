#!/usr/bin/env node

const { runAllToolsTests } = require('./run-tools-tests');
const { runToolRegistryTests } = require('./utils/tool-registry.test');
const { runServerIntegrationTests } = require('./integration/server.test');

async function runAllTests() {
  console.log('🧪 EXECUTANDO TODOS OS TESTES - ARQUITETURA REFATORADA\n');
  console.log('=' .repeat(70));
  console.log('');

  try {
    // Executar testes das ferramentas individuais
    console.log('📦 TESTES DAS FERRAMENTAS INDIVIDUAIS');
    console.log('-'.repeat(50));
    await runAllToolsTests();
    console.log('');

    // Executar testes dos utilitários
    console.log('🔧 TESTES DOS UTILITÁRIOS');
    console.log('-'.repeat(50));
    await runToolRegistryTests();
    console.log('');

    // Executar testes de integração
    console.log('🖥️  TESTES DE INTEGRAÇÃO');
    console.log('-'.repeat(50));
    await runServerIntegrationTests();
    console.log('');

    // Resumo final
    console.log('=' .repeat(70));
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('');
    console.log('✅ Testes refatorados e organizados:');
    console.log('   • 5 ferramentas testadas individualmente');
    console.log('   • 1 utilitário (ToolRegistry) testado');
    console.log('   • 1 teste de integração (Servidor)');
    console.log('   • Atomicidade total garantida');
    console.log('   • Execução granular possível');
    console.log('   • Estrutura espelhada com código');
    console.log('');
    console.log('🚀 Arquitetura de testes modular implementada!');
    console.log('=' .repeat(70));

  } catch (error) {
    console.error('❌ FALHA NOS TESTES:', error.message);
    process.exit(1);
  }
}

// Executar todos os testes
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
