# Guia de Desenvolvimento

## Setup

```bash
git clone https://github.com/afialho/mcp-dev-tools.git
cd mcp-dev-tools
npm install
npm test
```

## Arquitetura

```
tools/           # Ferramentas individuais (carregamento automático)
utils/           # ToolRegistry (gerencia ferramentas)
tests/tools/     # Testes isolados por ferramenta
bin/server.js    # Servidor MCP principal
```

**ToolRegistry**: Carrega automaticamente todas as ferramentas do diretório `tools/`. Não é necessário registrar manualmente.

## Adicionar Nova Ferramenta

### 1. Criar Ferramenta

`tools/nova-ferramenta.js`:
```javascript
const novaFerramentaTool = {
  name: 'nome_ferramenta',
  description: 'Descrição da ferramenta',
  inputSchema: {
    type: 'object',
    properties: {
      parametro: { type: 'string', description: 'Descrição do parâmetro' }
    },
    required: ['parametro']
  },

  async execute(args) {
    const { parametro } = args;
    try {
      const resultado = `Resultado: ${parametro}`;
      return { content: [{ type: 'text', text: resultado }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `❌ Erro: ${error.message}` }] };
    }
  }
};

module.exports = novaFerramentaTool;
```

### 2. Criar Teste

`tests/tools/nova-ferramenta.test.js`:
```javascript
const novaFerramenta = require('../../tools/nova-ferramenta');
const { testTool } = require('../helpers/test-utils');

async function runNovaFerramentaTests() {
  console.log('🚀 Testando Nova Ferramenta...\n');

  await testTool(novaFerramenta, { parametro: 'teste' }, ['Resultado:', 'teste']);

  console.log('✅ Nova Ferramenta - Testes passaram!');
}

if (require.main === module) {
  runNovaFerramentaTests().catch(console.error);
}

module.exports = { runNovaFerramentaTests };
```

### 3. Adicionar Script

`package.json`:
```json
"test:nova": "node tests/tools/nova-ferramenta.test.js"
```

## Testes e Debugging

### Comandos de Teste
```bash
npm test                    # Todos os testes
npm run test:tools         # Apenas ferramentas
npm run test:uuid          # Ferramenta específica
```

### Debugging
```bash
DEBUG=* npm start          # Logs detalhados
npm run dev               # Servidor com auto-reload
```

### Verificar Carregamento
```bash
node -e "
const ToolRegistry = require('./utils/tool-registry');
const registry = new ToolRegistry();
registry.loadTools();
console.log('Ferramentas:', registry.getToolNames());
"
```

### Estrutura de Ferramenta
- **`name`**: Nome único (usado pelo MCP)
- **`description`**: Descrição clara
- **`inputSchema`**: Schema JSON para validação
- **`execute(args)`**: Função assíncrona principal

### Padrões de Resposta
```javascript
// Sucesso: { content: [{ type: 'text', text: 'resultado' }] }
// Erro: { content: [{ type: 'text', text: '❌ erro' }] }
```
