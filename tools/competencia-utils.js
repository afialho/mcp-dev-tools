const competenciaUtilsTool = {
  name: 'competencia_utils',
  description: 'Utilitários especializados para competências MM/YYYY, MM/YY, YY-MM - Ideal para sistemas contábeis, fiscais e financeiros brasileiros',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'validar', 'converter', 'calcular', 'formatar', 'analisar'],
        description: 'Operação: gerar competências, validar formatos, converter entre formatos, calcular diferenças/períodos, formatar apresentação, analisar informações fiscais'
      },
      
      tipo: {
        type: 'string',
        enum: ['sequencia', 'ultimos_meses', 'proximos_meses', 'ano_completo', 'trimestre', 'semestre', 'exercicio_fiscal'],
        description: 'Tipo de geração de competências'
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 120,
        default: 12,
        description: 'Quantidade de competências para gerar (máximo 120 = 10 anos)'
      },
      competencia_inicio: {
        type: 'string',
        description: 'Competência de início para sequência (MM/YYYY, MM/YY, YY-MM)'
      },
      competencia_fim: {
        type: 'string',
        description: 'Competência de fim para sequência'
      },
      ano_referencia: {
        type: 'number',
        minimum: 1900,
        maximum: 2100,
        description: 'Ano de referência para geração'
      },
      incluir_atual: {
        type: 'boolean',
        default: true,
        description: 'Incluir competência atual na geração'
      },
      ordem: {
        type: 'string',
        enum: ['crescente', 'decrescente'],
        default: 'crescente',
        description: 'Ordem de geração das competências'
      },
      
      competencias: {
        type: 'array',
        items: { type: 'string' },
        maxItems: 120,
        description: 'Lista de competências para processar'
      },
      
      tipo_validacao: {
        type: 'string',
        enum: ['formato', 'intervalo', 'sequencia', 'exercicio'],
        default: 'formato',
        description: 'Tipo de validação a realizar'
      },
      formato_esperado: {
        type: 'string',
        enum: ['auto', 'mm_yyyy', 'mm_yy', 'yy_mm', 'yyyy_mm'],
        default: 'auto',
        description: 'Formato esperado para validação'
      },
      competencia_minima: {
        type: 'string',
        description: 'Competência mínima para validação de intervalo'
      },
      competencia_maxima: {
        type: 'string',
        description: 'Competência máxima para validação de intervalo'
      },
      
      tipo_conversao: {
        type: 'string',
        enum: ['formato', 'normalizar', 'data_inicio', 'data_fim', 'timestamp'],
        default: 'formato',
        description: 'Tipo de conversão a realizar'
      },
      formato_origem: {
        type: 'string',
        enum: ['auto', 'mm_yyyy', 'mm_yy', 'yy_mm', 'yyyy_mm'],
        default: 'auto',
        description: 'Formato de origem para conversão'
      },
      formato_destino: {
        type: 'string',
        enum: ['mm_yyyy', 'mm_yy', 'yy_mm', 'yyyy_mm'],
        default: 'mm_yyyy',
        description: 'Formato de destino para conversão'
      },
      separador_destino: {
        type: 'string',
        default: '/',
        description: 'Separador para formato de destino'
      },
      
      tipo_calculo: {
        type: 'string',
        enum: ['diferenca', 'adicionar', 'subtrair', 'dias_competencia', 'dias_uteis', 'trimestre', 'semestre', 'primeiro_dia', 'ultimo_dia'],
        description: 'Tipo de cálculo a realizar'
      },
      valor: {
        type: 'number',
        description: 'Valor para adicionar/subtrair meses'
      },
      incluir_fins_semana: {
        type: 'boolean',
        default: true,
        description: 'Incluir fins de semana nos cálculos de dias'
      },
      incluir_feriados: {
        type: 'boolean',
        default: false,
        description: 'Incluir feriados nos cálculos'
      },
      
      formato: {
        type: 'string',
        enum: ['extenso', 'abreviado', 'customizado', 'fiscal'],
        default: 'extenso',
        description: 'Formato de apresentação'
      },
      formato_customizado: {
        type: 'string',
        description: 'Padrão customizado (ex: MMMM/YYYY)'
      },
      idioma: {
        type: 'string',
        default: 'pt-BR',
        description: 'Idioma para formatação'
      },
      incluir_exercicio: {
        type: 'boolean',
        default: false,
        description: 'Incluir informação do exercício fiscal'
      },
      separador: {
        type: 'string',
        default: '/',
        description: 'Separador para formatação'
      },
      
      tipo_analise: {
        type: 'string',
        enum: ['completa', 'fiscal', 'estatisticas', 'vencimentos'],
        default: 'completa',
        description: 'Tipo de análise a realizar'
      },
      incluir_vencimentos: {
        type: 'boolean',
        default: true,
        description: 'Incluir calendário de vencimentos fiscais'
      },
      incluir_estatisticas: {
        type: 'boolean',
        default: false,
        description: 'Incluir estatísticas para múltiplas competências'
      },
      
      seculo_base: {
        type: 'number',
        default: 2000,
        description: 'Século base para interpretação de anos YY (2000 para 24=2024)'
      },
      limite_yy: {
        type: 'number',
        default: 50,
        description: 'Limite para interpretação de anos YY (00-50=20xx, 51-99=19xx)'
      }
    },
    required: ['operacao']
  },

  mesesPorExtenso: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],

  mesesAbreviados: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],

  vencimentosFiscais: {
    'icms': { dia: 10, descricao: 'ICMS - 10º dia útil' },
    'iss': { dia: 15, descricao: 'ISS - 15º dia útil' },
    'pis_cofins': { dia: 25, descricao: 'PIS/COFINS - 25º dia útil' },
    'irpj_csll': { dia: 30, descricao: 'IRPJ/CSLL - Último dia útil' },
    'simples': { dia: 20, descricao: 'Simples Nacional - 20º dia' }
  },

  detectarFormato(competencia) {
    const formatos = [
      { regex: /^(\d{2})\/(\d{4})$/, tipo: 'mm_yyyy' },
      { regex: /^(\d{1,2})\/(\d{4})$/, tipo: 'mm_yyyy' },
      { regex: /^(\d{2})\/(\d{2})$/, tipo: 'mm_yy' },
      { regex: /^(\d{1,2})\/(\d{2})$/, tipo: 'mm_yy' },
      { regex: /^(\d{2})-(\d{2})$/, tipo: 'yy_mm' },
      { regex: /^(\d{4})-(\d{2})$/, tipo: 'yyyy_mm' },
      { regex: /^(\d{2})-(\d{4})$/, tipo: 'mm_yyyy' },
      { regex: /^(\d{4})\/(\d{2})$/, tipo: 'yyyy_mm' }
    ];

    for (const formato of formatos) {
      const match = competencia.match(formato.regex);
      if (match) {
        return { tipo: formato.tipo, match: match };
      }
    }
    return { tipo: 'desconhecido', match: null };
  },

  normalizarCompetencia(competencia, opcoes = {}) {
    const { seculo_base = 2000, limite_yy = 50 } = opcoes;
    const deteccao = this.detectarFormato(competencia);
    
    if (deteccao.tipo === 'desconhecido') {
      return null;
    }

    const match = deteccao.match;
    let mes, ano;

    try {
      switch (deteccao.tipo) {
        case 'mm_yyyy':
          mes = parseInt(match[1]);
          ano = parseInt(match[2]);
          break;
        case 'mm_yy':
          mes = parseInt(match[1]);
          const yy = parseInt(match[2]);
          ano = this.interpretarAnoYY(yy, seculo_base, limite_yy);
          break;
        case 'yy_mm':
          const yyMm = parseInt(match[1]);
          mes = parseInt(match[2]);
          ano = this.interpretarAnoYY(yyMm, seculo_base, limite_yy);
          break;
        case 'yyyy_mm':
          ano = parseInt(match[1]);
          mes = parseInt(match[2]);
          break;
        default:
          return null;
      }

      if (mes < 1 || mes > 12) {
        return null;
      }

      if (ano < 1900 || ano > 2100) {
        return null;
      }

      return {
        mes: mes,
        ano: ano,
        formato_original: deteccao.tipo,
        competencia_normalizada: `${String(mes).padStart(2, '0')}/${ano}`
      };

    } catch (error) {
      return null;
    }
  },

  interpretarAnoYY(yy, seculo_base = 2000, limite = 50) {
    if (yy <= limite) {
      return seculo_base + yy;
    } else {
      return seculo_base - 100 + yy;
    }
  },

  executarGeracao(args) {
    const {
      tipo = 'ultimos_meses',
      quantidade = 12,
      competencia_inicio,
      competencia_fim,
      ano_referencia,
      incluir_atual = true,
      ordem = 'crescente',
      formato_destino = 'mm_yyyy',
      separador = '/'
    } = args;

    let resultados = [];
    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();

    try {
      switch (tipo) {
        case 'ultimos_meses':
          resultados = this.gerarUltimosMeses(quantidade, incluir_atual, mesAtual, anoAtual);
          break;

        case 'proximos_meses':
          resultados = this.gerarProximosMeses(quantidade, incluir_atual, mesAtual, anoAtual);
          break;

        case 'sequencia':
          if (!competencia_inicio || !competencia_fim) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro na Geração**\n\nPara gerar sequência, forneça competencia_inicio e competencia_fim.`
              }]
            };
          }
          resultados = this.gerarSequencia(competencia_inicio, competencia_fim);
          break;

        case 'ano_completo':
          const ano = ano_referencia || anoAtual;
          resultados = this.gerarAnoCompleto(ano);
          break;

        case 'trimestre':
          const trimestreAtual = Math.floor((mesAtual - 1) / 3) + 1;
          const anoTrimestre = ano_referencia || anoAtual;
          resultados = this.gerarTrimestre(trimestreAtual, anoTrimestre);
          break;

        case 'semestre':
          const semestreAtual = mesAtual <= 6 ? 1 : 2;
          const anoSemestre = ano_referencia || anoAtual;
          resultados = this.gerarSemestre(semestreAtual, anoSemestre);
          break;

        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Tipo de Geração Inválido**\n\nTipos disponíveis: ultimos_meses, proximos_meses, sequencia, ano_completo, trimestre, semestre`
            }]
          };
      }

      if (ordem === 'decrescente') {
        resultados.reverse();
      }

      const competenciasFormatadas = resultados.map(comp =>
        this.formatarCompetenciaSaida(comp, formato_destino, separador)
      );

      const titulo = `📊 **Competências Geradas (${tipo})**\n\n`;
      const lista = competenciasFormatadas.map((item, index) => `${index + 1}. \`${item}\``).join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${competenciasFormatadas.length} competência(s) gerada(s) com sucesso!**`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Geração**\n\n${error.message}`
        }]
      };
    }
  },

  executarValidacao(args) {
    const {
      competencias = [],
      tipo_validacao = 'formato',
      formato_esperado = 'auto',
      competencia_minima,
      competencia_maxima,
      seculo_base = 2000,
      limite_yy = 50
    } = args;

    if (competencias.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Validação**\n\nNenhuma competência fornecida para validação.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const competencia of competencias) {
        const resultado = this.validarCompetencia(competencia, tipo_validacao, {
          formato_esperado,
          competencia_minima,
          competencia_maxima,
          seculo_base,
          limite_yy
        });
        resultados.push(resultado);
      }

      const titulo = `✅ **Validação de Competências (${tipo_validacao})**\n\n`;
      const lista = resultados.map(r =>
        `${r.valida ? '✅' : '❌'} \`${r.competencia}\` - ${r.mensagem}`
      ).join('\n');

      const resumo = `\n\n📊 **Resumo:** ${resultados.filter(r => r.valida).length}/${resultados.length} válidas`;

      return {
        content: [{
          type: 'text',
          text: titulo + lista + resumo
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Validação**\n\n${error.message}`
        }]
      };
    }
  },

  gerarUltimosMeses(quantidade, incluirAtual, mesAtual, anoAtual) {
    const resultados = [];
    let mes = mesAtual;
    let ano = anoAtual;

    if (!incluirAtual) {
      mes--;
      if (mes < 1) {
        mes = 12;
        ano--;
      }
    }

    for (let i = 0; i < quantidade; i++) {
      resultados.unshift({ mes, ano });
      mes--;
      if (mes < 1) {
        mes = 12;
        ano--;
      }
    }

    return resultados;
  },

  gerarProximosMeses(quantidade, incluirAtual, mesAtual, anoAtual) {
    const resultados = [];
    let mes = mesAtual;
    let ano = anoAtual;

    if (!incluirAtual) {
      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    for (let i = 0; i < quantidade; i++) {
      resultados.push({ mes, ano });
      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    return resultados;
  },

  gerarSequencia(competenciaInicio, competenciaFim) {
    const inicio = this.normalizarCompetencia(competenciaInicio);
    const fim = this.normalizarCompetencia(competenciaFim);

    if (!inicio || !fim) {
      throw new Error('Competências de início ou fim inválidas');
    }

    const resultados = [];
    let mes = inicio.mes;
    let ano = inicio.ano;

    while (ano < fim.ano || (ano === fim.ano && mes <= fim.mes)) {
      resultados.push({ mes, ano });
      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    return resultados;
  },

  gerarAnoCompleto(ano) {
    const resultados = [];
    for (let mes = 1; mes <= 12; mes++) {
      resultados.push({ mes, ano });
    }
    return resultados;
  },

  gerarTrimestre(trimestre, ano) {
    const resultados = [];
    const mesInicio = (trimestre - 1) * 3 + 1;

    for (let i = 0; i < 3; i++) {
      resultados.push({ mes: mesInicio + i, ano });
    }

    return resultados;
  },

  gerarSemestre(semestre, ano) {
    const resultados = [];
    const mesInicio = semestre === 1 ? 1 : 7;

    for (let i = 0; i < 6; i++) {
      resultados.push({ mes: mesInicio + i, ano });
    }

    return resultados;
  },

  formatarCompetenciaSaida(competencia, formato, separador) {
    const { mes, ano } = competencia;
    const mesStr = String(mes).padStart(2, '0');

    switch (formato) {
      case 'mm_yyyy':
        return `${mesStr}${separador}${ano}`;
      case 'mm_yy':
        return `${mesStr}${separador}${String(ano).slice(-2)}`;
      case 'yy_mm':
        return `${String(ano).slice(-2)}${separador}${mesStr}`;
      case 'yyyy_mm':
        return `${ano}${separador}${mesStr}`;
      default:
        return `${mesStr}/${ano}`;
    }
  },

  validarCompetencia(competencia, tipo, opcoes = {}) {
    const { formato_esperado, competencia_minima, competencia_maxima, seculo_base, limite_yy } = opcoes;

    const resultado = {
      competencia: competencia,
      valida: false,
      mensagem: '',
      formato_detectado: null,
      interpretacao: null
    };

    const normalizada = this.normalizarCompetencia(competencia, { seculo_base, limite_yy });

    if (!normalizada) {
      resultado.mensagem = 'Formato não reconhecido ou inválido';
      return resultado;
    }

    resultado.formato_detectado = normalizada.formato_original;
    resultado.interpretacao = normalizada.competencia_normalizada;

    switch (tipo) {
      case 'formato':
        if (formato_esperado === 'auto' || normalizada.formato_original === formato_esperado) {
          resultado.valida = true;
          resultado.mensagem = `Válida (${normalizada.competencia_normalizada})`;
        } else {
          resultado.mensagem = `Formato ${normalizada.formato_original}, esperado ${formato_esperado}`;
        }
        break;

      case 'intervalo':
        const minima = competencia_minima ? this.normalizarCompetencia(competencia_minima) : null;
        const maxima = competencia_maxima ? this.normalizarCompetencia(competencia_maxima) : null;

        if (minima && this.compararCompetencias(normalizada, minima) < 0) {
          resultado.mensagem = `Anterior à competência mínima (${competencia_minima})`;
        } else if (maxima && this.compararCompetencias(normalizada, maxima) > 0) {
          resultado.mensagem = `Posterior à competência máxima (${competencia_maxima})`;
        } else {
          resultado.valida = true;
          resultado.mensagem = 'Dentro do intervalo válido';
        }
        break;

      default:
        resultado.valida = true;
        resultado.mensagem = 'Competência válida';
    }

    return resultado;
  },

  compararCompetencias(comp1, comp2) {
    if (comp1.ano !== comp2.ano) {
      return comp1.ano - comp2.ano;
    }
    return comp1.mes - comp2.mes;
  },

  executarConversao(args) {
    const {
      competencias = [],
      tipo_conversao = 'formato',
      formato_origem = 'auto',
      formato_destino = 'mm_yyyy',
      separador_destino = '/',
      seculo_base = 2000,
      limite_yy = 50
    } = args;

    if (competencias.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Conversão**\n\nNenhuma competência fornecida para conversão.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const competencia of competencias) {
        const normalizada = this.normalizarCompetencia(competencia, { seculo_base, limite_yy });
        if (!normalizada) {
          resultados.push(`❌ ${competencia} - Competência inválida`);
          continue;
        }

        let resultado;
        switch (tipo_conversao) {
          case 'formato':
            resultado = this.formatarCompetenciaSaida(normalizada, formato_destino, separador_destino);
            break;
          case 'data_inicio':
            resultado = `${normalizada.ano}-${String(normalizada.mes).padStart(2, '0')}-01`;
            break;
          case 'data_fim':
            const ultimoDia = new Date(normalizada.ano, normalizada.mes, 0).getDate();
            resultado = `${normalizada.ano}-${String(normalizada.mes).padStart(2, '0')}-${ultimoDia}`;
            break;
          case 'timestamp':
            const dataInicio = new Date(normalizada.ano, normalizada.mes - 1, 1);
            const dataFim = new Date(normalizada.ano, normalizada.mes, 0, 23, 59, 59, 999);
            resultado = {
              inicio: Math.floor(dataInicio.getTime() / 1000),
              fim: Math.floor(dataFim.getTime() / 1000)
            };
            break;
          default:
            resultado = this.formatarCompetenciaSaida(normalizada, formato_destino, separador_destino);
        }

        if (tipo_conversao === 'timestamp') {
          resultados.push(`✅ \`${competencia}\` → Início: \`${resultado.inicio}\`, Fim: \`${resultado.fim}\``);
        } else {
          resultados.push(`✅ \`${competencia}\` → \`${resultado}\``);
        }
      }

      const titulo = `🔄 **Conversão de Competências (${tipo_conversao})**\n\n`;
      const lista = resultados.join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${competencias.length} competência(s) processada(s)!**`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Conversão**\n\n${error.message}`
        }]
      };
    }
  },

  executarCalculo(args) {
    const {
      tipo_calculo,
      competencias = [],
      competencia_inicio,
      competencia_fim,
      valor,
      seculo_base = 2000,
      limite_yy = 50
    } = args;

    try {
      let resultado;

      switch (tipo_calculo) {
        case 'diferenca':
          if (!competencia_inicio || !competencia_fim) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nPara calcular diferença, forneça competencia_inicio e competencia_fim.`
              }]
            };
          }
          resultado = this.calcularDiferenca(competencia_inicio, competencia_fim, { seculo_base, limite_yy });
          break;

        case 'adicionar':
        case 'subtrair':
          if (competencias.length === 0 || valor === undefined) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nPara ${tipo_calculo}, forneça competencias e valor.`
              }]
            };
          }
          resultado = this.calcularAdicaoSubtracao(competencias, valor, tipo_calculo === 'subtrair', { seculo_base, limite_yy });
          break;

        case 'trimestre':
          if (competencias.length === 0) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nForneça pelo menos uma competência.`
              }]
            };
          }
          resultado = this.calcularTrimestre(competencias, { seculo_base, limite_yy });
          break;

        case 'dias_competencia':
          if (competencias.length === 0) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nForneça pelo menos uma competência.`
              }]
            };
          }
          resultado = this.calcularDiasCompetencia(competencias, { seculo_base, limite_yy });
          break;

        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Tipo de Cálculo Inválido**\n\nTipos disponíveis: diferenca, adicionar, subtrair, trimestre, dias_competencia`
            }]
          };
      }

      const titulo = `🧮 **Cálculo de Competências (${tipo_calculo})**\n\n`;

      return {
        content: [{
          type: 'text',
          text: titulo + resultado + `\n\n✅ **Cálculo realizado com sucesso!**`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro no Cálculo**\n\n${error.message}`
        }]
      };
    }
  },

  calcularDiferenca(competenciaInicio, competenciaFim, opcoes) {
    const inicio = this.normalizarCompetencia(competenciaInicio, opcoes);
    const fim = this.normalizarCompetencia(competenciaFim, opcoes);

    if (!inicio || !fim) {
      throw new Error('Competências inválidas para cálculo de diferença');
    }

    const mesesDiferenca = (fim.ano - inicio.ano) * 12 + (fim.mes - inicio.mes);

    return `**Diferença:** ${mesesDiferenca} meses\n**De:** ${inicio.competencia_normalizada}\n**Até:** ${fim.competencia_normalizada}`;
  },

  calcularAdicaoSubtracao(competencias, valor, subtrair, opcoes) {
    const resultados = [];
    const multiplicador = subtrair ? -1 : 1;

    for (const competencia of competencias) {
      const normalizada = this.normalizarCompetencia(competencia, opcoes);
      if (!normalizada) {
        resultados.push(`❌ ${competencia} - Competência inválida`);
        continue;
      }

      let novoMes = normalizada.mes + (valor * multiplicador);
      let novoAno = normalizada.ano;

      while (novoMes > 12) {
        novoMes -= 12;
        novoAno++;
      }
      while (novoMes < 1) {
        novoMes += 12;
        novoAno--;
      }

      const novaCompetencia = this.formatarCompetenciaSaida({ mes: novoMes, ano: novoAno }, 'mm_yyyy', '/');
      resultados.push(`✅ \`${competencia}\` → \`${novaCompetencia}\``);
    }

    return resultados.join('\n');
  },

  calcularTrimestre(competencias, opcoes) {
    const resultados = [];

    for (const competencia of competencias) {
      const normalizada = this.normalizarCompetencia(competencia, opcoes);
      if (!normalizada) {
        resultados.push(`❌ ${competencia} - Competência inválida`);
        continue;
      }

      const trimestre = Math.floor((normalizada.mes - 1) / 3) + 1;
      resultados.push(`✅ \`${competencia}\` → **Q${trimestre} ${normalizada.ano}**`);
    }

    return resultados.join('\n');
  },

  calcularDiasCompetencia(competencias, opcoes) {
    const resultados = [];

    for (const competencia of competencias) {
      const normalizada = this.normalizarCompetencia(competencia, opcoes);
      if (!normalizada) {
        resultados.push(`❌ ${competencia} - Competência inválida`);
        continue;
      }

      const diasNoMes = new Date(normalizada.ano, normalizada.mes, 0).getDate();
      resultados.push(`✅ \`${competencia}\` → **${diasNoMes} dias**`);
    }

    return resultados.join('\n');
  },

  executarFormatacao(args) {
    const {
      competencias = [],
      formato = 'extenso',
      formato_customizado,
      idioma = 'pt-BR',
      incluir_exercicio = false,
      separador = '/',
      seculo_base = 2000,
      limite_yy = 50
    } = args;

    if (competencias.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Formatação**\n\nNenhuma competência fornecida para formatação.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const competencia of competencias) {
        const normalizada = this.normalizarCompetencia(competencia, { seculo_base, limite_yy });
        if (!normalizada) {
          resultados.push(`❌ ${competencia} - Competência inválida`);
          continue;
        }

        let formatado;
        switch (formato) {
          case 'extenso':
            formatado = this.formatarExtenso(normalizada, incluir_exercicio);
            break;
          case 'abreviado':
            formatado = this.formatarAbreviado(normalizada, separador);
            break;
          case 'customizado':
            formatado = this.formatarCustomizado(normalizada, formato_customizado);
            break;
          case 'fiscal':
            formatado = this.formatarFiscal(normalizada);
            break;
          default:
            formatado = this.formatarExtenso(normalizada, incluir_exercicio);
        }

        resultados.push(`✅ \`${competencia}\` → **${formatado}**`);
      }

      const titulo = `🎨 **Formatação de Competências (${formato})**\n\n`;
      const lista = resultados.join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${competencias.length} competência(s) formatada(s)!**`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Formatação**\n\n${error.message}`
        }]
      };
    }
  },

  formatarExtenso(competencia, incluirExercicio) {
    const mesNome = this.mesesPorExtenso[competencia.mes - 1];
    let resultado = `${mesNome} de ${competencia.ano}`;

    if (incluirExercicio) {
      resultado += ` (Exercício ${competencia.ano})`;
    }

    return resultado;
  },

  formatarAbreviado(competencia, separador) {
    const mesAbrev = this.mesesAbreviados[competencia.mes - 1];
    return `${mesAbrev}${separador}${competencia.ano}`;
  },

  formatarCustomizado(competencia, padrao) {
    if (!padrao) return this.formatarExtenso(competencia, false);

    const mesNome = this.mesesPorExtenso[competencia.mes - 1];
    const mesAbrev = this.mesesAbreviados[competencia.mes - 1];
    const mesNum = String(competencia.mes).padStart(2, '0');

    return padrao
      .replace('MMMM', mesNome)
      .replace('MMM', mesAbrev)
      .replace('MM', mesNum)
      .replace('YYYY', competencia.ano)
      .replace('YY', String(competencia.ano).slice(-2));
  },

  formatarFiscal(competencia) {
    const trimestre = Math.floor((competencia.mes - 1) / 3) + 1;
    const semestre = competencia.mes <= 6 ? 'S1' : 'S2';
    return `${String(competencia.mes).padStart(2, '0')}/${competencia.ano} (Q${trimestre}/${competencia.ano} - ${semestre}/${competencia.ano} - Exercício ${competencia.ano})`;
  },

  executarAnalise(args) {
    const {
      competencias = [],
      tipo_analise = 'completa',
      incluir_vencimentos = true,
      incluir_estatisticas = false,
      seculo_base = 2000,
      limite_yy = 50
    } = args;

    if (competencias.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Análise**\n\nNenhuma competência fornecida para análise.`
        }]
      };
    }

    try {
      let resultado;

      switch (tipo_analise) {
        case 'completa':
          resultado = this.analisarCompleta(competencias[0], incluir_vencimentos, { seculo_base, limite_yy });
          break;
        case 'fiscal':
          resultado = this.analisarFiscal(competencias[0], { seculo_base, limite_yy });
          break;
        case 'estatisticas':
          resultado = this.analisarEstatisticas(competencias, { seculo_base, limite_yy });
          break;
        case 'vencimentos':
          resultado = this.analisarVencimentos(competencias[0], { seculo_base, limite_yy });
          break;
        default:
          resultado = this.analisarCompleta(competencias[0], incluir_vencimentos, { seculo_base, limite_yy });
      }

      const titulo = `📊 **Análise de Competências (${tipo_analise})**\n\n`;

      return {
        content: [{
          type: 'text',
          text: titulo + resultado + `\n\n✅ **Análise concluída!**`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Análise**\n\n${error.message}`
        }]
      };
    }
  },

  analisarCompleta(competencia, incluirVencimentos, opcoes) {
    const normalizada = this.normalizarCompetencia(competencia, opcoes);
    if (!normalizada) {
      throw new Error('Competência inválida para análise');
    }

    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();

    let status;
    if (normalizada.ano < anoAtual || (normalizada.ano === anoAtual && normalizada.mes < mesAtual)) {
      status = 'competencia_passada';
    } else if (normalizada.ano === anoAtual && normalizada.mes === mesAtual) {
      status = 'competencia_atual';
    } else {
      status = 'competencia_futura';
    }

    const trimestre = Math.floor((normalizada.mes - 1) / 3) + 1;
    const semestre = normalizada.mes <= 6 ? 'S1' : 'S2';
    const diasNoMes = new Date(normalizada.ano, normalizada.mes, 0).getDate();

    const info = {
      competencia_original: competencia,
      competencia_normalizada: normalizada.competencia_normalizada,
      formato_extenso: this.formatarExtenso(normalizada, false),
      primeiro_dia: `${normalizada.ano}-${String(normalizada.mes).padStart(2, '0')}-01`,
      ultimo_dia: `${normalizada.ano}-${String(normalizada.mes).padStart(2, '0')}-${diasNoMes}`,
      dias_no_mes: diasNoMes,
      trimestre: `Q${trimestre} ${normalizada.ano}`,
      semestre: `${semestre} ${normalizada.ano}`,
      exercicio_fiscal: normalizada.ano,
      status: status
    };

    let resultado = Object.entries(info)
      .map(([chave, valor]) => `**${chave.replace(/_/g, ' ')}:** ${valor}`)
      .join('\n');

    if (incluirVencimentos) {
      resultado += '\n\n**Vencimentos Fiscais:**\n';
      resultado += this.calcularVencimentos(normalizada);
    }

    return resultado;
  },

  analisarEstatisticas(competencias, opcoes) {
    const competenciasValidas = competencias
      .map(c => this.normalizarCompetencia(c, opcoes))
      .filter(c => c !== null);

    if (competenciasValidas.length === 0) {
      throw new Error('Nenhuma competência válida para análise estatística');
    }

    competenciasValidas.sort((a, b) => this.compararCompetencias(a, b));

    const primeira = competenciasValidas[0];
    const ultima = competenciasValidas[competenciasValidas.length - 1];
    const mesesDiferenca = (ultima.ano - primeira.ano) * 12 + (ultima.mes - primeira.mes);

    const stats = {
      total_competencias: competenciasValidas.length,
      competencia_inicial: primeira.competencia_normalizada,
      competencia_final: ultima.competencia_normalizada,
      periodo_meses: mesesDiferenca + 1,
      anos_abrangidos: ultima.ano - primeira.ano + 1
    };

    return Object.entries(stats)
      .map(([chave, valor]) => `**${chave.replace(/_/g, ' ')}:** ${valor}`)
      .join('\n');
  },

  calcularVencimentos(competencia) {
    const proximoMes = competencia.mes === 12 ? 1 : competencia.mes + 1;
    const proximoAno = competencia.mes === 12 ? competencia.ano + 1 : competencia.ano;

    const vencimentos = [];
    for (const [tipo, info] of Object.entries(this.vencimentosFiscais)) {
      const dataVencimento = `${proximoAno}-${String(proximoMes).padStart(2, '0')}-${String(info.dia).padStart(2, '0')}`;
      vencimentos.push(`• **${info.descricao}:** ${dataVencimento}`);
    }

    return vencimentos.join('\n');
  },

  async execute(args) {
    try {
      const { operacao } = args;

      switch (operacao) {
        case 'gerar':
          return this.executarGeracao(args);
        case 'validar':
          return this.executarValidacao(args);
        case 'converter':
          return this.executarConversao(args);
        case 'calcular':
          return this.executarCalculo(args);
        case 'formatar':
          return this.executarFormatacao(args);
        case 'analisar':
          return this.executarAnalise(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: gerar, validar, converter, calcular, formatar, analisar`
            }]
          };
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro Interno**\n\n${error.message}`
        }]
      };
    }
  }
};

module.exports = competenciaUtilsTool;
