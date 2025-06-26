const jsonFormatterTool = {
  name: 'formatar_json',
  description: 'Formata e valida JSON - sempre exibe o JSON formatado no chat por padrão',
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
        maximum: 10,
        default: 2
      },
      output_format: {
        type: 'string',
        description: 'JSON formatado',
      }
    },
    required: ['json_string']
  },
  
  async execute(args) {
    const { json_string, indentacao = 2, output_format = 'both', always_display = true } = args;

    try {
      const jsonObj = JSON.parse(json_string);
      const jsonFormatado = JSON.stringify(jsonObj, null, indentacao);

      return {
        content: [
          {
            type: 'text',
            text: `\`\`\`json\n${jsonFormatado}\n\`\`\``
          }
        ]
      };
    } catch (error) {
      // Para erros, sempre usar formato rico para melhor feedback
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
