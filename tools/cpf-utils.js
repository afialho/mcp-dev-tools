const cpfUtilsTool = {
  name: 'cpf_utils',
  description: 'Utilitários para CPF: gerar, validar e formatar CPFs brasileiros',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'validar', 'formatar'],
        description: 'Operação a realizar: gerar, validar ou formatar CPFs'
      },
      cpfs: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de CPFs para validar/formatar (não usado em gerar)',
        maxItems: 100
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 1,
        description: 'Quantidade de CPFs para gerar (apenas para operação gerar)'
      },
      formato: {
        type: 'string',
        enum: ['com_mascara', 'sem_mascara'],
        default: 'com_mascara',
        description: 'Formato de saída: com máscara (000.000.000-00) ou sem'
      }
    },
    required: ['operacao']
  },

  validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    if (cpfLimpo.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo[i]) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) digito1 = 0;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo[i]) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) digito2 = 0;

    return digito1 === parseInt(cpfLimpo[9]) && digito2 === parseInt(cpfLimpo[10]);
  },

  gerarCPF() {
    const primeiros9 = Array.from({length: 9}, () => Math.floor(Math.random() * 10));

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += primeiros9[i] * (10 - i);
    }
    const digito1 = 11 - (soma % 11);
    const dv1 = digito1 > 9 ? 0 : digito1;

    soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += primeiros9[i] * (11 - i);
    }
    soma += dv1 * 2;
    const digito2 = 11 - (soma % 11);
    const dv2 = digito2 > 9 ? 0 : digito2;

    return [...primeiros9, dv1, dv2].join('');
  },

  formatarComMascara(cpf) {
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  removerMascara(cpf) {
    return cpf.replace(/[^\d]/g, '');
  },

  obterMotivoInvalidez(cpf) {
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    
    if (cpfLimpo.length !== 11) {
      return 'Deve ter 11 dígitos';
    }
    
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return 'Sequência repetida';
    }
    
    return 'Dígitos verificadores incorretos';
  },

  async execute(args) {
    const { operacao, cpfs = [], quantidade = 1, formato = 'com_mascara' } = args;

    try {
      switch (operacao) {
        case 'gerar':
          return this.executarGeracao(quantidade, formato);
        
        case 'validar':
          if (!cpfs || cpfs.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Validação**\n\nPara validar CPFs, é necessário fornecer uma lista de CPFs no parâmetro `cpfs`.'
              }]
            };
          }
          return this.executarValidacao(cpfs);
        
        case 'formatar':
          if (!cpfs || cpfs.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Formatação**\n\nPara formatar CPFs, é necessário fornecer uma lista de CPFs no parâmetro `cpfs`.'
              }]
            };
          }
          return this.executarFormatacao(cpfs, formato);
        
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
    const cpfsGerados = [];
    
    for (let i = 0; i < quantidade; i++) {
      const cpf = this.gerarCPF();
      const cpfFormatado = formato === 'com_mascara' ? this.formatarComMascara(cpf) : cpf;
      cpfsGerados.push(cpfFormatado);
    }

    const resultado = `🆔 **CPFs Gerados**\n\n`;
    const listaCpfs = cpfsGerados.map((cpf, index) => 
      `${index + 1}. \`${cpf}\` ✅ Válido`
    ).join('\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaCpfs + `\n\n✅ **${quantidade} CPF(s) gerado(s) com sucesso!**`
      }]
    };
  },

  executarValidacao(cpfs) {
    const resultados = [];
    let validos = 0;
    let invalidos = 0;

    for (let i = 0; i < cpfs.length; i++) {
      const cpf = cpfs[i];
      const isValid = this.validarCPF(cpf);
      
      if (isValid) {
        resultados.push(`${i + 1}. \`${cpf}\` ✅ **Válido**`);
        validos++;
      } else {
        const motivo = this.obterMotivoInvalidez(cpf);
        resultados.push(`${i + 1}. \`${cpf}\` ❌ **Inválido** - ${motivo}`);
        invalidos++;
      }
    }

    const resultado = `🔍 **Validação de CPFs**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${validos} válido(s), ${invalidos} inválido(s) de ${cpfs.length} CPF(s) verificado(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  executarFormatacao(cpfs, formato) {
    const resultados = [];
    let processados = 0;

    for (let i = 0; i < cpfs.length; i++) {
      const cpfOriginal = cpfs[i];
      let cpfFormatado;
      
      if (formato === 'com_mascara') {
        cpfFormatado = this.formatarComMascara(cpfOriginal);
      } else {
        cpfFormatado = this.removerMascara(cpfOriginal);
      }
      
      if (cpfFormatado !== cpfOriginal) {
        resultados.push(`${i + 1}. \`${cpfOriginal}\` → \`${cpfFormatado}\``);
        processados++;
      } else {
        resultados.push(`${i + 1}. \`${cpfOriginal}\` → \`${cpfFormatado}\` (sem alteração)`);
      }
    }

    const operacaoTexto = formato === 'com_mascara' ? 'Adicionar máscara' : 'Remover máscara';
    const resultado = `🎨 **Formatação de CPFs**\n\n**Operação:** ${operacaoTexto}\n\n`;
    const listaResultados = resultados.join('\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + `\n\n✅ **${cpfs.length} CPF(s) processado(s) com sucesso!**`
      }]
    };
  }
};

module.exports = cpfUtilsTool;
