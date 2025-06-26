const QRCode = require('qrcode');

const qrCodeUtilsTool = {
  name: 'qr_code_utils_dev-tools',
  description: 'Utilidades para QR Code: gerar QR codes a partir de URLs, textos e dados diversos com diferentes formatos e configurações',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        description: 'Operação: gerar QR codes a partir de dados',
        enum: ['gerar']
      },
      dados: {
        type: 'string',
        description: 'Dados para gerar QR Code (URL, texto, JSON, etc.)'
      },
      tipo: {
        type: 'string',
        description: 'Tipo de dados para gerar QR Code',
        enum: ['url', 'texto', 'email', 'telefone', 'wifi', 'vcard', 'sms'],
        default: 'texto'
      },
      formato: {
        type: 'string',
        description: 'Formato de saída do QR Code',
        enum: ['svg', 'png_base64', 'terminal'],
        default: 'svg'
      },
      tamanho: {
        type: 'number',
        description: 'Tamanho do QR Code em pixels (para PNG)',
        minimum: 100,
        maximum: 1000,
        default: 300
      },
      correcao_erro: {
        type: 'string',
        description: 'Nível de correção de erro',
        enum: ['L', 'M', 'Q', 'H'],
        default: 'M'
      },
      margem: {
        type: 'number',
        description: 'Margem ao redor do QR Code',
        minimum: 0,
        maximum: 10,
        default: 4
      },
      cor_fundo: {
        type: 'string',
        description: 'Cor de fundo (hex)',
        default: '#FFFFFF'
      },
      cor_frente: {
        type: 'string',
        description: 'Cor da frente (hex)',
        default: '#000000'
      }
    },
    required: ['operacao', 'dados']
  },

  async execute(args) {
    const { 
      operacao, 
      dados, 
      tipo = 'texto',
      formato = 'svg',
      tamanho = 300,
      correcao_erro = 'M',
      margem = 4,
      cor_fundo = '#FFFFFF',
      cor_frente = '#000000'
    } = args;

    if (operacao !== 'gerar') {
      return {
        content: [{
          type: 'text',
          text: '❌ **Operação Inválida**\n\nOperação não suportada. Use `gerar` para gerar QR Codes.'
        }]
      };
    }

    if (!dados || dados.trim() === '') {
      return {
        content: [{
          type: 'text',
          text: '❌ **Erro de Geração**\n\nPara gerar QR Code, é necessário fornecer dados no parâmetro `dados`.'
        }]
      };
    }

    try {
      // Processar dados baseado no tipo
      let dadosProcessados = this.processarDados(dados, tipo);

      // Configurações do QR Code
      const opcoes = {
        errorCorrectionLevel: correcao_erro,
        type: formato === 'png_base64' ? 'image/png' : 'svg',
        quality: 0.92,
        margin: margem,
        color: {
          dark: cor_frente,
          light: cor_fundo
        },
        width: formato === 'png_base64' ? tamanho : undefined
      };

      let resultado;
      let conteudoQR;

      if (formato === 'terminal') {
        // QR Code no terminal
        conteudoQR = await QRCode.toString(dadosProcessados, { type: 'terminal', small: true });
        resultado = `📱 **QR Code Gerado (Terminal)**\n\n**Tipo:** ${tipo.toUpperCase()}\n**Dados:** \`${dados}\`\n\n\`\`\`\n${conteudoQR}\`\`\`\n\n✅ QR Code gerado com sucesso!`;
      } else if (formato === 'svg') {
        // QR Code SVG
        conteudoQR = await QRCode.toString(dadosProcessados, opcoes);
        resultado = `📱 **QR Code Gerado (SVG)**\n\n**Tipo:** ${tipo.toUpperCase()}\n**Dados:** \`${dados}\`\n**Correção de Erro:** ${correcao_erro}\n**Margem:** ${margem}\n\n\`\`\`svg\n${conteudoQR}\`\`\`\n\n✅ QR Code SVG gerado com sucesso!`;
      } else if (formato === 'png_base64') {
        // QR Code PNG em Base64
        conteudoQR = await QRCode.toDataURL(dadosProcessados, opcoes);
        resultado = `📱 **QR Code Gerado (PNG Base64)**\n\n**Tipo:** ${tipo.toUpperCase()}\n**Dados:** \`${dados}\`\n**Tamanho:** ${tamanho}px\n**Correção de Erro:** ${correcao_erro}\n\n**Base64:**\n\`\`\`\n${conteudoQR}\`\`\`\n\n✅ QR Code PNG gerado com sucesso!`;
      }

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };

    } catch (error) {
      throw new Error(`Erro ao gerar QR Code: ${error.message}`);
    }
  },

  processarDados(dados, tipo) {
    switch (tipo) {
      case 'url':
        // Validar e processar URL
        if (!dados.startsWith('http://') && !dados.startsWith('https://')) {
          return `https://${dados}`;
        }
        return dados;

      case 'email':
        // Formato mailto
        if (!dados.startsWith('mailto:')) {
          return `mailto:${dados}`;
        }
        return dados;

      case 'telefone':
        // Formato tel
        if (!dados.startsWith('tel:')) {
          return `tel:${dados}`;
        }
        return dados;

      case 'sms':
        // Formato SMS
        if (!dados.startsWith('sms:')) {
          return `sms:${dados}`;
        }
        return dados;

      case 'wifi':
        // Formato WiFi: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;
        if (!dados.startsWith('WIFI:')) {
          // Assumir formato simples: nome,senha,tipo
          const partes = dados.split(',');
          if (partes.length >= 2) {
            const [nome, senha, tipo = 'WPA'] = partes;
            return `WIFI:T:${tipo};S:${nome};P:${senha};H:false;`;
          }
        }
        return dados;

      case 'vcard':
        // Formato vCard simples
        if (!dados.startsWith('BEGIN:VCARD')) {
          // Assumir formato simples: nome,telefone,email
          const partes = dados.split(',');
          if (partes.length >= 1) {
            const [nome, telefone = '', email = ''] = partes;
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${nome}\n${telefone ? `TEL:${telefone}\n` : ''}${email ? `EMAIL:${email}\n` : ''}END:VCARD`;
          }
        }
        return dados;

      case 'texto':
      default:
        return dados;
    }
  }
};

module.exports = qrCodeUtilsTool;
