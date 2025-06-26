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

    // Verificar resposta da ferramenta
    if (!resultado.content[0].text.includes('✅ **JSON Formatado**')) {
      throw new Error('Formatação básica falhou');
    }

    // Verificar auto-display markdown (deve ter 2 elementos no content)
    if (resultado.content.length !== 2) {
      throw new Error('Auto-display markdown não funcionou - esperado 2 elementos no content');
    }

    // Verificar se o segundo elemento é JSON puro em markdown
    if (!resultado.content[1].text.includes('```json') || !resultado.content[1].text.includes('"nome"')) {
      throw new Error('JSON em markdown não foi gerado corretamente');
    }

    console.log('✅ Formatação básica funcionando');
    console.log('✅ Auto-display markdown funcionando');

    // Teste de validação (não deve ter auto-display)
    const argsValidacao = {
      operacao: 'validar',
      json_string: '{"teste": true}'
    };

    const resultadoValidacao = await jsonUtils.execute(argsValidacao);
    if (!resultadoValidacao.content[0].text.includes('✅ **JSON Válido**')) {
      throw new Error('Validação falhou');
    }

    // Validação não deve ter auto-display (só 1 elemento no content)
    if (resultadoValidacao.content.length !== 1) {
      throw new Error('Validação não deveria ter auto-display markdown');
    }

    console.log('✅ Validação funcionando');

    // Teste de conversão (deve ter auto-display)
    const argsConversao = {
      operacao: 'converter',
      dados_entrada: { nome: 'Teste', valor: 123 }
    };

    const resultadoConversao = await jsonUtils.execute(argsConversao);
    if (!resultadoConversao.content[0].text.includes('✅ **Dados Convertidos para JSON**')) {
      throw new Error('Conversão falhou');
    }

    // Conversão deve ter auto-display (2 elementos no content)
    if (resultadoConversao.content.length !== 2) {
      throw new Error('Conversão deveria ter auto-display markdown');
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
