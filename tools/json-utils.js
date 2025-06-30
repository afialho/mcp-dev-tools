const jsonUtilsTool = {
  name: 'json_utils_dev-tools',
  description: 'Utilitários completos para JSON: gerar, validar, converter, formatar, analisar e manipular dados JSON',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        description: 'Operação: formatar JSON, validar estrutura, converter dados para JSON, analisar conteúdo, extrair valores ou comparar JSONs',
        enum: ['formatar', 'validar', 'converter', 'analisar', 'extrair', 'comparar', 'gerar_schema', 'minificar', 'gerar', 'criar']
      },
      
      json_string: {
        type: 'string',
        description: 'String JSON para formatar/validar (não usado em converter)'
      },
      indentacao: {
        type: 'number',
        description: 'Número de espaços para indentação (2-8)',
        minimum: 2,
        maximum: 8,
        default: 2
      },
      ordenar_chaves: {
        type: 'boolean',
        description: 'Ordenar chaves alfabeticamente',
        default: false
      },
      
      dados_entrada: {
        description: 'Dados para converter para JSON (objeto, array, string, etc.)'
      },
      formato_origem: {
        type: 'string',
        description: 'Formato dos dados de entrada',
        enum: ['objeto', 'array', 'csv', 'xml', 'yaml', 'auto'],
        default: 'auto'
      },
      estrutura_personalizada: {
        type: 'object',
        description: 'Estrutura personalizada para organizar os dados convertidos'
      },
      
      schema: {
        type: 'object',
        description: 'JSON Schema para validação (apenas para operação validar)'
      },
      
      jsonpath: {
        type: 'string',
        description: 'Expressão JSONPath para extrair valores específicos'
      },
      incluir_estatisticas: {
        type: 'boolean',
        description: 'Incluir estatísticas na análise (contagem de propriedades, tipos, etc.)',
        default: false
      },
      
      json_comparacao: {
        type: 'string',
        description: 'Segundo JSON para comparação (apenas para operação comparar)'
      },
      
      jsons: {
        type: 'array',
        description: 'Array de strings JSON para operações em lote',
        items: { type: 'string' },
        maxItems: 50
      },
      
      incluir_tipos: {
        type: 'boolean',
        description: 'Incluir informações de tipos na análise',
        default: false
      },
      formato_saida: {
        type: 'string',
        description: 'Formato de saída do resultado',
        enum: ['json', 'texto', 'tabela'],
        default: 'json'
      }
    },
    required: ['operacao']
  },
  
  async execute(args) {
    const {
      operacao,
      json_string,
      indentacao = 2,
      ordenar_chaves = false,
      dados_entrada,
      formato_origem = 'auto',
      estrutura_personalizada,
      schema,
      jsonpath,
      incluir_estatisticas = false,
      json_comparacao,
      jsons,
      incluir_tipos = false,
      formato_saida = 'json'
    } = args;

    try {
      let resultado;
      
      switch (operacao) {
        case 'formatar':
          resultado = await this.formatarJson(json_string, indentacao, ordenar_chaves);
          break;
          
        case 'validar':
          resultado = await this.validarJson(json_string, schema);
          break;
          
        case 'converter':
          resultado = await this.converterParaJson(dados_entrada, formato_origem, estrutura_personalizada, indentacao, ordenar_chaves);
          break;
          
        case 'analisar':
          resultado = await this.analisarJson(json_string, incluir_estatisticas, incluir_tipos);
          break;
          
        case 'extrair':
          resultado = await this.extrairValores(json_string, jsonpath);
          break;
          
        case 'comparar':
          resultado = await this.compararJsons(json_string, json_comparacao);
          break;
          
        case 'gerar_schema':
          resultado = await this.gerarSchema(json_string);
          break;
          
        case 'minificar':
          resultado = await this.minificarJson(json_string);
          break;
          
        default:
          throw new Error(`Operação '${operacao}' não suportada`);
      }
      
      const respostaContent = [
        {
          type: 'text',
          text: resultado
        }
      ];

      const jsonMarkdown = this.extrairJsonParaMarkdown(resultado, operacao);
      if (jsonMarkdown) {
        respostaContent.push({
          type: 'text',
          text: jsonMarkdown
        });
      }

      return {
        content: respostaContent
      };
      
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Erro na operação '${operacao}'**\n\n**Erro:** ${error.message}\n\n**Dica:** Verifique se os parâmetros estão corretos para a operação selecionada.`
          }
        ]
      };
    }
  },

  async formatarJson(jsonString, indentacao, ordenarChaves) {
    const jsonObj = JSON.parse(jsonString);
    
    let jsonFormatado;
    if (ordenarChaves) {
      jsonFormatado = JSON.stringify(this.ordenarChavesRecursivo(jsonObj), null, indentacao);
    } else {
      jsonFormatado = JSON.stringify(jsonObj, null, indentacao);
    }
    
    return `✅ **JSON Formatado**\n\n\`\`\`json\n${jsonFormatado}\n\`\`\``;
  },

  async validarJson(jsonString, schema) {
    try {
      const jsonObj = JSON.parse(jsonString);
      
      let resultado = '✅ **JSON Válido**\n\n';
      resultado += `**Tipo:** ${Array.isArray(jsonObj) ? 'Array' : typeof jsonObj}\n`;
      resultado += `**Tamanho:** ${JSON.stringify(jsonObj).length} caracteres\n`;
      
      if (Array.isArray(jsonObj)) {
        resultado += `**Elementos:** ${jsonObj.length}\n`;
      } else if (typeof jsonObj === 'object' && jsonObj !== null) {
        resultado += `**Propriedades:** ${Object.keys(jsonObj).length}\n`;
      }
      
      if (schema) {
        const validacao = this.validarComSchema(jsonObj, schema);
        resultado += `\n**Validação com Schema:** ${validacao.valido ? '✅ Válido' : '❌ Inválido'}\n`;
        if (!validacao.valido) {
          resultado += `**Erros:** ${validacao.erros.join(', ')}\n`;
        }
      }
      
      return resultado;
      
    } catch (error) {
      return `❌ **JSON Inválido**\n\n**Erro:** ${error.message}\n\n**Posição:** ${this.encontrarPosicaoErro(error.message)}\n\n**String recebida:**\n\`\`\`\n${jsonString.substring(0, 200)}${jsonString.length > 200 ? '...' : ''}\n\`\`\``;
    }
  },

  async converterParaJson(dados, formatoOrigem, estruturaPersonalizada, indentacao, ordenarChaves) {
    let dadosConvertidos;

    if (estruturaPersonalizada) {
      dadosConvertidos = estruturaPersonalizada;
      dadosConvertidos = this.substituirPlaceholders(dadosConvertidos, dados);
    } else {
      if (typeof dados === 'string') {
        try {
          dadosConvertidos = JSON.parse(dados);
        } catch {
          dadosConvertidos = { valor: dados };
        }
      } else {
        dadosConvertidos = dados;
      }
    }

    let jsonFormatado;
    if (ordenarChaves) {
      jsonFormatado = JSON.stringify(this.ordenarChavesRecursivo(dadosConvertidos), null, indentacao);
    } else {
      jsonFormatado = JSON.stringify(dadosConvertidos, null, indentacao);
    }

    return `✅ **Dados Convertidos para JSON**\n\n\`\`\`json\n${jsonFormatado}\n\`\`\``;
  },

  async analisarJson(jsonString, incluirEstatisticas, incluirTipos) {
    const jsonObj = JSON.parse(jsonString);

    let resultado = '📊 **Análise do JSON**\n\n';

    const analise = this.analisarObjetoRecursivo(jsonObj);

    resultado += `**Tipo Principal:** ${Array.isArray(jsonObj) ? 'Array' : typeof jsonObj}\n`;
    resultado += `**Tamanho Total:** ${JSON.stringify(jsonObj).length} caracteres\n`;

    if (incluirEstatisticas) {
      resultado += `\n**📈 Estatísticas:**\n`;
      resultado += `- Total de propriedades: ${analise.totalPropriedades}\n`;
      resultado += `- Profundidade máxima: ${analise.profundidadeMaxima}\n`;
      resultado += `- Arrays encontrados: ${analise.totalArrays}\n`;
      resultado += `- Objetos encontrados: ${analise.totalObjetos}\n`;
    }

    if (incluirTipos) {
      resultado += `\n**🏷️ Tipos Encontrados:**\n`;
      Object.entries(analise.tipos).forEach(([tipo, quantidade]) => {
        resultado += `- ${tipo}: ${quantidade}\n`;
      });
    }

    return resultado;
  },

  async extrairValores(jsonString, jsonpath) {
    const jsonObj = JSON.parse(jsonString);

    if (!jsonpath) {
      throw new Error('JSONPath é obrigatório para extração');
    }

    const valores = this.extrairComJsonPath(jsonObj, jsonpath);

    let resultado = `🔍 **Valores Extraídos**\n\n`;
    resultado += `**JSONPath:** \`${jsonpath}\`\n`;
    resultado += `**Resultados encontrados:** ${valores.length}\n\n`;

    if (valores.length > 0) {
      resultado += `\`\`\`json\n${JSON.stringify(valores, null, 2)}\n\`\`\``;
    } else {
      resultado += `❌ Nenhum valor encontrado para o caminho especificado.`;
    }

    return resultado;
  },

  async compararJsons(json1, json2) {
    const obj1 = JSON.parse(json1);
    const obj2 = JSON.parse(json2);

    const diferencas = this.encontrarDiferencas(obj1, obj2);

    let resultado = `🔄 **Comparação de JSONs**\n\n`;

    if (diferencas.length === 0) {
      resultado += `✅ **Os JSONs são idênticos**`;
    } else {
      resultado += `❌ **Encontradas ${diferencas.length} diferença(s):**\n\n`;
      diferencas.forEach((diff, index) => {
        resultado += `${index + 1}. **${diff.caminho}**\n`;
        resultado += `   - JSON 1: ${JSON.stringify(diff.valor1)}\n`;
        resultado += `   - JSON 2: ${JSON.stringify(diff.valor2)}\n\n`;
      });
    }

    return resultado;
  },

  async gerarSchema(jsonString) {
    const jsonObj = JSON.parse(jsonString);
    const schema = this.gerarSchemaRecursivo(jsonObj);

    const schemaFormatado = JSON.stringify(schema, null, 2);

    return `📋 **Schema JSON Gerado**\n\n\`\`\`json\n${schemaFormatado}\n\`\`\``;
  },

  async minificarJson(jsonString) {
    const jsonObj = JSON.parse(jsonString);
    const jsonMinificado = JSON.stringify(jsonObj);

    const tamanhoOriginal = jsonString.length;
    const tamanhoMinificado = jsonMinificado.length;
    const reducao = ((tamanhoOriginal - tamanhoMinificado) / tamanhoOriginal * 100).toFixed(1);

    return `🗜️ **JSON Minificado**\n\n**Redução:** ${reducao}% (${tamanhoOriginal} → ${tamanhoMinificado} caracteres)\n\n\`\`\`json\n${jsonMinificado}\n\`\`\``;
  },

  ordenarChavesRecursivo(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.ordenarChavesRecursivo(item));
    } else if (obj !== null && typeof obj === 'object') {
      const chavesOrdenadas = Object.keys(obj).sort();
      const objOrdenado = {};
      chavesOrdenadas.forEach(chave => {
        objOrdenado[chave] = this.ordenarChavesRecursivo(obj[chave]);
      });
      return objOrdenado;
    }
    return obj;
  },

  substituirPlaceholders(estrutura, dados) {
    const estruturaString = JSON.stringify(estrutura);
    const estruturaSubstituida = estruturaString.replace(/"\{\{(\w+)\}\}"/g, (match, chave) => {
      return dados[chave] !== undefined ? JSON.stringify(dados[chave]) : `"${match}"`;
    });
    return JSON.parse(estruturaSubstituida);
  },

  analisarObjetoRecursivo(obj, profundidade = 0) {
    const analise = {
      totalPropriedades: 0,
      profundidadeMaxima: profundidade,
      totalArrays: 0,
      totalObjetos: 0,
      tipos: {}
    };

    if (Array.isArray(obj)) {
      analise.totalArrays++;
      obj.forEach(item => {
        const subAnalise = this.analisarObjetoRecursivo(item, profundidade + 1);
        analise.totalPropriedades += subAnalise.totalPropriedades;
        analise.profundidadeMaxima = Math.max(analise.profundidadeMaxima, subAnalise.profundidadeMaxima);
        analise.totalArrays += subAnalise.totalArrays;
        analise.totalObjetos += subAnalise.totalObjetos;
        Object.entries(subAnalise.tipos).forEach(([tipo, quantidade]) => {
          analise.tipos[tipo] = (analise.tipos[tipo] || 0) + quantidade;
        });
      });
    } else if (obj !== null && typeof obj === 'object') {
      analise.totalObjetos++;
      Object.entries(obj).forEach(([chave, valor]) => {
        analise.totalPropriedades++;
        const tipo = Array.isArray(valor) ? 'array' : typeof valor;
        analise.tipos[tipo] = (analise.tipos[tipo] || 0) + 1;

        const subAnalise = this.analisarObjetoRecursivo(valor, profundidade + 1);
        analise.totalPropriedades += subAnalise.totalPropriedades;
        analise.profundidadeMaxima = Math.max(analise.profundidadeMaxima, subAnalise.profundidadeMaxima);
        analise.totalArrays += subAnalise.totalArrays;
        analise.totalObjetos += subAnalise.totalObjetos;
        Object.entries(subAnalise.tipos).forEach(([tipo, quantidade]) => {
          analise.tipos[tipo] = (analise.tipos[tipo] || 0) + quantidade;
        });
      });
    } else {
      const tipo = typeof obj;
      analise.tipos[tipo] = (analise.tipos[tipo] || 0) + 1;
    }

    return analise;
  },

  extrairComJsonPath(obj, path) {
    const caminhos = path.replace(/^\$\.?/, '').split('.');
    let resultados = [obj];

    for (const caminho of caminhos) {
      const novosResultados = [];

      for (const resultado of resultados) {
        if (caminho === '*') {
          if (Array.isArray(resultado)) {
            novosResultados.push(...resultado);
          } else if (typeof resultado === 'object' && resultado !== null) {
            novosResultados.push(...Object.values(resultado));
          }
        } else if (caminho.includes('[') && caminho.includes(']')) {
          const [propriedade, indice] = caminho.split('[');
          const indiceNumerico = indice.replace(']', '');

          if (resultado && resultado[propriedade]) {
            if (indiceNumerico === '*') {
              novosResultados.push(...resultado[propriedade]);
            } else {
              const idx = parseInt(indiceNumerico);
              if (!isNaN(idx) && resultado[propriedade][idx] !== undefined) {
                novosResultados.push(resultado[propriedade][idx]);
              }
            }
          }
        } else {
          if (resultado && resultado[caminho] !== undefined) {
            novosResultados.push(resultado[caminho]);
          }
        }
      }

      resultados = novosResultados;
    }

    return resultados;
  },

  encontrarDiferencas(obj1, obj2, caminho = '') {
    const diferencas = [];

    if (typeof obj1 !== typeof obj2) {
      diferencas.push({
        caminho: caminho || 'raiz',
        valor1: obj1,
        valor2: obj2
      });
      return diferencas;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      const tamanhoMax = Math.max(obj1.length, obj2.length);
      for (let i = 0; i < tamanhoMax; i++) {
        const novoCaminho = `${caminho}[${i}]`;
        if (i >= obj1.length) {
          diferencas.push({ caminho: novoCaminho, valor1: undefined, valor2: obj2[i] });
        } else if (i >= obj2.length) {
          diferencas.push({ caminho: novoCaminho, valor1: obj1[i], valor2: undefined });
        } else {
          diferencas.push(...this.encontrarDiferencas(obj1[i], obj2[i], novoCaminho));
        }
      }
    } else if (obj1 !== null && obj2 !== null && typeof obj1 === 'object' && typeof obj2 === 'object') {
      const todasChaves = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

      for (const chave of todasChaves) {
        const novoCaminho = caminho ? `${caminho}.${chave}` : chave;
        if (!(chave in obj1)) {
          diferencas.push({ caminho: novoCaminho, valor1: undefined, valor2: obj2[chave] });
        } else if (!(chave in obj2)) {
          diferencas.push({ caminho: novoCaminho, valor1: obj1[chave], valor2: undefined });
        } else {
          diferencas.push(...this.encontrarDiferencas(obj1[chave], obj2[chave], novoCaminho));
        }
      }
    } else if (obj1 !== obj2) {
      diferencas.push({
        caminho: caminho || 'raiz',
        valor1: obj1,
        valor2: obj2
      });
    }

    return diferencas;
  },

  gerarSchemaRecursivo(obj) {
    if (Array.isArray(obj)) {
      const schema = {
        type: 'array',
        items: obj.length > 0 ? this.gerarSchemaRecursivo(obj[0]) : { type: 'string' }
      };
      return schema;
    } else if (obj !== null && typeof obj === 'object') {
      const schema = {
        type: 'object',
        properties: {},
        required: Object.keys(obj)
      };

      Object.entries(obj).forEach(([chave, valor]) => {
        schema.properties[chave] = this.gerarSchemaRecursivo(valor);
      });

      return schema;
    } else {
      return { type: typeof obj };
    }
  },

  validarComSchema(obj, schema) {
    const erros = [];

    if (schema.type && typeof obj !== schema.type) {
      if (!(schema.type === 'array' && Array.isArray(obj))) {
        erros.push(`Tipo esperado: ${schema.type}, recebido: ${typeof obj}`);
      }
    }

    if (schema.properties && typeof obj === 'object' && obj !== null) {
      Object.entries(schema.properties).forEach(([chave, subSchema]) => {
        if (obj[chave] !== undefined) {
          const subValidacao = this.validarComSchema(obj[chave], subSchema);
          erros.push(...subValidacao.erros.map(erro => `${chave}.${erro}`));
        }
      });

      if (schema.required) {
        schema.required.forEach(chaveRequerida => {
          if (obj[chaveRequerida] === undefined) {
            erros.push(`Propriedade obrigatória ausente: ${chaveRequerida}`);
          }
        });
      }
    }

    return {
      valido: erros.length === 0,
      erros
    };
  },

  encontrarPosicaoErro(mensagemErro) {
    const match = mensagemErro.match(/position (\d+)/i);
    if (match) {
      return `Posição ${match[1]}`;
    }
    return 'Posição não identificada';
  },

  extrairJsonParaMarkdown(resultado, operacao) {
    const regexJson = /```json\n([\s\S]*?)\n```/g;
    const matches = [...resultado.matchAll(regexJson)];

    if (matches.length === 0) {
      return null;
    }

    const jsonContent = matches[0][1];

    try {
      JSON.parse(jsonContent);
      return `\`\`\`json\n${jsonContent}\n\`\`\``;
    } catch (error) {
      return null;
    }
  }
};

module.exports = jsonUtilsTool;
