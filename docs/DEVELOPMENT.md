# Guia de Desenvolvimento

Este documento contém informações técnicas para desenvolvedores que desejam contribuir ou entender a arquitetura do MCP Dev Utils.

## Arquitetura

O projeto utiliza uma arquitetura modular que garante atomicidade, manutenibilidade e facilita o desenvolvimento:

```
dev-utils/
├── bin/
│   └── server.js           # Servidor principal MCP
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
│   ├── utils/             # Testes dos utilitários
│   ├── integration/       # Testes de integração
│   ├── helpers/           # Utilitários de teste
│   ├── run-all-tests.js   # Executa todos os testes
│   └── run-tools-tests.js # Executa apenas testes das ferramentas
├── docs/                  # Documentação
└── README.md
```

## Benefícios da Arquitetura

- ✅ **Atomicidade** - Cada ferramenta é independente e testável
- ✅ **Manutenibilidade** - Código organizado e modular
- ✅ **Extensibilidade** - Novas ferramentas são carregadas automaticamente
- ✅ **Testabilidade** - Testes isolados e granulares por ferramenta
- ✅ **Colaboração** - Desenvolvimento paralelo possível
- ✅ **Execução Granular** - Possibilidade de testar componentes específicos

## Sistema ToolRegistry

O `ToolRegistry` é o coração do sistema refatorado:

- **Carregamento automático**: Detecta e carrega todas as ferramentas do diretório `tools/`
- **Gerenciamento centralizado**: Mantém registro de todas as ferramentas disponíveis
- **Execução unificada**: Interface única para executar qualquer ferramenta
- **Tratamento de erro**: Gerenciamento consistente de erros

## Desenvolvimento Local

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/afialho/mcp-dev-utils.git
cd mcp-dev-utils

# Instalar dependências
npm install
```

### Executar em Desenvolvimento

```bash
# Executar servidor em modo desenvolvimento (com auto-reload)
npm run dev

# Executar servidor normalmente
npm start

# Executar testes
npm test

# Verificar estrutura do projeto
tree dev-utils/
```

## Adicionar Nova Ferramenta

### 1. Criar o Arquivo da Ferramenta

Crie `tools/nova-ferramenta.js`:

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

    try {
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

module.exports = novaFerramentaTool;
```

### 2. Carregamento Automático

A ferramenta será carregada automaticamente pelo ToolRegistry na próxima inicialização do servidor. Não é necessário registrar manualmente.

### 3. Criar Testes

Crie `tests/tools/nova-ferramenta.test.js`:

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

### 4. Adicionar Script npm

Adicione no `package.json`:

```json
{
  "scripts": {
    "test:nova": "node tests/tools/nova-ferramenta.test.js"
  }
}
```

## Estrutura de uma Ferramenta

Cada ferramenta deve exportar um objeto com:

- **`name`**: Nome único da ferramenta (usado pelo MCP)
- **`description`**: Descrição clara da funcionalidade
- **`inputSchema`**: Schema JSON para validação de parâmetros
- **`execute(args)`**: Função assíncrona que implementa a lógica

### Padrões de Resposta

```javascript
// Sucesso
return {
  content: [
    {
      type: 'text',
      text: 'Resultado da operação'
    }
  ]
};

// Erro
return {
  content: [
    {
      type: 'text',
      text: '❌ Descrição do erro'
    }
  ]
};
```

## Debugging

### Logs do Servidor

```bash
# Executar com logs detalhados
DEBUG=* npm start

# Logs específicos do MCP
DEBUG=mcp:* npm start
```

### Testar Ferramenta Específica

```bash
# Testar apenas uma ferramenta
npm run test:uuid
npm run test:email
npm run test:hash
```

### Verificar Carregamento

```bash
# Verificar se todas as ferramentas foram carregadas
node -e "
const ToolRegistry = require('./utils/tool-registry');
const registry = new ToolRegistry();
registry.loadTools();
console.log('Ferramentas carregadas:', registry.getToolNames());
console.log('Total:', registry.getToolCount());
"
```
