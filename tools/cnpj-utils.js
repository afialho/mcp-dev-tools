const cnpjUtilsTool = {
  name: 'cnpj_utils',
  description: 'Utilitários para CNPJ: gerar, validar e formatar CNPJs brasileiros',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'validar', 'formatar'],
        description: 'Operação a realizar: gerar, validar ou formatar CNPJs'
      },
      cnpjs: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de CNPJs para validar/formatar (não usado em gerar)',
        maxItems: 100
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 1,
        description: 'Quantidade de CNPJs para gerar (apenas para operação gerar)'
      },
      formato: {
        type: 'string',
        enum: ['com_mascara', 'sem_mascara'],
        default: 'com_mascara',
        description: 'Formato de saída: com máscara (00.000.000/0000-00) ou sem'
      }
    },
    required: ['operacao']
  },

  // Função para validar CNPJ
  validarCNPJ(cnpj) {
    // Remove formatação
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) return false;
    
    // Verifica sequências inválidas (00000000000000, 11111111111111, etc.)
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
    
    // Calcula primeiro dígito verificador
    const multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpjLimpo[i]) * multiplicadores1[i];
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) digito1 = 0;
    
    // Verifica primeiro dígito
    if (parseInt(cnpjLimpo[12]) !== digito1) return false;
    
    // Calcula segundo dígito verificador
    const multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpjLimpo[i]) * multiplicadores2[i];
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) digito2 = 0;
    
    // Verifica segundo dígito
    return parseInt(cnpjLimpo[13]) === digito2;
  },

  // Função para gerar CNPJ válido
  gerarCNPJ() {
    // Gera 12 primeiros dígitos aleatórios
    const primeiros12 = Array.from({length: 12}, () => Math.floor(Math.random() * 10));
    
    // Calcula primeiro dígito verificador
    const multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += primeiros12[i] * multiplicadores1[i];
    }
    const digito1 = 11 - (soma % 11);
    const dv1 = digito1 > 9 ? 0 : digito1;
    
    // Calcula segundo dígito verificador
    const multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += primeiros12[i] * multiplicadores2[i];
    }
    soma += dv1 * 2;
    const digito2 = 11 - (soma % 11);
    const dv2 = digito2 > 9 ? 0 : digito2;
    
    return [...primeiros12, dv1, dv2].join('');
  },

  // Função para formatar CNPJ com máscara
  formatarComMascara(cnpj) {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    if (cnpjLimpo.length !== 14) return cnpj; // Retorna original se inválido
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  // Função para remover máscara do CNPJ
  removerMascara(cnpj) {
    return cnpj.replace(/[^\d]/g, '');
  },

  // Função para obter motivo de invalidez
  obterMotivoInvalidez(cnpj) {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    if (cnpjLimpo.length !== 14) {
      return 'Deve ter 14 dígitos';
    }
    
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) {
      return 'Sequência repetida';
    }
    
    return 'Dígitos verificadores incorretos';
  },

  async execute(args) {
    const { operacao, cnpjs = [], quantidade = 1, formato = 'com_mascara' } = args;

    try {
      switch (operacao) {
        case 'gerar':
          return this.executarGeracao(quantidade, formato);
        
        case 'validar':
          if (!cnpjs || cnpjs.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Validação**\n\nPara validar CNPJs, é necessário fornecer uma lista de CNPJs no parâmetro `cnpjs`.'
              }]
            };
          }
          return this.executarValidacao(cnpjs);
        
        case 'formatar':
          if (!cnpjs || cnpjs.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Formatação**\n\nPara formatar CNPJs, é necessário fornecer uma lista de CNPJs no parâmetro `cnpjs`.'
              }]
            };
          }
          return this.executarFormatacao(cnpjs, formato);
        
        default:
          return {
            content: [{
              type: 'text',
              text: '❌ **Operação Inválida**\n\nOperações disponíveis: `gerar`, `validar`, `formatar`'
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

  executarGeracao(quantidade, formato) {
    const cnpjsGerados = [];
    
    for (let i = 0; i < quantidade; i++) {
      const cnpj = this.gerarCNPJ();
      const cnpjFormatado = formato === 'com_mascara' ? this.formatarComMascara(cnpj) : cnpj;
      cnpjsGerados.push(cnpjFormatado);
    }

    const resultado = `🏢 **CNPJs Gerados**\n\n`;
    const listaCnpjs = cnpjsGerados.map((cnpj, index) => 
      `${index + 1}. \`${cnpj}\` ✅ Válido`
    ).join('\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaCnpjs + `\n\n✅ **${quantidade} CNPJ(s) gerado(s) com sucesso!**`
      }]
    };
  },

  executarValidacao(cnpjs) {
    const resultados = [];
    let validos = 0;
    let invalidos = 0;

    for (let i = 0; i < cnpjs.length; i++) {
      const cnpj = cnpjs[i];
      const isValid = this.validarCNPJ(cnpj);
      
      if (isValid) {
        resultados.push(`${i + 1}. \`${cnpj}\` ✅ **Válido**`);
        validos++;
      } else {
        const motivo = this.obterMotivoInvalidez(cnpj);
        resultados.push(`${i + 1}. \`${cnpj}\` ❌ **Inválido** - ${motivo}`);
        invalidos++;
      }
    }

    const resultado = `🔍 **Validação de CNPJs**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${validos} válido(s), ${invalidos} inválido(s) de ${cnpjs.length} CNPJ(s) verificado(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  executarFormatacao(cnpjs, formato) {
    const resultados = [];
    let processados = 0;
    let erros = 0;

    for (let i = 0; i < cnpjs.length; i++) {
      const cnpj = cnpjs[i];
      const cnpjLimpo = this.removerMascara(cnpj);
      
      if (cnpjLimpo.length === 14) {
        const cnpjFormatado = formato === 'com_mascara' 
          ? this.formatarComMascara(cnpjLimpo)
          : cnpjLimpo;
        resultados.push(`${i + 1}. \`${cnpj}\` → \`${cnpjFormatado}\``);
        processados++;
      } else {
        resultados.push(`${i + 1}. \`${cnpj}\` ❌ **Erro** - Formato inválido`);
        erros++;
      }
    }

    const operacao = formato === 'com_mascara' ? 'Adição de Máscara' : 'Remoção de Máscara';
    const resultado = `🎭 **${operacao} em CNPJs**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${processados} processado(s), ${erros} erro(s) de ${cnpjs.length} CNPJ(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  }
};

module.exports = cnpjUtilsTool;
