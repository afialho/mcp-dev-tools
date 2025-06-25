const crypto = require('crypto');

const hashGeneratorTool = {
  name: 'gerar_hash',
  description: 'Gera hash de uma string',
  inputSchema: {
    type: 'object',
    properties: {
      texto: {
        type: 'string',
        description: 'Texto para gerar hash'
      },
      algoritmo: {
        type: 'string',
        description: 'Algoritmo de hash',
        enum: ['md5', 'sha1', 'sha256'],
        default: 'sha256'
      }
    },
    required: ['texto']
  },
  
  async execute(args) {
    const { texto, algoritmo = 'sha256' } = args;
    
    const hash = crypto.createHash(algoritmo).update(texto).digest('hex');
    
    const resultado = `🔐 **Hash Gerado**\n\n**Algoritmo:** ${algoritmo.toUpperCase()}\n**Texto:** \`${texto}\`\n**Hash:** \`${hash}\`\n\n✅ Hash gerado com sucesso!`;

    return {
      content: [
        {
          type: 'text',
          text: resultado
        }
      ]
    };
  }
};

module.exports = hashGeneratorTool;
