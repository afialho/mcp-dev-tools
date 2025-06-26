const xml2js = require('xml2js');
const { create } = require('xmlbuilder2');

const xmlUtilsTool = {
  name: 'xml_utils_dev-tools',
  description: 'Utilitários completos para XML: formatar, minificar, validar, converter, extrair, analisar e manipular dados XML',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['formatar', 'minificar', 'validar', 'converter', 'extrair', 'analisar', 'escapar', 'comparar', 'gerar_schema'],
        description: 'Operação: formatar XML, minificar, validar estrutura, converter XML↔JSON, extrair valores, analisar estrutura, escapar caracteres, comparar XMLs ou gerar schema'
      },
      xml_string: {
        type: 'string',
        description: 'String XML para processar (obrigatório para maioria das operações)'
      },
      indentacao: {
        type: 'number',
        minimum: 2,
        maximum: 8,
        default: 2,
        description: 'Número de espaços para indentação na formatação'
      },
      formato_destino: {
        type: 'string',
        enum: ['json', 'xml'],
        default: 'json',
        description: 'Formato de destino para conversão'
      },
      dados_json: {
        type: 'string',
        description: 'String JSON para converter para XML (apenas para conversão JSON→XML)'
      },
      xpath: {
        type: 'string',
        description: 'Expressão XPath simplificada para extração (ex: //elemento, //elemento/@atributo)'
      },
      incluir_estatisticas: {
        type: 'boolean',
        default: false,
        description: 'Incluir estatísticas detalhadas na análise'
      },
      xml_comparacao: {
        type: 'string',
        description: 'Segundo XML para comparação (apenas para operação comparar)'
      },
      preservar_espacos: {
        type: 'boolean',
        default: false,
        description: 'Preservar espaços em branco significativos na formatação'
      },
      incluir_declaracao: {
        type: 'boolean',
        default: true,
        description: 'Incluir declaração XML (<?xml version="1.0"?>) na formatação'
      },
      texto_para_escapar: {
        type: 'string',
        description: 'Texto para escapar/desescapar caracteres XML (apenas para operação escapar)'
      },
      tipo_escape: {
        type: 'string',
        enum: ['escapar', 'desescapar'],
        default: 'escapar',
        description: 'Tipo de operação de escape (apenas para operação escapar)'
      },
      elemento_raiz: {
        type: 'string',
        default: 'root',
        description: 'Nome do elemento raiz para conversão JSON→XML'
      }
    },
    required: ['operacao']
  },

  async execute(args) {
    try {
      const { operacao } = args;

      switch (operacao) {
        case 'formatar':
          return this.executarFormatacao(args);
        case 'minificar':
          return this.executarMinificacao(args);
        case 'validar':
          return this.executarValidacao(args);
        case 'converter':
          return this.executarConversao(args);
        case 'extrair':
          return this.executarExtracao(args);
        case 'analisar':
          return this.executarAnalise(args);
        case 'escapar':
          return this.executarEscape(args);
        case 'comparar':
          return this.executarComparacao(args);
        case 'gerar_schema':
          return this.executarGeracaoSchema(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: formatar, minificar, validar, converter, extrair, analisar, escapar, comparar, gerar_schema`
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

  async executarFormatacao(args) {
    const { xml_string, indentacao = 2, incluir_declaracao = true, preservar_espacos = false } = args;

    if (!xml_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para formatação.'
        }]
      };
    }

    try {
      // Parse do XML com configuração mais simples
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: !preservar_espacos
      });

      const result = await parser.parseStringPromise(xml_string);

      // Rebuild com formatação
      const builder = new xml2js.Builder({
        renderOpts: {
          pretty: true,
          indent: ' '.repeat(indentacao),
          newline: '\n'
        },
        xmldec: incluir_declaracao ? { version: '1.0', encoding: 'UTF-8' } : false
      });

      const xmlFormatado = builder.buildObject(result);

      const resultado = `✅ **XML Formatado**\n\n` +
        `**Indentação:** ${indentacao} espaços\n` +
        `**Declaração XML:** ${incluir_declaracao ? 'Incluída' : 'Omitida'}\n` +
        `**Preservar Espaços:** ${preservar_espacos ? 'Sim' : 'Não'}\n\n` +
        `\`\`\`xml\n${xmlFormatado}\n\`\`\``;

      // Auto-display para XML formatado
      return {
        content: [
          { type: 'text', text: resultado },
          { type: 'text', text: `\`\`\`xml\n${xmlFormatado}\n\`\`\`` }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Formatação**\n\n**Erro:** ${error.message}\n\n**Dica:** Verifique se o XML está bem formado.`
        }]
      };
    }
  },

  async executarMinificacao(args) {
    const { xml_string } = args;

    if (!xml_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para minificação.'
        }]
      };
    }

    try {
      // Parse e rebuild sem formatação
      const parser = new xml2js.Parser({
        trim: true,
        ignoreAttrs: false,
        explicitArray: false
      });

      const result = await parser.parseStringPromise(xml_string);
      
      const builder = new xml2js.Builder({
        renderOpts: { pretty: false },
        xmldec: null,
        headless: true
      });

      const xmlMinificado = builder.buildObject(result);
      
      const tamanhoOriginal = xml_string.length;
      const tamanhoMinificado = xmlMinificado.length;
      const reducao = ((tamanhoOriginal - tamanhoMinificado) / tamanhoOriginal * 100).toFixed(1);

      const resultado = `🗜️ **XML Minificado**\n\n` +
        `**Tamanho Original:** ${tamanhoOriginal} caracteres\n` +
        `**Tamanho Minificado:** ${tamanhoMinificado} caracteres\n` +
        `**Redução:** ${reducao}%\n\n` +
        `\`\`\`xml\n${xmlMinificado}\n\`\`\``;

      return {
        content: [
          { type: 'text', text: resultado },
          { type: 'text', text: `\`\`\`xml\n${xmlMinificado}\n\`\`\`` }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Minificação**\n\n**Erro:** ${error.message}\n\n**Dica:** Verifique se o XML está bem formado.`
        }]
      };
    }
  },

  async executarValidacao(args) {
    const { xml_string } = args;

    if (!xml_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para validação.'
        }]
      };
    }

    try {
      const parser = new xml2js.Parser({
        strict: true,
        trim: true
      });

      await parser.parseStringPromise(xml_string);

      // Análise adicional
      const analise = this.analisarEstrutura(xml_string);

      const resultado = `✅ **XML Válido**\n\n` +
        `**Status:** Sintaxe correta e bem formado\n` +
        `**Elementos:** ${analise.totalElementos}\n` +
        `**Atributos:** ${analise.totalAtributos}\n` +
        `**Profundidade:** ${analise.profundidadeMaxima} níveis\n` +
        `**Tamanho:** ${xml_string.length} caracteres\n\n` +
        `✅ **Validação concluída com sucesso!**`;

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      const resultado = `❌ **XML Inválido**\n\n` +
        `**Erro:** ${error.message}\n\n` +
        `**Dicas para Correção:**\n` +
        `- Verifique se todas as tags estão fechadas\n` +
        `- Confirme se os atributos estão entre aspas\n` +
        `- Verifique caracteres especiais não escapados\n` +
        `- Confirme se há apenas um elemento raiz`;

      return {
        content: [{ type: 'text', text: resultado }]
      };
    }
  },

  async executarConversao(args) {
    const { xml_string, dados_json, formato_destino = 'json', elemento_raiz = 'root' } = args;

    if (formato_destino === 'json') {
      // XML → JSON
      if (!xml_string) {
        return {
          content: [{
            type: 'text',
            text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para conversão XML→JSON.'
          }]
        };
      }

      try {
        const parser = new xml2js.Parser({
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          trim: true
        });

        const result = await parser.parseStringPromise(xml_string);
        const jsonString = JSON.stringify(result, null, 2);

        const resultado = `🔄 **XML Convertido para JSON**\n\n` +
          `**Formato Destino:** JSON\n` +
          `**Preservação:** Atributos e estrutura mantidos\n\n` +
          `\`\`\`json\n${jsonString}\n\`\`\``;

        return {
          content: [
            { type: 'text', text: resultado },
            { type: 'text', text: `\`\`\`json\n${jsonString}\n\`\`\`` }
          ]
        };

      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Erro na Conversão XML→JSON**\n\n**Erro:** ${error.message}`
          }]
        };
      }

    } else {
      // JSON → XML
      if (!dados_json) {
        return {
          content: [{
            type: 'text',
            text: '❌ **Erro de Parâmetro**\n\nO parâmetro `dados_json` é obrigatório para conversão JSON→XML.'
          }]
        };
      }

      try {
        const jsonObj = JSON.parse(dados_json);

        const builder = new xml2js.Builder({
          rootName: elemento_raiz,
          renderOpts: {
            pretty: true,
            indent: '  ',
            newline: '\n'
          },
          xmldec: { version: '1.0', encoding: 'UTF-8' }
        });

        const xmlResult = builder.buildObject(jsonObj);

        const resultado = `🔄 **JSON Convertido para XML**\n\n` +
          `**Elemento Raiz:** ${elemento_raiz}\n` +
          `**Formatação:** Indentada e legível\n\n` +
          `\`\`\`xml\n${xmlResult}\n\`\`\``;

        return {
          content: [
            { type: 'text', text: resultado },
            { type: 'text', text: `\`\`\`xml\n${xmlResult}\n\`\`\`` }
          ]
        };

      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Erro na Conversão JSON→XML**\n\n**Erro:** ${error.message}`
          }]
        };
      }
    }
  },

  async executarExtracao(args) {
    const { xml_string, xpath } = args;

    if (!xml_string || !xpath) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetros**\n\nOs parâmetros `xml_string` e `xpath` são obrigatórios para extração.'
        }]
      };
    }

    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: true
      });

      const result = await parser.parseStringPromise(xml_string);
      const valores = this.extrairComXPath(result, xpath);

      let resultado = `🔍 **Valores Extraídos**\n\n`;
      resultado += `**XPath:** \`${xpath}\`\n`;
      resultado += `**Resultados encontrados:** ${valores.length}\n\n`;

      if (valores.length > 0) {
        resultado += `\`\`\`json\n${JSON.stringify(valores, null, 2)}\n\`\`\``;
      } else {
        resultado += `❌ Nenhum valor encontrado para o XPath especificado.`;
      }

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Extração**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarAnalise(args) {
    const { xml_string, incluir_estatisticas = false } = args;

    if (!xml_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para análise.'
        }]
      };
    }

    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: true
      });

      const result = await parser.parseStringPromise(xml_string);
      const analise = this.analisarEstruturaCompleta(xml_string, result);

      let resultado = `📊 **Análise Estrutural do XML**\n\n`;
      resultado += `**Elementos:** ${analise.totalElementos}\n`;
      resultado += `**Atributos:** ${analise.totalAtributos}\n`;
      resultado += `**Profundidade Máxima:** ${analise.profundidadeMaxima} níveis\n`;
      resultado += `**Tamanho Total:** ${xml_string.length} caracteres\n`;
      resultado += `**Namespaces:** ${analise.namespaces.length}\n`;

      if (incluir_estatisticas) {
        resultado += `\n**📈 Estatísticas Detalhadas:**\n`;
        resultado += `- Comentários: ${analise.comentarios}\n`;
        resultado += `- Instruções de processamento: ${analise.processamento}\n`;
        resultado += `- Seções CDATA: ${analise.cdata}\n`;
        resultado += `- Elementos únicos: ${analise.elementosUnicos.length}\n`;
        resultado += `- Atributos únicos: ${analise.atributosUnicos.length}\n`;

        if (analise.elementosUnicos.length > 0) {
          resultado += `\n**Elementos encontrados:** ${analise.elementosUnicos.join(', ')}\n`;
        }
      }

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Análise**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarEscape(args) {
    const { texto_para_escapar, tipo_escape = 'escapar' } = args;

    if (!texto_para_escapar) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `texto_para_escapar` é obrigatório para escape.'
        }]
      };
    }

    try {
      let resultado;
      let textoProcessado;

      if (tipo_escape === 'escapar') {
        textoProcessado = this.escaparXml(texto_para_escapar);
        resultado = `🔒 **Caracteres XML Escapados**\n\n` +
          `**Texto Original:** \`${texto_para_escapar}\`\n` +
          `**Texto Escapado:** \`${textoProcessado}\`\n\n` +
          `**Transformações realizadas:**\n` +
          `- & → &amp;\n` +
          `- < → &lt;\n` +
          `- > → &gt;\n` +
          `- " → &quot;\n` +
          `- ' → &apos;\n\n` +
          `✅ **Escape realizado com sucesso!**`;
      } else {
        textoProcessado = this.desescaparXml(texto_para_escapar);
        resultado = `🔓 **Caracteres XML Desescapados**\n\n` +
          `**Texto Original:** \`${texto_para_escapar}\`\n` +
          `**Texto Desescapado:** \`${textoProcessado}\`\n\n` +
          `**Transformações realizadas:**\n` +
          `- &amp; → &\n` +
          `- &lt; → <\n` +
          `- &gt; → >\n` +
          `- &quot; → "\n` +
          `- &apos; → '\n\n` +
          `✅ **Desescape realizado com sucesso!**`;
      }

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro no Escape**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarComparacao(args) {
    const { xml_string, xml_comparacao } = args;

    if (!xml_string || !xml_comparacao) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetros**\n\nOs parâmetros `xml_string` e `xml_comparacao` são obrigatórios para comparação.'
        }]
      };
    }

    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: true
      });

      const xml1 = await parser.parseStringPromise(xml_string);
      const xml2 = await parser.parseStringPromise(xml_comparacao);

      const comparacao = this.compararObjetos(xml1, xml2);

      let resultado = `🔍 **Comparação de XMLs**\n\n`;

      if (comparacao.identicos) {
        resultado += `✅ **XMLs são estruturalmente idênticos**\n\n`;
        resultado += `**Elementos:** ${comparacao.estatisticas.elementos}\n`;
        resultado += `**Atributos:** ${comparacao.estatisticas.atributos}\n`;
      } else {
        resultado += `❌ **XMLs são diferentes**\n\n`;
        resultado += `**Diferenças encontradas:** ${comparacao.diferencas.length}\n\n`;

        if (comparacao.diferencas.length > 0) {
          resultado += `**Detalhes das diferenças:**\n`;
          comparacao.diferencas.slice(0, 5).forEach((diff, index) => {
            resultado += `${index + 1}. ${diff}\n`;
          });

          if (comparacao.diferencas.length > 5) {
            resultado += `... e mais ${comparacao.diferencas.length - 5} diferenças\n`;
          }
        }
      }

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Comparação**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarGeracaoSchema(args) {
    const { xml_string } = args;

    if (!xml_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `xml_string` é obrigatório para geração de schema.'
        }]
      };
    }

    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: true
      });

      const result = await parser.parseStringPromise(xml_string);
      const schema = this.gerarXsdBasico(result);

      const resultado = `📋 **Schema XSD Gerado**\n\n` +
        `**Baseado em:** Estrutura do XML fornecido\n` +
        `**Tipo:** XSD básico com inferência de tipos\n\n` +
        `\`\`\`xml\n${schema}\n\`\`\``;

      return {
        content: [
          { type: 'text', text: resultado },
          { type: 'text', text: `\`\`\`xml\n${schema}\n\`\`\`` }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Geração de Schema**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  // Métodos auxiliares
  analisarEstrutura(xmlString) {
    const elementos = (xmlString.match(/<[^\/!?][^>]*>/g) || []).length;
    const atributos = (xmlString.match(/\s+\w+\s*=\s*["'][^"']*["']/g) || []).length;

    let profundidade = 0;
    let maxProfundidade = 0;

    for (let i = 0; i < xmlString.length; i++) {
      if (xmlString[i] === '<') {
        if (xmlString[i + 1] === '/') {
          profundidade--;
        } else if (xmlString[i + 1] !== '!' && xmlString[i + 1] !== '?') {
          profundidade++;
          maxProfundidade = Math.max(maxProfundidade, profundidade);
        }
      }
    }

    return {
      totalElementos: elementos,
      totalAtributos: atributos,
      profundidadeMaxima: maxProfundidade
    };
  },

  analisarEstruturaCompleta(xmlString, parsedXml) {
    const analiseBasica = this.analisarEstrutura(xmlString);

    // Análise adicional
    const comentarios = (xmlString.match(/<!--[\s\S]*?-->/g) || []).length;
    const processamento = (xmlString.match(/<\?[\s\S]*?\?>/g) || []).length;
    const cdata = (xmlString.match(/<!\[CDATA\[[\s\S]*?\]\]>/g) || []).length;

    // Extrair namespaces
    const namespaces = [...new Set((xmlString.match(/xmlns:?\w*\s*=/g) || []).map(ns => ns.replace(/xmlns:?|=/g, '').trim()))];

    // Elementos e atributos únicos
    const elementosUnicos = [...new Set((xmlString.match(/<(\w+)/g) || []).map(tag => tag.substring(1)))];
    const atributosUnicos = [...new Set((xmlString.match(/\s+(\w+)\s*=/g) || []).map(attr => attr.trim().replace('=', '')))];

    return {
      ...analiseBasica,
      comentarios,
      processamento,
      cdata,
      namespaces,
      elementosUnicos,
      atributosUnicos
    };
  },

  extrairComXPath(obj, xpath) {
    // XPath simplificado - suporte básico para //elemento e //elemento/@atributo
    const resultados = [];

    if (xpath.startsWith('//')) {
      const path = xpath.substring(2);

      if (path.includes('/@')) {
        // Extração de atributo
        const [elemento, atributo] = path.split('/@');
        this.buscarElementoAtributo(obj, elemento, atributo, resultados);
      } else {
        // Extração de elemento
        this.buscarElemento(obj, path, resultados);
      }
    }

    return resultados;
  },

  buscarElemento(obj, elemento, resultados, caminho = '') {
    if (typeof obj !== 'object' || obj === null) return;

    for (const [chave, valor] of Object.entries(obj)) {
      const novoCaminho = caminho ? `${caminho}.${chave}` : chave;

      if (chave === elemento) {
        resultados.push({ caminho: novoCaminho, valor });
      }

      if (typeof valor === 'object') {
        this.buscarElemento(valor, elemento, resultados, novoCaminho);
      }
    }
  },

  buscarElementoAtributo(obj, elemento, atributo, resultados, caminho = '') {
    if (typeof obj !== 'object' || obj === null) return;

    for (const [chave, valor] of Object.entries(obj)) {
      const novoCaminho = caminho ? `${caminho}.${chave}` : chave;

      if (chave === elemento && typeof valor === 'object' && valor.$) {
        if (valor.$[atributo] !== undefined) {
          resultados.push({
            caminho: `${novoCaminho}@${atributo}`,
            valor: valor.$[atributo]
          });
        }
      }

      if (typeof valor === 'object') {
        this.buscarElementoAtributo(valor, elemento, atributo, resultados, novoCaminho);
      }
    }
  },

  escaparXml(texto) {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  desescaparXml(texto) {
    return texto
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  },

  compararObjetos(obj1, obj2, caminho = '') {
    const diferencas = [];
    let identicos = true;

    // Comparar chaves
    const chaves1 = Object.keys(obj1 || {});
    const chaves2 = Object.keys(obj2 || {});
    const todasChaves = [...new Set([...chaves1, ...chaves2])];

    for (const chave of todasChaves) {
      const novoCaminho = caminho ? `${caminho}.${chave}` : chave;

      if (!(chave in obj1)) {
        diferencas.push(`Elemento ausente no XML1: ${novoCaminho}`);
        identicos = false;
      } else if (!(chave in obj2)) {
        diferencas.push(`Elemento ausente no XML2: ${novoCaminho}`);
        identicos = false;
      } else {
        const valor1 = obj1[chave];
        const valor2 = obj2[chave];

        if (typeof valor1 !== typeof valor2) {
          diferencas.push(`Tipo diferente em ${novoCaminho}: ${typeof valor1} vs ${typeof valor2}`);
          identicos = false;
        } else if (typeof valor1 === 'object' && valor1 !== null) {
          const subComparacao = this.compararObjetos(valor1, valor2, novoCaminho);
          if (!subComparacao.identicos) {
            diferencas.push(...subComparacao.diferencas);
            identicos = false;
          }
        } else if (valor1 !== valor2) {
          diferencas.push(`Valor diferente em ${novoCaminho}: "${valor1}" vs "${valor2}"`);
          identicos = false;
        }
      }
    }

    return {
      identicos,
      diferencas,
      estatisticas: {
        elementos: chaves1.length,
        atributos: 0 // Simplificado para esta implementação
      }
    };
  },

  gerarXsdBasico(obj, elementName = 'root') {
    let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xsd += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n\n`;

    // Elemento raiz
    const rootKey = Object.keys(obj)[0];
    xsd += `  <xs:element name="${rootKey}" type="${rootKey}Type"/>\n\n`;

    // Definir tipos
    xsd += this.gerarTipoXsd(obj[rootKey], `${rootKey}Type`, '  ');

    xsd += `</xs:schema>`;

    return xsd;
  },

  gerarTipoXsd(obj, typeName, indent) {
    let xsd = `${indent}<xs:complexType name="${typeName}">\n`;
    xsd += `${indent}  <xs:sequence>\n`;

    if (typeof obj === 'object' && obj !== null) {
      for (const [chave, valor] of Object.entries(obj)) {
        if (chave === '$') continue; // Pular atributos

        const tipo = this.inferirTipoXsd(valor);
        if (tipo === 'complexType') {
          xsd += `${indent}    <xs:element name="${chave}" type="${chave}Type"/>\n`;
        } else {
          xsd += `${indent}    <xs:element name="${chave}" type="xs:${tipo}"/>\n`;
        }
      }
    }

    xsd += `${indent}  </xs:sequence>\n`;

    // Adicionar atributos se existirem
    if (obj && obj.$) {
      for (const [attrName] of Object.entries(obj.$)) {
        xsd += `${indent}  <xs:attribute name="${attrName}" type="xs:string"/>\n`;
      }
    }

    xsd += `${indent}</xs:complexType>\n\n`;

    // Gerar tipos complexos aninhados
    if (typeof obj === 'object' && obj !== null) {
      for (const [chave, valor] of Object.entries(obj)) {
        if (chave === '$') continue;
        if (typeof valor === 'object' && valor !== null) {
          xsd += this.gerarTipoXsd(valor, `${chave}Type`, indent);
        }
      }
    }

    return xsd;
  },

  inferirTipoXsd(valor) {
    if (typeof valor === 'object' && valor !== null) {
      return 'complexType';
    } else if (typeof valor === 'number') {
      return Number.isInteger(valor) ? 'int' : 'decimal';
    } else if (typeof valor === 'boolean') {
      return 'boolean';
    } else {
      return 'string';
    }
  }
};

module.exports = xmlUtilsTool;
