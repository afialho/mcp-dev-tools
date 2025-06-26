const dateUtils = require('../../tools/date-utils');
const { testTool } = require('../helpers/test-utils');

async function runDateUtilsTests() {
  console.log('🚀 Testando Date Utils...\n');

  // Teste 1: Gerar timestamp atual
  console.log('📅 Teste 1: Gerar timestamp atual');
  await testTool(dateUtils, {
    operacao: 'gerar',
    tipo: 'agora'
  }, ['Datas/Timestamps Gerados', 'agora', 'gerado(s) com sucesso']);

  // Teste 2: Gerar datas aleatórias
  console.log('📅 Teste 2: Gerar datas aleatórias');
  await testTool(dateUtils, {
    operacao: 'gerar',
    tipo: 'data_aleatoria',
    quantidade: 3,
    data_inicio: '2024-01-01',
    data_fim: '2024-12-31'
  }, ['Datas/Timestamps Gerados', 'data_aleatoria', '3 item(s) gerado(s)']);

  // Teste 3: Gerar sequência de datas
  console.log('📅 Teste 3: Gerar sequência de datas');
  await testTool(dateUtils, {
    operacao: 'gerar',
    tipo: 'sequencia_datas',
    quantidade: 5,
    data_inicio: '2024-01-01',
    intervalo_dias: 7
  }, ['Datas/Timestamps Gerados', 'sequencia_datas', '5 item(s) gerado(s)']);

  // Teste 4: Gerar apenas dias úteis
  console.log('📅 Teste 4: Gerar dias úteis');
  await testTool(dateUtils, {
    operacao: 'gerar',
    tipo: 'dias_uteis',
    quantidade: 5,
    data_inicio: '2024-01-01'
  }, ['Datas/Timestamps Gerados', 'dias_uteis', '5 item(s) gerado(s)']);

  // Teste 5: Validar formatos de data
  console.log('📅 Teste 5: Validar formatos de data');
  await testTool(dateUtils, {
    operacao: 'validar',
    datas: ['2024-01-15', '15/01/2024', '01/15/2024', '2024-13-01'],
    tipo_validacao: 'formato'
  }, ['Validação de Datas', 'formato', 'Resumo']);

  // Teste 6: Validar dias úteis
  console.log('📅 Teste 6: Validar dias úteis');
  await testTool(dateUtils, {
    operacao: 'validar',
    datas: ['2024-01-09', '2024-01-13', '2024-01-14'], // Terça, sábado, domingo
    tipo_validacao: 'dia_util'
  }, ['Validação de Datas', 'dia_util', 'Terça-feira']);

  // Teste 7: Validar intervalo de datas
  console.log('📅 Teste 7: Validar intervalo');
  await testTool(dateUtils, {
    operacao: 'validar',
    datas: ['2024-06-15', '2023-12-31', '2025-01-01'],
    tipo_validacao: 'intervalo',
    data_minima: '2024-01-01',
    data_maxima: '2024-12-31'
  }, ['Validação de Datas', 'intervalo', 'Dentro do intervalo']);

  // Teste 8: Converter formatos
  console.log('📅 Teste 8: Converter formatos');
  await testTool(dateUtils, {
    operacao: 'converter',
    datas: ['2024-01-15', '15/01/2024'],
    tipo_conversao: 'formato',
    formato_destino: 'brasileiro'
  }, ['Conversão de Datas', 'formato', 'processada(s)']);

  // Teste 9: Converter para timestamp
  console.log('📅 Teste 9: Converter para timestamp');
  await testTool(dateUtils, {
    operacao: 'converter',
    datas: ['2024-01-15'],
    tipo_conversao: 'timestamp'
  }, ['Conversão de Datas', 'timestamp', 'processada(s)']);

  // Teste 10: Converter para formato relativo
  console.log('📅 Teste 10: Converter para relativo');
  await testTool(dateUtils, {
    operacao: 'converter',
    datas: ['2024-01-13'], // Assumindo que hoje é próximo a esta data
    tipo_conversao: 'relativo'
  }, ['Conversão de Datas', 'relativo', 'processada(s)']);

  // Teste 11: Calcular diferença entre datas
  console.log('📅 Teste 11: Calcular diferença');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'diferenca',
    data_inicio: '2024-01-01',
    data_fim: '2024-12-31',
    unidade: 'dias'
  }, ['Cálculo de Datas', 'diferenca', 'dias']);

  // Teste 12: Calcular idade
  console.log('📅 Teste 12: Calcular idade');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'idade',
    data_nascimento: '1990-05-15'
  }, ['Cálculo de Datas', 'idade', 'anos']);

  // Teste 13: Adicionar dias
  console.log('📅 Teste 13: Adicionar dias');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'adicionar',
    datas: ['2024-01-15'],
    valor: 30,
    unidade: 'dias'
  }, ['Cálculo de Datas', 'adicionar', '2024-01-15']);

  // Teste 14: Subtrair meses
  console.log('📅 Teste 14: Subtrair meses');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'subtrair',
    datas: ['2024-06-15'],
    valor: 3,
    unidade: 'meses'
  }, ['Cálculo de Datas', 'subtrair', '2024-06-15']);

  // Teste 15: Próximo dia útil
  console.log('📅 Teste 15: Próximo dia útil');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'proximo_dia_util',
    datas: ['2024-01-13'] // Sábado
  }, ['Cálculo de Datas', 'proximo_dia_util', '2024-01-13']);

  // Teste 16: Formatar por extenso
  console.log('📅 Teste 16: Formatar por extenso');
  await testTool(dateUtils, {
    operacao: 'formatar',
    datas: ['2024-01-15'],
    formato: 'extenso',
    idioma: 'pt-BR'
  }, ['Formatação de Datas', 'extenso', 'Janeiro']);

  // Teste 17: Formatar customizado
  console.log('📅 Teste 17: Formatar customizado');
  await testTool(dateUtils, {
    operacao: 'formatar',
    datas: ['2024-01-15'],
    formato: 'customizado',
    formato_customizado: 'DD/MM/YYYY'
  }, ['Formatação de Datas', 'customizado', '15/01/2024']);

  // Teste 18: Formatar relativo
  console.log('📅 Teste 18: Formatar relativo');
  await testTool(dateUtils, {
    operacao: 'formatar',
    datas: ['2024-01-13'],
    formato: 'relativo'
  }, ['Formatação de Datas', 'relativo', 'formatada(s)']);

  // Teste 19: Análise completa
  console.log('📅 Teste 19: Análise completa');
  await testTool(dateUtils, {
    operacao: 'analisar',
    datas: ['2024-01-15'],
    tipo_analise: 'completa'
  }, ['Análise de Datas', 'completa', 'data original', 'dia semana']);

  // Teste 20: Análise estatística
  console.log('📅 Teste 20: Análise estatística');
  await testTool(dateUtils, {
    operacao: 'analisar',
    datas: ['2024-01-15', '2024-06-15', '2024-12-15'],
    tipo_analise: 'estatisticas'
  }, ['Análise de Datas', 'estatisticas', 'total datas', 'intervalo dias']);

  // Teste 21: Erro - operação inválida
  console.log('📅 Teste 21: Operação inválida');
  await testTool(dateUtils, {
    operacao: 'operacao_inexistente'
  }, ['Operação Inválida', 'gerar, validar, converter']);

  // Teste 22: Erro - dados insuficientes para cálculo
  console.log('📅 Teste 22: Dados insuficientes');
  await testTool(dateUtils, {
    operacao: 'calcular',
    tipo_calculo: 'diferenca'
    // Faltam data_inicio e data_fim
  }, ['Erro no Cálculo', 'data_inicio e data_fim']);

  // Teste 23: Erro - nenhuma data para validação
  console.log('📅 Teste 23: Nenhuma data para validação');
  await testTool(dateUtils, {
    operacao: 'validar',
    datas: []
  }, ['Erro de Validação', 'Nenhuma data fornecida']);

  // Teste 24: Timestamps com milissegundos
  console.log('📅 Teste 24: Timestamp com milissegundos');
  await testTool(dateUtils, {
    operacao: 'gerar',
    tipo: 'agora',
    incluir_milissegundos: true
  }, ['Datas/Timestamps Gerados', 'agora', 'gerado(s) com sucesso']);

  // Teste 25: Validar feriados
  console.log('📅 Teste 25: Validar feriados');
  await testTool(dateUtils, {
    operacao: 'validar',
    datas: ['2024-01-01', '2024-04-21', '2024-12-25'], // Confraternização, Tiradentes, Natal
    tipo_validacao: 'feriado'
  }, ['Validação de Datas', 'feriado', 'Confraternização']);

  console.log('✅ Date Utils - Todos os testes passaram!');
}

if (require.main === module) {
  runDateUtilsTests().catch(console.error);
}

module.exports = { runDateUtilsTests };
