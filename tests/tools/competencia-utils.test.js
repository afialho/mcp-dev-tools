const competenciaUtils = require('../../tools/competencia-utils');
const { testTool } = require('../helpers/test-utils');

async function runCompetenciaUtilsTests() {
  console.log('🚀 Testando Competencia Utils...\n');

  // Teste 1: Gerar últimos 6 meses
  console.log('📊 Teste 1: Gerar últimos 6 meses');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'ultimos_meses',
    quantidade: 6
  }, ['Competências Geradas', 'ultimos_meses', '6 competência(s) gerada(s)']);

  // Teste 2: Gerar próximos 3 meses
  console.log('📊 Teste 2: Gerar próximos 3 meses');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'proximos_meses',
    quantidade: 3,
    incluir_atual: false
  }, ['Competências Geradas', 'proximos_meses', '3 competência(s) gerada(s)']);

  // Teste 3: Gerar sequência entre competências
  console.log('📊 Teste 3: Gerar sequência');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'sequencia',
    competencia_inicio: '01/2024',
    competencia_fim: '06/2024'
  }, ['Competências Geradas', 'sequencia', '6 competência(s) gerada(s)']);

  // Teste 4: Gerar ano completo
  console.log('📊 Teste 4: Gerar ano completo');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'ano_completo',
    ano_referencia: 2024
  }, ['Competências Geradas', 'ano_completo', '12 competência(s) gerada(s)']);

  // Teste 5: Gerar trimestre
  console.log('📊 Teste 5: Gerar trimestre');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'trimestre',
    ano_referencia: 2024
  }, ['Competências Geradas', 'trimestre', '3 competência(s) gerada(s)']);

  // Teste 6: Gerar em formato MM/YY
  console.log('📊 Teste 6: Gerar em formato MM/YY');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'ultimos_meses',
    quantidade: 3,
    formato_destino: 'mm_yy'
  }, ['Competências Geradas', 'ultimos_meses', '3 competência(s) gerada(s)']);

  // Teste 7: Validar formatos mistos
  console.log('📊 Teste 7: Validar formatos mistos');
  await testTool(competenciaUtils, {
    operacao: 'validar',
    competencias: ['01/2024', '02/24', '24-03', '2024-04', '13/24', '00/23'],
    tipo_validacao: 'formato'
  }, ['Validação de Competências', 'formato', 'Resumo']);

  // Teste 8: Validar intervalo
  console.log('📊 Teste 8: Validar intervalo');
  await testTool(competenciaUtils, {
    operacao: 'validar',
    competencias: ['06/2024', '12/2023', '01/2025'],
    tipo_validacao: 'intervalo',
    competencia_minima: '01/2024',
    competencia_maxima: '12/2024'
  }, ['Validação de Competências', 'intervalo', 'Dentro do intervalo']);

  // Teste 9: Converter entre formatos
  console.log('📊 Teste 9: Converter formatos');
  await testTool(competenciaUtils, {
    operacao: 'converter',
    competencias: ['01/24', '24-02', '2024-03'],
    tipo_conversao: 'formato',
    formato_destino: 'mm_yyyy'
  }, ['Conversão de Competências', 'formato', 'processada(s)']);

  // Teste 10: Converter para primeiro dia
  console.log('📊 Teste 10: Converter para primeiro dia');
  await testTool(competenciaUtils, {
    operacao: 'converter',
    competencias: ['03/2024'],
    tipo_conversao: 'data_inicio'
  }, ['Conversão de Competências', 'data_inicio', '2024-03-01']);

  // Teste 11: Converter para último dia
  console.log('📊 Teste 11: Converter para último dia');
  await testTool(competenciaUtils, {
    operacao: 'converter',
    competencias: ['02/2024'],
    tipo_conversao: 'data_fim'
  }, ['Conversão de Competências', 'data_fim', '2024-02-29']);

  // Teste 12: Converter para timestamps
  console.log('📊 Teste 12: Converter para timestamps');
  await testTool(competenciaUtils, {
    operacao: 'converter',
    competencias: ['01/2024'],
    tipo_conversao: 'timestamp'
  }, ['Conversão de Competências', 'timestamp', 'Início', 'Fim']);

  // Teste 13: Calcular diferença entre competências
  console.log('📊 Teste 13: Calcular diferença');
  await testTool(competenciaUtils, {
    operacao: 'calcular',
    tipo_calculo: 'diferenca',
    competencia_inicio: '01/2024',
    competencia_fim: '06/2024'
  }, ['Cálculo de Competências', 'diferenca', 'meses']);

  // Teste 14: Adicionar meses
  console.log('📊 Teste 14: Adicionar meses');
  await testTool(competenciaUtils, {
    operacao: 'calcular',
    tipo_calculo: 'adicionar',
    competencias: ['03/2024'],
    valor: 6
  }, ['Cálculo de Competências', 'adicionar', '03/2024']);

  // Teste 15: Subtrair meses
  console.log('📊 Teste 15: Subtrair meses');
  await testTool(competenciaUtils, {
    operacao: 'calcular',
    tipo_calculo: 'subtrair',
    competencias: ['06/2024'],
    valor: 3
  }, ['Cálculo de Competências', 'subtrair', '06/2024']);

  // Teste 16: Calcular trimestre
  console.log('📊 Teste 16: Calcular trimestre');
  await testTool(competenciaUtils, {
    operacao: 'calcular',
    tipo_calculo: 'trimestre',
    competencias: ['05/2024', '08/2024', '11/2024']
  }, ['Cálculo de Competências', 'trimestre', 'Q2', 'Q3', 'Q4']);

  // Teste 17: Calcular dias na competência
  console.log('📊 Teste 17: Calcular dias na competência');
  await testTool(competenciaUtils, {
    operacao: 'calcular',
    tipo_calculo: 'dias_competencia',
    competencias: ['02/2024', '04/2024']
  }, ['Cálculo de Competências', 'dias_competencia', '29 dias', '30 dias']);

  // Teste 18: Formatar por extenso
  console.log('📊 Teste 18: Formatar por extenso');
  await testTool(competenciaUtils, {
    operacao: 'formatar',
    competencias: ['01/2024', '12/2023'],
    formato: 'extenso'
  }, ['Formatação de Competências', 'extenso', 'Janeiro de 2024', 'Dezembro']);

  // Teste 19: Formatar abreviado
  console.log('📊 Teste 19: Formatar abreviado');
  await testTool(competenciaUtils, {
    operacao: 'formatar',
    competencias: ['06/2024'],
    formato: 'abreviado'
  }, ['Formatação de Competências', 'abreviado', 'Jun']);

  // Teste 20: Formatar customizado
  console.log('📊 Teste 20: Formatar customizado');
  await testTool(competenciaUtils, {
    operacao: 'formatar',
    competencias: ['03/2024'],
    formato: 'customizado',
    formato_customizado: 'MMMM/YY'
  }, ['Formatação de Competências', 'customizado', 'Março/24']);

  // Teste 21: Formatar fiscal
  console.log('📊 Teste 21: Formatar fiscal');
  await testTool(competenciaUtils, {
    operacao: 'formatar',
    competencias: ['04/2024'],
    formato: 'fiscal'
  }, ['Formatação de Competências', 'fiscal', 'Q2/2024', 'Exercício']);

  // Teste 22: Análise completa
  console.log('📊 Teste 22: Análise completa');
  await testTool(competenciaUtils, {
    operacao: 'analisar',
    competencias: ['03/2024'],
    tipo_analise: 'completa',
    incluir_vencimentos: true
  }, ['Análise de Competências', 'completa', 'competencia original', 'Vencimentos Fiscais']);

  // Teste 23: Análise estatística
  console.log('📊 Teste 23: Análise estatística');
  await testTool(competenciaUtils, {
    operacao: 'analisar',
    competencias: ['01/2024', '06/2024', '12/2024'],
    tipo_analise: 'estatisticas'
  }, ['Análise de Competências', 'estatisticas', 'total competencias', 'periodo meses']);

  // Teste 24: Erro - operação inválida
  console.log('📊 Teste 24: Operação inválida');
  await testTool(competenciaUtils, {
    operacao: 'operacao_inexistente'
  }, ['Operação Inválida', 'gerar, validar, converter']);

  // Teste 25: Erro - dados insuficientes para sequência
  console.log('📊 Teste 25: Dados insuficientes para sequência');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'sequencia'
    // Faltam competencia_inicio e competencia_fim
  }, ['Erro na Geração', 'competencia_inicio e competencia_fim']);

  // Teste 26: Erro - nenhuma competência para validação
  console.log('📊 Teste 26: Nenhuma competência para validação');
  await testTool(competenciaUtils, {
    operacao: 'validar',
    competencias: []
  }, ['Erro de Validação', 'Nenhuma competência fornecida']);

  // Teste 27: Competências com anos YY
  console.log('📊 Teste 27: Competências com anos YY');
  await testTool(competenciaUtils, {
    operacao: 'validar',
    competencias: ['01/99', '12/00', '06/24', '13/25'],
    seculo_base: 2000,
    limite_yy: 50
  }, ['Validação de Competências', 'formato', 'Resumo']);

  // Teste 28: Formato YY-MM
  console.log('📊 Teste 28: Formato YY-MM');
  await testTool(competenciaUtils, {
    operacao: 'converter',
    competencias: ['24-01', '24-12'],
    formato_destino: 'mm_yyyy'
  }, ['Conversão de Competências', 'formato', '01/2024', '12/2024']);

  // Teste 29: Gerar com ordem decrescente
  console.log('📊 Teste 29: Gerar ordem decrescente');
  await testTool(competenciaUtils, {
    operacao: 'gerar',
    tipo: 'ultimos_meses',
    quantidade: 3,
    ordem: 'decrescente'
  }, ['Competências Geradas', 'ultimos_meses', '3 competência(s) gerada(s)']);

  // Teste 30: Análise com vencimentos específicos
  console.log('📊 Teste 30: Análise com vencimentos');
  await testTool(competenciaUtils, {
    operacao: 'analisar',
    competencias: ['12/2023'],
    tipo_analise: 'completa',
    incluir_vencimentos: true
  }, ['Análise de Competências', 'completa', 'ICMS', 'ISS', 'PIS/COFINS']);

  console.log('✅ Competencia Utils - Todos os testes passaram!');
}

if (require.main === module) {
  runCompetenciaUtilsTests().catch(console.error);
}

module.exports = { runCompetenciaUtilsTests };
