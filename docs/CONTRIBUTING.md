# Guia de Contribuição

Obrigado por considerar contribuir com o MCP Dev Utils! Este documento fornece diretrizes para contribuições efetivas.

## Como Contribuir

### 1. Configurar Ambiente de Desenvolvimento

```bash
# Fork do repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/mcp-dev-utils.git
cd mcp-dev-utils

# Instalar dependências
npm install

# Configurar upstream
git remote add upstream https://github.com/afialho/mcp-dev-utils.git

# Testar instalação
npm test
```

### 2. Criar Branch para Sua Contribuição

```bash
# Atualizar main
git checkout main
git pull upstream main

# Criar branch para feature/fix
git checkout -b feature/nova-ferramenta
# ou
git checkout -b fix/correcao-bug
```

### 3. Fazer Suas Mudanças

Siga os padrões estabelecidos no projeto:

- **Código**: Mantenha consistência com o estilo existente
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize documentação relevante
- **Commits**: Use mensagens descritivas

### 4. Testar Suas Mudanças

```bash
# Executar todos os testes
npm test

# Testar funcionalidade específica
npm run test:sua-ferramenta

# Testar servidor localmente
npm run dev
```

### 5. Submeter Pull Request

```bash
# Push da sua branch
git push origin feature/nova-ferramenta

# Criar Pull Request no GitHub
# Preencher template com detalhes da mudança
```

## Tipos de Contribuição

### 🛠️ Novas Ferramentas

Adicionar novas ferramentas úteis para desenvolvedores:

1. **Criar arquivo da ferramenta** em `tools/`
2. **Adicionar testes** em `tests/tools/`
3. **Atualizar documentação**
4. **Adicionar script npm** no package.json

### 🐛 Correções de Bugs

Corrigir problemas existentes:

1. **Identificar o problema** com testes reproduzíveis
2. **Implementar correção** mantendo compatibilidade
3. **Adicionar testes** para prevenir regressão
4. **Documentar mudança** no CHANGELOG.md

### 📚 Melhorias na Documentação

Melhorar clareza e completude da documentação:

1. **README.md**: Informações para usuários
2. **docs/**: Documentação técnica
3. **Comentários no código**: Explicações técnicas
4. **Exemplos**: Casos de uso práticos

### 🧪 Melhorias nos Testes

Aumentar cobertura e qualidade dos testes:

1. **Novos casos de teste**: Cenários não cobertos
2. **Testes de performance**: Verificar eficiência
3. **Testes de integração**: Validar funcionamento conjunto
4. **Helpers de teste**: Utilitários compartilhados

## Padrões de Código

### Estrutura de uma Ferramenta

```javascript
const minhaFerramentaTool = {
  name: 'nome_da_ferramenta',
  description: 'Descrição clara e concisa da funcionalidade',
  inputSchema: {
    type: 'object',
    properties: {
      parametro: {
        type: 'string',
        description: 'Descrição do parâmetro'
      }
    },
    required: ['parametro']
  },

  async execute(args) {
    const { parametro } = args;

    try {
      // Implementar lógica aqui
      const resultado = processarParametro(parametro);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Resultado: ${resultado}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Erro: ${error.message}`
          }
        ]
      };
    }
  }
};

module.exports = minhaFerramentaTool;
```

### Padrões de Teste

```javascript
const minhaFerramenta = require('../../tools/minha-ferramenta');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testCasoBasico() {
  console.log('🧪 Testando caso básico...');

  await testTool(
    minhaFerramenta,
    { parametro: 'valor_teste' },
    ['Resultado:', 'valor_teste', '✅']
  );

  console.log('  ✅ Caso básico funcionando');
}

async function testCasoErro() {
  console.log('🧪 Testando tratamento de erro...');

  await testToolError(
    minhaFerramenta,
    { parametro: '' },
    ['❌', 'Erro:']
  );

  console.log('  ✅ Erro tratado corretamente');
}

async function runMinhaFerramentaTests() {
  console.log('🚀 Testando Minha Ferramenta...\n');

  try {
    await testCasoBasico();
    await testCasoErro();

    console.log('\n✅ Minha Ferramenta - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Minha Ferramenta - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runMinhaFerramentaTests().catch(console.error);
}

module.exports = { runMinhaFerramentaTests };
```

### Padrões de Commit

Use mensagens de commit descritivas seguindo o padrão:

```bash
# Formato
tipo(escopo): descrição

# Exemplos
feat(tools): add password generator tool
fix(uuid): correct v1 timestamp generation
docs(readme): update installation instructions
test(email): add edge cases for domain validation
refactor(registry): improve error handling
```

**Tipos de commit:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `test`: Adição ou modificação de testes
- `refactor`: Refatoração de código
- `style`: Mudanças de formatação
- `chore`: Tarefas de manutenção

## Diretrizes Específicas

### Adicionando Nova Ferramenta

1. **Planejamento**:
   - Verificar se a ferramenta é útil para desenvolvedores
   - Confirmar que não duplica funcionalidade existente
   - Definir interface clara e simples

2. **Implementação**:
   - Seguir padrão das ferramentas existentes
   - Implementar tratamento robusto de erros
   - Adicionar validação de parâmetros

3. **Testes**:
   - Criar testes abrangentes
   - Incluir casos de sucesso e erro
   - Testar casos extremos

4. **Documentação**:
   - Atualizar README com exemplos
   - Adicionar ao DEVELOPMENT.md se necessário
   - Documentar parâmetros e comportamento

### Correção de Bugs

1. **Reprodução**:
   - Criar teste que reproduz o bug
   - Confirmar que o teste falha antes da correção

2. **Correção**:
   - Implementar correção mínima necessária
   - Manter compatibilidade com versões anteriores
   - Evitar mudanças desnecessárias

3. **Validação**:
   - Confirmar que o teste agora passa
   - Executar todos os testes para evitar regressão
   - Testar manualmente se necessário

## Processo de Review

### O que Esperamos

- **Código limpo**: Fácil de ler e entender
- **Testes abrangentes**: Cobertura adequada
- **Documentação atualizada**: Mudanças documentadas
- **Compatibilidade**: Não quebrar funcionalidades existentes

### O que Verificamos

- **Funcionalidade**: A mudança funciona como esperado
- **Qualidade**: Código segue padrões do projeto
- **Testes**: Cobertura adequada e testes passando
- **Performance**: Não introduz problemas de performance
- **Segurança**: Não introduz vulnerabilidades

## Comunicação

### Onde Buscar Ajuda

- **GitHub Issues**: Para bugs e solicitações de funcionalidades
- **GitHub Discussions**: Para perguntas e discussões
- **Pull Requests**: Para revisão de código

### Como Reportar Bugs

1. **Verificar issues existentes**: Evitar duplicatas
2. **Usar template de issue**: Fornecer informações completas
3. **Incluir reprodução**: Passos para reproduzir o problema
4. **Ambiente**: Versão do Node.js, sistema operacional, etc.

### Como Sugerir Funcionalidades

1. **Descrever o problema**: Que problema a funcionalidade resolve
2. **Propor solução**: Como a funcionalidade funcionaria
3. **Considerar alternativas**: Outras formas de resolver o problema
4. **Avaliar impacto**: Como afetaria usuários existentes

## Reconhecimento

Contribuidores são reconhecidos:

- **README.md**: Lista de contribuidores
- **CHANGELOG.md**: Créditos nas mudanças
- **GitHub**: Histórico de contribuições
- **Releases**: Menção em notas de release

## Código de Conduta

### Nossos Valores

- **Respeito**: Tratar todos com cortesia e profissionalismo
- **Inclusão**: Acolher contribuidores de todos os backgrounds
- **Colaboração**: Trabalhar juntos para melhorar o projeto
- **Qualidade**: Manter altos padrões de código e documentação

### Comportamento Esperado

- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade

### Comportamento Inaceitável

- Linguagem ou imagens sexualizadas
- Ataques pessoais ou políticos
- Assédio público ou privado
- Publicar informações privadas de outros

## Primeiros Passos

### Para Iniciantes

1. **Explorar o código**: Entender a estrutura do projeto
2. **Executar testes**: Familiarizar-se com o sistema de testes
3. **Issues "good first issue"**: Procurar issues marcadas para iniciantes
4. **Documentação**: Começar com melhorias na documentação

### Ideias de Contribuição

- **Novas ferramentas**: Base64 encoder/decoder, Color converter, etc.
- **Melhorias**: Performance, tratamento de erros, validação
- **Testes**: Casos extremos, testes de integração
- **Documentação**: Exemplos, tutoriais, traduções

Obrigado por contribuir! 🚀
