const ageCalculatorTool = {
  name: 'calcular_idade',
  description: 'Calcula idade baseada na data de nascimento',
  inputSchema: {
    type: 'object',
    properties: {
      data_nascimento: {
        type: 'string',
        description: 'Data de nascimento (YYYY-MM-DD)',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      }
    },
    required: ['data_nascimento']
  },
  
  async execute(args) {
    const { data_nascimento } = args;
    
    try {
      const nascimento = new Date(data_nascimento);
      const hoje = new Date();
      
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      const dias = Math.floor((hoje - nascimento) / (1000 * 60 * 60 * 24));
      const anos = Math.floor(dias / 365.25);
      const meses = Math.floor((dias % 365.25) / 30.44);

      const resultado = `🎂 **Cálculo de Idade**\n\n**Data de Nascimento:** ${data_nascimento}\n**Data Atual:** ${hoje.toISOString().split('T')[0]}\n\n**Idade:** ${idade} anos\n**Detalhes:** ${anos} anos e ${meses} meses\n**Total de dias:** ${dias.toLocaleString()} dias\n\n✅ Idade calculada com sucesso!`;

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
            text: `❌ **Data Inválida**\n\n**Erro:** ${error.message}\n\n**Formato esperado:** YYYY-MM-DD (ex: 1990-05-15)`
          }
        ]
      };
    }
  }
};

module.exports = ageCalculatorTool;
