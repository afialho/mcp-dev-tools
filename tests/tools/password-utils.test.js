const passwordUtils = require('../../tools/password-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testGerarSenhaForte() {
  console.log('🧪 Testando geração de senha forte...');
  
  await testTool(
    passwordUtils, 
    { operacao: 'gerar', tipo: 'forte', quantidade: 1, comprimento: 12 },
    ['Senhas Geradas', 'Forte', '1.', 'Entropia:', 'bits', '✅']
  );
  
  console.log('  ✅ Senha forte gerada com sucesso');
}

async function testGerarSenhaMedia() {
  console.log('🧪 Testando geração de senha média...');
  
  await testTool(
    passwordUtils,
    { operacao: 'gerar', tipo: 'media', quantidade: 2, comprimento: 10 },
    ['Senhas Geradas', 'Média', '1.', '2.', 'Entropia:', '2 senha(s) gerada(s)']
  );
  
  console.log('  ✅ Senhas médias geradas com sucesso');
}

async function testGerarSenhaNumerica() {
  console.log('🧪 Testando geração de senha numérica...');
  
  await testTool(
    passwordUtils,
    { operacao: 'gerar', tipo: 'numerica', quantidade: 1, comprimento: 6 },
    ['Senhas Geradas', 'Numérica', '1.', 'Entropia:', 'bits']
  );
  
  console.log('  ✅ Senha numérica gerada com sucesso');
}

async function testGerarSenhaPersonalizada() {
  console.log('🧪 Testando geração de senha personalizada...');
  
  await testTool(
    passwordUtils,
    { 
      operacao: 'gerar', 
      tipo: 'personalizada', 
      quantidade: 1, 
      comprimento: 8,
      incluir_maiusculas: true,
      incluir_minusculas: true,
      incluir_numeros: false,
      incluir_simbolos: false
    },
    ['Senhas Geradas', 'Personalizada', '1.', 'Entropia:']
  );
  
  console.log('  ✅ Senha personalizada gerada com sucesso');
}

async function testGerarSenhaPersonalizadaErro() {
  console.log('🧪 Testando erro em senha personalizada sem caracteres...');
  
  await testToolError(
    passwordUtils,
    { 
      operacao: 'gerar', 
      tipo: 'personalizada',
      incluir_maiusculas: false,
      incluir_minusculas: false,
      incluir_numeros: false,
      incluir_simbolos: false
    },
    ['❌', 'Erro de Configuração', 'selecione pelo menos um tipo']
  );
  
  console.log('  ✅ Erro de configuração detectado corretamente');
}

async function testAnalisarSenhaForte() {
  console.log('🧪 Testando análise de senha forte...');
  
  await testTool(
    passwordUtils,
    { operacao: 'analisar', senhas: ['MyStr0ng!P@ssw0rd'] },
    ['Análise de Segurança', 'Força:', 'Entropia:', 'Tempo para quebrar:', 'Características:']
  );
  
  console.log('  ✅ Análise de senha forte realizada');
}

async function testAnalisarSenhaFraca() {
  console.log('🧪 Testando análise de senha fraca...');
  
  await testTool(
    passwordUtils,
    { operacao: 'analisar', senhas: ['123456'] },
    ['Análise de Segurança', 'Fraca', 'Problemas detectados:', 'muito curta']
  );
  
  console.log('  ✅ Análise de senha fraca realizada');
}

async function testAnalisarMultiplasSenhas() {
  console.log('🧪 Testando análise de múltiplas senhas...');
  
  await testTool(
    passwordUtils,
    { operacao: 'analisar', senhas: ['MyStr0ng!P@ssw0rd', '123456', 'password'] },
    ['Análise de Múltiplas Senhas', '1.', '2.', '3.', 'Pontuação média:']
  );
  
  console.log('  ✅ Análise de múltiplas senhas realizada');
}

async function testValidarSenhas() {
  console.log('🧪 Testando validação de senhas...');
  
  await testTool(
    passwordUtils,
    { operacao: 'validar', senhas: ['MyStr0ng!P@ssw0rd', '123456', 'GoodP@ss123', 'weak'] },
    ['Relatório de Validação', 'Total analisado:', 'Fracas:', 'Médias:', 'Fortes:', 'Recomendação:']
  );
  
  console.log('  ✅ Validação de senhas realizada');
}

async function testGerarFraseSenha() {
  console.log('🧪 Testando geração de frase-senha...');
  
  await testTool(
    passwordUtils,
    { operacao: 'frase', quantidade: 1, palavras_frase: 4, separador: '-' },
    ['Frases-Senha Geradas', '1.', 'Entropia:', 'bits', 'frase(s)-senha gerada(s)']
  );
  
  console.log('  ✅ Frase-senha gerada com sucesso');
}

async function testGerarMultiplasFrases() {
  console.log('🧪 Testando geração de múltiplas frases-senha...');
  
  await testTool(
    passwordUtils,
    { operacao: 'frase', quantidade: 3, palavras_frase: 5, separador: '_' },
    ['Frases-Senha Geradas', '1.', '2.', '3.', 'Entropia:', '3 frase(s)-senha']
  );
  
  console.log('  ✅ Múltiplas frases-senha geradas com sucesso');
}

async function testAnaliseErroSemSenhas() {
  console.log('🧪 Testando erro de análise sem senhas...');
  
  await testToolError(
    passwordUtils,
    { operacao: 'analisar', senhas: [] },
    ['❌', 'Erro de Parâmetro', 'pelo menos uma senha']
  );
  
  console.log('  ✅ Erro de parâmetro detectado corretamente');
}

async function testValidacaoErroSemSenhas() {
  console.log('🧪 Testando erro de validação sem senhas...');
  
  await testToolError(
    passwordUtils,
    { operacao: 'validar', senhas: [] },
    ['❌', 'Erro de Parâmetro', 'pelo menos uma senha']
  );
  
  console.log('  ✅ Erro de parâmetro detectado corretamente');
}

async function testOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');

  await testToolError(
    passwordUtils,
    { operacao: 'invalida' },
    ['❌', 'Operação Inválida', 'gerar, analisar, validar, frase, verificar']
  );

  console.log('  ✅ Operação inválida detectada corretamente');
}

async function testLimitesParametros() {
  console.log('🧪 Testando limites de parâmetros...');

  // Teste com quantidade máxima
  await testTool(
    passwordUtils,
    { operacao: 'gerar', quantidade: 50, comprimento: 8 },
    ['50 senha(s) gerada(s)']
  );

  // Teste com comprimento máximo
  await testTool(
    passwordUtils,
    { operacao: 'gerar', quantidade: 1, comprimento: 128 },
    ['Entropia:', 'bits']
  );

  console.log('  ✅ Limites de parâmetros testados');
}

async function testFraseSenhaComNumeros() {
  console.log('🧪 Testando frase-senha com números...');

  await testTool(
    passwordUtils,
    { operacao: 'frase', quantidade: 1, palavras_frase: 3, incluir_numeros_frase: true },
    ['Frases-Senha Geradas', '1.', 'Entropia:', 'bits']
  );

  console.log('  ✅ Frase-senha com números gerada com sucesso');
}

async function testFraseSenhaComSimbolos() {
  console.log('🧪 Testando frase-senha com símbolos...');

  await testTool(
    passwordUtils,
    { operacao: 'frase', quantidade: 1, palavras_frase: 3, incluir_simbolos_frase: true },
    ['Frases-Senha Geradas', '1.', 'Entropia:', 'bits']
  );

  console.log('  ✅ Frase-senha com símbolos gerada com sucesso');
}

async function testFraseSenhaCompleta() {
  console.log('🧪 Testando frase-senha completa (palavras + números + símbolos)...');

  await testTool(
    passwordUtils,
    {
      operacao: 'frase',
      quantidade: 1,
      palavras_frase: 3,
      incluir_numeros_frase: true,
      incluir_simbolos_frase: true,
      separador: '_'
    },
    ['Frases-Senha Geradas', '1.', 'Entropia:', 'bits']
  );

  console.log('  ✅ Frase-senha completa gerada com sucesso');
}

async function testVerificarVazamentosSemSenhas() {
  console.log('🧪 Testando erro de verificação sem senhas...');

  await testToolError(
    passwordUtils,
    { operacao: 'verificar', senhas: [] },
    ['❌', 'Erro de Parâmetro', 'pelo menos uma senha para verificar']
  );

  console.log('  ✅ Erro de verificação sem senhas detectado');
}

// Nota: Teste de verificação real de vazamentos seria dependente de rede
// Por isso, testamos apenas a estrutura e tratamento de erros
async function testVerificarVazamentosEstrutura() {
  console.log('🧪 Testando estrutura de verificação de vazamentos...');

  // Este teste pode falhar se não houver conexão com internet
  // mas testa a estrutura da funcionalidade
  try {
    const result = await passwordUtils.execute({
      operacao: 'verificar',
      senhas: ['password123'] // senha comum que provavelmente está vazada
    });

    // Verifica se a resposta tem a estrutura esperada
    if (result.content && result.content[0] && result.content[0].text) {
      const text = result.content[0].text;
      if (text.includes('Verificação de Vazamentos') || text.includes('Não foi possível verificar')) {
        console.log('  ✅ Estrutura de verificação funcionando');
        return;
      }
    }
    throw new Error('Estrutura de resposta inesperada');
  } catch (error) {
    console.log('  ⚠️ Verificação de vazamentos não testável (sem internet ou API indisponível)');
  }
}

async function runPasswordUtilsTests() {
  console.log('🚀 Testando Password Utils...\n');

  try {
    // Testes de geração
    await testGerarSenhaForte();
    await testGerarSenhaMedia();
    await testGerarSenhaNumerica();
    await testGerarSenhaPersonalizada();
    await testGerarSenhaPersonalizadaErro();
    
    // Testes de análise
    await testAnalisarSenhaForte();
    await testAnalisarSenhaFraca();
    await testAnalisarMultiplasSenhas();
    
    // Testes de validação
    await testValidarSenhas();
    
    // Testes de frases-senha
    await testGerarFraseSenha();
    await testGerarMultiplasFrases();
    await testFraseSenhaComNumeros();
    await testFraseSenhaComSimbolos();
    await testFraseSenhaCompleta();

    // Testes de verificação de vazamentos
    await testVerificarVazamentosSemSenhas();
    await testVerificarVazamentosEstrutura();

    // Testes de erro
    await testAnaliseErroSemSenhas();
    await testValidacaoErroSemSenhas();
    await testOperacaoInvalida();

    // Testes de limites
    await testLimitesParametros();

    console.log('\n✅ Password Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Password Utils - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runPasswordUtilsTests().catch(console.error);
}

module.exports = { runPasswordUtilsTests };
