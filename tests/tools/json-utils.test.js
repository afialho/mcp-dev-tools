const jsonUtils = require('../../tools/json-utils');

async function runJsonUtilsTests() {
  console.log('🧪 Testando JSON Utils...');

  // Teste básico de formatação
  try {
    const args = {
      operacao: 'formatar',
      json_string: '{"nome":"João","idade":30}'
    };

    const resultado = await jsonUtils.execute(args);
    if (!resultado.content[0].text.includes('✅ **JSON Formatado**')) {
      throw new Error('Formatação básica falhou');
    }

    console.log('✅ Formatação básica funcionando');

    // Teste de validação
    const argsValidacao = {
      operacao: 'validar',
      json_string: '{"teste": true}'
    };

    const resultadoValidacao = await jsonUtils.execute(argsValidacao);
    if (!resultadoValidacao.content[0].text.includes('✅ **JSON Válido**')) {
      throw new Error('Validação falhou');
    }

    console.log('✅ Validação funcionando');

    // Teste de conversão
    const argsConversao = {
      operacao: 'converter',
      dados_entrada: { nome: 'Teste', valor: 123 }
    };

    const resultadoConversao = await jsonUtils.execute(argsConversao);
    if (!resultadoConversao.content[0].text.includes('✅ **Dados Convertidos para JSON**')) {
      throw new Error('Conversão falhou');
    }

    console.log('✅ Conversão funcionando');
    console.log('✅ JSON Utils: Todos os testes passaram!');

  } catch (error) {
    console.error('❌ JSON Utils: Teste falhou -', error.message);
    throw error;
  }
}

// Testes detalhados comentados para evitar conflitos com describe/test
// Os testes básicos estão na função runJsonUtilsTests acima

module.exports = { runJsonUtilsTests };
