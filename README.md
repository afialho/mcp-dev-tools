# MCP Dev Utils

> Ferramentas úteis para desenvolvedores via MCP - Arquitetura modular e extensível

## Configuração

Adicione no arquivo de configuração MCP da sua IDE:

```json
{
  "mcpServers": {
    "dev-utils": {
      "command": "npx",
      "args": ["-y", "mcp-dev-utils"]
    }
  }
}
```

## Arquitetura

O projeto foi refatorado para garantir atomicidade, manutenibilidade e facilitar o desenvolvimento:

```
dev-utils/
├── bin/
│   └── server.js           # Servidor principal MCP (refatorado)
├── tools/                  # Ferramentas individuais
│   ├── index.js           # Exporta todas as ferramentas
│   ├── uuid-generator.js  # Geração de UUIDs
│   ├── email-validator.js # Validação de emails
│   ├── hash-generator.js  # Geração de hashes
│   ├── json-formatter.js  # Formatação de JSON
│   └── age-calculator.js  # Cálculo de idade
├── utils/
│   └── tool-registry.js   # Sistema de registro automático
├── tests/                 # Testes organizados e modulares
│   ├── tools/             # Testes individuais das ferramentas
│   │   ├── uuid-generator.test.js
│   │   ├── email-validator.test.js
│   │   ├── hash-generator.test.js
│   │   ├── json-formatter.test.js
│   │   └── age-calculator.test.js
│   ├── utils/             # Testes dos utilitários
│   │   └── tool-registry.test.js
│   ├── integration/       # Testes de integração
│   │   └── server.test.js
│   ├── helpers/           # Utilitários de teste
│   │   └── test-utils.js
│   ├── run-all-tests.js   # Executa todos os testes
│   └── run-tools-tests.js # Executa apenas testes das ferramentas
└── README.md
```

### Benefícios da Arquitetura

- ✅ **Atomicidade** - Cada ferramenta é independente e testável
- ✅ **Manutenibilidade** - Código organizado e modular (74% menos código no servidor)
- ✅ **Extensibilidade** - Novas ferramentas são carregadas automaticamente
- ✅ **Testabilidade** - Testes isolados e granulares por ferramenta
- ✅ **Colaboração** - Desenvolvimento paralelo possível
- ✅ **Execução Granular** - Possibilidade de testar componentes específicos

## Ferramentas

### Gerar UUID
- `"Gere um UUID"`
- `"Gere 3 UUIDs v4"`
- `"Crie um UUID versão 1"`

### Validar Email
- `"Valide o email admin@empresa.com"`
- `"Verifique se teste@gmail.com é válido"`
- `"Este email está correto: user@domain.co.uk?"`

### Gerar Hash
- `"Gere hash SHA256 da palavra 'password'"`
- `"Crie hash MD5 da string 'hello world'"`
- `"Hash da senha 'MinhaSenh@123' usando SHA1"`

### Formatar JSON
- `"Formate este JSON: {'nome':'João','idade':30}"`
- `"Organize: {'users':[{'id':1,'name':'Ana'}],'total':1}"`
- `"Valide e formate com indentação 4: {'config':{'debug':true}}"`

### Calcular Idade
- `"Calcule a idade de quem nasceu em 1990-05-15"`
- `"Qual idade de alguém nascido em 1985-12-25?"`
- `"Idade para data de nascimento 2000-03-10"`

## Workflow Completo

```
"Crie um perfil de usuário: gere UUID para ID, valide email admin@test.com, hash da senha 'pass123', formate em JSON incluindo nome 'João Silva', e calcule idade para 1990-05-15"
```

## Para Desenvolvedores

### Executar Testes

A arquitetura de testes foi refatorada para garantir **atomicidade**, **isolamento** e **execução granular**:

#### Executar Todos os Testes

```bash
# Executar todos os testes (recomendado)
npm test

# Ou diretamente
node tests/run-all-tests.js
```

#### Executar Testes por Categoria

```bash
# Testar apenas as ferramentas individuais
npm run test:tools

# Testar apenas utilitários (ToolRegistry)
npm run test:registry

# Testar apenas integração do servidor
npm run test:server
```

#### Executar Testes de Ferramentas Específicas

```bash
# Testar UUID Generator
npm run test:uuid

# Testar Email Validator
npm run test:email

# Testar Hash Generator
npm run test:hash

# Testar JSON Formatter
npm run test:json

# Testar Age Calculator
npm run test:age
```

#### Execução Direta (sem npm)

```bash
# Todos os testes
node tests/run-all-tests.js

# Apenas ferramentas
node tests/run-tools-tests.js

# Ferramenta específica
node tests/tools/uuid-generator.test.js
node tests/tools/email-validator.test.js
node tests/tools/hash-generator.test.js
node tests/tools/json-formatter.test.js
node tests/tools/age-calculator.test.js

# Utilitários
node tests/utils/tool-registry.test.js

# Integração
node tests/integration/server.test.js
```

#### Benefícios da Nova Estrutura de Testes

- ✅ **Atomicidade Total**: Cada teste é completamente isolado
- ✅ **Execução Granular**: Teste apenas o que você está desenvolvendo
- ✅ **Debugging Focado**: Falhas não afetam outros testes
- ✅ **Desenvolvimento Paralelo**: Diferentes desenvolvedores podem trabalhar simultaneamente
- ✅ **CI/CD Otimizado**: Testes podem ser executados em paralelo
- ✅ **Manutenção Simplificada**: Fácil localização e correção de problemas

### Adicionar Nova Ferramenta

1. **Crie o arquivo da ferramenta** em `tools/nova-ferramenta.js`:

```javascript
const novaFerramentaTool = {
  name: 'nome_ferramenta',
  description: 'Descrição da ferramenta',
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

    // Sua lógica aqui
    const resultado = `Resultado para: ${parametro}`;

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

module.exports = novaFerramentaTool;
```

2. **A ferramenta será carregada automaticamente** pelo ToolRegistry na próxima inicialização

3. **Adicione testes** criando `tests/tools/nova-ferramenta.test.js`:

```javascript
const novaFerramenta = require('../../tools/nova-ferramenta');
const { testTool } = require('../helpers/test-utils');

async function testNovaFerramenta() {
  console.log('🧪 Testando Nova Ferramenta...');

  await testTool(
    novaFerramenta,
    { parametro: 'valor_teste' },
    ['Resultado para:', 'valor_teste']
  );

  console.log('  ✅ Nova ferramenta funcionando');
}

async function runNovaFerramentaTests() {
  console.log('🚀 Testando Nova Ferramenta...\n');

  try {
    await testNovaFerramenta();
    console.log('\n✅ Nova Ferramenta - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Nova Ferramenta - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runNovaFerramentaTests().catch(console.error);
}

module.exports = { runNovaFerramentaTests };
```

4. **Adicione script no package.json**:

```json
{
  "scripts": {
    "test:nova": "node tests/tools/nova-ferramenta.test.js"
  }
}
```

### Estrutura de uma Ferramenta

Cada ferramenta deve exportar um objeto com:

- **`name`**: Nome único da ferramenta (usado pelo MCP)
- **`description`**: Descrição clara da funcionalidade
- **`inputSchema`**: Schema JSON para validação de parâmetros
- **`execute(args)`**: Função assíncrona que implementa a lógica

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar servidor em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Verificar estrutura do projeto
tree dev-utils/
```

## Informações Técnicas

### Refatoração Realizada

O projeto passou por uma refatoração completa para melhorar a arquitetura:

- **Antes**: 326 linhas em um único arquivo `server.js`
- **Depois**: 84 linhas no servidor + ferramentas modulares
- **Redução**: 74% menos código no servidor principal
- **Resultado**: Sistema modular, testável e extensível

### Sistema ToolRegistry

O `ToolRegistry` é o coração do sistema refatorado:

- **Carregamento automático**: Detecta e carrega todas as ferramentas do diretório `tools/`
- **Gerenciamento centralizado**: Mantém registro de todas as ferramentas disponíveis
- **Execução unificada**: Interface única para executar qualquer ferramenta
- **Tratamento de erro**: Gerenciamento consistente de erros

### Compatibilidade

- ✅ **100% compatível** com a versão anterior
- ✅ **Todas as ferramentas** funcionam exatamente como antes
- ✅ **Mesma interface MCP** - nenhuma mudança para o usuário final
- ✅ **Performance mantida** - sem impacto na velocidade

### Validação

O sistema foi completamente validado com testes automatizados refatorados:

- **Arquitetura Modular**: Cada ferramenta testada individualmente
- **5 ferramentas** com testes isolados e atômicos
- **1 utilitário** (ToolRegistry) com testes específicos
- **1 teste de integração** do servidor completo
- **Execução granular** possível para debugging focado
- **100% de sucesso** em todos os testes
- **Cobertura completa** de funcionalidades
- **Helpers compartilhados** para evitar duplicação de código

## Requisitos
- Node.js 18+

## Publicação no Registry

### Preparação para Publicação

Antes de publicar uma nova versão, siga estes passos:

#### 1. Validação Completa

```bash
# Executar todos os testes
npm test

# Verificar se não há problemas de lint/formato
npm run dev # Testar servidor localmente

# Verificar estrutura do pacote
npm pack --dry-run
```

#### 2. Atualizar Versão

```bash
# Versão patch (1.1.0 → 1.1.1) - correções de bugs
npm version patch

# Versão minor (1.1.0 → 1.2.0) - novas funcionalidades
npm version minor

# Versão major (1.1.0 → 2.0.0) - mudanças breaking
npm version major
```

> **Nota**: Os comandos `npm version` executam automaticamente os testes e fazem commit/push das mudanças graças aos scripts `version` e `postversion` configurados no package.json.

#### 3. Verificar package.json

Certifique-se de que os campos estão corretos:

```json
{
  "name": "mcp-dev-utils",
  "version": "1.1.0",
  "description": "MCP Server com utilidades essenciais para desenvolvedores - Arquitetura modular e extensível",
  "main": "bin/server.js",
  "bin": {
    "mcp-dev-utils": "./bin/server.js"
  },
  "files": [
    "bin/",
    "tools/",
    "utils/",
    "tests/",
    "README.md"
  ],
  "keywords": [
    "mcp",
    "model-context-protocol",
    "development",
    "utilities",
    "developer-tools",
    "modular",
    "extensible"
  ]
}
```

### Processo de Publicação

#### 1. Login no npm

```bash
# Fazer login (apenas na primeira vez)
npm login

# Verificar usuário logado
npm whoami
```

#### 2. Publicar

```bash
# Publicação normal
npm publish

# Publicação com tag específica (para versões beta/alpha)
npm publish --tag beta
npm publish --tag alpha

# Publicação com acesso público (se necessário)
npm publish --access public
```

> **Nota**: O script `prepublishOnly` executa automaticamente todos os testes antes da publicação, garantindo que apenas código validado seja publicado.

#### 3. Verificar Publicação

```bash
# Verificar se foi publicado
npm view mcp-dev-utils

# Verificar versões disponíveis
npm view mcp-dev-utils versions --json

# Testar instalação
npx mcp-dev-utils@latest
```

### Versionamento Semântico

Siga o padrão [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (1.X.0): Novas funcionalidades compatíveis
- **PATCH** (1.1.X): Correções de bugs compatíveis

#### Exemplos de Versionamento

```bash
# Correção de bug no UUID Generator
npm version patch  # 1.1.0 → 1.1.1

# Nova ferramenta adicionada (Password Generator)
npm version minor  # 1.1.1 → 1.2.0

# Mudança na interface MCP (breaking change)
npm version major  # 1.2.0 → 2.0.0
```

### Automatização com GitHub Actions

Crie `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Checklist de Publicação

- [ ] ✅ Todos os testes passando (`npm test`)
- [ ] ✅ Versão atualizada (`npm version`)
- [ ] ✅ **CHANGELOG.md atualizado** com as mudanças da versão
- [ ] ✅ README.md atualizado
- [ ] ✅ package.json com informações corretas
- [ ] ✅ Arquivos desnecessários excluídos (`.npmignore` configurado)
- [ ] ✅ Testado localmente (`npm pack` e instalação)
- [ ] ✅ Commit e push das mudanças
- [ ] ✅ Tag criada (`git tag v1.1.0`)
- [ ] ✅ Publicação realizada (`npm publish`)
- [ ] ✅ Verificação da publicação (`npm view`)

#### Atualizando CHANGELOG.md

Antes de cada publicação, atualize o `CHANGELOG.md`:

```markdown
## [1.2.0] - 2024-12-26

### Added
- ✨ Nova ferramenta: Password Generator
- ✨ Suporte a configurações customizadas

### Changed
- 🔄 Melhorias na interface do JSON Formatter

### Fixed
- 🐛 Correção no cálculo de idade para anos bissextos
```

### Scripts Automáticos Configurados

O projeto inclui scripts automáticos para garantir qualidade:

```json
{
  "scripts": {
    "prepublishOnly": "npm test",     // Executa testes antes de publicar
    "prepack": "npm test",            // Executa testes antes de empacotar
    "version": "npm test && git add -A", // Testa e adiciona mudanças ao commit
    "postversion": "git push && git push --tags" // Push automático após versioning
  }
}
```

#### Fluxo Automático

```bash
# Este comando:
npm version patch

# Executa automaticamente:
# 1. npm test (via script 'version')
# 2. git add -A (adiciona mudanças)
# 3. git commit -m "1.1.1" (commit da versão)
# 4. git tag v1.1.1 (cria tag)
# 5. git push (via script 'postversion')
# 6. git push --tags (push das tags)
```

### Comandos Úteis

```bash
# Ver informações do pacote
npm view mcp-dev-utils

# Ver dependentes do pacote
npm view mcp-dev-utils dependents

# Despublicar versão (cuidado!)
npm unpublish mcp-dev-utils@1.1.0

# Deprecar versão
npm deprecate mcp-dev-utils@1.0.0 "Versão descontinuada, use 1.1.0+"

# Verificar tamanho do pacote
npm pack --dry-run

# Testar instalação local
npm pack
npm install -g mcp-dev-utils-1.1.0.tgz
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-ferramenta`)
3. Adicione sua ferramenta seguindo o padrão estabelecido
4. Adicione testes individuais para sua ferramenta em `tests/tools/`
5. Execute `npm test` para validar todos os testes
6. Execute `npm run test:sua-ferramenta` para testar especificamente
6. Commit suas mudanças (`git commit -am 'Adiciona nova ferramenta'`)
7. Push para a branch (`git push origin feature/nova-ferramenta`)
8. Abra um Pull Request

## Licença

MIT