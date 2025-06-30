const cheerio = require('cheerio');
const { minify } = require('html-minifier-terser');
const TurndownService = require('turndown');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const htmlUtilsTool = {
  name: 'html_utils_dev-tools',
  description: 'Utilitários completos para HTML: formatar, minificar, validar, converter, extrair, analisar, sanitizar e manipular dados HTML',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['formatar', 'minificar', 'validar', 'converter', 'escapar', 'extrair', 'analisar', 'otimizar', 'comparar', 'gerar_schema', 'sanitizar', 'gerar'],
        description: 'Operação: formatar HTML, minificar, validar estrutura, converter HTML↔Markdown/Texto, escapar caracteres, extrair elementos, analisar estrutura, otimizar código, comparar HTMLs, gerar schema, sanitizar ou gerar HTML'
      },
      html_string: {
        type: 'string',
        description: 'String HTML para processar (obrigatório para maioria das operações)'
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
        enum: ['markdown', 'texto', 'json'],
        default: 'markdown',
        description: 'Formato de destino para conversão'
      },
      seletor_css: {
        type: 'string',
        description: 'Seletor CSS para extração (ex: div.classe, #id, a, img)'
      },
      incluir_estatisticas: {
        type: 'boolean',
        default: false,
        description: 'Incluir estatísticas detalhadas na análise'
      },
      preservar_comentarios: {
        type: 'boolean',
        default: false,
        description: 'Preservar comentários HTML na minificação'
      },
      nivel_sanitizacao: {
        type: 'string',
        enum: ['basico', 'rigoroso'],
        default: 'basico',
        description: 'Nível de sanitização: básico (remove scripts) ou rigoroso (whitelist restrita)'
      },
      template_tipo: {
        type: 'string',
        enum: ['pagina_basica', 'formulario', 'tabela', 'card', 'lista'],
        default: 'pagina_basica',
        description: 'Tipo de template para geração'
      },
      html_comparacao: {
        type: 'string',
        description: 'Segundo HTML para comparação (apenas para operação comparar)'
      },
      texto_para_escapar: {
        type: 'string',
        description: 'Texto para escapar caracteres HTML (apenas para operação escapar)'
      },
      incluir_seo: {
        type: 'boolean',
        default: false,
        description: 'Incluir análise de SEO na análise'
      },
      incluir_acessibilidade: {
        type: 'boolean',
        default: false,
        description: 'Incluir análise de acessibilidade na análise'
      },
      markdown_string: {
        type: 'string',
        description: 'String Markdown para converter para HTML (apenas para conversão Markdown→HTML)'
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
        case 'escapar':
          return this.executarEscape(args);
        case 'extrair':
          return this.executarExtracao(args);
        case 'analisar':
          return this.executarAnalise(args);
        case 'otimizar':
          return this.executarOtimizacao(args);
        case 'comparar':
          return this.executarComparacao(args);
        case 'gerar_schema':
          return this.executarGeracaoSchema(args);
        case 'sanitizar':
          return this.executarSanitizacao(args);
        case 'gerar':
          return this.executarGeracao(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: formatar, minificar, validar, converter, escapar, extrair, analisar, otimizar, comparar, gerar_schema, sanitizar, gerar`
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
    const { html_string, indentacao = 2 } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para formatação.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string, { 
        decodeEntities: false,
        withStartIndices: false,
        withEndIndices: false
      });

      const htmlFormatado = $.html();
      const linhas = htmlFormatado.split('\n');
      const linhasFormatadas = [];
      let nivelIndentacao = 0;
      const espacos = ' '.repeat(indentacao);

      for (const linha of linhas) {
        const linhaTrimmed = linha.trim();
        if (!linhaTrimmed) continue;

        if (linhaTrimmed.startsWith('</') && !linhaTrimmed.includes('/>')) {
          nivelIndentacao = Math.max(0, nivelIndentacao - 1);
        }

        linhasFormatadas.push(espacos.repeat(nivelIndentacao) + linhaTrimmed);

        if (linhaTrimmed.startsWith('<') &&
            !linhaTrimmed.startsWith('</') &&
            !linhaTrimmed.endsWith('/>') &&
            !this.isInlineTag(linhaTrimmed)) {
          nivelIndentacao++;
        }
      }

      const resultado = linhasFormatadas.join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `🎨 **HTML Formatado**\n\n**Configuração:** ${indentacao} espaços de indentação\n**Tamanho Original:** ${html_string.length} caracteres\n**Tamanho Formatado:** ${resultado.length} caracteres\n\n\`\`\`html\n${resultado}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Formatação**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarMinificacao(args) {
    const { html_string, preservar_comentarios = false } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para minificação.'
        }]
      };
    }

    try {
      const opcoes = {
        collapseWhitespace: true,
        removeComments: !preservar_comentarios,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
        removeEmptyAttributes: true,
        removeOptionalTags: false,
        removeEmptyElements: false
      };

      const htmlMinificado = await minify(html_string, opcoes);
      const reducaoPercentual = ((html_string.length - htmlMinificado.length) / html_string.length * 100).toFixed(1);

      return {
        content: [
          {
            type: 'text',
            text: `🗜️ **HTML Minificado**\n\n**Tamanho Original:** ${html_string.length} caracteres\n**Tamanho Minificado:** ${htmlMinificado.length} caracteres\n**Redução:** ${reducaoPercentual}%\n**Comentários:** ${preservar_comentarios ? 'Preservados' : 'Removidos'}\n\n\`\`\`html\n${htmlMinificado}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Minificação**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarValidacao(args) {
    const { html_string } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para validação.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string);
      const problemas = [];
      const avisos = [];

      this.validarEstrutura($, problemas, avisos);

      this.validarTagsFechadas(html_string, problemas);

      this.validarAtributosObrigatorios($, problemas, avisos);

      const isValido = problemas.length === 0;
      let resultado = `${isValido ? '✅' : '❌'} **Validação HTML**\n\n`;
      resultado += `**Status:** ${isValido ? 'Válido' : 'Inválido'}\n`;
      resultado += `**Problemas:** ${problemas.length}\n`;
      resultado += `**Avisos:** ${avisos.length}\n\n`;

      if (problemas.length > 0) {
        resultado += `**🚨 Problemas Encontrados:**\n`;
        problemas.forEach((problema, index) => {
          resultado += `${index + 1}. ${problema}\n`;
        });
        resultado += '\n';
      }

      if (avisos.length > 0) {
        resultado += `**⚠️ Avisos:**\n`;
        avisos.forEach((aviso, index) => {
          resultado += `${index + 1}. ${aviso}\n`;
        });
      }

      return {
        content: [{ type: 'text', text: resultado }]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Validação**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  isInlineTag(linha) {
    const inlineTags = ['span', 'a', 'strong', 'em', 'b', 'i', 'small', 'code', 'kbd', 'var', 'samp'];
    return inlineTags.some(tag => linha.includes(`<${tag}`));
  },

  validarEstrutura($, problemas, avisos) {
    const html = $.html();
    if (!html.toLowerCase().includes('<!doctype')) {
      avisos.push('DOCTYPE não encontrado');
    }

    if ($('html').length === 0) {
      problemas.push('Tag <html> não encontrada');
    }
    if ($('head').length === 0) {
      avisos.push('Tag <head> não encontrada');
    }
    if ($('body').length === 0) {
      avisos.push('Tag <body> não encontrada');
    }
  },

  validarTagsFechadas(html, problemas) {
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    const tagRegex = /<(\w+)(?:\s[^>]*)?>/g;
    const closeTagRegex = /<\/(\w+)>/g;
    
    const openTags = [];
    const closeTags = [];
    
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      if (!selfClosingTags.includes(tagName)) {
        openTags.push(tagName);
      }
    }
    
    while ((match = closeTagRegex.exec(html)) !== null) {
      closeTags.push(match[1].toLowerCase());
    }
    
    const openCount = {};
    const closeCount = {};
    
    openTags.forEach(tag => {
      openCount[tag] = (openCount[tag] || 0) + 1;
    });
    
    closeTags.forEach(tag => {
      closeCount[tag] = (closeCount[tag] || 0) + 1;
    });
    
    for (const tag in openCount) {
      if ((closeCount[tag] || 0) !== openCount[tag]) {
        problemas.push(`Tag <${tag}> não está balanceada (${openCount[tag]} abertas, ${closeCount[tag] || 0} fechadas)`);
      }
    }
  },

  validarAtributosObrigatorios($, problemas, avisos) {
    $('img').each((i, elem) => {
      if (!$(elem).attr('alt')) {
        avisos.push(`Imagem sem atributo 'alt' encontrada`);
      }
    });

    $('a').each((i, elem) => {
      if (!$(elem).attr('href')) {
        avisos.push(`Link sem atributo 'href' encontrado`);
      }
    });

    $('input[type!="hidden"]').each((i, elem) => {
      const id = $(elem).attr('id');
      if (id && $(`label[for="${id}"]`).length === 0) {
        avisos.push(`Input sem label associado encontrado`);
      }
    });
  },

  async executarConversao(args) {
    const { html_string, markdown_string, formato_destino = 'markdown' } = args;

    if (!html_string && !markdown_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` ou `markdown_string` é obrigatório para conversão.'
        }]
      };
    }

    try {
      let resultado = '';
      let tipoConversao = '';

      if (html_string) {
        switch (formato_destino) {
          case 'markdown':
            const turndownService = new TurndownService({
              headingStyle: 'atx',
              codeBlockStyle: 'fenced'
            });
            resultado = turndownService.turndown(html_string);
            tipoConversao = 'HTML → Markdown';
            break;

          case 'texto':
            const $ = cheerio.load(html_string);
            resultado = $.text().replace(/\s+/g, ' ').trim();
            tipoConversao = 'HTML → Texto';
            break;

          case 'json':
            const $json = cheerio.load(html_string);
            resultado = JSON.stringify(this.htmlParaJson($json), null, 2);
            tipoConversao = 'HTML → JSON';
            break;

          default:
            throw new Error(`Formato de destino '${formato_destino}' não suportado`);
        }
      } else if (markdown_string) {
        resultado = this.markdownParaHtml(markdown_string);
        tipoConversao = 'Markdown → HTML';
      }

      return {
        content: [
          {
            type: 'text',
            text: `🔄 **Conversão ${tipoConversao}**\n\n**Tamanho Original:** ${(html_string || markdown_string).length} caracteres\n**Tamanho Convertido:** ${resultado.length} caracteres\n\n\`\`\`${formato_destino === 'json' ? 'json' : formato_destino === 'markdown' ? 'markdown' : 'html'}\n${resultado}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Conversão**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarEscape(args) {
    const { texto_para_escapar, html_string } = args;

    if (!texto_para_escapar && !html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `texto_para_escapar` ou `html_string` é obrigatório para escape.'
        }]
      };
    }

    try {
      let resultado = '';
      let operacao = '';

      if (texto_para_escapar) {
        resultado = this.escaparHtml(texto_para_escapar);
        operacao = 'Texto → HTML Escapado';
      } else {
        resultado = this.desescaparHtml(html_string);
        operacao = 'HTML → Texto Desescapado';
      }

      return {
        content: [
          {
            type: 'text',
            text: `🔒 **${operacao}**\n\n**Original:**\n\`\`\`\n${texto_para_escapar || html_string}\n\`\`\`\n\n**Resultado:**\n\`\`\`\n${resultado}\n\`\`\``
          }
        ]
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

  async executarExtracao(args) {
    const { html_string, seletor_css } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para extração.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string);
      let resultado = '';

      if (seletor_css) {
        const elementos = $(seletor_css);
        resultado = `🎯 **Extração por Seletor CSS: \`${seletor_css}\`**\n\n`;
        resultado += `**Elementos Encontrados:** ${elementos.length}\n\n`;

        elementos.each((index, elem) => {
          const $elem = $(elem);
          resultado += `**${index + 1}.** \`${$elem.prop('tagName').toLowerCase()}\`\n`;

          const attrs = [];
          if ($elem.attr('id')) attrs.push(`id="${$elem.attr('id')}"`);
          if ($elem.attr('class')) attrs.push(`class="${$elem.attr('class')}"`);
          if ($elem.attr('href')) attrs.push(`href="${$elem.attr('href')}"`);
          if ($elem.attr('src')) attrs.push(`src="${$elem.attr('src')}"`);
          if ($elem.attr('alt')) attrs.push(`alt="${$elem.attr('alt')}"`);

          if (attrs.length > 0) {
            resultado += `   **Atributos:** ${attrs.join(', ')}\n`;
          }

          const texto = $elem.text().trim();
          if (texto && texto.length < 100) {
            resultado += `   **Texto:** ${texto}\n`;
          }
          resultado += '\n';
        });
      } else {
        resultado = this.extrairElementosImportantes($);
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

  htmlParaJson($) {
    const estrutura = {
      title: $('title').text() || null,
      meta: {},
      headings: [],
      links: [],
      images: [],
      elements: {
        total: $('*').length,
        divs: $('div').length,
        paragraphs: $('p').length,
        spans: $('span').length
      }
    };

    $('meta').each((i, elem) => {
      const name = $(elem).attr('name') || $(elem).attr('property');
      const content = $(elem).attr('content');
      if (name && content) {
        estrutura.meta[name] = content;
      }
    });

    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      estrutura.headings.push({
        level: parseInt(elem.tagName.charAt(1)),
        text: $(elem).text().trim()
      });
    });

    $('a[href]').each((i, elem) => {
      estrutura.links.push({
        href: $(elem).attr('href'),
        text: $(elem).text().trim(),
        title: $(elem).attr('title') || null
      });
    });

    $('img').each((i, elem) => {
      estrutura.images.push({
        src: $(elem).attr('src'),
        alt: $(elem).attr('alt') || null,
        title: $(elem).attr('title') || null
      });
    });

    return estrutura;
  },

  markdownParaHtml(markdown) {
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');

    return html;
  },

  escaparHtml(texto) {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  desescaparHtml(html) {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  },

  extrairElementosImportantes($) {
    let resultado = '📋 **Extração Automática de Elementos**\n\n';

    const title = $('title').text();
    if (title) {
      resultado += `**📄 Título:** ${title}\n\n`;
    }

    const description = $('meta[name="description"]').attr('content');
    if (description) {
      resultado += `**📝 Descrição:** ${description}\n\n`;
    }

    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      headings.push({
        level: parseInt(elem.tagName.charAt(1)),
        text: $(elem).text().trim()
      });
    });

    if (headings.length > 0) {
      resultado += `**📚 Cabeçalhos (${headings.length}):**\n`;
      headings.forEach((h, index) => {
        resultado += `${index + 1}. ${'#'.repeat(h.level)} ${h.text}\n`;
      });
      resultado += '\n';
    }

    const links = [];
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      if (href && text) {
        links.push({ href, text });
      }
    });

    if (links.length > 0) {
      resultado += `**🔗 Links (${links.length}):**\n`;
      links.slice(0, 10).forEach((link, index) => {
        resultado += `${index + 1}. [${link.text}](${link.href})\n`;
      });
      if (links.length > 10) {
        resultado += `... e mais ${links.length - 10} links\n`;
      }
      resultado += '\n';
    }

    const images = [];
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt');
      if (src) {
        images.push({ src, alt: alt || 'Sem alt' });
      }
    });

    if (images.length > 0) {
      resultado += `**🖼️ Imagens (${images.length}):**\n`;
      images.slice(0, 5).forEach((img, index) => {
        resultado += `${index + 1}. ${img.src} (${img.alt})\n`;
      });
      if (images.length > 5) {
        resultado += `... e mais ${images.length - 5} imagens\n`;
      }
      resultado += '\n';
    }

    return resultado;
  },

  async executarAnalise(args) {
    const { html_string, incluir_estatisticas = false, incluir_seo = false, incluir_acessibilidade = false } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para análise.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string);
      let resultado = '📊 **Análise Completa do HTML**\n\n';

      const stats = this.calcularEstatisticas($, html_string);
      resultado += `**📈 Estatísticas Básicas:**\n`;
      resultado += `- **Tamanho Total:** ${html_string.length} caracteres\n`;
      resultado += `- **Total de Elementos:** ${stats.totalElementos}\n`;
      resultado += `- **Profundidade Máxima:** ${stats.profundidadeMaxima} níveis\n`;
      resultado += `- **Links:** ${stats.links}\n`;
      resultado += `- **Imagens:** ${stats.imagens}\n`;
      resultado += `- **Formulários:** ${stats.formularios}\n\n`;

      if (incluir_estatisticas) {
        resultado += `**📋 Estatísticas Detalhadas:**\n`;
        resultado += `- **Divs:** ${$('div').length}\n`;
        resultado += `- **Parágrafos:** ${$('p').length}\n`;
        resultado += `- **Spans:** ${$('span').length}\n`;
        resultado += `- **Scripts:** ${$('script').length}\n`;
        resultado += `- **Estilos:** ${$('style').length}\n`;
        resultado += `- **Tabelas:** ${$('table').length}\n\n`;
      }

      if (incluir_seo) {
        resultado += this.analisarSEO($);
      }

      if (incluir_acessibilidade) {
        resultado += this.analisarAcessibilidade($);
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

  calcularEstatisticas($, html) {
    return {
      totalElementos: $('*').length,
      profundidadeMaxima: this.calcularProfundidadeMaxima($),
      links: $('a[href]').length,
      imagens: $('img').length,
      formularios: $('form').length
    };
  },

  calcularProfundidadeMaxima($) {
    let maxDepth = 0;

    function calcularProfundidade(elemento, depth = 0) {
      maxDepth = Math.max(maxDepth, depth);
      $(elemento).children().each((i, child) => {
        calcularProfundidade(child, depth + 1);
      });
    }

    $('body').each((i, body) => {
      calcularProfundidade(body, 1);
    });

    return maxDepth;
  },

  analisarSEO($) {
    let resultado = `**🔍 Análise de SEO:**\n`;
    const problemas = [];
    const sucessos = [];

    const title = $('title').text();
    if (title) {
      if (title.length >= 30 && title.length <= 60) {
        sucessos.push(`Title com tamanho ideal (${title.length} caracteres)`);
      } else {
        problemas.push(`Title com tamanho inadequado (${title.length} caracteres, ideal: 30-60)`);
      }
    } else {
      problemas.push('Title não encontrado');
    }

    const description = $('meta[name="description"]').attr('content');
    if (description) {
      if (description.length >= 120 && description.length <= 160) {
        sucessos.push(`Meta description com tamanho ideal (${description.length} caracteres)`);
      } else {
        problemas.push(`Meta description com tamanho inadequado (${description.length} caracteres, ideal: 120-160)`);
      }
    } else {
      problemas.push('Meta description não encontrada');
    }

    const h1s = $('h1');
    if (h1s.length === 1) {
      sucessos.push('Exatamente um H1 encontrado');
    } else if (h1s.length === 0) {
      problemas.push('Nenhum H1 encontrado');
    } else {
      problemas.push(`Múltiplos H1s encontrados (${h1s.length})`);
    }

    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      headings.push(parseInt(elem.tagName.charAt(1)));
    });

    if (headings.length > 0) {
      sucessos.push(`Estrutura de headings presente (${headings.length} headings)`);
    }

    if (sucessos.length > 0) {
      resultado += `✅ **Pontos Positivos:**\n`;
      sucessos.forEach(sucesso => resultado += `- ${sucesso}\n`);
      resultado += '\n';
    }

    if (problemas.length > 0) {
      resultado += `❌ **Problemas de SEO:**\n`;
      problemas.forEach(problema => resultado += `- ${problema}\n`);
      resultado += '\n';
    }

    return resultado;
  },

  analisarAcessibilidade($) {
    let resultado = `**♿ Análise de Acessibilidade:**\n`;
    const problemas = [];
    const sucessos = [];

    const imgsSemAlt = $('img:not([alt])').length;
    if (imgsSemAlt > 0) {
      problemas.push(`${imgsSemAlt} imagem(ns) sem atributo alt`);
    } else if ($('img').length > 0) {
      sucessos.push('Todas as imagens possuem atributo alt');
    }

    const linksSemTexto = $('a[href]').filter((i, elem) => !$(elem).text().trim()).length;
    if (linksSemTexto > 0) {
      problemas.push(`${linksSemTexto} link(s) sem texto descritivo`);
    }

    const inputsSemLabel = $('input[type!="hidden"]').filter((i, elem) => {
      const id = $(elem).attr('id');
      return !id || $(`label[for="${id}"]`).length === 0;
    }).length;
    if (inputsSemLabel > 0) {
      problemas.push(`${inputsSemLabel} input(s) sem label associado`);
    }

    const textosBrancos = $('[style*="color: white"], [style*="color: #fff"], [style*="color: #ffffff"]').length;
    if (textosBrancos > 0) {
      problemas.push(`Possíveis problemas de contraste detectados (${textosBrancos} elementos)`);
    }

    if (sucessos.length > 0) {
      resultado += `✅ **Pontos Positivos:**\n`;
      sucessos.forEach(sucesso => resultado += `- ${sucesso}\n`);
      resultado += '\n';
    }

    if (problemas.length > 0) {
      resultado += `❌ **Problemas de Acessibilidade:**\n`;
      problemas.forEach(problema => resultado += `- ${problema}\n`);
      resultado += '\n';
    }

    return resultado;
  },

  async executarSanitizacao(args) {
    const { html_string, nivel_sanitizacao = 'basico' } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para sanitização.'
        }]
      };
    }

    try {
      let opcoes = {};

      if (nivel_sanitizacao === 'basico') {
        opcoes = {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'blockquote'],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
          FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
          FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover']
        };
      } else {
        opcoes = {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
          ALLOWED_ATTR: [],
          FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
          FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'style']
        };
      }

      const htmlSanitizado = DOMPurify.sanitize(html_string, opcoes);
      const elementosRemovidos = html_string.length - htmlSanitizado.length;

      return {
        content: [
          {
            type: 'text',
            text: `🧹 **HTML Sanitizado**\n\n**Nível:** ${nivel_sanitizacao}\n**Tamanho Original:** ${html_string.length} caracteres\n**Tamanho Sanitizado:** ${htmlSanitizado.length} caracteres\n**Redução:** ${elementosRemovidos} caracteres\n\n\`\`\`html\n${htmlSanitizado}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Sanitização**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarOtimizacao(args) {
    const { html_string } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para otimização.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string);
      const otimizacoes = [];

      $('*').each((i, elem) => {
        const $elem = $(elem);
        const attrs = elem.attribs;
        for (const attr in attrs) {
          if (!attrs[attr] || attrs[attr].trim() === '') {
            $elem.removeAttr(attr);
            otimizacoes.push(`Removido atributo vazio: ${attr}`);
          }
        }
      });

      $('div, span, p').each((i, elem) => {
        const $elem = $(elem);
        if (!$elem.text().trim() && $elem.children().length === 0) {
          $elem.remove();
          otimizacoes.push(`Removido elemento vazio: ${elem.tagName}`);
        }
      });

      $('[class]').each((i, elem) => {
        const $elem = $(elem);
        const classes = $elem.attr('class').split(/\s+/).filter(Boolean);
        const uniqueClasses = [...new Set(classes)];
        if (classes.length !== uniqueClasses.length) {
          $elem.attr('class', uniqueClasses.join(' '));
          otimizacoes.push('Removidas classes duplicadas');
        }
      });

      const htmlOtimizado = $.html();

      return {
        content: [
          {
            type: 'text',
            text: `⚡ **HTML Otimizado**\n\n**Otimizações Aplicadas:** ${otimizacoes.length}\n**Tamanho Original:** ${html_string.length} caracteres\n**Tamanho Otimizado:** ${htmlOtimizado.length} caracteres\n\n**Otimizações:**\n${otimizacoes.slice(0, 10).map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\n\`\`\`html\n${htmlOtimizado}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Otimização**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  async executarComparacao(args) {
    const { html_string, html_comparacao } = args;

    if (!html_string || !html_comparacao) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nOs parâmetros `html_string` e `html_comparacao` são obrigatórios para comparação.'
        }]
      };
    }

    try {
      const $1 = cheerio.load(html_string);
      const $2 = cheerio.load(html_comparacao);

      const stats1 = this.calcularEstatisticas($1, html_string);
      const stats2 = this.calcularEstatisticas($2, html_comparacao);

      let resultado = '🔍 **Comparação de HTMLs**\n\n';

      resultado += `**📊 Estatísticas Comparativas:**\n`;
      resultado += `| Métrica | HTML 1 | HTML 2 | Diferença |\n`;
      resultado += `|---------|--------|--------|-----------|\n`;
      resultado += `| Tamanho | ${html_string.length} | ${html_comparacao.length} | ${html_comparacao.length - html_string.length} |\n`;
      resultado += `| Elementos | ${stats1.totalElementos} | ${stats2.totalElementos} | ${stats2.totalElementos - stats1.totalElementos} |\n`;
      resultado += `| Links | ${stats1.links} | ${stats2.links} | ${stats2.links - stats1.links} |\n`;
      resultado += `| Imagens | ${stats1.imagens} | ${stats2.imagens} | ${stats2.imagens - stats1.imagens} |\n`;
      resultado += `| Profundidade | ${stats1.profundidadeMaxima} | ${stats2.profundidadeMaxima} | ${stats2.profundidadeMaxima - stats1.profundidadeMaxima} |\n\n`;

      const title1 = $1('title').text();
      const title2 = $2('title').text();
      if (title1 !== title2) {
        resultado += `**📄 Títulos Diferentes:**\n`;
        resultado += `- HTML 1: "${title1}"\n`;
        resultado += `- HTML 2: "${title2}"\n\n`;
      }

      const headings1 = [];
      const headings2 = [];
      $1('h1, h2, h3, h4, h5, h6').each((i, elem) => headings1.push($1(elem).text().trim()));
      $2('h1, h2, h3, h4, h5, h6').each((i, elem) => headings2.push($2(elem).text().trim()));

      if (JSON.stringify(headings1) !== JSON.stringify(headings2)) {
        resultado += `**📚 Estrutura de Headings Diferente:**\n`;
        resultado += `- HTML 1: ${headings1.length} headings\n`;
        resultado += `- HTML 2: ${headings2.length} headings\n\n`;
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
    const { html_string } = args;

    if (!html_string) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Parâmetro**\n\nO parâmetro `html_string` é obrigatório para geração de schema.'
        }]
      };
    }

    try {
      const $ = cheerio.load(html_string);
      const schema = this.gerarSchemaHtml($);

      return {
        content: [
          {
            type: 'text',
            text: `📋 **Schema HTML Gerado**\n\n**Baseado em:** Estrutura do HTML fornecido\n**Formato:** JSON Schema\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\``
          }
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

  async executarGeracao(args) {
    const { template_tipo = 'pagina_basica' } = args;

    try {
      const template = this.gerarTemplate(template_tipo);

      return {
        content: [
          {
            type: 'text',
            text: `🏗️ **Template HTML Gerado**\n\n**Tipo:** ${template_tipo}\n**Características:** ${this.getTemplateDescription(template_tipo)}\n\n\`\`\`html\n${template}\n\`\`\``
          }
        ]
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro na Geração**\n\n**Erro:** ${error.message}`
        }]
      };
    }
  },

  gerarSchemaHtml($) {
    const schema = {
      type: 'object',
      properties: {
        html: {
          type: 'object',
          properties: {
            head: {
              type: 'object',
              properties: {
                title: { type: 'string', example: $('title').text() || 'Título da Página' },
                meta: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      content: { type: 'string' }
                    }
                  }
                }
              }
            },
            body: {
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      tag: { type: 'string' },
                      attributes: { type: 'object' },
                      content: { type: 'string' },
                      children: { type: 'array' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      statistics: this.calcularEstatisticas($, $.html())
    };

    return schema;
  },

  gerarTemplate(tipo) {
    const templates = {
      pagina_basica: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Básica</title>
    <meta name="description" content="Descrição da página">
</head>
<body>
    <header>
        <h1>Título Principal</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#sobre">Sobre</a></li>
                <li><a href="#contato">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Seção Principal</h2>
            <p>Conteúdo da página aqui.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Todos os direitos reservados.</p>
    </footer>
</body>
</html>`,

      formulario: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário</title>
</head>
<body>
    <form action="#" method="post">
        <fieldset>
            <legend>Informações Pessoais</legend>

            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone">

            <label for="mensagem">Mensagem:</label>
            <textarea id="mensagem" name="mensagem" rows="4"></textarea>

            <button type="submit">Enviar</button>
        </fieldset>
    </form>
</body>
</html>`,

      tabela: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabela de Dados</title>
</head>
<body>
    <table>
        <caption>Dados de Exemplo</caption>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>João Silva</td>
                <td>joao@email.com</td>
                <td>Ativo</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Maria Santos</td>
                <td>maria@email.com</td>
                <td>Inativo</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,

      card: `<div class="card">
    <img src="https://via.placeholder.com/300x200" alt="Imagem do Card">
    <div class="card-content">
        <h3>Título do Card</h3>
        <p>Descrição do conteúdo do card aqui.</p>
        <a href="#" class="btn">Saiba Mais</a>
    </div>
</div>`,

      lista: `<ul class="lista-items">
    <li class="item">
        <h4>Item 1</h4>
        <p>Descrição do primeiro item.</p>
    </li>
    <li class="item">
        <h4>Item 2</h4>
        <p>Descrição do segundo item.</p>
    </li>
    <li class="item">
        <h4>Item 3</h4>
        <p>Descrição do terceiro item.</p>
    </li>
</ul>`
    };

    return templates[tipo] || templates.pagina_basica;
  },

  getTemplateDescription(tipo) {
    const descriptions = {
      pagina_basica: 'HTML5 semântico com header, nav, main, section e footer',
      formulario: 'Formulário acessível com labels, fieldset e validação',
      tabela: 'Tabela semântica com caption, thead, tbody e th/td',
      card: 'Componente card com imagem, título, descrição e botão',
      lista: 'Lista não ordenada com itens estruturados'
    };

    return descriptions[tipo] || 'Template HTML básico';
  }
};

module.exports = htmlUtilsTool;
