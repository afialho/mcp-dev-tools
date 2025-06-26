const emailUtils = require('../../tools/email-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidarEmailsValidos() {
  console.log('🧪 Testando validação de emails válidos...');
  
  const emailsValidos = [
    'test@example.com',
    'user.name@domain.org',
    'admin@empresa.com.br'
  ];
  
  await testTool(
    emailUtils,
    { operacao: 'validar', emails: emailsValidos },
    ['Validação de Emails', '✅ **Válido**', '3 válido(s), 0 inválido(s)']
  );
  
  console.log('  ✅ Emails válidos reconhecidos corretamente');
}

async function testValidarEmailsInvalidos() {
  console.log('🧪 Testando validação de emails inválidos...');
  
  const emailsInvalidos = [
    'invalid-email',
    'test@',
    '@domain.com',
    'test..test@domain.com'
  ];
  
  await testTool(
    emailUtils,
    { operacao: 'validar', emails: emailsInvalidos },
    ['Validação de Emails', '❌ **Inválido**', '0 válido(s), 4 inválido(s)']
  );
  
  console.log('  ✅ Emails inválidos detectados corretamente');
}

async function testValidarEmailsMistos() {
  console.log('🧪 Testando validação de emails mistos...');
  
  const emailsMistos = [
    'valid@example.com',
    'invalid-email',
    'another@domain.org'
  ];
  
  await testTool(
    emailUtils,
    { operacao: 'validar', emails: emailsMistos },
    ['Validação de Emails', '✅ **Válido**', '❌ **Inválido**', '2 válido(s), 1 inválido(s)']
  );
  
  console.log('  ✅ Emails mistos processados corretamente');
}

async function testGerarEmailsAleatorios() {
  console.log('🧪 Testando geração de emails aleatórios...');
  
  await testTool(
    emailUtils,
    { operacao: 'gerar', quantidade: 3, tipo: 'aleatorio' },
    ['Emails Aleatórios Gerados', '1.', '2.', '3.', '✅ Válido', '3 email(s) gerado(s)']
  );
  
  console.log('  ✅ Emails aleatórios gerados com sucesso');
}

async function testGerarEmailsProfissionais() {
  console.log('🧪 Testando geração de emails profissionais...');
  
  await testTool(
    emailUtils,
    { operacao: 'gerar', quantidade: 2, tipo: 'profissional', dominio: 'empresa.com' },
    ['Emails Profissionais Gerados', '1.', '2.', 'empresa.com', '2 email(s) gerado(s)']
  );
  
  console.log('  ✅ Emails profissionais gerados com sucesso');
}

async function testGerarEmailsTeste() {
  console.log('🧪 Testando geração de emails de teste...');
  
  await testTool(
    emailUtils,
    { operacao: 'gerar', quantidade: 1, tipo: 'teste' },
    ['Emails de Teste Gerados', '1.', '✅ Válido', '1 email(s) gerado(s)']
  );
  
  console.log('  ✅ Emails de teste gerados com sucesso');
}

async function testExtrairEmails() {
  console.log('🧪 Testando extração de emails...');
  
  const texto = 'Contatos: joao@empresa.com, maria@teste.org e admin@sistema.net para mais informações.';
  
  await testTool(
    emailUtils,
    { operacao: 'extrair', texto: texto },
    ['Emails Extraídos', 'joao@empresa.com', 'maria@teste.org', 'admin@sistema.net', '3 email(s)']
  );
  
  console.log('  ✅ Emails extraídos corretamente do texto');
}

async function testExtrairEmailsTextoVazio() {
  console.log('🧪 Testando extração em texto sem emails...');
  
  const texto = 'Este texto não contém nenhum endereço de correio eletrônico válido.';
  
  await testTool(
    emailUtils,
    { operacao: 'extrair', texto: texto },
    ['Extração de Emails', 'Nenhum email válido encontrado']
  );
  
  console.log('  ✅ Texto sem emails tratado corretamente');
}

async function testAnalisarEmails() {
  console.log('🧪 Testando análise de emails...');
  
  const emails = [
    'usuario@gmail.com',
    'admin@empresa.com.br'
  ];
  
  await testTool(
    emailUtils,
    { operacao: 'analisar', emails: emails },
    ['Análise Detalhada', 'usuario@gmail.com', 'Google Gmail', 'Usuário:', 'Domínio:', 'Provedor:']
  );
  
  console.log('  ✅ Análise de emails realizada corretamente');
}

async function testAnalisarEmailTemporario() {
  console.log('🧪 Testando análise de email temporário...');
  
  const emails = ['test@10minutemail.com'];
  
  await testTool(
    emailUtils,
    { operacao: 'analisar', emails: emails },
    ['Análise Detalhada', 'Temporário:', '⚠️ Sim']
  );
  
  console.log('  ✅ Email temporário detectado corretamente');
}

async function testFormatarEmails() {
  console.log('🧪 Testando formatação de emails...');
  
  const emails = [
    '  USUARIO@GMAIL.COM  ',
    'teste@gmial.com',
    'normal@domain.com'
  ];
  
  await testTool(
    emailUtils,
    { operacao: 'formatar', emails: emails },
    ['Formatação e Normalização', 'usuario@gmail.com', 'teste@gmail.com', 'Corrigido', 'Já formatado']
  );
  
  console.log('  ✅ Emails formatados corretamente');
}

async function testValidarSemEmails() {
  console.log('🧪 Testando validação sem emails...');
  
  await testToolError(
    emailUtils,
    { operacao: 'validar' },
    ['❌ **Erro de Validação**', 'necessário fornecer uma lista de emails']
  );
  
  console.log('  ✅ Erro de validação sem emails detectado');
}

async function testExtrairSemTexto() {
  console.log('🧪 Testando extração sem texto...');
  
  await testToolError(
    emailUtils,
    { operacao: 'extrair' },
    ['❌ **Erro de Extração**', 'necessário fornecer um texto']
  );
  
  console.log('  ✅ Erro de extração sem texto detectado');
}

async function testOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');
  
  await testToolError(
    emailUtils,
    { operacao: 'invalida' },
    ['❌ **Operação Inválida**', 'validar`, `gerar`, `extrair`, `analisar`, `formatar']
  );
  
  console.log('  ✅ Operação inválida detectada');
}

async function testValidacaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de validação específico...');
  
  // Testa emails com diferentes tipos de erro
  const testCases = [
    { email: 'test', motivo: 'Falta o símbolo @' },
    { email: 'test@@domain.com', motivo: 'Múltiplos símbolos @' },
    { email: 'test..user@domain.com', motivo: 'Pontos consecutivos não permitidos' },
    { email: '.test@domain.com', motivo: 'Não pode começar ou terminar com ponto' }
  ];
  
  for (const testCase of testCases) {
    const motivo = emailUtils.obterMotivoInvalidez(testCase.email);
    if (motivo !== testCase.motivo) {
      throw new Error(`Motivo incorreto para ${testCase.email}: esperado "${testCase.motivo}", obtido "${motivo}"`);
    }
  }
  
  console.log('  ✅ Algoritmo de validação funcionando corretamente');
}

async function testGeracaoAlgoritmo() {
  console.log('🧪 Testando algoritmo de geração...');
  
  // Gera 10 emails e verifica se todos são válidos
  for (let i = 0; i < 10; i++) {
    const email = emailUtils.gerarEmail('aleatorio');
    if (!emailUtils.validarEmail(email)) {
      throw new Error(`Email gerado inválido: ${email}`);
    }
  }
  
  console.log('  ✅ Algoritmo de geração produzindo emails válidos');
}

async function runEmailUtilsTests() {
  console.log('🚀 Iniciando testes do Email Utils...\n');
  
  try {
    // Testes de validação
    await testValidarEmailsValidos();
    await testValidarEmailsInvalidos();
    await testValidarEmailsMistos();
    
    // Testes de geração
    await testGerarEmailsAleatorios();
    await testGerarEmailsProfissionais();
    await testGerarEmailsTeste();
    
    // Testes de extração
    await testExtrairEmails();
    await testExtrairEmailsTextoVazio();
    
    // Testes de análise
    await testAnalisarEmails();
    await testAnalisarEmailTemporario();
    
    // Testes de formatação
    await testFormatarEmails();
    
    // Testes de erro
    await testValidarSemEmails();
    await testExtrairSemTexto();
    await testOperacaoInvalida();
    
    // Testes de algoritmos
    await testValidacaoAlgoritmo();
    await testGeracaoAlgoritmo();
    
    console.log('\n✅ Email Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Email Utils - Teste falhou:', error.message);
    throw error;
  }
}

// Executa os testes se o arquivo for chamado diretamente
if (require.main === module) {
  runEmailUtilsTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runEmailUtilsTests };
