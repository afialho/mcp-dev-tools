const crypto = require('crypto');

const passwordUtilsTool = {
  name: 'password_utils',
  description: 'Utilitários para senhas: gerar, analisar segurança, validar e criar frases-senha',
  inputSchema: {
    type: 'object',
    properties: {
      operacao: {
        type: 'string',
        enum: ['gerar', 'analisar', 'validar', 'frase', 'verificar'],
        description: 'Operação: gerar senhas, analisar segurança, validar múltiplas, gerar frase-senha ou verificar vazamentos'
      },
      senhas: {
        type: 'array',
        items: { type: 'string' },
        description: 'Lista de senhas para analisar/validar (não usado em gerar/frase)',
        maxItems: 50
      },
      quantidade: {
        type: 'number',
        minimum: 1,
        maximum: 50,
        default: 1,
        description: 'Quantidade de senhas/frases para gerar'
      },
      comprimento: {
        type: 'number',
        minimum: 4,
        maximum: 128,
        default: 16,
        description: 'Comprimento da senha (4-128 caracteres)'
      },
      tipo: {
        type: 'string',
        enum: ['forte', 'media', 'numerica', 'personalizada'],
        default: 'forte',
        description: 'Tipo de senha: forte (completa), media (sem símbolos), numerica (PIN), personalizada'
      },
      incluir_maiusculas: {
        type: 'boolean',
        default: true,
        description: 'Incluir letras maiúsculas (apenas para tipo personalizada)'
      },
      incluir_minusculas: {
        type: 'boolean',
        default: true,
        description: 'Incluir letras minúsculas (apenas para tipo personalizada)'
      },
      incluir_numeros: {
        type: 'boolean',
        default: true,
        description: 'Incluir números (apenas para tipo personalizada)'
      },
      incluir_simbolos: {
        type: 'boolean',
        default: false,
        description: 'Incluir símbolos (apenas para tipo personalizada)'
      },
      excluir_ambiguos: {
        type: 'boolean',
        default: true,
        description: 'Excluir caracteres ambíguos (0, O, l, I, etc.)'
      },
      palavras_frase: {
        type: 'number',
        minimum: 3,
        maximum: 8,
        default: 4,
        description: 'Número de palavras na frase-senha (3-8)'
      },
      separador: {
        type: 'string',
        default: '-',
        description: 'Separador entre palavras na frase-senha'
      },
      incluir_numeros_frase: {
        type: 'boolean',
        default: false,
        description: 'Incluir números nas frases-senha para torná-las mais seguras'
      },
      incluir_simbolos_frase: {
        type: 'boolean',
        default: false,
        description: 'Incluir símbolos nas frases-senha para torná-las mais seguras'
      }
    },
    required: ['operacao']
  },

  // Conjuntos de caracteres
  CHARSETS: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: '0O1lI|`'
  },

  // Lista de palavras para frases-senha
  PALAVRAS_FRASE: [
    'casa', 'gato', 'sol', 'mar', 'lua', 'flor', 'rio', 'paz', 'luz', 'cor',
    'vida', 'amor', 'tempo', 'mundo', 'terra', 'agua', 'fogo', 'vento', 'ceu', 'estrela',
    'livro', 'mesa', 'porta', 'janela', 'ponte', 'caminho', 'arvore', 'folha', 'fruto', 'semente',
    'musica', 'danca', 'festa', 'alegria', 'sonho', 'esperanca', 'coragem', 'forca', 'sabedoria', 'verdade',
    'amigo', 'familia', 'crianca', 'pessoa', 'gente', 'povo', 'cidade', 'pais', 'lugar', 'espaco',
    'momento', 'hora', 'dia', 'noite', 'manha', 'tarde', 'ano', 'mes', 'semana', 'segundo',
    'palavra', 'frase', 'texto', 'historia', 'conto', 'poema', 'verso', 'rima', 'som', 'voz',
    'olho', 'mao', 'pe', 'cabeca', 'corpo', 'mente', 'alma', 'coracao', 'sangue', 'osso',
    'pedra', 'metal', 'ouro', 'prata', 'ferro', 'madeira', 'papel', 'tecido', 'vidro', 'plastico',
    'comida', 'pao', 'leite', 'cafe', 'cha', 'fruta', 'carne', 'peixe', 'arroz', 'feijao'
  ],

  // Senhas comuns para verificação
  SENHAS_COMUNS: [
    '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
    'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234', '123123', 'dragon', 'master', 'hello', 'login', 'pass', 'admin123'
  ],

  async execute(args) {
    try {
      const { operacao } = args;

      switch (operacao) {
        case 'gerar':
          return this.executarGeracao(args);
        case 'analisar':
          return this.executarAnalise(args);
        case 'validar':
          return this.executarValidacao(args);
        case 'frase':
          return this.executarGeracaoFrase(args);
        case 'verificar':
          return this.executarVerificacaoVazamentos(args);
        default:
          return {
            content: [{
              type: 'text',
              text: `❌ **Operação Inválida**\n\nOperações disponíveis: gerar, analisar, validar, frase, verificar`
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

  // Gerar conjunto de caracteres baseado no tipo
  obterConjuntoCaracteres(tipo, opcoes = {}) {
    let charset = '';
    
    switch (tipo) {
      case 'forte':
        charset = this.CHARSETS.lowercase + this.CHARSETS.uppercase + 
                 this.CHARSETS.numbers + this.CHARSETS.symbols;
        break;
      case 'media':
        charset = this.CHARSETS.lowercase + this.CHARSETS.uppercase + this.CHARSETS.numbers;
        break;
      case 'numerica':
        charset = this.CHARSETS.numbers;
        break;
      case 'personalizada':
        if (opcoes.incluir_minusculas) charset += this.CHARSETS.lowercase;
        if (opcoes.incluir_maiusculas) charset += this.CHARSETS.uppercase;
        if (opcoes.incluir_numeros) charset += this.CHARSETS.numbers;
        if (opcoes.incluir_simbolos) charset += this.CHARSETS.symbols;
        break;
    }

    // Remover caracteres ambíguos se solicitado
    if (opcoes.excluir_ambiguos) {
      for (const char of this.CHARSETS.ambiguous) {
        charset = charset.replace(new RegExp(char, 'g'), '');
      }
    }

    return charset;
  },

  // Gerar senha aleatória
  gerarSenha(comprimento, charset) {
    if (!charset || charset.length === 0) {
      throw new Error('Conjunto de caracteres vazio');
    }

    let senha = '';
    const array = new Uint8Array(comprimento);
    crypto.getRandomValues(array);

    for (let i = 0; i < comprimento; i++) {
      senha += charset[array[i] % charset.length];
    }

    return senha;
  },

  // Garantir que a senha tenha pelo menos um caractere de cada tipo necessário
  garantirDiversidade(senha, tipo, opcoes = {}) {
    const tipos = [];
    
    switch (tipo) {
      case 'forte':
        tipos.push(
          { chars: this.CHARSETS.lowercase, name: 'minúscula' },
          { chars: this.CHARSETS.uppercase, name: 'maiúscula' },
          { chars: this.CHARSETS.numbers, name: 'número' },
          { chars: this.CHARSETS.symbols, name: 'símbolo' }
        );
        break;
      case 'media':
        tipos.push(
          { chars: this.CHARSETS.lowercase, name: 'minúscula' },
          { chars: this.CHARSETS.uppercase, name: 'maiúscula' },
          { chars: this.CHARSETS.numbers, name: 'número' }
        );
        break;
      case 'personalizada':
        if (opcoes.incluir_minusculas) tipos.push({ chars: this.CHARSETS.lowercase, name: 'minúscula' });
        if (opcoes.incluir_maiusculas) tipos.push({ chars: this.CHARSETS.uppercase, name: 'maiúscula' });
        if (opcoes.incluir_numeros) tipos.push({ chars: this.CHARSETS.numbers, name: 'número' });
        if (opcoes.incluir_simbolos) tipos.push({ chars: this.CHARSETS.symbols, name: 'símbolo' });
        break;
    }

    // Verificar se tem pelo menos um de cada tipo
    for (const tipoChar of tipos) {
      let temTipo = false;
      for (const char of senha) {
        if (tipoChar.chars.includes(char)) {
          temTipo = true;
          break;
        }
      }
      
      // Se não tem, substituir um caractere aleatório
      if (!temTipo && senha.length > tipos.length) {
        const posicao = Math.floor(Math.random() * senha.length);
        const novoChar = tipoChar.chars[Math.floor(Math.random() * tipoChar.chars.length)];
        senha = senha.substring(0, posicao) + novoChar + senha.substring(posicao + 1);
      }
    }

    return senha;
  },

  // Executar geração de senhas
  executarGeracao(args) {
    const {
      quantidade = 1,
      comprimento = 16,
      tipo = 'forte',
      incluir_maiusculas = true,
      incluir_minusculas = true,
      incluir_numeros = true,
      incluir_simbolos = false,
      excluir_ambiguos = true
    } = args;

    const opcoes = {
      incluir_maiusculas,
      incluir_minusculas,
      incluir_numeros,
      incluir_simbolos,
      excluir_ambiguos
    };

    const charset = this.obterConjuntoCaracteres(tipo, opcoes);

    if (!charset) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Configuração**\n\nPara tipo personalizada, selecione pelo menos um tipo de caractere.`
        }]
      };
    }

    const senhasGeradas = [];

    for (let i = 0; i < quantidade; i++) {
      let senha = this.gerarSenha(comprimento, charset);

      // Garantir diversidade para tipos que precisam
      if (['forte', 'media', 'personalizada'].includes(tipo)) {
        senha = this.garantirDiversidade(senha, tipo, opcoes);
      }

      const entropia = this.calcularEntropia(senha, charset.length);
      senhasGeradas.push({ senha, entropia });
    }

    const tipoTexto = {
      'forte': 'Forte',
      'media': 'Média',
      'numerica': 'Numérica',
      'personalizada': 'Personalizada'
    };

    const resultado = `🔐 **Senhas Geradas (${tipoTexto[tipo]})**\n\n`;
    const listaSenhas = senhasGeradas.map((item, index) =>
      `${index + 1}. \`${item.senha}\` ✅ Entropia: ${item.entropia.toFixed(1)} bits`
    ).join('\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaSenhas + `\n\n✅ **${quantidade} senha(s) gerada(s) com sucesso!**`
      }]
    };
  },

  // Executar análise de segurança
  executarAnalise(args) {
    const { senhas } = args;

    if (!senhas || senhas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Parâmetro**\n\nForneça pelo menos uma senha para analisar.`
        }]
      };
    }

    if (senhas.length === 1) {
      // Análise detalhada de uma senha
      const analise = this.analisarSenha(senhas[0]);
      return {
        content: [{
          type: 'text',
          text: this.formatarAnaliseDetalhada(analise)
        }]
      };
    } else {
      // Análise resumida de múltiplas senhas
      const analises = senhas.map(senha => this.analisarSenha(senha));
      return {
        content: [{
          type: 'text',
          text: this.formatarAnaliseMultipla(analises)
        }]
      };
    }
  },

  // Executar validação em lote
  executarValidacao(args) {
    const { senhas } = args;

    if (!senhas || senhas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Parâmetro**\n\nForneça pelo menos uma senha para validar.`
        }]
      };
    }

    const analises = senhas.map(senha => this.analisarSenha(senha));
    const fracas = analises.filter(a => a.pontuacao < 60);
    const medias = analises.filter(a => a.pontuacao >= 60 && a.pontuacao < 80);
    const fortes = analises.filter(a => a.pontuacao >= 80);

    const resultado = `🔍 **Relatório de Validação**\n\n` +
      `**Total analisado:** ${senhas.length} senha(s)\n` +
      `🔴 **Fracas:** ${fracas.length} (< 60 pontos)\n` +
      `🟡 **Médias:** ${medias.length} (60-79 pontos)\n` +
      `🟢 **Fortes:** ${fortes.length} (≥ 80 pontos)\n\n`;

    let detalhes = '';
    if (fracas.length > 0) {
      detalhes += `**⚠️ Senhas Fracas Detectadas:**\n`;
      fracas.forEach((analise, index) => {
        detalhes += `${index + 1}. Pontuação: ${analise.pontuacao}/100 - ${analise.problemas.join(', ')}\n`;
      });
      detalhes += '\n';
    }

    detalhes += `✅ **Recomendação:** ${this.obterRecomendacao(analises)}`;

    return {
      content: [{
        type: 'text',
        text: resultado + detalhes
      }]
    };
  },

  // Executar geração de frase-senha
  executarGeracaoFrase(args) {
    const {
      quantidade = 1,
      palavras_frase = 4,
      separador = '-',
      incluir_numeros_frase = false,
      incluir_simbolos_frase = false
    } = args;

    const frasesGeradas = [];

    for (let i = 0; i < quantidade; i++) {
      const palavras = [];
      const palavrasUsadas = new Set();

      // Selecionar palavras únicas aleatoriamente
      while (palavras.length < palavras_frase) {
        const palavra = this.PALAVRAS_FRASE[Math.floor(Math.random() * this.PALAVRAS_FRASE.length)];
        if (!palavrasUsadas.has(palavra)) {
          palavras.push(palavra);
          palavrasUsadas.add(palavra);
        }
      }

      // Adicionar números se solicitado
      if (incluir_numeros_frase) {
        const numero = Math.floor(Math.random() * 1000); // 0-999
        palavras.push(numero.toString());
      }

      // Adicionar símbolo se solicitado
      if (incluir_simbolos_frase) {
        const simbolos = ['!', '@', '#', '$', '%', '&', '*'];
        const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
        palavras.push(simbolo);
      }

      const frase = palavras.join(separador);
      const entropia = this.calcularEntropiaFraseCompleta(palavras_frase, incluir_numeros_frase, incluir_simbolos_frase);
      frasesGeradas.push({ frase, entropia });
    }

    const resultado = `🔤 **Frases-Senha Geradas**\n\n`;
    const listaFrases = frasesGeradas.map((item, index) =>
      `${index + 1}. \`${item.frase}\` ✅ Entropia: ${item.entropia.toFixed(1)} bits`
    ).join('\n');

    return {
      content: [{
        type: 'text',
        text: resultado + listaFrases + `\n\n✅ **${quantidade} frase(s)-senha gerada(s) com sucesso!**`
      }]
    };
  },

  // Executar verificação de vazamentos
  async executarVerificacaoVazamentos(args) {
    const { senhas } = args;

    if (!senhas || senhas.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Erro de Parâmetro**\n\nForneça pelo menos uma senha para verificar vazamentos.`
        }]
      };
    }

    const verificacoes = [];

    for (const senha of senhas) {
      try {
        const resultado = await this.verificarVazamento(senha);
        verificacoes.push({
          senha: senha,
          vazada: resultado.vazada,
          ocorrencias: resultado.ocorrencias,
          erro: null
        });
      } catch (error) {
        verificacoes.push({
          senha: senha,
          vazada: null,
          ocorrencias: 0,
          erro: error.message
        });
      }
    }

    return {
      content: [{
        type: 'text',
        text: this.formatarVerificacaoVazamentos(verificacoes)
      }]
    };
  },

  // Analisar segurança de uma senha
  analisarSenha(senha) {
    const analise = {
      senha: senha,
      comprimento: senha.length,
      temMinuscula: /[a-z]/.test(senha),
      temMaiuscula: /[A-Z]/.test(senha),
      temNumero: /[0-9]/.test(senha),
      temSimbolo: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(senha),
      temSequencia: this.temSequencia(senha),
      temRepeticao: this.temRepeticao(senha),
      eComum: this.SENHAS_COMUNS.includes(senha.toLowerCase()),
      entropia: 0,
      pontuacao: 0,
      forca: '',
      tempoQuebrar: '',
      problemas: []
    };

    // Calcular entropia
    const espacoCaracteres = this.calcularEspacoCaracteres(analise);
    analise.entropia = this.calcularEntropia(senha, espacoCaracteres);

    // Calcular pontuação
    analise.pontuacao = this.calcularPontuacao(analise);

    // Determinar força
    analise.forca = this.determinarForca(analise.pontuacao);

    // Calcular tempo para quebrar
    analise.tempoQuebrar = this.calcularTempoQuebrar(analise.entropia);

    // Identificar problemas
    analise.problemas = this.identificarProblemas(analise);

    return analise;
  },

  // Calcular espaço de caracteres baseado no que a senha contém
  calcularEspacoCaracteres(analise) {
    let espaco = 0;
    if (analise.temMinuscula) espaco += 26;
    if (analise.temMaiuscula) espaco += 26;
    if (analise.temNumero) espaco += 10;
    if (analise.temSimbolo) espaco += 32;
    return Math.max(espaco, 1);
  },

  // Calcular entropia em bits
  calcularEntropia(senha, espacoCaracteres) {
    return Math.log2(Math.pow(espacoCaracteres, senha.length));
  },

  // Calcular entropia para frases-senha
  calcularEntropiaFrase(numPalavras, tamanhoDicionario) {
    return Math.log2(Math.pow(tamanhoDicionario, numPalavras));
  },

  // Calcular entropia para frases-senha completas (com números e símbolos)
  calcularEntropiaFraseCompleta(numPalavras, incluirNumeros, incluirSimbolos) {
    let entropia = Math.log2(Math.pow(this.PALAVRAS_FRASE.length, numPalavras));

    if (incluirNumeros) {
      entropia += Math.log2(1000); // 0-999
    }

    if (incluirSimbolos) {
      entropia += Math.log2(7); // 7 símbolos disponíveis
    }

    return entropia;
  },

  // Verificar se tem sequências
  temSequencia(senha) {
    const sequencias = ['123', '234', '345', '456', '567', '678', '789', '890',
                       'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
                       'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop'];

    const senhaLower = senha.toLowerCase();
    return sequencias.some(seq => senhaLower.includes(seq) || senhaLower.includes(seq.split('').reverse().join('')));
  },

  // Verificar se tem repetições
  temRepeticao(senha) {
    // Verifica se tem 3 ou mais caracteres iguais consecutivos
    return /(.)\1{2,}/.test(senha);
  },

  // Calcular pontuação de 0-100
  calcularPontuacao(analise) {
    let pontos = 0;

    // Pontos por comprimento (25 pontos máximo)
    if (analise.comprimento >= 12) pontos += 25;
    else if (analise.comprimento >= 8) pontos += 15;
    else if (analise.comprimento >= 6) pontos += 10;
    else pontos += 5;

    // Pontos por diversidade (25 pontos máximo)
    let diversidade = 0;
    if (analise.temMinuscula) diversidade += 6;
    if (analise.temMaiuscula) diversidade += 6;
    if (analise.temNumero) diversidade += 6;
    if (analise.temSimbolo) diversidade += 7;
    pontos += diversidade;

    // Pontos por ausência de padrões (25 pontos máximo)
    let padroes = 25;
    if (analise.temSequencia) padroes -= 10;
    if (analise.temRepeticao) padroes -= 10;
    if (analise.eComum) padroes -= 15;
    pontos += Math.max(padroes, 0);

    // Pontos por entropia (25 pontos máximo)
    if (analise.entropia >= 60) pontos += 25;
    else if (analise.entropia >= 40) pontos += 20;
    else if (analise.entropia >= 30) pontos += 15;
    else if (analise.entropia >= 20) pontos += 10;
    else pontos += 5;

    return Math.min(pontos, 100);
  },

  // Determinar força baseada na pontuação
  determinarForca(pontuacao) {
    if (pontuacao >= 90) return '🟢 Muito Forte';
    if (pontuacao >= 80) return '🟢 Forte';
    if (pontuacao >= 60) return '🟡 Média';
    if (pontuacao >= 40) return '🟠 Fraca';
    return '🔴 Muito Fraca';
  },

  // Calcular tempo estimado para quebrar
  calcularTempoQuebrar(entropia) {
    // Assumindo 1 bilhão de tentativas por segundo
    const tentativasPorSegundo = 1e9;
    const tentativasTotal = Math.pow(2, entropia - 1); // Média de tentativas
    const segundos = tentativasTotal / tentativasPorSegundo;

    if (segundos < 60) return `${segundos.toFixed(1)} segundos`;
    if (segundos < 3600) return `${(segundos / 60).toFixed(1)} minutos`;
    if (segundos < 86400) return `${(segundos / 3600).toFixed(1)} horas`;
    if (segundos < 31536000) return `${(segundos / 86400).toFixed(1)} dias`;
    if (segundos < 31536000000) return `${(segundos / 31536000).toFixed(1)} anos`;

    const anos = segundos / 31536000;
    if (anos < 1e6) return `${anos.toExponential(1)} anos`;
    return `${anos.toExponential(1)} anos`;
  },

  // Identificar problemas na senha
  identificarProblemas(analise) {
    const problemas = [];

    if (analise.comprimento < 8) problemas.push('muito curta');
    if (!analise.temMinuscula) problemas.push('sem minúsculas');
    if (!analise.temMaiuscula) problemas.push('sem maiúsculas');
    if (!analise.temNumero) problemas.push('sem números');
    if (!analise.temSimbolo) problemas.push('sem símbolos');
    if (analise.temSequencia) problemas.push('contém sequências');
    if (analise.temRepeticao) problemas.push('contém repetições');
    if (analise.eComum) problemas.push('senha muito comum');

    return problemas;
  },

  // Verificar se senha foi vazada usando HaveIBeenPwned API
  async verificarVazamento(senha) {
    const crypto = require('crypto');

    // Gerar hash SHA-1 da senha
    const hash = crypto.createHash('sha1').update(senha).digest('hex').toUpperCase();
    const prefixo = hash.substring(0, 5);
    const sufixo = hash.substring(5);

    try {
      // Fazer requisição para a API HaveIBeenPwned
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefixo}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'MCP-Dev-Utils-Password-Checker'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.text();
      const linhas = data.split('\n');

      // Procurar pelo sufixo do hash
      for (const linha of linhas) {
        const [hashSufixo, count] = linha.split(':');
        if (hashSufixo === sufixo) {
          return {
            vazada: true,
            ocorrencias: parseInt(count.trim())
          };
        }
      }

      return {
        vazada: false,
        ocorrencias: 0
      };

    } catch (error) {
      // Se não conseguir acessar a API, retorna como não verificado
      throw new Error(`Não foi possível verificar: ${error.message}`);
    }
  },

  // Formatar resultado da verificação de vazamentos
  formatarVerificacaoVazamentos(verificacoes) {
    let resultado = `🔍 **Verificação de Vazamentos**\n\n`;

    const vazadas = verificacoes.filter(v => v.vazada === true);
    const seguras = verificacoes.filter(v => v.vazada === false);
    const erros = verificacoes.filter(v => v.erro !== null);

    resultado += `**Total verificado:** ${verificacoes.length} senha(s)\n`;
    resultado += `🔴 **Vazadas:** ${vazadas.length}\n`;
    resultado += `🟢 **Seguras:** ${seguras.length}\n`;
    if (erros.length > 0) {
      resultado += `⚠️ **Não verificadas:** ${erros.length}\n`;
    }
    resultado += '\n';

    // Detalhar senhas vazadas
    if (vazadas.length > 0) {
      resultado += `**🚨 Senhas Vazadas Detectadas:**\n`;
      vazadas.forEach((verificacao, index) => {
        const senhaOculta = '•'.repeat(verificacao.senha.length);
        resultado += `${index + 1}. \`${senhaOculta}\` - Encontrada ${verificacao.ocorrencias.toLocaleString()} vez(es) em vazamentos\n`;
      });
      resultado += '\n';
    }

    // Detalhar erros se houver
    if (erros.length > 0) {
      resultado += `**⚠️ Senhas Não Verificadas:**\n`;
      erros.forEach((verificacao, index) => {
        const senhaOculta = '•'.repeat(verificacao.senha.length);
        resultado += `${index + 1}. \`${senhaOculta}\` - ${verificacao.erro}\n`;
      });
      resultado += '\n';
    }

    // Recomendação
    if (vazadas.length > 0) {
      resultado += `🔴 **URGENTE:** Troque imediatamente as senhas vazadas!`;
    } else if (seguras.length === verificacoes.length) {
      resultado += `✅ **Excelente:** Nenhuma senha foi encontrada em vazamentos conhecidos.`;
    } else {
      resultado += `⚠️ **Atenção:** Algumas senhas não puderam ser verificadas.`;
    }

    return resultado;
  },

  // Formatar análise detalhada para uma senha
  formatarAnaliseDetalhada(analise) {
    const senhaOculta = '•'.repeat(analise.senha.length);

    let resultado = `🔍 **Análise de Segurança**\n\n`;
    resultado += `**Senha:** \`${senhaOculta}\`\n`;
    resultado += `**Força:** ${analise.forca} (${analise.pontuacao}/100)\n`;
    resultado += `**Entropia:** ${analise.entropia.toFixed(1)} bits\n`;
    resultado += `**Tempo para quebrar:** ${analise.tempoQuebrar}\n\n`;

    resultado += `**Características:**\n`;
    resultado += `${analise.comprimento >= 8 ? '✅' : '❌'} Comprimento adequado (${analise.comprimento} caracteres)\n`;
    resultado += `${analise.temMinuscula ? '✅' : '❌'} Contém letras minúsculas\n`;
    resultado += `${analise.temMaiuscula ? '✅' : '❌'} Contém letras maiúsculas\n`;
    resultado += `${analise.temNumero ? '✅' : '❌'} Contém números\n`;
    resultado += `${analise.temSimbolo ? '✅' : '❌'} Contém símbolos\n`;
    resultado += `${!analise.temSequencia ? '✅' : '❌'} Sem sequências detectadas\n`;
    resultado += `${!analise.temRepeticao ? '✅' : '❌'} Sem repetições excessivas\n`;
    resultado += `${!analise.eComum ? '✅' : '❌'} Não está em listas de senhas comuns\n`;

    if (analise.problemas.length > 0) {
      resultado += `\n**⚠️ Problemas detectados:** ${analise.problemas.join(', ')}`;
    }

    return resultado;
  },

  // Formatar análise múltipla
  formatarAnaliseMultipla(analises) {
    let resultado = `🔍 **Análise de Múltiplas Senhas**\n\n`;

    analises.forEach((analise, index) => {
      const senhaOculta = '•'.repeat(analise.senha.length);
      resultado += `**${index + 1}.** \`${senhaOculta}\` - ${analise.forca} (${analise.pontuacao}/100)\n`;
      if (analise.problemas.length > 0) {
        resultado += `   ⚠️ ${analise.problemas.join(', ')}\n`;
      }
    });

    const media = analises.reduce((sum, a) => sum + a.pontuacao, 0) / analises.length;
    resultado += `\n**Pontuação média:** ${media.toFixed(1)}/100`;

    return resultado;
  },

  // Obter recomendação baseada nas análises
  obterRecomendacao(analises) {
    const fracas = analises.filter(a => a.pontuacao < 60).length;
    const total = analises.length;

    if (fracas === 0) {
      return 'Todas as senhas estão em bom nível de segurança.';
    } else if (fracas === total) {
      return 'Todas as senhas precisam ser fortalecidas. Use senhas mais longas com maior diversidade de caracteres.';
    } else {
      return `${fracas} de ${total} senhas precisam ser fortalecidas.`;
    }
  }
};

module.exports = passwordUtilsTool;
