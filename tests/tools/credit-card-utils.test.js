const creditCardUtils = require('../../tools/credit-card-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testGerarCartaoUnico() {
  console.log('🧪 Testando geração de cartão único...');
  
  await testTool(
    creditCardUtils, 
    { operacao: 'gerar', quantidade: 1, bandeira: 'visa', formato: 'com_mascara' },
    ['Cartões Gerados', 'Visa', '1.', '✅', 'CVV:', 'gerado(s) com sucesso']
  );
  
  console.log('  ✅ Cartão único gerado com sucesso');
}

async function testGerarMultiplosCartoes() {
  console.log('🧪 Testando geração de múltiplos cartões...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 3, bandeira: 'aleatorio', formato: 'sem_mascara' },
    ['Cartões Gerados', '1.', '2.', '3.', '✅', '3 cartão(s) gerado(s)']
  );
  
  console.log('  ✅ Múltiplos cartões gerados com sucesso');
}

async function testGerarCartaoSemCVV() {
  console.log('🧪 Testando geração sem CVV...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 1, bandeira: 'mastercard', incluir_cvv: false },
    ['Cartões Gerados', 'Mastercard', '1.', '✅']
  );
  
  console.log('  ✅ Cartão sem CVV gerado com sucesso');
}

async function testGerarCartaoSemData() {
  console.log('🧪 Testando geração sem data...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 1, bandeira: 'visa', incluir_data: false },
    ['Cartões Gerados', 'Visa', '1.', '✅']
  );
  
  console.log('  ✅ Cartão sem data gerado com sucesso');
}

async function testGerarCartaoDataVencida() {
  console.log('🧪 Testando geração com data vencida...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 1, bandeira: 'amex', tipo_data: 'vencida' },
    ['Cartões Gerados', 'American Express', '1.', '✅', 'Vencido']
  );
  
  console.log('  ✅ Cartão com data vencida gerado com sucesso');
}

async function testGerarCartaoDataMista() {
  console.log('🧪 Testando geração com datas mistas...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 5, bandeira: 'visa', tipo_data: 'mista' },
    ['Cartões Gerados', 'Visa', '5 cartão(s) gerado(s)']
  );
  
  console.log('  ✅ Cartões com datas mistas gerados com sucesso');
}

async function testValidarCartoesValidos() {
  console.log('🧪 Testando validação de cartões válidos...');

  // Gerar números válidos usando os novos IINs
  const visaValido = creditCardUtils.gerarNumero('visa');
  const mastercardValido = creditCardUtils.gerarNumero('mastercard');
  const amexValido = creditCardUtils.gerarNumero('amex');

  const cartoesValidos = [visaValido, mastercardValido, amexValido];

  await testTool(
    creditCardUtils,
    { operacao: 'validar', numeros: cartoesValidos },
    ['Validação de Cartões', 'Válido', '3 válido(s)']
  );

  console.log('  ✅ Cartões válidos validados corretamente');
}

async function testValidarCartoesInvalidos() {
  console.log('🧪 Testando validação de cartões inválidos...');

  const cartoesInvalidos = [
    '1234567890123456', // Número inválido
    '4111111111111112', // Visa com dígito verificador errado
    '0000000000000000'  // Sequência inválida
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'validar', numeros: cartoesInvalidos },
    ['Validação de Cartões', 'Inválido', '3 inválido(s)']
  );

  console.log('  ✅ Cartões inválidos identificados corretamente');
}

async function testValidarCartoesMistos() {
  console.log('🧪 Testando validação de cartões mistos...');

  const visaValido = creditCardUtils.gerarNumero('visa');
  const mastercardValido = creditCardUtils.gerarNumero('mastercard');

  const cartoesMistos = [
    visaValido,           // Visa válido
    '1234567890123456',   // Inválido
    mastercardValido      // Mastercard válido
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'validar', numeros: cartoesMistos },
    ['Validação de Cartões', 'Válido', 'Inválido', '2 válido(s)', '1 inválido(s)']
  );

  console.log('  ✅ Cartões mistos validados corretamente');
}

async function testIdentificarBandeiras() {
  console.log('🧪 Testando identificação de bandeiras...');

  const cartoesTeste = [
    creditCardUtils.gerarNumero('visa'),       // Visa
    creditCardUtils.gerarNumero('mastercard'), // Mastercard
    creditCardUtils.gerarNumero('amex'),       // American Express
    creditCardUtils.gerarNumero('diners')      // Diners Club
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'identificar', numeros: cartoesTeste },
    ['Identificação de Bandeiras', 'Visa', 'Mastercard', 'American Express', 'Diners Club']
  );

  console.log('  ✅ Bandeiras identificadas corretamente');
}

async function testFormatarComMascara() {
  console.log('🧪 Testando formatação com máscara...');

  const cartoesParaFormatar = [
    creditCardUtils.gerarNumero('visa'),       // Visa
    creditCardUtils.gerarNumero('mastercard')  // Mastercard
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'formatar', numeros: cartoesParaFormatar, formato: 'com_mascara' },
    ['Formatação de Cartões', 'Adição de Máscara', '2 formatado(s)']
  );

  console.log('  ✅ Formatação com máscara funcionando');
}

async function testFormatarSemMascara() {
  console.log('🧪 Testando formatação sem máscara...');

  // Gerar cartões e formatá-los com máscara primeiro
  const visa = creditCardUtils.gerarNumero('visa');
  const mastercard = creditCardUtils.gerarNumero('mastercard');

  const cartoesFormatados = [
    creditCardUtils.formatarComMascara(visa, 'visa'),
    creditCardUtils.formatarComMascara(mastercard, 'mastercard')
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'formatar', numeros: cartoesFormatados, formato: 'sem_mascara' },
    ['Formatação de Cartões', 'Remoção de Máscara', '2 formatado(s)']
  );

  console.log('  ✅ Formatação sem máscara funcionando');
}

async function testAnalisarCartoes() {
  console.log('🧪 Testando análise completa de cartões...');

  const cartoesParaAnalisar = [
    creditCardUtils.gerarNumero('visa'), // Visa válido
    '1234567890123456'                   // Inválido
  ];

  await testTool(
    creditCardUtils,
    { operacao: 'analisar', numeros: cartoesParaAnalisar },
    ['Análise Completa', 'Visa', 'Válido', 'Luhn', 'Não identificada', 'Inválido']
  );

  console.log('  ✅ Análise completa funcionando');
}

async function testValidarSemNumeros() {
  console.log('🧪 Testando validação sem números...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'validar', numeros: [] },
    ['Erro de Validação', 'necessário fornecer uma lista de números']
  );
  
  console.log('  ✅ Erro de validação sem números tratado');
}

async function testOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'operacao_inexistente' },
    ['Operação Inválida', 'gerar, validar, identificar, formatar, analisar']
  );
  
  console.log('  ✅ Operação inválida tratada corretamente');
}

async function testLimiteQuantidade() {
  console.log('🧪 Testando limite de quantidade...');
  
  await testTool(
    creditCardUtils,
    { operacao: 'gerar', quantidade: 50, bandeira: 'visa' },
    ['Cartões Gerados', 'Visa', '50 cartão(s) gerado(s)']
  );
  
  console.log('  ✅ Limite de quantidade respeitado');
}

async function testAlgoritmoLuhn() {
  console.log('🧪 Testando algoritmo de Luhn...');

  // Testa números conhecidos
  const numeroValido = '4111111111111111';
  const numeroInvalido = '4111111111111112';

  if (!creditCardUtils.validarLuhn(numeroValido)) {
    throw new Error('Número válido não passou na validação de Luhn');
  }

  if (creditCardUtils.validarLuhn(numeroInvalido)) {
    throw new Error('Número inválido passou na validação de Luhn');
  }

  console.log('  ✅ Algoritmo de Luhn funcionando corretamente');
}

async function testGeracaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de geração...');
  
  // Gera um cartão e valida se está correto
  const cartaoGerado = creditCardUtils.gerarNumero('visa');
  
  if (!/^4\d{12,18}$/.test(cartaoGerado)) {
    throw new Error('Cartão Visa gerado não tem formato correto');
  }
  
  if (!creditCardUtils.validarLuhn(cartaoGerado)) {
    throw new Error('Cartão gerado não passou na validação de Luhn');
  }
  
  const bandeira = creditCardUtils.identificarBandeira(cartaoGerado);
  if (bandeira !== 'visa') {
    throw new Error('Cartão gerado não foi identificado como Visa');
  }
  
  console.log('  ✅ Algoritmo de geração funcionando corretamente');
}

async function testGeracaoCVV() {
  console.log('🧪 Testando geração de CVV...');
  
  // Testa CVV para diferentes bandeiras
  const cvvVisa = creditCardUtils.gerarCVV('visa');
  const cvvAmex = creditCardUtils.gerarCVV('amex');
  
  if (cvvVisa.length !== 3 || !/^\d{3}$/.test(cvvVisa)) {
    throw new Error('CVV Visa deve ter 3 dígitos');
  }
  
  if (cvvAmex.length !== 4 || !/^\d{4}$/.test(cvvAmex)) {
    throw new Error('CVV American Express deve ter 4 dígitos');
  }
  
  console.log('  ✅ Geração de CVV funcionando corretamente');
}

async function testGeracaoData() {
  console.log('🧪 Testando geração de data...');
  
  // Testa geração de data futura
  const dataFutura = creditCardUtils.gerarDataExpiracao('futura', 5, 3, 'MM/YY');
  if (!/^\d{2}\/\d{2}$/.test(dataFutura)) {
    throw new Error('Data futura deve ter formato MM/YY');
  }
  
  // Testa geração de data vencida
  const dataVencida = creditCardUtils.gerarDataExpiracao('vencida', 5, 3, 'MM/YYYY');
  if (!/^\d{2}\/\d{4}$/.test(dataVencida)) {
    throw new Error('Data vencida deve ter formato MM/YYYY');
  }
  
  console.log('  ✅ Geração de data funcionando corretamente');
}

async function testVerificacaoDataVencida() {
  console.log('🧪 Testando verificação de data vencida...');

  // Testa data claramente vencida
  const dataVencida = '01/20'; // Janeiro 2020
  if (!creditCardUtils.isDataVencida(dataVencida)) {
    throw new Error('Data vencida não foi identificada corretamente');
  }

  // Testa data futura
  const anoFuturo = new Date().getFullYear() + 2;
  const dataFutura = `12/${anoFuturo.toString().slice(-2)}`;
  if (creditCardUtils.isDataVencida(dataFutura)) {
    throw new Error('Data futura foi identificada como vencida');
  }

  console.log('  ✅ Verificação de data vencida funcionando corretamente');
}

async function runCreditCardUtilsTests() {
  console.log('🚀 Testando Credit Card Utils...\n');

  try {
    // Testes de geração
    await testGerarCartaoUnico();
    await testGerarMultiplosCartoes();
    await testGerarCartaoSemCVV();
    await testGerarCartaoSemData();
    await testGerarCartaoDataVencida();
    await testGerarCartaoDataMista();
    await testLimiteQuantidade();

    // Testes de validação
    await testValidarCartoesValidos();
    await testValidarCartoesInvalidos();
    await testValidarCartoesMistos();

    // Testes de identificação
    await testIdentificarBandeiras();

    // Testes de formatação
    await testFormatarComMascara();
    await testFormatarSemMascara();

    // Testes de análise
    await testAnalisarCartoes();

    // Testes de erro
    await testValidarSemNumeros();
    await testOperacaoInvalida();

    // Testes de algoritmos
    await testAlgoritmoLuhn();
    await testGeracaoAlgoritmo();
    await testGeracaoCVV();
    await testGeracaoData();
    await testVerificacaoDataVencida();

    console.log('\n✅ Credit Card Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Credit Card Utils - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runCreditCardUtilsTests().catch(console.error);
}

module.exports = { runCreditCardUtilsTests };
