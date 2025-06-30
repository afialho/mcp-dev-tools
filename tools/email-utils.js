const emailUtilsTool = {
  name: 'email_utils',
  description: 'Utilitários completos para emails: gerar, validar, extrair, analisar e formatar emails',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['validar', 'gerar', 'extrair', 'analisar', 'formatar'],
        description: 'Operação: validar, gerar, extrair, analisar ou formatar emails'
      },
      emails: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de emails para validar/analisar/formatar (não usado em gerar/extrair)',
        maxItems: 100
      },
      texto: {
        type: 'string',
        description: 'Texto para extrair emails (apenas para operação extrair)'
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 1,
        description: 'Quantidade de emails para gerar (apenas para operação gerar)'
      },
      dominio: {
        type: 'string',
        description: 'Domínio personalizado para geração (ex: empresa.com)'
      },
      tipo: {
        type: 'string',
        enum: ['aleatorio', 'profissional', 'teste'],
        default: 'aleatorio',
        description: 'Tipo de email para gerar'
      }
    },
    required: ['operacao']
  },

  dominiosTemporarios: [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'maildrop.cc', 'yopmail.com'
  ],

  provedoresPopulares: {
    'gmail.com': 'Google Gmail',
    'outlook.com': 'Microsoft Outlook',
    'hotmail.com': 'Microsoft Hotmail',
    'yahoo.com': 'Yahoo Mail',
    'icloud.com': 'Apple iCloud',
    'protonmail.com': 'ProtonMail',
    'aol.com': 'AOL Mail'
  },

  correcoesDominios: {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com'
  },

  validarEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) return false;
    
    if (email.length > 254) return false;
    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    
    return true;
  },

  gerarEmail(tipo = 'aleatorio', dominio = null) {
    const nomesProfissionais = [
      'joao.silva', 'maria.santos', 'pedro.oliveira', 'ana.costa', 'carlos.ferreira',
      'lucia.almeida', 'rafael.souza', 'fernanda.lima', 'marcos.pereira', 'julia.rodrigues'
    ];
    
    const nomesAleatorios = [
      'usuario', 'teste', 'demo', 'exemplo', 'sample', 'user', 'admin', 'dev', 'test', 'temp'
    ];
    
    const dominiosPopulares = [
      'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'
    ];
    
    const dominiosTeste = [
      'exemplo.com', 'teste.org', 'demo.net', 'sample.com'
    ];
    
    let prefixo, dominioFinal;
    
    switch (tipo) {
      case 'profissional':
        prefixo = nomesProfissionais[Math.floor(Math.random() * nomesProfissionais.length)];
        dominioFinal = dominio || dominiosPopulares[Math.floor(Math.random() * dominiosPopulares.length)];
        break;
      case 'teste':
        prefixo = nomesAleatorios[Math.floor(Math.random() * nomesAleatorios.length)] + 
                 Math.floor(Math.random() * 1000);
        dominioFinal = dominio || dominiosTeste[Math.floor(Math.random() * dominiosTeste.length)];
        break;
      default:
        prefixo = nomesAleatorios[Math.floor(Math.random() * nomesAleatorios.length)] + 
                 Math.floor(Math.random() * 10000);
        dominioFinal = dominio || dominiosPopulares[Math.floor(Math.random() * dominiosPopulares.length)];
    }
    
    return `${prefixo}@${dominioFinal}`;
  },

  extrairEmails(texto) {
    const emailRegex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;
    const emails = texto.match(emailRegex) || [];
    
    const emailsUnicos = [...new Set(emails)];
    return emailsUnicos.filter(email => this.validarEmail(email));
  },

  analisarEmail(email) {
    const [usuario, dominio] = email.split('@');
    
    const analise = {
      usuario: usuario,
      dominio: dominio,
      valido: this.validarEmail(email),
      temporario: this.dominiosTemporarios.includes(dominio.toLowerCase()),
      provedor: this.provedoresPopulares[dominio.toLowerCase()] || 'Desconhecido',
      corporativo: !this.provedoresPopulares[dominio.toLowerCase()] && !this.dominiosTemporarios.includes(dominio.toLowerCase()),
      sugestaoCorrecao: this.correcoesDominios[dominio.toLowerCase()] || null
    };
    
    return analise;
  },

  formatarEmail(email) {
    let emailFormatado = email.trim().toLowerCase();
    
    const [usuario, dominio] = emailFormatado.split('@');
    if (dominio && this.correcoesDominios[dominio]) {
      emailFormatado = `${usuario}@${this.correcoesDominios[dominio]}`;
    }
    
    return emailFormatado;
  },

  obterMotivoInvalidez(email) {
    if (!email.includes('@')) return 'Falta o símbolo @';
    if (email.split('@').length !== 2) return 'Múltiplos símbolos @';
    if (email.length > 254) return 'Email muito longo (máx. 254 caracteres)';
    if (email.includes('..')) return 'Pontos consecutivos não permitidos';
    if (email.startsWith('.') || email.endsWith('.')) return 'Não pode começar ou terminar com ponto';
    
    const [usuario, dominio] = email.split('@');
    if (!usuario) return 'Usuário vazio';
    if (!dominio) return 'Domínio vazio';
    if (!dominio.includes('.')) return 'Domínio deve ter pelo menos um ponto';
    
    return 'Formato inválido';
  },

  async execute(args) {
    const { operacao, emails = [], texto = '', quantidade = 1, dominio = null, tipo = 'aleatorio' } = args;

    try {
      switch (operacao) {
        case 'validar':
          if (!emails || emails.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Validação**\n\nPara validar emails, é necessário fornecer uma lista de emails no parâmetro `emails`.'
              }]
            };
          }
          return this.executarValidacao(emails);
        
        case 'gerar':
          return this.executarGeracao(quantidade, tipo, dominio);
        
        case 'extrair':
          if (!texto) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Extração**\n\nPara extrair emails, é necessário fornecer um texto no parâmetro `texto`.'
              }]
            };
          }
          return this.executarExtracao(texto);
        
        case 'analisar':
          if (!emails || emails.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Análise**\n\nPara analisar emails, é necessário fornecer uma lista de emails no parâmetro `emails`.'
              }]
            };
          }
          return this.executarAnalise(emails);
        
        case 'formatar':
          if (!emails || emails.length === 0) {
            return {
              content: [{
                type: 'text',
                text: '❌ **Erro de Formatação**\n\nPara formatar emails, é necessário fornecer uma lista de emails no parâmetro `emails`.'
              }]
            };
          }
          return this.executarFormatacao(emails);
        
        default:
          return {
            content: [{
              type: 'text',
              text: '❌ **Operação Inválida**\n\nOperações disponíveis: `validar`, `gerar`, `extrair`, `analisar`, `formatar`'
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

  executarValidacao(emails) {
    const resultados = [];
    let validos = 0;
    let invalidos = 0;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const isValid = this.validarEmail(email);

      if (isValid) {
        const analise = this.analisarEmail(email);
        let status = '✅ **Válido**';
        if (analise.temporario) status += ' ⚠️ *Temporário*';
        if (analise.sugestaoCorrecao) status += ` 💡 *Sugestão: ${email.split('@')[0]}@${analise.sugestaoCorrecao}*`;

        resultados.push(`${i + 1}. \`${email}\` ${status}`);
        validos++;
      } else {
        const motivo = this.obterMotivoInvalidez(email);
        resultados.push(`${i + 1}. \`${email}\` ❌ **Inválido** - ${motivo}`);
        invalidos++;
      }
    }

    const resultado = `📧 **Validação de Emails**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${validos} válido(s), ${invalidos} inválido(s) de ${emails.length} email(s) verificado(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  },

  executarGeracao(quantidade, tipo, dominio) {
    const emailsGerados = [];

    for (let i = 0; i < quantidade; i++) {
      const email = this.gerarEmail(tipo, dominio);
      emailsGerados.push(email);
    }

    const tipoTexto = {
      'aleatorio': 'Aleatórios',
      'profissional': 'Profissionais',
      'teste': 'de Teste'
    };

    const resultado = `📧 **Emails ${tipoTexto[tipo]} Gerados**\n\n`;
    const listaEmails = emailsGerados.map((email, index) =>
      `${index + 1}. \`${email}\` ✅ Válido`
    ).join('\n');

    const dominioInfo = dominio ? `\n\n🌐 **Domínio:** ${dominio}` : '';

    return {
      content: [{
        type: 'text',
        text: resultado + listaEmails + `\n\n✅ **${quantidade} email(s) gerado(s) com sucesso!**` + dominioInfo
      }]
    };
  },

  executarExtracao(texto) {
    const emailsEncontrados = this.extrairEmails(texto);

    if (emailsEncontrados.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '📧 **Extração de Emails**\n\n❌ Nenhum email válido encontrado no texto fornecido.'
        }]
      };
    }

    const resultado = `📧 **Emails Extraídos do Texto**\n\n`;
    const listaEmails = emailsEncontrados.map((email, index) => {
      const analise = this.analisarEmail(email);
      let status = '✅ Válido';
      if (analise.temporario) status += ' ⚠️ Temporário';
      return `${index + 1}. \`${email}\` ${status}`;
    }).join('\n');

    const resumo = `\n\n📊 **Resumo:** ${emailsEncontrados.length} email(s) único(s) encontrado(s) e validado(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaEmails + resumo
      }]
    };
  },

  executarAnalise(emails) {
    const resultados = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const analise = this.analisarEmail(email);

      let detalhes = [
        `**Usuário:** ${analise.usuario}`,
        `**Domínio:** ${analise.dominio}`,
        `**Status:** ${analise.valido ? '✅ Válido' : '❌ Inválido'}`,
        `**Provedor:** ${analise.provedor}`,
        `**Tipo:** ${analise.corporativo ? '🏢 Corporativo' : '👤 Pessoal'}`,
        `**Temporário:** ${analise.temporario ? '⚠️ Sim' : '✅ Não'}`
      ];

      if (analise.sugestaoCorrecao) {
        detalhes.push(`**💡 Sugestão:** ${analise.usuario}@${analise.sugestaoCorrecao}`);
      }

      resultados.push(`${i + 1}. **\`${email}\`**\n   ${detalhes.join('\n   ')}`);
    }

    const resultado = `🔍 **Análise Detalhada de Emails**\n\n`;
    const listaResultados = resultados.join('\n\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados
      }]
    };
  },

  executarFormatacao(emails) {
    const resultados = [];
    let processados = 0;
    let corrigidos = 0;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const emailFormatado = this.formatarEmail(email);

      if (email !== emailFormatado) {
        resultados.push(`${i + 1}. \`${email}\` → \`${emailFormatado}\` 🔧 Corrigido`);
        corrigidos++;
      } else {
        resultados.push(`${i + 1}. \`${email}\` ✅ Já formatado`);
      }
      processados++;
    }

    const resultado = `🎭 **Formatação e Normalização de Emails**\n\n`;
    const listaResultados = resultados.join('\n');
    const resumo = `\n\n📊 **Resumo:** ${processados} processado(s), ${corrigidos} corrigido(s)`;

    return {
      content: [{
        type: 'text',
        text: resultado + listaResultados + resumo
      }]
    };
  }
};

module.exports = emailUtilsTool;
