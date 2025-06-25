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
      },
      output_format: {
        type: 'string',
        description: 'Formato de saída: "rich" (com formatação), "plain" (apenas JSON), ou "both" (JSON + formatação)',
        enum: ['rich', 'plain', 'both'],
        default: 'both'
      }
    },
    required: ['json_string']
  },
  
  async execute(args) {
    const { json_string, indentacao = 2, output_format = 'both' } = args;

    try {
      const jsonObj = JSON.parse(json_string);
      const jsonFormatado = JSON.stringify(jsonObj, null, indentacao);

      let resultado;

      if (output_format === 'plain') {
        // Formato simples: apenas o JSON formatado
        resultado = jsonFormatado;
      } else if (output_format === 'rich') {
        // Formato rico: com emojis, títulos e formatação markdown
        resultado = `📝 **JSON Formatado**\n\n\`\`\`json\n${jsonFormatado}\n\`\`\`\n\n✅ JSON válido e formatado com sucesso!`;
      } else {
        // Formato both: JSON limpo + confirmação rica (sem duplicar JSON)
        resultado = `\`\`\`json\n${jsonFormatado}\n\`\`\`\n\n✅ JSON válido e formatado com sucesso!`;
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
