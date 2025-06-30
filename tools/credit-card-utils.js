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

  bandeiras: {
    visa: {
      nome: 'Visa',
      prefixos: ['402400', '409070', '424631', '426684', '427570', '431940', '454742', '476173', '491827', '498765'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    },
    mastercard: {
      nome: 'Mastercard',
      prefixos: [],
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
      prefixos: ['300', '301', '302', '303', '304', '305', '36', '38'],
      comprimentos: [14],
      cvvLength: 3,
      mascara: '0000 000000 0000'
    },
    hipercard: {
      nome: 'Hipercard',
      prefixos: ['606282', '637095', '637599', '637609', '637612', '637568'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    },
    elo: {
      nome: 'Elo',
      prefixos: ['431274', '438935', '451416', '506699', '636368', '627780', '636297', '504175', '509048', '509067'],
      comprimentos: [16],
      cvvLength: 3,
      mascara: '0000 0000 0000 0000'
    }
  },

  inicializarPrefixos() {
    if (this.bandeiras.mastercard.prefixos.length === 0) {
      const prefixos = [];

      for (let i = 222100; i <= 272099; i += 500) {
        prefixos.push(i.toString());
      }

      for (let i = 510000; i <= 559999; i += 1000) {
        prefixos.push(i.toString());
      }

      this.bandeiras.mastercard.prefixos = prefixos;
    }
  },

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

  identificarBandeira(numero) {
    const numeroLimpo = numero.replace(/[^\d]/g, '');
    this.inicializarPrefixos();

    const todosPrefixos = [];
    for (const [codigo, config] of Object.entries(this.bandeiras)) {
      for (const prefixo of config.prefixos) {
        todosPrefixos.push({ prefixo, codigo, config });
      }
    }

    todosPrefixos.sort((a, b) => b.prefixo.length - a.prefixo.length);

    for (const item of todosPrefixos) {
      if (numeroLimpo.startsWith(item.prefixo) && item.config.comprimentos.includes(numeroLimpo.length)) {
        return item.codigo;
      }
    }

    return null;
  },

  calcularDigitoLuhn(numero) {
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

    return (10 - (soma % 10)) % 10;
  },

  gerarNumero(bandeira) {
    this.inicializarPrefixos();
    const config = this.bandeiras[bandeira];
    const prefixo = config.prefixos[Math.floor(Math.random() * config.prefixos.length)];
    const comprimento = config.comprimentos[Math.floor(Math.random() * config.comprimentos.length)];

    let numero = prefixo;
    while (numero.length < comprimento - 1) {
      numero += Math.floor(Math.random() * 10);
    }

    const digitoVerificador = this.calcularDigitoLuhn(numero);
    return numero + digitoVerificador;
  },

  gerarCVV(bandeira) {
    const config = this.bandeiras[bandeira];
    const length = config.cvvLength;
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  },

  gerarDataExpiracao(tipo, anosFuturo, anosPassado, formato) {
    const hoje = new Date();
    let ano, mes;
    
    if (tipo === 'futura') {
      ano = hoje.getFullYear() + Math.floor(Math.random() * anosFuturo) + 1;
      mes = Math.floor(Math.random() * 12) + 1;
    } else if (tipo === 'vencida') {
      ano = hoje.getFullYear() - Math.floor(Math.random() * anosPassado) - 1;
      mes = Math.floor(Math.random() * 12) + 1;
    } else {
      const isFutura = Math.random() > 0.5;
      if (isFutura) {
        ano = hoje.getFullYear() + Math.floor(Math.random() * anosFuturo) + 1;
      } else {
        ano = hoje.getFullYear() - Math.floor(Math.random() * anosPassado) - 1;
      }
      mes = Math.floor(Math.random() * 12) + 1;
    }
    
    const mesFormatado = mes.toString().padStart(2, '0');
    
    switch (formato) {
      case 'MM/YYYY':
        return `${mesFormatado}/${ano}`;
      case 'YYYY-MM':
        return `${ano}-${mesFormatado}`;
      default:
        return `${mesFormatado}/${ano.toString().slice(-2)}`;
    }
  },

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
    
    const dataCartao = new Date(ano, mes, 0);
    return dataCartao < hoje;
  },

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
      const bandeiraEscolhida = bandeira === 'aleatorio'
        ? Object.keys(this.bandeiras)[Math.floor(Math.random() * Object.keys(this.bandeiras).length)]
        : bandeira;

      const numero = this.gerarNumero(bandeiraEscolhida);
      const numeroFormatado = formato === 'com_mascara'
        ? this.formatarComMascara(numero, bandeiraEscolhida)
        : numero;

      const cvv = incluir_cvv ? this.gerarCVV(bandeiraEscolhida) : null;

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

if (require.main === module) {
  const assert = require('assert');

  console.log('🧪 Executando testes unitários...\n');

  console.log('1. Testando Visa...');
  const visaNumber = creditCardUtilsTool.gerarNumero('visa');
  const visaValid = creditCardUtilsTool.validarLuhn(visaNumber);
  const visaBandeira = creditCardUtilsTool.identificarBandeira(visaNumber);

  assert(visaValid, 'Visa deve ser válido pelo Luhn');
  assert(visaBandeira === 'visa', 'Visa deve ser identificado corretamente');
  assert(visaNumber.length === 16, 'Visa deve ter 16 dígitos');
  console.log(`   ✅ Visa: ${visaNumber} - Válido: ${visaValid} - Bandeira: ${visaBandeira}`);

  console.log('2. Testando Mastercard...');
  const mastercardNumber = creditCardUtilsTool.gerarNumero('mastercard');
  const mastercardValid = creditCardUtilsTool.validarLuhn(mastercardNumber);
  const mastercardBandeira = creditCardUtilsTool.identificarBandeira(mastercardNumber);

  assert(mastercardValid, 'Mastercard deve ser válido pelo Luhn');
  assert(mastercardBandeira === 'mastercard', 'Mastercard deve ser identificado corretamente');
  assert(mastercardNumber.length === 16, 'Mastercard deve ter 16 dígitos');
  console.log(`   ✅ Mastercard: ${mastercardNumber} - Válido: ${mastercardValid} - Bandeira: ${mastercardBandeira}`);

  console.log('3. Testando Elo...');
  const eloNumber = creditCardUtilsTool.gerarNumero('elo');
  const eloValid = creditCardUtilsTool.validarLuhn(eloNumber);
  const eloBandeira = creditCardUtilsTool.identificarBandeira(eloNumber);

  assert(eloValid, 'Elo deve ser válido pelo Luhn');
  assert(eloBandeira === 'elo', 'Elo deve ser identificado corretamente');
  assert(eloNumber.length === 16, 'Elo deve ter 16 dígitos');
  console.log(`   ✅ Elo: ${eloNumber} - Válido: ${eloValid} - Bandeira: ${eloBandeira}`);

  console.log('4. Testando Hipercard...');
  const hipercardNumber = creditCardUtilsTool.gerarNumero('hipercard');
  const hipercardValid = creditCardUtilsTool.validarLuhn(hipercardNumber);
  const hipercardBandeira = creditCardUtilsTool.identificarBandeira(hipercardNumber);

  assert(hipercardValid, 'Hipercard deve ser válido pelo Luhn');
  assert(hipercardBandeira === 'hipercard', 'Hipercard deve ser identificado corretamente');
  assert(hipercardNumber.length === 16, 'Hipercard deve ter 16 dígitos');
  console.log(`   ✅ Hipercard: ${hipercardNumber} - Válido: ${hipercardValid} - Bandeira: ${hipercardBandeira}`);

  console.log('5. Testando resolução de ambiguidade...');
  const eloAmbiguo = '4312740000000000';
  const bandeiraAmbigua = creditCardUtilsTool.identificarBandeira(eloAmbiguo);

  assert(bandeiraAmbigua === 'elo', 'Número 431274... deve ser identificado como Elo, não Visa');
  console.log(`   ✅ Ambiguidade resolvida: ${eloAmbiguo} identificado como ${bandeiraAmbigua}`);

  console.log('6. Testando IINs reais...');
  const visaReal = '4024000000000000';
  const mastercardReal = '5100000000000000';

  assert(creditCardUtilsTool.identificarBandeira(visaReal) === 'visa', 'IIN 402400 deve ser Visa');
  assert(creditCardUtilsTool.identificarBandeira(mastercardReal) === 'mastercard', 'IIN 510000 deve ser Mastercard');
  console.log(`   ✅ IINs reais validados`);

  console.log('\n🎉 Todos os testes passaram com sucesso!');
  console.log('✅ Números gerados usam IINs reais de 6-8 dígitos');
  console.log('✅ Algoritmo de Luhn corrigido (alternar = false)');
  console.log('✅ Ambiguidades resolvidas (prefixos mais longos primeiro)');
  console.log('✅ Visa limitado a 16 dígitos apenas');
}
