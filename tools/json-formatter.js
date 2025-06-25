const jsonFormatterTool = {
  name: 'formatar_json',
  description: 'Formata e valida JSON',
  inputSchema: {
    type: 'object',
    properties: {
      json_string: {
        type: 'string',
        description: 'String JSON para formatar'
      },
      indentacao: {
        type: 'number',
        description: 'Número de espaços para indentação',
        minimum: 2,
        maximum: 8,
        default: 2
      }
    },
    required: ['json_string']
  },
  
  async execute(args) {
    const { json_string, indentacao = 2 } = args;
    
    try {
      const jsonObj = JSON.parse(json_string);
      const jsonFormatado = JSON.stringify(jsonObj, null, indentacao);
      
      const resultado = `📝 **JSON Formatado**\n\n\`\`\`json\n${jsonFormatado}\n\`\`\`\n\n✅ JSON válido e formatado com sucesso!`;

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ **JSON Inválido**\n\n**Erro:** ${error.message}\n\n**String recebida:**\n\`\`\`\n${json_string}\n\`\`\``
          }
        ]
      };
    }
  }
};

module.exports = jsonFormatterTool;
