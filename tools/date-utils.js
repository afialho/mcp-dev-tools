const dateUtilsTool = {
  name: 'date_utils',
  description: 'Utilitários completos para datas, horários e timestamps - Geração, validação, conversão, cálculos, formatação e análise',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'validar', 'converter', 'calcular', 'formatar', 'analisar'],
        description: 'Operação: gerar datas/timestamps, validar formatos, converter entre formatos/fusos, calcular diferenças/idades, formatar apresentação, analisar informações'
      },
      
      tipo: {
        type: 'string',
        enum: ['agora', 'timestamp', 'data_aleatoria', 'hora_aleatoria', 'sequencia_datas', 'sequencia_horarios', 'dias_uteis', 'fins_semana'],
        description: 'Tipo de geração (apenas para operação gerar)'
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 1,
        description: 'Quantidade de datas/horários para gerar'
      },
      data_inicio: {
        type: 'string',
        description: 'Data de início para geração aleatória ou sequência (YYYY-MM-DD)'
      },
      data_fim: {
        type: 'string',
        description: 'Data de fim para geração aleatória ou sequência (YYYY-MM-DD)'
      },
      horario_inicio: {
        type: 'string',
        default: '00:00',
        description: 'Horário de início (HH:mm)'
      },
      horario_fim: {
        type: 'string',
        default: '23:59',
        description: 'Horário de fim (HH:mm)'
      },
      incluir_milissegundos: {
        type: 'boolean',
        default: false,
        description: 'Incluir milissegundos no timestamp'
      },
      apenas_dias_uteis: {
        type: 'boolean',
        default: false,
        description: 'Gerar apenas dias úteis (segunda a sexta)'
      },
      intervalo_dias: {
        type: 'number',
        default: 1,
        description: 'Intervalo em dias para sequências'
      },
      intervalo_horas: {
        type: 'number',
        default: 1,
        description: 'Intervalo em horas para sequências de horário'
      },
      
      datas: {
        type: 'array',
        items: { type: 'string' },
        maxItems: 100,
        description: 'Lista de datas para validar/converter/formatar/analisar'
      },
      
      tipo_validacao: {
        type: 'string',
        enum: ['formato', 'intervalo', 'dia_util', 'feriado', 'bissexto', 'futuro', 'passado'],
        default: 'formato',
        description: 'Tipo de validação a realizar'
      },
      formato_esperado: {
        type: 'string',
        enum: ['auto', 'iso', 'brasileiro', 'americano'],
        default: 'auto',
        description: 'Formato esperado para validação'
      },
      data_minima: {
        type: 'string',
        description: 'Data mínima para validação de intervalo (YYYY-MM-DD)'
      },
      data_maxima: {
        type: 'string',
        description: 'Data máxima para validação de intervalo (YYYY-MM-DD)'
      },
      
      tipo_conversao: {
        type: 'string',
        enum: ['formato', 'fuso_horario', 'timestamp', 'relativo'],
        default: 'formato',
        description: 'Tipo de conversão a realizar'
      },
      formato_origem: {
        type: 'string',
        enum: ['auto', 'iso', 'brasileiro', 'americano', 'timestamp'],
        default: 'auto',
        description: 'Formato de origem para conversão'
      },
      formato_destino: {
        type: 'string',
        enum: ['iso', 'brasileiro', 'americano', 'timestamp'],
        default: 'iso',
        description: 'Formato de destino para conversão'
      },
      fuso_origem: {
        type: 'string',
        default: 'UTC',
        description: 'Fuso horário de origem (ex: UTC, America/Sao_Paulo)'
      },
      fuso_destino: {
        type: 'string',
        default: 'America/Sao_Paulo',
        description: 'Fuso horário de destino'
      },
      
      tipo_calculo: {
        type: 'string',
        enum: ['diferenca', 'adicionar', 'subtrair', 'idade', 'dias_uteis', 'proximo_dia_util', 'fim_mes'],
        description: 'Tipo de cálculo a realizar'
      },
      data_nascimento: {
        type: 'string',
        description: 'Data de nascimento para cálculo de idade (YYYY-MM-DD)'
      },
      unidade: {
        type: 'string',
        enum: ['dias', 'semanas', 'meses', 'anos', 'horas', 'minutos'],
        default: 'dias',
        description: 'Unidade para cálculos de diferença/adição/subtração'
      },
      valor: {
        type: 'number',
        description: 'Valor para adicionar/subtrair'
      },
      incluir_fins_semana: {
        type: 'boolean',
        default: true,
        description: 'Incluir fins de semana nos cálculos'
      },
      incluir_feriados: {
        type: 'boolean',
        default: false,
        description: 'Incluir feriados nos cálculos'
      },
      
      formato: {
        type: 'string',
        enum: ['iso', 'brasileiro', 'americano', 'extenso', 'customizado', 'relativo'],
        default: 'iso',
        description: 'Formato de apresentação'
      },
      formato_customizado: {
        type: 'string',
        description: 'Padrão customizado (ex: DD/MM/YYYY HH:mm:ss)'
      },
      incluir_hora: {
        type: 'boolean',
        default: false,
        description: 'Incluir horário na formatação'
      },
      incluir_segundos: {
        type: 'boolean',
        default: false,
        description: 'Incluir segundos na formatação'
      },
      idioma: {
        type: 'string',
        default: 'pt-BR',
        description: 'Idioma para formatação (pt-BR, en-US)'
      },
      
      tipo_analise: {
        type: 'string',
        enum: ['completa', 'calendario', 'estatisticas', 'padroes'],
        default: 'completa',
        description: 'Tipo de análise a realizar'
      },
      incluir_astronomia: {
        type: 'boolean',
        default: false,
        description: 'Incluir informações astronômicas (fases da lua, estações)'
      },
      
      formato_saida: {
        type: 'string',
        enum: ['iso', 'brasileiro', 'americano', 'timestamp'],
        default: 'iso',
        description: 'Formato de saída para resultados'
      },
      fuso_horario: {
        type: 'string',
        default: 'America/Sao_Paulo',
        description: 'Fuso horário para operações'
      }
    },
    required: ['operacao']
  },

  feriadosFixos: {
    '01-01': 'Confraternização Universal',
    '04-21': 'Tiradentes',
    '05-01': 'Dia do Trabalhador',
    '09-07': 'Independência do Brasil',
    '10-12': 'Nossa Senhora Aparecida',
    '11-02': 'Finados',
    '11-15': 'Proclamação da República',
    '12-25': 'Natal'
  },

  detectarFormato(data) {
    const formatos = [
      { regex: /^\d{4}-\d{2}-\d{2}$/, tipo: 'iso' },
      { regex: /^\d{2}\/\d{2}\/\d{4}$/, tipo: 'brasileiro' },
      { regex: /^\d{2}\/\d{2}\/\d{4}$/, tipo: 'americano' },
      { regex: /^\d{10}$/, tipo: 'timestamp' },
      { regex: /^\d{13}$/, tipo: 'timestamp_ms' }
    ];

    for (const formato of formatos) {
      if (formato.regex.test(data)) {
        return formato.tipo;
      }
    }
    return 'desconhecido';
  },

  normalizarData(data, formato = 'auto') {
    if (formato === 'auto') {
      formato = this.detectarFormato(data);
    }

    try {
      switch (formato) {
        case 'iso':
          if (data.includes('T')) {
            return new Date(data);
          } else {
            const [ano, mes, dia] = data.split('-');
            return new Date(ano, mes - 1, dia);
          }
        case 'brasileiro':
          const [dia, mes, ano] = data.split('/');
          return new Date(ano, mes - 1, dia);
        case 'americano':
          const [mesAm, diaAm, anoAm] = data.split('/');
          return new Date(anoAm, mesAm - 1, diaAm);
        case 'timestamp':
          return new Date(parseInt(data) * 1000);
        case 'timestamp_ms':
          return new Date(parseInt(data));
        default:
          return new Date(data);
      }
    } catch (error) {
      return null;
    }
  },

  isDiaUtil(data) {
    const date = typeof data === 'string' ? this.normalizarData(data) : data;
    if (!date) return false;
    
    const diaSemana = date.getDay();
    return diaSemana >= 1 && diaSemana <= 5;
  },

  isFeriado(data) {
    const date = typeof data === 'string' ? this.normalizarData(data) : data;
    if (!date) return false;
    
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    const chave = `${mes}-${dia}`;
    
    return this.feriadosFixos.hasOwnProperty(chave);
  },

  calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = Math.floor((h + l - 7 * m + 114) / 31);
    const p = (h + l - 7 * m + 114) % 31;
    
    return new Date(ano, n - 1, p + 1);
  },

  executarGeracao(args) {
    const {
      tipo = 'agora',
      quantidade = 1,
      data_inicio,
      data_fim,
      horario_inicio = '00:00',
      horario_fim = '23:59',
      incluir_milissegundos = false,
      apenas_dias_uteis = false,
      intervalo_dias = 1,
      intervalo_horas = 1,
      formato_saida = 'iso'
    } = args;

    let resultados = [];
    const agora = new Date();

    try {
      switch (tipo) {
        case 'agora':
          const timestamp = incluir_milissegundos ? agora.getTime() : Math.floor(agora.getTime() / 1000);
          resultados.push(timestamp);
          break;

        case 'timestamp':
          for (let i = 0; i < quantidade; i++) {
            const ts = incluir_milissegundos ? Date.now() + i : Math.floor(Date.now() / 1000) + i;
            resultados.push(ts);
          }
          break;

        case 'data_aleatoria':
          const inicio = data_inicio ? new Date(data_inicio) : new Date(agora.getFullYear(), 0, 1);
          const fim = data_fim ? new Date(data_fim) : new Date(agora.getFullYear(), 11, 31);

          for (let i = 0; i < quantidade; i++) {
            const dataAleatoria = new Date(inicio.getTime() + Math.random() * (fim.getTime() - inicio.getTime()));

            if (apenas_dias_uteis && !this.isDiaUtil(dataAleatoria)) {
              i--;
              continue;
            }

            resultados.push(this.formatarDataSaida(dataAleatoria, formato_saida));
          }
          break;

        case 'sequencia_datas':
          const dataInicio = data_inicio ? new Date(data_inicio) : agora;
          for (let i = 0; i < quantidade; i++) {
            const data = new Date(dataInicio);
            data.setDate(dataInicio.getDate() + (i * intervalo_dias));

            if (apenas_dias_uteis && !this.isDiaUtil(data)) {
              quantidade++;
              continue;
            }

            resultados.push(this.formatarDataSaida(data, formato_saida));
          }
          break;

        case 'dias_uteis':
          const dataBase = data_inicio ? new Date(data_inicio) : agora;
          let diasEncontrados = 0;
          let dataAtual = new Date(dataBase);

          while (diasEncontrados < quantidade) {
            if (this.isDiaUtil(dataAtual)) {
              resultados.push(this.formatarDataSaida(new Date(dataAtual), formato_saida));
              diasEncontrados++;
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
          }
          break;

        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Tipo de Geração Inválido**\n\nTipos disponíveis: agora, timestamp, data_aleatoria, sequencia_datas, dias_uteis`
            }]
          };
      }

      const titulo = `📅 **Datas/Timestamps Gerados (${tipo})**\n\n`;
      const lista = resultados.map((item, index) => `${index + 1}. \`${item}\``).join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${quantidade} item(s) gerado(s) com sucesso!**`
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
      datas = [],
      tipo_validacao = 'formato',
      formato_esperado = 'auto',
      data_minima,
      data_maxima
    } = args;

    if (datas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Validação**\n\nNenhuma data fornecida para validação.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const data of datas) {
        const resultado = this.validarData(data, tipo_validacao, {
          formato_esperado,
          data_minima,
          data_maxima
        });
        resultados.push(resultado);
      }

      const titulo = `✅ **Validação de Datas (${tipo_validacao})**\n\n`;
      const lista = resultados.map(r =>
        `${r.valida ? '✅' : '❌'} \`${r.data}\` - ${r.mensagem}`
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

  formatarDataSaida(data, formato) {
    switch (formato) {
      case 'iso':
        return data.toISOString().split('T')[0];
      case 'brasileiro':
        return data.toLocaleDateString('pt-BR');
      case 'americano':
        return data.toLocaleDateString('en-US');
      case 'timestamp':
        return Math.floor(data.getTime() / 1000);
      default:
        return data.toISOString().split('T')[0];
    }
  },

  validarData(data, tipo, opcoes = {}) {
    const { formato_esperado, data_minima, data_maxima } = opcoes;

    const resultado = {
      data: data,
      valida: false,
      mensagem: '',
      formato_detectado: null
    };

    const formato = this.detectarFormato(data);
    resultado.formato_detectado = formato;

    if (formato === 'desconhecido') {
      resultado.mensagem = 'Formato não reconhecido';
      return resultado;
    }

    const dateObj = this.normalizarData(data, formato);
    if (!dateObj || isNaN(dateObj.getTime())) {
      resultado.mensagem = 'Data inválida';
      return resultado;
    }

    switch (tipo) {
      case 'formato':
        if (formato_esperado === 'auto' || formato === formato_esperado) {
          resultado.valida = true;
          resultado.mensagem = `Válida (${formato})`;
        } else {
          resultado.mensagem = `Formato ${formato}, esperado ${formato_esperado}`;
        }
        break;

      case 'intervalo':
        const minima = data_minima ? new Date(data_minima) : null;
        const maxima = data_maxima ? new Date(data_maxima) : null;

        if (minima && dateObj < minima) {
          resultado.mensagem = `Anterior à data mínima (${data_minima})`;
        } else if (maxima && dateObj > maxima) {
          resultado.mensagem = `Posterior à data máxima (${data_maxima})`;
        } else {
          resultado.valida = true;
          resultado.mensagem = 'Dentro do intervalo válido';
        }
        break;

      case 'dia_util':
        if (this.isDiaUtil(dateObj)) {
          resultado.valida = true;
          resultado.mensagem = `${this.obterDiaSemana(dateObj)} (Dia útil)`;
        } else {
          resultado.mensagem = `${this.obterDiaSemana(dateObj)} (Fim de semana)`;
        }
        break;

      case 'feriado':
        if (this.isFeriado(dateObj)) {
          resultado.valida = true;
          resultado.mensagem = `Feriado: ${this.feriadosFixos[this.obterChaveFeriado(dateObj)]}`;
        } else {
          resultado.mensagem = 'Não é feriado nacional';
        }
        break;

      case 'futuro':
        const agora = new Date();
        if (dateObj > agora) {
          resultado.valida = true;
          resultado.mensagem = 'Data futura';
        } else {
          resultado.mensagem = 'Data passada ou presente';
        }
        break;

      case 'passado':
        const hoje = new Date();
        if (dateObj < hoje) {
          resultado.valida = true;
          resultado.mensagem = 'Data passada';
        } else {
          resultado.mensagem = 'Data presente ou futura';
        }
        break;

      default:
        resultado.mensagem = 'Tipo de validação desconhecido';
    }

    return resultado;
  },

  obterDiaSemana(data) {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[data.getDay()];
  },

  obterChaveFeriado(data) {
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${mes}-${dia}`;
  },

  executarConversao(args) {
    const {
      datas = [],
      tipo_conversao = 'formato',
      formato_origem = 'auto',
      formato_destino = 'iso',
      fuso_origem = 'UTC',
      fuso_destino = 'America/Sao_Paulo'
    } = args;

    if (datas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Conversão**\n\nNenhuma data fornecida para conversão.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const data of datas) {
        const dateObj = this.normalizarData(data, formato_origem);
        if (!dateObj) {
          resultados.push(`❌ ${data} - Data inválida`);
          continue;
        }

        let resultado;
        switch (tipo_conversao) {
          case 'formato':
            resultado = this.formatarDataSaida(dateObj, formato_destino);
            break;
          case 'timestamp':
            resultado = Math.floor(dateObj.getTime() / 1000);
            break;
          case 'relativo':
            resultado = this.formatarRelativo(dateObj);
            break;
          default:
            resultado = this.formatarDataSaida(dateObj, formato_destino);
        }

        resultados.push(`✅ \`${data}\` → \`${resultado}\``);
      }

      const titulo = `🔄 **Conversão de Datas (${tipo_conversao})**\n\n`;
      const lista = resultados.join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${datas.length} data(s) processada(s)!**`
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
      datas = [],
      data_inicio,
      data_fim,
      data_nascimento,
      unidade = 'dias',
      valor,
      incluir_fins_semana = true
    } = args;

    try {
      let resultado;

      switch (tipo_calculo) {
        case 'diferenca':
          if (!data_inicio || !data_fim) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nPara calcular diferença, forneça data_inicio e data_fim.`
              }]
            };
          }
          resultado = this.calcularDiferenca(data_inicio, data_fim, unidade);
          break;

        case 'idade':
          const dataNasc = data_nascimento || (datas.length > 0 ? datas[0] : null);
          if (!dataNasc) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nPara calcular idade, forneça data_nascimento ou uma data no array datas.`
              }]
            };
          }
          resultado = this.calcularIdade(dataNasc);
          break;

        case 'adicionar':
        case 'subtrair':
          if (datas.length === 0 || valor === undefined) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nPara ${tipo_calculo}, forneça datas e valor.`
              }]
            };
          }
          resultado = this.calcularAdicaoSubtracao(datas, valor, unidade, tipo_calculo === 'subtrair');
          break;

        case 'proximo_dia_util':
          if (datas.length === 0) {
            return {
              content: [{
                type: 'text',
                text: `❌ **Erro no Cálculo**\n\nForneça pelo menos uma data.`
              }]
            };
          }
          resultado = this.calcularProximoDiaUtil(datas);
          break;

        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Tipo de Cálculo Inválido**\n\nTipos disponíveis: diferenca, idade, adicionar, subtrair, proximo_dia_util`
            }]
          };
      }

      const titulo = `🧮 **Cálculo de Datas (${tipo_calculo})**\n\n`;

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

  formatarRelativo(data) {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias === 0) return 'hoje';
    if (dias === 1) return 'ontem';
    if (dias === -1) return 'amanhã';
    if (dias > 0) return `há ${dias} dia${dias > 1 ? 's' : ''}`;
    return `em ${Math.abs(dias)} dia${Math.abs(dias) > 1 ? 's' : ''}`;
  },

  calcularDiferenca(dataInicio, dataFim, unidade) {
    const inicio = this.normalizarData(dataInicio);
    const fim = this.normalizarData(dataFim);

    if (!inicio || !fim) {
      throw new Error('Datas inválidas para cálculo de diferença');
    }

    const diffMs = fim.getTime() - inicio.getTime();

    switch (unidade) {
      case 'dias':
        return `${Math.floor(diffMs / (1000 * 60 * 60 * 24))} dias`;
      case 'horas':
        return `${Math.floor(diffMs / (1000 * 60 * 60))} horas`;
      case 'minutos':
        return `${Math.floor(diffMs / (1000 * 60))} minutos`;
      case 'anos':
        return `${Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))} anos`;
      default:
        return `${Math.floor(diffMs / (1000 * 60 * 60 * 24))} dias`;
    }
  },

  calcularIdade(dataNascimento) {
    const nascimento = this.normalizarData(dataNascimento);
    if (!nascimento) {
      throw new Error('Data de nascimento inválida');
    }

    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    let dias = hoje.getDate() - nascimento.getDate();

    if (dias < 0) {
      meses--;
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
      dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    return `${anos} anos, ${meses} meses, ${dias} dias`;
  },

  calcularAdicaoSubtracao(datas, valor, unidade, subtrair = false) {
    const resultados = [];
    const multiplicador = subtrair ? -1 : 1;

    for (const data of datas) {
      const dateObj = this.normalizarData(data);
      if (!dateObj) {
        resultados.push(`❌ ${data} - Data inválida`);
        continue;
      }

      const novaData = new Date(dateObj);

      switch (unidade) {
        case 'dias':
          novaData.setDate(novaData.getDate() + (valor * multiplicador));
          break;
        case 'meses':
          novaData.setMonth(novaData.getMonth() + (valor * multiplicador));
          break;
        case 'anos':
          novaData.setFullYear(novaData.getFullYear() + (valor * multiplicador));
          break;
        default:
          novaData.setDate(novaData.getDate() + (valor * multiplicador));
      }

      resultados.push(`✅ \`${data}\` → \`${this.formatarDataSaida(novaData, 'iso')}\``);
    }

    return resultados.join('\n');
  },

  calcularProximoDiaUtil(datas) {
    const resultados = [];

    for (const data of datas) {
      const dateObj = this.normalizarData(data);
      if (!dateObj) {
        resultados.push(`❌ ${data} - Data inválida`);
        continue;
      }

      const proximoDiaUtil = new Date(dateObj);
      proximoDiaUtil.setDate(proximoDiaUtil.getDate() + 1);

      while (!this.isDiaUtil(proximoDiaUtil)) {
        proximoDiaUtil.setDate(proximoDiaUtil.getDate() + 1);
      }

      resultados.push(`✅ \`${data}\` → \`${this.formatarDataSaida(proximoDiaUtil, 'iso')}\``);
    }

    return resultados.join('\n');
  },

  executarFormatacao(args) {
    const {
      datas = [],
      formato = 'iso',
      formato_customizado,
      incluir_hora = false,
      incluir_segundos = false,
      idioma = 'pt-BR'
    } = args;

    if (datas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Formatação**\n\nNenhuma data fornecida para formatação.`
        }]
      };
    }

    const resultados = [];

    try {
      for (const data of datas) {
        const dateObj = this.normalizarData(data);
        if (!dateObj) {
          resultados.push(`❌ ${data} - Data inválida`);
          continue;
        }

        let formatado;
        switch (formato) {
          case 'extenso':
            formatado = this.formatarExtenso(dateObj, idioma);
            break;
          case 'relativo':
            formatado = this.formatarRelativo(dateObj);
            break;
          case 'customizado':
            formatado = this.formatarCustomizado(dateObj, formato_customizado);
            break;
          default:
            formatado = this.formatarDataSaida(dateObj, formato);
        }

        if (incluir_hora && formato !== 'relativo') {
          const hora = incluir_segundos
            ? dateObj.toLocaleTimeString(idioma)
            : dateObj.toLocaleTimeString(idioma, { hour: '2-digit', minute: '2-digit' });
          formatado += ` ${hora}`;
        }

        resultados.push(`✅ \`${data}\` → **${formatado}**`);
      }

      const titulo = `🎨 **Formatação de Datas (${formato})**\n\n`;
      const lista = resultados.join('\n');

      return {
        content: [{
          type: 'text',
          text: titulo + lista + `\n\n✅ **${datas.length} data(s) formatada(s)!**`
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

  executarAnalise(args) {
    const {
      datas = [],
      tipo_analise = 'completa',
      incluir_astronomia = false
    } = args;

    if (datas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Análise**\n\nNenhuma data fornecida para análise.`
        }]
      };
    }

    try {
      let resultado;

      switch (tipo_analise) {
        case 'completa':
          resultado = this.analisarCompleta(datas[0]);
          break;
        case 'estatisticas':
          resultado = this.analisarEstatisticas(datas);
          break;
        default:
          resultado = this.analisarCompleta(datas[0]);
      }

      const titulo = `📊 **Análise de Datas (${tipo_analise})**\n\n`;

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

  formatarExtenso(data, idioma) {
    const meses = {
      'pt-BR': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    };

    const dia = data.getDate();
    const mes = meses[idioma] ? meses[idioma][data.getMonth()] : data.getMonth() + 1;
    const ano = data.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
  },

  formatarCustomizado(data, padrao) {
    if (!padrao) return this.formatarDataSaida(data, 'iso');

    return padrao
      .replace('DD', String(data.getDate()).padStart(2, '0'))
      .replace('MM', String(data.getMonth() + 1).padStart(2, '0'))
      .replace('YYYY', data.getFullYear())
      .replace('HH', String(data.getHours()).padStart(2, '0'))
      .replace('mm', String(data.getMinutes()).padStart(2, '0'))
      .replace('ss', String(data.getSeconds()).padStart(2, '0'));
  },

  analisarCompleta(data) {
    const dateObj = this.normalizarData(data);
    if (!dateObj) {
      throw new Error('Data inválida para análise');
    }

    const info = {
      data_original: data,
      data_iso: this.formatarDataSaida(dateObj, 'iso'),
      dia_semana: this.obterDiaSemana(dateObj),
      dia_ano: this.obterDiaDoAno(dateObj),
      semana_ano: this.obterSemanaDoAno(dateObj),
      trimestre: this.obterTrimestre(dateObj),
      mes_nome: this.obterNomeMes(dateObj),
      ano_bissexto: this.isAnoBissexto(dateObj.getFullYear()),
      dia_util: this.isDiaUtil(dateObj),
      feriado: this.isFeriado(dateObj),
      timestamp: Math.floor(dateObj.getTime() / 1000)
    };

    return Object.entries(info)
      .map(([chave, valor]) => `**${chave.replace(/_/g, ' ')}:** ${valor}`)
      .join('\n');
  },

  analisarEstatisticas(datas) {
    const datasValidas = datas
      .map(d => this.normalizarData(d))
      .filter(d => d && !isNaN(d.getTime()));

    if (datasValidas.length === 0) {
      throw new Error('Nenhuma data válida para análise estatística');
    }

    const timestamps = datasValidas.map(d => d.getTime());
    const maisAntiga = new Date(Math.min(...timestamps));
    const maisRecente = new Date(Math.max(...timestamps));
    const intervalo = Math.floor((maisRecente.getTime() - maisAntiga.getTime()) / (1000 * 60 * 60 * 24));
    const diasUteis = datasValidas.filter(d => this.isDiaUtil(d)).length;

    const stats = {
      total_datas: datasValidas.length,
      data_mais_antiga: this.formatarDataSaida(maisAntiga, 'iso'),
      data_mais_recente: this.formatarDataSaida(maisRecente, 'iso'),
      intervalo_dias: intervalo,
      dias_uteis: diasUteis,
      fins_semana: datasValidas.length - diasUteis
    };

    return Object.entries(stats)
      .map(([chave, valor]) => `**${chave.replace(/_/g, ' ')}:** ${valor}`)
      .join('\n');
  },

  obterDiaDoAno(data) {
    const inicio = new Date(data.getFullYear(), 0, 0);
    const diff = data - inicio;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  obterSemanaDoAno(data) {
    const inicio = new Date(data.getFullYear(), 0, 1);
    const dias = Math.floor((data - inicio) / (1000 * 60 * 60 * 24));
    return Math.ceil((dias + inicio.getDay() + 1) / 7);
  },

  obterTrimestre(data) {
    const trimestre = Math.floor(data.getMonth() / 3) + 1;
    return `Q${trimestre} ${data.getFullYear()}`;
  },

  obterNomeMes(data) {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return meses[data.getMonth()];
  },

  isAnoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
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

module.exports = dateUtilsTool;
