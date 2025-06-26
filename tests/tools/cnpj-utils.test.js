const cnpjUtils = require('../../tools/cnpj-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testGerarCnpjUnico() {
  console.log('🧪 Testando geração de CNPJ único...');
  
  await testTool(
    cnpjUtils, 
    { operacao: 'gerar', quantidade: 1, formato: 'com_mascara' },
    ['CNPJs Gerados', '1.', '✅ Válido', 'gerado(s) com sucesso']
  );
  
  console.log('  ✅ CNPJ único gerado com sucesso');
}

async function testGerarMultiplosCnpjs() {
  console.log('🧪 Testando geração de múltiplos CNPJs...');
  
  await testTool(
    cnpjUtils,
    { operacao: 'gerar', quantidade: 3, formato: 'sem_mascara' },
    ['CNPJs Gerados', '1.', '2.', '3.', '✅ Válido', '3 CNPJ(s) gerado(s)']
  );
  
  console.log('  ✅ Múltiplos CNPJs gerados com sucesso');
}

async function testLimiteQuantidade() {
  console.log('🧪 Testando limite de quantidade...');
  
  await testTool(
    cnpjUtils,
    { operacao: 'gerar', quantidade: 100, formato: 'sem_mascara' },
    ['CNPJs Gerados', '100 CNPJ(s) gerado(s)']
  );
  
  console.log('  ✅ Limite de quantidade respeitado');
}

async function testValidarCnpjsValidos() {
  console.log('🧪 Testando validação de CNPJs válidos...');
  
  // CNPJs válidos conhecidos
  const cnpjsValidos = [
    '11.222.333/0001-81',
    '12345678000195'
  ];
  
  await testTool(
    cnpjUtils,
    { operacao: 'validar', cnpjs: cnpjsValidos },
    ['Validação de CNPJs', '✅ **Válido**', '2 válido(s), 0 inválido(s)']
  );
  
  console.log('  ✅ CNPJs válidos reconhecidos corretamente');
}

async function testValidarCnpjsInvalidos() {
  console.log('🧪 Testando validação de CNPJs inválidos...');
  
  const cnpjsInvalidos = [
    '00000000000000',  // Sequência repetida
    '123456789',       // Poucos dígitos
    '12345678000199'   // Dígitos verificadores incorretos
  ];
  
  await testTool(
    cnpjUtils,
    { operacao: 'validar', cnpjs: cnpjsInvalidos },
    ['Validação de CNPJs', '❌ **Inválido**', '0 válido(s), 3 inválido(s)']
  );
  
  console.log('  ✅ CNPJs inválidos detectados corretamente');
}

async function testValidarCnpjsMistos() {
  console.log('🧪 Testando validação de CNPJs mistos...');
  
  const cnpjsMistos = [
    '11.222.333/0001-81',  // Válido
    '00000000000000',      // Inválido
    '12345678000195'       // Válido
  ];
  
  await testTool(
    cnpjUtils,
    { operacao: 'validar', cnpjs: cnpjsMistos },
    ['Validação de CNPJs', '✅ **Válido**', '❌ **Inválido**', '2 válido(s), 1 inválido(s)']
  );
  
  console.log('  ✅ CNPJs mistos processados corretamente');
}

async function testFormatarAdicionarMascara() {
  console.log('🧪 Testando formatação - adicionar máscara...');
  
  const cnpjsSemMascara = [
    '11222333000181',
    '12345678000195'
  ];
  
  await testTool(
    cnpjUtils,
    { operacao: 'formatar', cnpjs: cnpjsSemMascara, formato: 'com_mascara' },
    ['Adição de Máscara', '11.222.333/0001-81', '12.345.678/0001-95', '2 processado(s)']
  );
  
  console.log('  ✅ Máscara adicionada corretamente');
}

async function testFormatarRemoverMascara() {
  console.log('🧪 Testando formatação - remover máscara...');
  
  const cnpjsComMascara = [
    '11.222.333/0001-81',
    '12.345.678/0001-95'
  ];
  
  await testTool(
    cnpjUtils,
    { operacao: 'formatar', cnpjs: cnpjsComMascara, formato: 'sem_mascara' },
    ['Remoção de Máscara', '11222333000181', '12345678000195', '2 processado(s)']
  );
  
  console.log('  ✅ Máscara removida corretamente');
}

async function testFormatarCnpjsJaFormatados() {
  console.log('🧪 Testando formatação de CNPJs já formatados...');
  
  const cnpjsComMascara = ['11.222.333/0001-81'];
  
  await testTool(
    cnpjUtils,
    { operacao: 'formatar', cnpjs: cnpjsComMascara, formato: 'com_mascara' },
    ['Adição de Máscara', '11.222.333/0001-81', '1 processado(s)']
  );
  
  console.log('  ✅ CNPJs já formatados processados corretamente');
}

async function testValidarSemCnpjs() {
  console.log('🧪 Testando validação sem CNPJs...');
  
  await testToolError(
    cnpjUtils,
    { operacao: 'validar' },
    ['❌ **Erro de Validação**', 'necessário fornecer uma lista de CNPJs']
  );
  
  console.log('  ✅ Erro de validação sem CNPJs detectado');
}

async function testFormatarSemCnpjs() {
  console.log('🧪 Testando formatação sem CNPJs...');
  
  await testToolError(
    cnpjUtils,
    { operacao: 'formatar' },
    ['❌ **Erro de Formatação**', 'necessário fornecer uma lista de CNPJs']
  );
  
  console.log('  ✅ Erro de formatação sem CNPJs detectado');
}

async function testOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');
  
  await testToolError(
    cnpjUtils,
    { operacao: 'invalida' },
    ['❌ **Operação Inválida**', 'gerar`, `validar`, `formatar']
  );
  
  console.log('  ✅ Operação inválida detectada');
}

async function testValidacaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de validação específico...');
  
  // Testa CNPJs com diferentes tipos de erro
  const testCases = [
    { cnpj: '123', motivo: 'Deve ter 14 dígitos' },
    { cnpj: '11111111111111', motivo: 'Sequência repetida' },
    { cnpj: '12345678000199', motivo: 'Dígitos verificadores incorretos' }
  ];
  
  for (const testCase of testCases) {
    const motivo = cnpjUtils.obterMotivoInvalidez(testCase.cnpj);
    if (motivo !== testCase.motivo) {
      throw new Error(`Motivo incorreto para ${testCase.cnpj}: esperado "${testCase.motivo}", obtido "${motivo}"`);
    }
  }
  
  console.log('  ✅ Algoritmo de validação funcionando corretamente');
}

async function testGeracaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de geração...');
  
  // Gera 10 CNPJs e verifica se todos são válidos
  for (let i = 0; i < 10; i++) {
    const cnpj = cnpjUtils.gerarCNPJ();
    if (!cnpjUtils.validarCNPJ(cnpj)) {
      throw new Error(`CNPJ gerado inválido: ${cnpj}`);
    }
  }
  
  console.log('  ✅ Algoritmo de geração produzindo CNPJs válidos');
}

async function runCnpjUtilsTests() {
  console.log('🚀 Iniciando testes do CNPJ Utils...\n');
  
  try {
    // Testes de geração
    await testGerarCnpjUnico();
    await testGerarMultiplosCnpjs();
    await testLimiteQuantidade();
    
    // Testes de validação
    await testValidarCnpjsValidos();
    await testValidarCnpjsInvalidos();
    await testValidarCnpjsMistos();
    
    // Testes de formatação
    await testFormatarAdicionarMascara();
    await testFormatarRemoverMascara();
    await testFormatarCnpjsJaFormatados();
    
    // Testes de erro
    await testValidarSemCnpjs();
    await testFormatarSemCnpjs();
    await testOperacaoInvalida();
    
    // Testes de algoritmos
    await testValidacaoAlgoritmo();
    await testGeracaoAlgoritmo();
    
    console.log('\n✅ CNPJ Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ CNPJ Utils - Teste falhou:', error.message);
    throw error;
  }
}

// Executa os testes se o arquivo for chamado diretamente
if (require.main === module) {
  runCnpjUtilsTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runCnpjUtilsTests };
