const emailValidatorTool = {
  name: 'validar_email',
  description: 'Valida se um email tem formato correto',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email para validar'
      }
    },
    required: ['email']
  },
  
  async execute(args) {
    const { email } = args;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isValid = emailRegex.test(email);
    const resultado = isValid 
      ? `✅ **Email Válido**\n\n📧 \`${email}\` tem formato correto.`
      : `❌ **Email Inválido**\n\n📧 \`${email}\` não tem formato correto.\n\n**Problemas possíveis:**\n- Falta @\n- Domínio inválido\n- Caracteres especiais incorretos`;

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

module.exports = emailValidatorTool;
