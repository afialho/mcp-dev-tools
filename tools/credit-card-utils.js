const creditCardUtilsTool = {
  name: 'credit_card_utils',
  description: 'Utilitários para cartões de crédito: gerar, validar, identificar bandeiras, formatar e analisar cartões com CVV e datas de expiração',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'validar', 'identificar', 'formatar', 'analisar'],
        description: 'Operação: gerar cartões, validar números, identificar bandeiras, formatar ou analisar'
      },
      numeros: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de números de cartão para validar/identificar/formatar/analisar (não usado em gerar)',
        maxItems: 50
      },
      bandeira: {
        type: 'string',
        enum: ['visa', 'mastercard', 'amex', 'diners', 'hipercard', 'elo', 'aleatorio'],
        default: 'aleatorio',
        description: 'Bandeira do cartão para gerar (apenas para operação gerar)'
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 50,
        default: 1,
        description: 'Quantidade de cartões para gerar (apenas para operação gerar)'
      },
      formato: {
        type: 'string',
        enum: ['com_mascara', 'sem_mascara'],
        default: 'com_mascara',
        description: 'Formato de saída: com máscara (0000 0000 0000 0000) ou sem'
      },
      incluir_cvv: {
        type: 'boolean',
        default: true,
        description: 'Incluir CVV na geração (apenas para operação gerar)'
      },
      incluir_data: {
        type: 'boolean',
        default: true,
        description: 'Incluir data de expiração na geração (apenas para operação gerar)'
      },
      tipo_data: {
        type: 'string',
        enum: ['futura', 'vencida', 'mista'],
        default: 'futura',
        description: 'Tipo de data: futura (1-5 anos), vencida (1-3 anos atrás) ou mista'
      },
      anos_futuro: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        default: 5,
        description: 'Máximo de anos no futuro para datas futuras'
      },
      anos_passado: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        default: 3,
        description: 'Máximo de anos no passado para datas vencidas'
      },
      formato_data: {
        type: 'string',
        enum: ['MM/YY', 'MM/YYYY', 'YYYY-MM'],
        default: 'MM/YY',
        description: 'Formato da data de expiração'
      }
    },
    required: ['operacao']
  },

  // Configurações das bandeiras
  bandeiras: {
    visa: {
      nome: 'Visa',
      prefixos: ['4'],
      comprimentos: [13, 16, 19],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    },
    mastercard: {
      nome: 'Mastercard',
      prefixos: ['51', '52', '53', '54', '55', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '270', '271', '2720'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    },
    amex: {
      nome: 'American Express',
      prefixos: ['34', '37'],
      comprimentos: [15],
      cvvLength: 4,
      mascara: '0000 000000 00000'
    },
    diners: {
      nome: 'Diners Club',
      prefixos: ['30', '36', '38', '300', '301', '302', '303', '304', '305'],
      comprimentos: [14],
      cvvLength: 3,
      mascara: '0000 000000 0000'
    },
    hipercard: {
      nome: 'Hipercard',
      prefixos: ['606282', '637095', '637568', '637599', '637609', '637612'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    },
    elo: {
      nome: 'Elo',
      prefixos: ['4011', '4312', '4389', '4514', '4573', '5041', '5066', '5067', '6277', '6362', '6363'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    }
  },

  // Algoritmo de Luhn para validação
  validarLuhn(numero) {
    const numeroLimpo = numero.replace(/[^\d]/g, '');
    let soma = 0;
    let alternar = false;

    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
      let digito = parseInt(numeroLimpo[i]);
      
      if (alternar) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      
      soma += digito;
      alternar = !alternar;
    }

    return soma % 10 === 0;
  },

  // Identificar bandeira do cartão
  identificarBandeira(numero) {
    const numeroLimpo = numero.replace(/[^\d]/g, '');
    
    for (const [codigo, config] of Object.entries(this.bandeiras)) {
      for (const prefixo of config.prefixos) {
        if (numeroLimpo.startsWith(prefixo) && config.comprimentos.includes(numeroLimpo.length)) {
          return codigo;
        }
      }
    }
    
    return null;
  },

  // Gerar número de cartão válido
  gerarNumero(bandeira) {
    const config = this.bandeiras[bandeira];
    const prefixo = config.prefixos[Math.floor(Math.random() * config.prefixos.length)];
    const comprimento = config.comprimentos[Math.floor(Math.random() * config.comprimentos.length)];
    
    // Gerar dígitos aleatórios até comprimento - 1 (deixando espaço para dígito verificador)
    let numero = prefixo;
    while (numero.length < comprimento - 1) {
      numero += Math.floor(Math.random() * 10);
    }
    
    // Calcular dígito verificador usando algoritmo de Luhn
    let soma = 0;
    let alternar = true;
    
    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = parseInt(numero[i]);
      
      if (alternar) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      
      soma += digito;
      alternar = !alternar;
    }
    
    const digitoVerificador = (10 - (soma % 10)) % 10;
    return numero + digitoVerificador;
  },

  // Gerar CVV
  gerarCVV(bandeira) {
    const config = this.bandeiras[bandeira];
    const length = config.cvvLength;
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  },

  // Gerar data de expiração
  gerarDataExpiracao(tipo, anosFuturo, anosPassado, formato) {
    const hoje = new Date();
    let ano, mes;
    
    if (tipo === 'futura') {
      ano = hoje.getFullYear() + Math.floor(Math.random() * anosFuturo) + 1;
      mes = Math.floor(Math.random() * 12) + 1;
    } else if (tipo === 'vencida') {
      ano = hoje.getFullYear() - Math.floor(Math.random() * anosPassado) - 1;
      mes = Math.floor(Math.random() * 12) + 1;
    } else { // mista
      const isFutura = Math.random() > 0.5;
      if (isFutura) {
        ano = hoje.getFullYear() + Math.floor(Math.random() * anosFuturo) + 1;
      } else {
        ano = hoje.getFullYear() - Math.floor(Math.random() * anosPassado) - 1;
      }
      mes = Math.floor(Math.random() * 12) + 1;
    }
    
    // Formatar conforme solicitado
    const mesFormatado = mes.toString().padStart(2, '0');
    
    switch (formato) {
      case 'MM/YYYY':
        return `${mesFormatado}/${ano}`;
      case 'YYYY-MM':
        return `${ano}-${mesFormatado}`;
      default: // MM/YY
        return `${mesFormatado}/${ano.toString().slice(-2)}`;
    }
  },

  // Verificar se data está vencida
  isDataVencida(dataExpiracao) {
    const hoje = new Date();
    let ano, mes;
    
    if (dataExpiracao.includes('/')) {
      const [mesStr, anoStr] = dataExpiracao.split('/');
      mes = parseInt(mesStr);
      ano = anoStr.length === 2 ? 2000 + parseInt(anoStr) : parseInt(anoStr);
    } else if (dataExpiracao.includes('-')) {
      const [anoStr, mesStr] = dataExpiracao.split('-');
      ano = parseInt(anoStr);
      mes = parseInt(mesStr);
    }
    
    // Último dia do mês de expiração
    const dataCartao = new Date(ano, mes, 0);
    return dataCartao < hoje;
  },

  // Formatar número com máscara
  formatarComMascara(numero, bandeira) {
    const numeroLimpo = numero.replace(/[^\d]/g, '');
    const config = this.bandeiras[bandeira];
    
    if (!config) return numero;
    
    const mascara = config.mascara;
    let resultado = '';
    let posicaoNumero = 0;
    
    for (let i = 0; i < mascara.length && posicaoNumero < numeroLimpo.length; i++) {
      if (mascara[i] === '0') {
        resultado += numeroLimpo[posicaoNumero];
        posicaoNumero++;
      } else {
        resultado += mascara[i];
      }
    }
    
    return resultado;
  },

  async execute(args) {
    try {
      const { operacao } = args;

      switch (operacao) {
        case 'gerar':
          return this.executarGeracao(args);
        case 'validar':
          return this.executarValidacao(args);
        case 'identificar':
          return this.executarIdentificacao(args);
        case 'formatar':
          return this.executarFormatacao(args);
        case 'analisar':
          return this.executarAnalise(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: gerar, validar, identificar, formatar, analisar`
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
  },

  // Executar geração de cartões
  executarGeracao(args) {
    const {
      bandeira = 'aleatorio',
      quantidade = 1,
      formato = 'com_mascara',
      incluir_cvv = true,
      incluir_data = true,
      tipo_data = 'futura',
      anos_futuro = 5,
      anos_passado = 3,
      formato_data = 'MM/YY'
    } = args;

    const cartoesGerados = [];

    for (let i = 0; i < quantidade; i++) {
      // Escolher bandeira
      const bandeiraEscolhida = bandeira === 'aleatorio'
        ? Object.keys(this.bandeiras)[Math.floor(Math.random() * Object.keys(this.bandeiras).length)]
        : bandeira;

      // Gerar número
      const numero = this.gerarNumero(bandeiraEscolhida);
      const numeroFormatado = formato === 'com_mascara'
        ? this.formatarComMascara(numero, bandeiraEscolhida)
        : numero;

      // Gerar CVV se solicitado
      const cvv = incluir_cvv ? this.gerarCVV(bandeiraEscolhida) : null;

      // Gerar data se solicitada
      const dataExpiracao = incluir_data
        ? this.gerarDataExpiracao(tipo_data, anos_futuro, anos_passado, formato_data)
        : null;

      const statusData = dataExpiracao ? (this.isDataVencida(dataExpiracao) ? 'Vencido' : 'Futuro') : null;

      cartoesGerados.push({
        numero: numeroFormatado,
        bandeira: this.bandeiras[bandeiraEscolhida].nome,
        cvv,
        dataExpiracao,
        statusData,
        bandeiraCode: bandeiraEscolhida
      });
    }

    // Montar resultado
    const titulo = `💳 **Cartões Gerados${bandeira !== 'aleatorio' ? ` - ${this.bandeiras[bandeira].nome}` : ''}**\n\n`;

    const listaCartoes = cartoesGerados.map((cartao, index) => {
      let linha = `${index + 1}. \`${cartao.numero}\` ✅ **${cartao.bandeira}**`;

      if (cartao.cvv || cartao.dataExpiracao) {
        linha += '\n   ';
        if (cartao.cvv) linha += `🔐 CVV: ${cartao.cvv}`;
        if (cartao.cvv && cartao.dataExpiracao) linha += ' | ';
        if (cartao.dataExpiracao) {
          const statusIcon = cartao.statusData === 'Vencido' ? '❌' : '✅';
          linha += `📅 ${cartao.dataExpiracao} ${statusIcon} ${cartao.statusData}`;
        }
      }

      return linha;
    }).join('\n\n');

    // Estatísticas
    const bandeirasCount = {};
    const statusCount = { futuro: 0, vencido: 0 };

    cartoesGerados.forEach(cartao => {
      bandeirasCount[cartao.bandeira] = (bandeirasCount[cartao.bandeira] || 0) + 1;
      if (cartao.statusData) {
        statusCount[cartao.statusData.toLowerCase()]++;
      }
    });

    let resumo = `\n\n✅ **${quantidade} cartão(s) gerado(s) com sucesso!**`;

    if (Object.keys(bandeirasCount).length > 1) {
      const bandeirasResumo = Object.entries(bandeirasCount)
        .map(([bandeira, count]) => `${count} ${bandeira}`)
        .join(', ');
      resumo += `\n📊 **Bandeiras:** ${bandeirasResumo}`;
    }

    if (incluir_data && (statusCount.futuro > 0 || statusCount.vencido > 0)) {
      resumo += `\n📅 **Status:** ${statusCount.futuro} futuro(s), ${statusCount.vencido} vencido(s)`;
    }

    return {
      content: [{
        type: 'text',
        text: titulo + listaCartoes + resumo
      }]
    };
  },

  // Executar validação de cartões
  executarValidacao(args) {
    const { numeros = [] } = args;

    if (!numeros || numeros.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Validação**\n\nPara validar cartões, é necessário fornecer uma lista de números no parâmetro `numeros`.'
        }]
      };
    }

    const resultados = [];
    let validos = 0;
    let invalidos = 0;

    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i];
      const numeroLimpo = numero.replace(/[^\d]/g, '');
      const isValid = this.validarLuhn(numero);
      const bandeira = this.identificarBandeira(numero);

      if (isValid && bandeira) {
        resultados.push(`${i + 1}. \`${numero}\` ✅ **Válido** - ${this.bandeiras[bandeira].nome}`);
        validos++;
      } else {
        let motivo = 'Número inválido';
        if (!isValid) motivo = 'Falha no algoritmo de Luhn';
        else if (!bandeira) motivo = 'Bandeira não reconhecida';

        resultados.push(`${i + 1}. \`${numero}\` ❌ **Inválido** - ${motivo}`);
        invalidos++;
      }
    }

    const resultado = `🔍 **Validação de Cartões**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${validos} válido(s), ${invalidos} inválido(s) de ${numeros.length} cartão(s) verificado(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  // Executar identificação de bandeiras
  executarIdentificacao(args) {
    const { numeros = [] } = args;

    if (!numeros || numeros.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Identificação**\n\nPara identificar bandeiras, é necessário fornecer uma lista de números no parâmetro `numeros`.'
        }]
      };
    }

    const resultados = [];
    const bandeirasCount = {};

    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i];
      const bandeira = this.identificarBandeira(numero);

      if (bandeira) {
        const config = this.bandeiras[bandeira];
        resultados.push(`${i + 1}. \`${numero}\` 🏦 **${config.nome}**\n   📏 ${numero.replace(/[^\d]/g, '').length} dígitos | 🔐 CVV: ${config.cvvLength} dígitos`);
        bandeirasCount[config.nome] = (bandeirasCount[config.nome] || 0) + 1;
      } else {
        resultados.push(`${i + 1}. \`${numero}\` ❓ **Bandeira não identificada**`);
        bandeirasCount['Não identificada'] = (bandeirasCount['Não identificada'] || 0) + 1;
      }
    }

    const resultado = `🏦 **Identificação de Bandeiras**\n\n`;
    const listaResultados = resultados.join('\n\n');

    const resumoBandeiras = Object.entries(bandeirasCount)
      .map(([bandeira, count]) => `${count} ${bandeira}`)
      .join(', ');
    const resumo = `\n\n📊 **Resumo:** ${resumoBandeiras} de ${numeros.length} cartão(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  // Executar formatação de cartões
  executarFormatacao(args) {
    const { numeros = [], formato = 'com_mascara' } = args;

    if (!numeros || numeros.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Formatação**\n\nPara formatar cartões, é necessário fornecer uma lista de números no parâmetro `numeros`.'
        }]
      };
    }

    const resultados = [];
    let processados = 0;
    let erros = 0;

    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i];
      const numeroLimpo = numero.replace(/[^\d]/g, '');
      const bandeira = this.identificarBandeira(numero);

      if (bandeira) {
        const numeroFormatado = formato === 'com_mascara'
          ? this.formatarComMascara(numeroLimpo, bandeira)
          : numeroLimpo;
        resultados.push(`${i + 1}. \`${numero}\` → \`${numeroFormatado}\` (${this.bandeiras[bandeira].nome})`);
        processados++;
      } else {
        resultados.push(`${i + 1}. \`${numero}\` ❌ **Erro** - Bandeira não identificada`);
        erros++;
      }
    }

    const acao = formato === 'com_mascara' ? 'Adição de Máscara' : 'Remoção de Máscara';
    const resultado = `🎭 **Formatação de Cartões - ${acao}**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${processados} formatado(s), ${erros} erro(s) de ${numeros.length} cartão(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  // Executar análise completa de cartões
  executarAnalise(args) {
    const { numeros = [] } = args;

    if (!numeros || numeros.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Análise**\n\nPara analisar cartões, é necessário fornecer uma lista de números no parâmetro `numeros`.'
        }]
      };
    }

    const resultados = [];

    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i];
      const numeroLimpo = numero.replace(/[^\d]/g, '');
      const bandeira = this.identificarBandeira(numero);
      const isValid = this.validarLuhn(numero);

      let analise = `📋 **Análise ${i + 1}: ${numero}**\n\n`;

      if (bandeira) {
        const config = this.bandeiras[bandeira];
        analise += `🏦 **Bandeira:** ${config.nome}\n`;
        analise += `${isValid ? '✅' : '❌'} **Validação:** ${isValid ? 'Válido' : 'Inválido'} (Luhn ${isValid ? '✓' : '✗'})\n`;
        analise += `📏 **Comprimento:** ${numeroLimpo.length} dígitos ${config.comprimentos.includes(numeroLimpo.length) ? '✓' : '❌'}\n`;
        analise += `🎭 **Formato:** \`${this.formatarComMascara(numeroLimpo, bandeira)}\`\n`;
        analise += `🔐 **CVV:** ${config.cvvLength} dígitos esperados\n`;
        analise += `📅 **Data Exemplo:** 12/28 (MM/YY)\n`;
        analise += `🌍 **Rede:** ${config.nome} International`;
      } else {
        analise += `❓ **Bandeira:** Não identificada\n`;
        analise += `${isValid ? '✅' : '❌'} **Validação:** ${isValid ? 'Válido' : 'Inválido'} (Luhn ${isValid ? '✓' : '✗'})\n`;
        analise += `📏 **Comprimento:** ${numeroLimpo.length} dígitos\n`;
        analise += `⚠️ **Observação:** Número não corresponde a nenhuma bandeira conhecida`;
      }

      resultados.push(analise);
    }

    const titulo = `🔍 **Análise Completa de Cartões**\n\n`;
    const conteudo = resultados.join('\n\n' + '─'.repeat(50) + '\n\n');

    return {
      content: [{
        type: 'text',
        text: titulo + conteudo
      }]
    };
  }
};

module.exports = creditCardUtilsTool;
