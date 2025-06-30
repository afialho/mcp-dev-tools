const crypto = require('crypto');

const uuidGeneratorTool = {
  name: 'gerar_uuid',
  description: 'Gera um UUID único',
  inputSchema: {
    type: 'object',
    properties: {
      versao: {
        type: 'string',
        description: 'Versão do UUID (v4 ou v1)',
        enum: ['v1', 'v4'],
        default: 'v4'
      },
      quantidade: {
        type: 'number',
        description: 'Quantidade de UUIDs para gerar',
        minimum: 1,
        maximum: 10,
        default: 1
      }
    }
  },
  
  async execute(args) {
    const { versao = 'v4', quantidade = 1 } = args;
    
    const uuids = [];
    
    for (let i = 0; i < quantidade; i++) {
      if (versao === 'v4') {
        uuids.push(crypto.randomUUID());
      } else if (versao === 'v1') {
        const timestamp = Date.now().toString(16);
        const randomPart = crypto.randomBytes(6).toString('hex');
        uuids.push(`${timestamp}-${randomPart}`);
      }
    }

    const resultado = `🆔 **UUIDs Gerados (${versao.toUpperCase()})**\n\n`;
    const listaUuids = uuids.map((uuid, index) => `${index + 1}. \`${uuid}\``).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: resultado + listaUuids + `\n\n✅ **${quantidade} UUID(s) gerado(s) com sucesso!**`
        }
      ]
    };
  }
};

module.exports = uuidGeneratorTool;
