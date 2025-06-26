const base64UtilsTool = {
  name: 'base64_utils_dev-tools',
  description: 'Utilitários completos para Base64: codificar, decodificar, validar, analisar e formatar dados Base64',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['encode', 'decode', 'validar', 'analisar', 'url_encode', 'url_decode', 'formatar', 'detectar'],
        description: 'Operação: codificar, decodificar, validar, analisar, URL-safe encode/decode, formatar ou detectar tipo'
      },
      texto: {
        type: 'string',
        description: 'Texto para codificar (apenas para operações encode/url_encode)'
      },
      dados_base64: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de strings Base64 para processar (não usado em encode)',
        maxItems: 100
      },
      formato_saida: {
        type: 'string',
        enum: ['texto', 'hex', 'buffer'],
        default: 'texto',
        description: 'Formato do resultado decodificado'
      },
      quebrar_linhas: {
        type: 'boolean',
        default: false,
        description: 'Adicionar quebras de linha (formatação MIME)'
      },
      largura_linha: {
        type: 'number',
        default: 76,
        minimum: 20,
        maximum: 200,
        description: 'Largura das linhas para formatação MIME'
      },
      incluir_estatisticas: {
        type: 'boolean',
        default: false,
        description: 'Incluir estatísticas detalhadas na análise'
      }
    },
    required: ['operacao']
  },

  // Validar se uma string é Base64 válida
  isValidBase64(str) {
    if (!str || typeof str !== 'string') return false;
    
    // Remover quebras de linha e espaços
    const cleaned = str.replace(/[\r\n\s]/g, '');
    
    // Verificar caracteres válidos
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleaned)) return false;
    
    // Verificar padding correto
    const paddingCount = (cleaned.match(/=/g) || []).length;
    if (paddingCount > 2) return false;
    
    // Verificar se o comprimento é múltiplo de 4 (após padding)
    return cleaned.length % 4 === 0;
  },

  // Validar se uma string é Base64 URL-safe válida
  isValidBase64Url(str) {
    if (!str || typeof str !== 'string') return false;
    
    const cleaned = str.replace(/[\r\n\s]/g, '');
    const urlSafeRegex = /^[A-Za-z0-9_-]*$/;
    
    return urlSafeRegex.test(cleaned);
  },

  // Detectar tipo de Base64
  detectBase64Type(str) {
    if (!str) return 'invalid';
    
    const cleaned = str.replace(/[\r\n\s]/g, '');
    
    if (this.isValidBase64(cleaned)) {
      return 'standard';
    } else if (this.isValidBase64Url(cleaned)) {
      return 'url-safe';
    }
    
    return 'invalid';
  },

  // Converter Base64 URL-safe para padrão
  urlSafeToStandard(str) {
    let result = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Adicionar padding se necessário
    const padding = 4 - (result.length % 4);
    if (padding !== 4) {
      result += '='.repeat(padding);
    }
    
    return result;
  },

  // Converter Base64 padrão para URL-safe
  standardToUrlSafe(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  // Formatar Base64 com quebras de linha
  formatWithLineBreaks(str, width = 76) {
    const cleaned = str.replace(/[\r\n\s]/g, '');
    const lines = [];
    
    for (let i = 0; i < cleaned.length; i += width) {
      lines.push(cleaned.slice(i, i + width));
    }
    
    return lines.join('\n');
  },

  // Analisar dados Base64
  analyzeBase64(str) {
    const cleaned = str.replace(/[\r\n\s]/g, '');
    const type = this.detectBase64Type(cleaned);
    
    let decodedSize = 0;
    let isValid = false;
    
    if (type !== 'invalid') {
      try {
        const standardBase64 = type === 'url-safe' ? this.urlSafeToStandard(cleaned) : cleaned;
        const decoded = Buffer.from(standardBase64, 'base64');
        decodedSize = decoded.length;
        isValid = true;
      } catch (error) {
        isValid = false;
      }
    }
    
    return {
      type,
      isValid,
      originalLength: str.length,
      cleanedLength: cleaned.length,
      decodedSize,
      efficiency: decodedSize > 0 ? ((decodedSize / cleaned.length) * 100).toFixed(2) + '%' : '0%',
      paddingChars: (cleaned.match(/=/g) || []).length,
      hasLineBreaks: str !== cleaned
    };
  },

  async executarEncode(args) {
    const { texto } = args;

    if (texto === undefined || texto === null) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `texto` é obrigatório para codificação.'
        }]
      };
    }

    try {
      const encoded = Buffer.from(texto, 'utf8').toString('base64');
      
      const resultado = `🔐 **Base64 Encode**\n\n` +
        `**Texto Original:** \`${texto}\`\n` +
        `**Base64:** \`${encoded}\`\n` +
        `**Tamanho Original:** ${texto.length} bytes\n` +
        `**Tamanho Codificado:** ${encoded.length} caracteres\n\n` +
        `✅ **Codificação realizada com sucesso!**`;

      return {
        content: [{ type: 'text', text: resultado }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Codificação**\n\n${error.message}`
        }]
      };
    }
  },

  async executarDecode(args) {
    const { dados_base64, formato_saida = 'texto', incluir_estatisticas = false } = args;
    
    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para decodificação.'
        }]
      };
    }

    const resultados = [];
    
    for (let i = 0; i < dados_base64.length; i++) {
      const base64Str = dados_base64[i];
      const analysis = this.analyzeBase64(base64Str);
      
      if (!analysis.isValid) {
        resultados.push(`**${i + 1}.** ❌ Base64 inválido: \`${base64Str.substring(0, 50)}${base64Str.length > 50 ? '...' : ''}\``);
        continue;
      }

      try {
        const cleaned = base64Str.replace(/[\r\n\s]/g, '');
        const standardBase64 = analysis.type === 'url-safe' ? this.urlSafeToStandard(cleaned) : cleaned;
        const decoded = Buffer.from(standardBase64, 'base64');
        
        let decodedText;
        switch (formato_saida) {
          case 'hex':
            decodedText = decoded.toString('hex');
            break;
          case 'buffer':
            decodedText = `Buffer(${decoded.length}) [${Array.from(decoded).slice(0, 10).join(', ')}${decoded.length > 10 ? '...' : ''}]`;
            break;
          default:
            decodedText = decoded.toString('utf8');
        }
        
        let resultado = `**${i + 1}.** ✅ \`${decodedText}\``;
        
        if (incluir_estatisticas) {
          resultado += `\n   📊 Tipo: ${analysis.type}, Tamanho: ${analysis.decodedSize} bytes, Eficiência: ${analysis.efficiency}`;
        }
        
        resultados.push(resultado);
      } catch (error) {
        resultados.push(`**${i + 1}.** ❌ Erro na decodificação: ${error.message}`);
      }
    }

    const texto = `🔓 **Base64 Decode**\n\n` +
      `**Formato de Saída:** ${formato_saida}\n` +
      `**Resultados:**\n\n${resultados.join('\n\n')}\n\n` +
      `✅ **${dados_base64.length} item(s) processado(s)!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async executarUrlEncode(args) {
    const { texto } = args;

    if (texto === undefined || texto === null) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `texto` é obrigatório para codificação URL-safe.'
        }]
      };
    }

    try {
      const standardBase64 = Buffer.from(texto, 'utf8').toString('base64');
      const urlSafe = this.standardToUrlSafe(standardBase64);
      
      const resultado = `🔐 **Base64 URL-Safe Encode**\n\n` +
        `**Texto Original:** \`${texto}\`\n` +
        `**Base64 Padrão:** \`${standardBase64}\`\n` +
        `**Base64 URL-Safe:** \`${urlSafe}\`\n` +
        `**Tamanho Original:** ${texto.length} bytes\n` +
        `**Tamanho Codificado:** ${urlSafe.length} caracteres\n\n` +
        `✅ **Codificação URL-safe realizada com sucesso!**`;

      return {
        content: [{ type: 'text', text: resultado }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Codificação URL-Safe**\n\n${error.message}`
        }]
      };
    }
  },

  async executarUrlDecode(args) {
    const { dados_base64, formato_saida = 'texto' } = args;
    
    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para decodificação URL-safe.'
        }]
      };
    }

    const resultados = [];
    
    for (let i = 0; i < dados_base64.length; i++) {
      const urlSafeStr = dados_base64[i];
      
      if (!this.isValidBase64Url(urlSafeStr)) {
        resultados.push(`**${i + 1}.** ❌ Base64 URL-safe inválido: \`${urlSafeStr.substring(0, 50)}${urlSafeStr.length > 50 ? '...' : ''}\``);
        continue;
      }

      try {
        const standardBase64 = this.urlSafeToStandard(urlSafeStr);
        const decoded = Buffer.from(standardBase64, 'base64');
        
        let decodedText;
        switch (formato_saida) {
          case 'hex':
            decodedText = decoded.toString('hex');
            break;
          case 'buffer':
            decodedText = `Buffer(${decoded.length}) [${Array.from(decoded).slice(0, 10).join(', ')}${decoded.length > 10 ? '...' : ''}]`;
            break;
          default:
            decodedText = decoded.toString('utf8');
        }
        
        resultados.push(`**${i + 1}.** ✅ \`${decodedText}\``);
      } catch (error) {
        resultados.push(`**${i + 1}.** ❌ Erro na decodificação: ${error.message}`);
      }
    }

    const texto = `🔓 **Base64 URL-Safe Decode**\n\n` +
      `**Formato de Saída:** ${formato_saida}\n` +
      `**Resultados:**\n\n${resultados.join('\n\n')}\n\n` +
      `✅ **${dados_base64.length} item(s) processado(s)!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async executarValidacao(args) {
    const { dados_base64 } = args;

    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para validação.'
        }]
      };
    }

    const resultados = [];
    let validCount = 0;

    for (let i = 0; i < dados_base64.length; i++) {
      const str = dados_base64[i];
      const analysis = this.analyzeBase64(str);

      if (analysis.isValid) {
        validCount++;
        resultados.push(`**${i + 1}.** ✅ **Válido** (${analysis.type}) - \`${str.substring(0, 50)}${str.length > 50 ? '...' : ''}\``);
      } else {
        resultados.push(`**${i + 1}.** ❌ **Inválido** - \`${str.substring(0, 50)}${str.length > 50 ? '...' : ''}\``);
      }
    }

    const texto = `🔍 **Validação Base64**\n\n` +
      `**Resultados:**\n\n${resultados.join('\n\n')}\n\n` +
      `📊 **Resumo:** ${validCount}/${dados_base64.length} válidos (${((validCount/dados_base64.length)*100).toFixed(1)}%)\n\n` +
      `✅ **Validação concluída!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async executarAnalise(args) {
    const { dados_base64, incluir_estatisticas = true } = args;

    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para análise.'
        }]
      };
    }

    const resultados = [];
    const estatisticas = {
      total: dados_base64.length,
      validos: 0,
      standard: 0,
      urlSafe: 0,
      invalidos: 0,
      totalOriginalBytes: 0,
      totalDecodedBytes: 0
    };

    for (let i = 0; i < dados_base64.length; i++) {
      const str = dados_base64[i];
      const analysis = this.analyzeBase64(str);

      // Atualizar estatísticas
      if (analysis.isValid) {
        estatisticas.validos++;
        if (analysis.type === 'standard') estatisticas.standard++;
        if (analysis.type === 'url-safe') estatisticas.urlSafe++;
        estatisticas.totalDecodedBytes += analysis.decodedSize;
      } else {
        estatisticas.invalidos++;
      }
      estatisticas.totalOriginalBytes += analysis.originalLength;

      let resultado = `**${i + 1}.** `;
      if (analysis.isValid) {
        resultado += `✅ **${analysis.type.toUpperCase()}**\n`;
        resultado += `   📏 Original: ${analysis.originalLength} chars, Decodificado: ${analysis.decodedSize} bytes\n`;
        resultado += `   📊 Eficiência: ${analysis.efficiency}, Padding: ${analysis.paddingChars} chars\n`;
        if (analysis.hasLineBreaks) resultado += `   📝 Contém quebras de linha\n`;
        resultado += `   💾 \`${str.substring(0, 60)}${str.length > 60 ? '...' : ''}\``;
      } else {
        resultado += `❌ **INVÁLIDO**\n`;
        resultado += `   💾 \`${str.substring(0, 60)}${str.length > 60 ? '...' : ''}\``;
      }

      resultados.push(resultado);
    }

    let texto = `📊 **Análise Base64**\n\n${resultados.join('\n\n')}`;

    if (incluir_estatisticas) {
      const eficienciaGeral = estatisticas.totalOriginalBytes > 0 ?
        ((estatisticas.totalDecodedBytes / estatisticas.totalOriginalBytes) * 100).toFixed(2) + '%' : '0%';

      texto += `\n\n📈 **Estatísticas Gerais:**\n` +
        `• **Total:** ${estatisticas.total} itens\n` +
        `• **Válidos:** ${estatisticas.validos} (${((estatisticas.validos/estatisticas.total)*100).toFixed(1)}%)\n` +
        `• **Standard:** ${estatisticas.standard} itens\n` +
        `• **URL-Safe:** ${estatisticas.urlSafe} itens\n` +
        `• **Inválidos:** ${estatisticas.invalidos} itens\n` +
        `• **Bytes Originais:** ${estatisticas.totalOriginalBytes}\n` +
        `• **Bytes Decodificados:** ${estatisticas.totalDecodedBytes}\n` +
        `• **Eficiência Geral:** ${eficienciaGeral}`;
    }

    texto += `\n\n✅ **Análise concluída!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async executarFormatacao(args) {
    const { dados_base64, quebrar_linhas = true, largura_linha = 76 } = args;

    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para formatação.'
        }]
      };
    }

    const resultados = [];

    for (let i = 0; i < dados_base64.length; i++) {
      const str = dados_base64[i];
      const analysis = this.analyzeBase64(str);

      if (!analysis.isValid) {
        resultados.push(`**${i + 1}.** ❌ Base64 inválido - não é possível formatar`);
        continue;
      }

      const cleaned = str.replace(/[\r\n\s]/g, '');
      let formatted;

      if (quebrar_linhas) {
        formatted = this.formatWithLineBreaks(cleaned, largura_linha);
      } else {
        formatted = cleaned;
      }

      resultados.push(`**${i + 1}.** ✅ **Formatado** (${analysis.type})\n\`\`\`\n${formatted}\n\`\`\``);
    }

    const texto = `🎨 **Formatação Base64**\n\n` +
      `**Configuração:** ${quebrar_linhas ? `Quebras de linha a cada ${largura_linha} caracteres` : 'Sem quebras de linha'}\n\n` +
      `${resultados.join('\n\n')}\n\n` +
      `✅ **${dados_base64.length} item(s) formatado(s)!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async executarDeteccao(args) {
    const { dados_base64 } = args;

    if (!dados_base64 || dados_base64.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_base64` é obrigatório para detecção.'
        }]
      };
    }

    const resultados = [];
    const contadores = { standard: 0, 'url-safe': 0, invalid: 0 };

    for (let i = 0; i < dados_base64.length; i++) {
      const str = dados_base64[i];
      const tipo = this.detectBase64Type(str);
      contadores[tipo]++;

      let icone, descricao;
      switch (tipo) {
        case 'standard':
          icone = '🔤';
          descricao = 'Base64 Padrão (RFC 4648)';
          break;
        case 'url-safe':
          icone = '🔗';
          descricao = 'Base64 URL-Safe (RFC 4648)';
          break;
        default:
          icone = '❌';
          descricao = 'Formato inválido';
      }

      resultados.push(`**${i + 1}.** ${icone} **${descricao}**\n   💾 \`${str.substring(0, 60)}${str.length > 60 ? '...' : ''}\``);
    }

    const texto = `🔍 **Detecção de Tipo Base64**\n\n` +
      `${resultados.join('\n\n')}\n\n` +
      `📊 **Resumo:**\n` +
      `• **Standard:** ${contadores.standard} itens\n` +
      `• **URL-Safe:** ${contadores['url-safe']} itens\n` +
      `• **Inválidos:** ${contadores.invalid} itens\n\n` +
      `✅ **Detecção concluída!**`;

    return {
      content: [{ type: 'text', text: texto }]
    };
  },

  async execute(args) {
    try {
      const { operacao } = args;

      switch (operacao) {
        case 'encode':
          return this.executarEncode(args);
        case 'decode':
          return this.executarDecode(args);
        case 'url_encode':
          return this.executarUrlEncode(args);
        case 'url_decode':
          return this.executarUrlDecode(args);
        case 'validar':
          return this.executarValidacao(args);
        case 'analisar':
          return this.executarAnalise(args);
        case 'formatar':
          return this.executarFormatacao(args);
        case 'detectar':
          return this.executarDeteccao(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: encode, decode, url_encode, url_decode, validar, analisar, formatar, detectar`
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

module.exports = base64UtilsTool;
