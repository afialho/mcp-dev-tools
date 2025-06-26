const cpfUtils = require('../../tools/cpf-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testGerarCpfUnico() {
  console.log('🧪 Testando geração de CPF único...');
  
  await testTool(
    cpfUtils, 
    { operacao: 'gerar', quantidade: 1, formato: 'com_mascara' },
    ['CPFs Gerados', '1.', '✅ Válido', 'gerado(s) com sucesso']
  );
  
  console.log('  ✅ CPF único gerado com sucesso');
}

async function testGerarMultiplosCpfs() {
  console.log('🧪 Testando geração de múltiplos CPFs...');
  
  await testTool(
    cpfUtils,
    { operacao: 'gerar', quantidade: 3, formato: 'sem_mascara' },
    ['CPFs Gerados', '1.', '2.', '3.', '✅ Válido', '3 CPF(s) gerado(s)']
  );
  
  console.log('  ✅ Múltiplos CPFs gerados com sucesso');
}

async function testValidarCpfsValidos() {
  console.log('🧪 Testando validação de CPFs válidos...');
  
  // CPFs válidos conhecidos
  const cpfsValidos = ['11144477735', '123.456.789-09'];
  
  await testTool(
    cpfUtils,
    { operacao: 'validar', cpfs: cpfsValidos },
    ['Validação de CPFs', '✅ **Válido**', 'Resumo']
  );
  
  console.log('  ✅ CPFs válidos identificados corretamente');
}

async function testValidarCpfsInvalidos() {
  console.log('🧪 Testando validação de CPFs inválidos...');
  
  const cpfsInvalidos = [
    '111.111.111-11', // Sequência repetida
    '123.456.789-99', // Dígitos verificadores incorretos
    '12345678',       // Poucos dígitos
    '123456789012'    // Muitos dígitos
  ];
  
  await testTool(
    cpfUtils,
    { operacao: 'validar', cpfs: cpfsInvalidos },
    ['Validação de CPFs', '❌ **Inválido**', 'Sequência repetida', 'Resumo']
  );
  
  console.log('  ✅ CPFs inválidos identificados corretamente');
}

async function testValidarCpfsMistos() {
  console.log('🧪 Testando validação de CPFs mistos...');
  
  const cpfsMistos = [
    '11144477735',    // Válido
    '111.111.111-11', // Inválido - sequência
    '123.456.789-09'  // Válido
  ];
  
  await testTool(
    cpfUtils,
    { operacao: 'validar', cpfs: cpfsMistos },
    ['Validação de CPFs', '✅ **Válido**', '❌ **Inválido**', '2 válido(s), 1 inválido(s)']
  );
  
  console.log('  ✅ CPFs mistos validados corretamente');
}

async function testFormatarAdicionarMascara() {
  console.log('🧪 Testando formatação - adicionar máscara...');
  
  const cpfsSemMascara = ['11144477735', '12345678909'];
  
  await testTool(
    cpfUtils,
    { operacao: 'formatar', cpfs: cpfsSemMascara, formato: 'com_mascara' },
    ['Formatação de CPFs', 'Adicionar máscara', '111.444.777-35', '123.456.789-09', '→']
  );
  
  console.log('  ✅ Máscaras adicionadas corretamente');
}

async function testFormatarRemoverMascara() {
  console.log('🧪 Testando formatação - remover máscara...');
  
  const cpfsComMascara = ['111.444.777-35', '123.456.789-09'];
  
  await testTool(
    cpfUtils,
    { operacao: 'formatar', cpfs: cpfsComMascara, formato: 'sem_mascara' },
    ['Formatação de CPFs', 'Remover máscara', '11144477735', '12345678909', '→']
  );
  
  console.log('  ✅ Máscaras removidas corretamente');
}

async function testFormatarCpfsJaFormatados() {
  console.log('🧪 Testando formatação de CPFs já formatados...');
  
  const cpfsJaFormatados = ['111.444.777-35'];
  
  await testTool(
    cpfUtils,
    { operacao: 'formatar', cpfs: cpfsJaFormatados, formato: 'com_mascara' },
    ['Formatação de CPFs', 'sem alteração', 'processado(s) com sucesso']
  );
  
  console.log('  ✅ CPFs já formatados tratados corretamente');
}

async function testValidarSemCpfs() {
  console.log('🧪 Testando validação sem fornecer CPFs...');
  
  await testTool(
    cpfUtils,
    { operacao: 'validar' },
    ['❌', 'Erro de Validação', 'necessário fornecer uma lista de CPFs']
  );
  
  console.log('  ✅ Erro de validação sem CPFs tratado corretamente');
}

async function testFormatarSemCpfs() {
  console.log('🧪 Testando formatação sem fornecer CPFs...');
  
  await testTool(
    cpfUtils,
    { operacao: 'formatar' },
    ['❌', 'Erro de Formatação', 'necessário fornecer uma lista de CPFs']
  );
  
  console.log('  ✅ Erro de formatação sem CPFs tratado corretamente');
}

async function testOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');
  
  await testTool(
    cpfUtils,
    { operacao: 'operacao_inexistente' },
    ['❌', 'Operação Inválida', 'gerar', 'validar', 'formatar']
  );
  
  console.log('  ✅ Operação inválida tratada corretamente');
}

async function testValidacaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de validação específico...');
  
  // Testa CPF válido conhecido: 111.444.777-35
  const cpfValido = '11144477735';
  const resultado = cpfUtils.validarCPF(cpfValido);
  
  if (!resultado) {
    throw new Error('CPF válido conhecido foi rejeitado pelo algoritmo');
  }
  
  // Testa CPF inválido conhecido: 111.111.111-11
  const cpfInvalido = '11111111111';
  const resultadoInvalido = cpfUtils.validarCPF(cpfInvalido);
  
  if (resultadoInvalido) {
    throw new Error('CPF inválido conhecido foi aceito pelo algoritmo');
  }
  
  console.log('  ✅ Algoritmo de validação funcionando corretamente');
}

async function testGeracaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de geração...');
  
  // Gera um CPF e valida se está correto
  const cpfGerado = cpfUtils.gerarCPF();
  
  if (cpfGerado.length !== 11) {
    throw new Error('CPF gerado não tem 11 dígitos');
  }
  
  if (!/^\d{11}$/.test(cpfGerado)) {
    throw new Error('CPF gerado contém caracteres não numéricos');
  }
  
  if (!cpfUtils.validarCPF(cpfGerado)) {
    throw new Error('CPF gerado não passou na validação');
  }
  
  console.log('  ✅ Algoritmo de geração funcionando corretamente');
}

async function testLimiteQuantidade() {
  console.log('🧪 Testando limite de quantidade (100 CPFs)...');
  
  await testTool(
    cpfUtils,
    { operacao: 'gerar', quantidade: 100, formato: 'sem_mascara' },
    ['CPFs Gerados', '100.', '100 CPF(s) gerado(s)']
  );
  
  console.log('  ✅ Limite de 100 CPFs funcionando corretamente');
}

async function runCpfUtilsTests() {
  console.log('🚀 Testando CPF Utils...\n');
  
  try {
    // Testes de geração
    await testGerarCpfUnico();
    await testGerarMultiplosCpfs();
    await testLimiteQuantidade();
    
    // Testes de validação
    await testValidarCpfsValidos();
    await testValidarCpfsInvalidos();
    await testValidarCpfsMistos();
    
    // Testes de formatação
    await testFormatarAdicionarMascara();
    await testFormatarRemoverMascara();
    await testFormatarCpfsJaFormatados();
    
    // Testes de erro
    await testValidarSemCpfs();
    await testFormatarSemCpfs();
    await testOperacaoInvalida();
    
    // Testes de algoritmos
    await testValidacaoAlgoritmo();
    await testGeracaoAlgoritmo();
    
    console.log('\n✅ CPF Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ CPF Utils - Teste falhou:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runCpfUtilsTests().catch(console.error);
}

module.exports = { runCpfUtilsTests };
