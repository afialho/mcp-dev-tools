# Guia de Testes

A arquitetura de testes foi refatorada para garantir **atomicidade**, **isolamento** e **execução granular**.

## Estrutura de Testes

```
tests/
├── tools/                          # Testes das ferramentas individuais
│   ├── uuid-generator.test.js      # Testa apenas UUID Generator
│   ├── email-validator.test.js     # Testa apenas Email Validator
│   ├── hash-generator.test.js      # Testa apenas Hash Generator
│   ├── json-formatter.test.js      # Testa apenas JSON Formatter
│   └── age-calculator.test.js      # Testa apenas Age Calculator
├── utils/
│   └── tool-registry.test.js       # Testa apenas ToolRegistry
├── integration/
│   └── server.test.js              # Testes de integração do servidor
├── helpers/
│   └── test-utils.js               # Utilitários compartilhados
├── run-all-tests.js                # Runner que executa todos
└── run-tools-tests.js              # Runner específico para ferramentas
```

## Executar Testes

### Executar Todos os Testes

```bash
# Executar todos os testes (recomendado)
npm test

# Ou diretamente
node tests/run-all-tests.js
```

### Executar Testes por Categoria

```bash
# Testar apenas as ferramentas individuais
npm run test:tools

# Testar apenas utilitários (ToolRegistry)
npm run test:registry

# Testar apenas integração do servidor
npm run test:server
```

### Executar Testes de Ferramentas Específicas

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

### Execução Direta (sem npm)

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

## Benefícios da Nova Estrutura

- ✅ **Atomicidade Total**: Cada teste é completamente isolado
- ✅ **Execução Granular**: Teste apenas o que você está desenvolvendo
- ✅ **Debugging Focado**: Falhas não afetam outros testes
- ✅ **Desenvolvimento Paralelo**: Diferentes desenvolvedores podem trabalhar simultaneamente
- ✅ **CI/CD Otimizado**: Testes podem ser executados em paralelo
- ✅ **Manutenção Simplificada**: Fácil localização e correção de problemas

## Helpers de Teste

### test-utils.js

O arquivo `tests/helpers/test-utils.js` contém utilitários compartilhados:

```javascript
const { testTool, testToolError, validateMcpResponse } = require('../helpers/test-utils');

// Testar ferramenta com sucesso esperado
await testTool(
  ferramenta,
  { parametro: 'valor' },
  ['texto_esperado_1', 'texto_esperado_2']
);

// Testar ferramenta com erro esperado
await testToolError(
  ferramenta,
  { parametro_invalido: 'valor' },
  ['erro_esperado', 'mensagem_erro']
);

// Validar resposta MCP
validateMcpResponse(response);
```

## Criar Novos Testes

### Para Nova Ferramenta

Crie `tests/tools/nova-ferramenta.test.js`:

```javascript
const novaFerramenta = require('../../tools/nova-ferramenta');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testCasoSucesso() {
  console.log('🧪 Testando caso de sucesso...');

  await testTool(
    novaFerramenta,
    { parametro: 'valor_valido' },
    ['resultado_esperado', 'outro_texto']
  );

  console.log('  ✅ Caso de sucesso funcionando');
}

async function testCasoErro() {
  console.log('🧪 Testando caso de erro...');

  await testToolError(
    novaFerramenta,
    { parametro: 'valor_invalido' },
    ['❌', 'erro_esperado']
  );

  console.log('  ✅ Caso de erro tratado corretamente');
}

async function runNovaFerramentaTests() {
  console.log('🚀 Testando Nova Ferramenta...\n');

  try {
    await testCasoSucesso();
    await testCasoErro();

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

### Adicionar ao Runner

Adicione no `tests/run-tools-tests.js`:

```javascript
const { runNovaFerramentaTests } = require('./tools/nova-ferramenta.test');

// Adicionar na função runAllToolsTests()
await runNovaFerramentaTests();
```

### Adicionar Script npm

Adicione no `package.json`:

```json
{
  "scripts": {
    "test:nova": "node tests/tools/nova-ferramenta.test.js"
  }
}
```

## Padrões de Teste

### Estrutura de um Teste

```javascript
async function testFuncionalidade() {
  console.log('🧪 Testando funcionalidade...');

  // Executar teste
  await testTool(ferramenta, args, expectedTexts);

  console.log('  ✅ Funcionalidade testada');
}

async function runFerramentaTests() {
  console.log('🚀 Testando Ferramenta...\n');

  try {
    await testFuncionalidade();
    console.log('\n✅ Ferramenta - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Ferramenta - Teste falhou:', error.message);
    throw error;
  }
}
```

### Validações

```javascript
// Validar resposta MCP
validateMcpResponse(result);

// Verificar conteúdo específico
assert(result.content[0].text.includes('texto_esperado'));

// Verificar estrutura
assert(result.content, 'Response deve ter content');
assert(Array.isArray(result.content), 'Content deve ser array');
```

## Debugging de Testes

### Executar Teste Específico

```bash
# Executar apenas um teste para debugging
node tests/tools/uuid-generator.test.js
```

### Ver Saída Detalhada

```javascript
// Adicionar logs para debugging
console.log('RESULT:', JSON.stringify(result, null, 2));
```

### Testar Ferramenta Diretamente

```bash
# Testar ferramenta diretamente no Node.js
node -e "
const uuid = require('./tools/uuid-generator');
uuid.execute({ versao: 'v4', quantidade: 1 })
  .then(result => console.log(JSON.stringify(result, null, 2)));
"
```

## CI/CD

### Scripts Automáticos

Os testes são executados automaticamente:

- **`prepublishOnly`**: Antes de publicar no npm
- **`prepack`**: Antes de empacotar
- **`version`**: Durante versionamento

### GitHub Actions

Exemplo de workflow para CI:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

## Métricas de Teste

### Cobertura Atual

- **5 ferramentas** testadas individualmente
- **1 utilitário** (ToolRegistry) testado
- **1 teste de integração** completo
- **100% de sucesso** em todos os testes
- **Execução granular** implementada

### Tempo de Execução

- **Teste individual**: ~1-2 segundos
- **Todos os testes das ferramentas**: ~5-10 segundos
- **Todos os testes**: ~10-15 segundos

## Troubleshooting

### Teste Falhando

1. **Executar individualmente**: `npm run test:ferramenta`
2. **Verificar logs**: Adicionar `console.log` no teste
3. **Testar ferramenta diretamente**: Usar Node.js REPL
4. **Verificar dependências**: `npm install`

### Performance

1. **Testes lentos**: Verificar se há operações síncronas desnecessárias
2. **Timeout**: Aumentar tempo limite se necessário
3. **Paralelização**: Usar execução granular para otimizar

### Manutenção

1. **Atualizar helpers**: Centralizar lógica comum em `test-utils.js`
2. **Refatorar testes**: Manter atomicidade e isolamento
3. **Documentar mudanças**: Atualizar este guia conforme necessário
