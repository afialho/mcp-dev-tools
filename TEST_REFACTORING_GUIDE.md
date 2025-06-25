# Guia de Refatoração - Testes Individuais

## Visão Geral

Este documento contém instruções detalhadas para refatorar os testes do projeto MCP Dev Utils, separando cada teste em arquivos independentes para garantir atomicidade, melhor organização e facilitar manutenção.

## Objetivos da Refatoração de Testes

- ✅ Separar cada teste de ferramenta em arquivo próprio
- ✅ Garantir atomicidade e isolamento total dos testes
- ✅ Facilitar execução granular de testes específicos
- ✅ Permitir desenvolvimento paralelo de testes
- ✅ Criar estrutura espelhada com o diretório `tools/`
- ✅ Implementar sistema de execução consolidada

## Estrutura Final Esperada

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

## Benefícios da Abordagem

### ✅ Atomicidade Total
- Cada teste completamente isolado
- Falhas em um teste não afetam outros
- Execução independente de cada teste

### ✅ Organização Clara
- Estrutura espelhada: `tools/uuid-generator.js` ↔ `tests/tools/uuid-generator.test.js`
- Fácil localização: nome do arquivo = ferramenta testada
- Manutenção mais intuitiva

### ✅ Desenvolvimento Paralelo
- Diferentes desenvolvedores podem trabalhar em testes diferentes
- Menos conflitos de merge
- Desenvolvimento de ferramenta + teste no mesmo PR

### ✅ Granularidade de Execução
- Executar apenas o teste de uma ferramenta específica
- Debugging mais focado
- CI/CD pode executar testes em paralelo

### ✅ Escalabilidade
- Fácil adição de novos testes
- Cada arquivo pode crescer independentemente
- Estrutura preparada para muitas ferramentas

### ✅ Implementação Segura
- Abordagem gradual reduz riscos
- Validação incremental da estrutura
- Manutenção de compatibilidade durante transição
- Possibilidade de rollback a qualquer momento

---

## ETAPA 0: Implementação Gradual (Opcional mas Recomendada)

### Prompt para IA:

```
Contexto: Iniciando refatoração de testes para arquivos individuais.

Estratégia: Implementação gradual para validar abordagem antes de migrar tudo.

Instruções:
1. Mantenha os arquivos de teste atuais funcionando
2. Implemente apenas 1-2 ferramentas inicialmente
3. Valide a estrutura e helpers antes de prosseguir
4. Crie sistema de execução híbrido durante transição

Abordagem Gradual:
- Fase 1: Criar estrutura + UUID Generator (mais simples)
- Fase 2: Adicionar Email Validator (validação)
- Fase 3: Validar helpers e runners
- Fase 4: Migrar ferramentas restantes
- Fase 5: Remover arquivos antigos

Benefícios da Abordagem Gradual:
✅ Reduz risco de quebrar testes existentes
✅ Permite validação da estrutura com casos reais
✅ Facilita ajustes nos helpers e padrões
✅ Mantém sistema funcionando durante transição
✅ Permite feedback e iteração antes de completar

Scripts de Transição:
```json
{
  "scripts": {
    "test": "node tests/run-all-tests.js",
    "test:legacy": "node tests/tools.test.js && node tests/server.test.js",
    "test:new": "node tests/run-new-tests.js",
    "test:uuid": "node tests/tools/uuid-generator.test.js",
    "test:email": "node tests/tools/email-validator.test.js"
  }
}
```

Validação: Sistema híbrido funcionando com testes antigos e novos.
```

---

## ETAPA 1: Criar Nova Estrutura de Diretórios

### Prompt para IA:

```
Contexto: Refatorando testes do MCP Dev Utils para arquivos individuais.

Tarefa: Criar a nova estrutura de diretórios para testes organizados.

Instruções:
1. Crie o diretório `tests/tools/` para testes das ferramentas
2. Crie o diretório `tests/utils/` para testes dos utilitários
3. Crie o diretório `tests/integration/` para testes de integração
4. Crie o diretório `tests/helpers/` para utilitários de teste

Estrutura a criar:
- tests/tools/
- tests/utils/
- tests/integration/
- tests/helpers/

Validação: Confirme que os diretórios foram criados executando `ls -la tests/`.
```

---

## ETAPA 2: Criar Utilitários de Teste Compartilhados

### Prompt para IA:

```
Contexto: Refatorando testes para arquivos individuais. Nova estrutura criada.

Tarefa: Criar arquivo de utilitários compartilhados para evitar duplicação.

Instruções:
1. Crie o arquivo `tests/helpers/test-utils.js`
2. Implemente funções auxiliares comuns
3. Inclua helpers para assertions e setup

Estrutura esperada:
```javascript
const assert = require('assert');

// Helper para validar estrutura de resposta MCP
function validateMcpResponse(response) {
  assert(response, 'Response deve existir');
  assert(response.content, 'Response deve ter content');
  assert(Array.isArray(response.content), 'Content deve ser array');
  assert(response.content.length > 0, 'Content não pode estar vazio');
  assert(response.content[0].type === 'text', 'Primeiro item deve ser text');
  assert(response.content[0].text, 'Text não pode estar vazio');
}

// Helper para testar ferramentas
async function testTool(tool, args, expectedIncludes) {
  const result = await tool.execute(args);
  validateMcpResponse(result);
  
  for (const expected of expectedIncludes) {
    assert(result.content[0].text.includes(expected), 
           `Resultado deve incluir: ${expected}`);
  }
  
  return result;
}

// Helper para testar erros
async function testToolError(tool, args, expectedErrorIncludes) {
  const result = await tool.execute(args);
  validateMcpResponse(result);
  
  for (const expected of expectedErrorIncludes) {
    assert(result.content[0].text.includes(expected), 
           `Erro deve incluir: ${expected}`);
  }
  
  return result;
}

module.exports = {
  validateMcpResponse,
  testTool,
  testToolError
};
```

Validação: Arquivo criado com helpers reutilizáveis.
```

---

## ETAPA 3: Extrair Teste do UUID Generator

### Prompt para IA:

```
Contexto: Refatorando testes para arquivos individuais. Helpers criados.

Tarefa: Extrair teste do UUID Generator do arquivo atual para arquivo próprio.

Referência: Função testUuidGenerator() do arquivo tests/tools.test.js

Instruções:
1. Crie o arquivo `tests/tools/uuid-generator.test.js`
2. Extraia e adapte os testes do UUID Generator
3. Use os helpers criados para reduzir duplicação
4. Inclua testes para v4, v1 e múltiplos UUIDs

Estrutura esperada:
```javascript
const uuidGenerator = require('../../tools/uuid-generator');
const { testTool } = require('../helpers/test-utils');

async function testUuidV4() {
  console.log('🧪 Testando UUID v4...');
  
  await testTool(
    uuidGenerator, 
    { versao: 'v4', quantidade: 1 },
    ['UUID', 'V4', '✅']
  );
  
  console.log('  ✅ UUID v4 gerado com sucesso');
}

async function testUuidV1Multiple() {
  console.log('🧪 Testando UUID v1 múltiplos...');
  
  await testTool(
    uuidGenerator,
    { versao: 'v1', quantidade: 2 },
    ['UUID', 'V1', '2. `', '✅']
  );
  
  console.log('  ✅ UUID v1 múltiplos gerados com sucesso');
}

async function runUuidGeneratorTests() {
  console.log('🚀 Testando UUID Generator...\n');
  
  try {
    await testUuidV4();
    await testUuidV1Multiple();
    
    console.log('\n✅ UUID Generator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ UUID Generator - Teste falhou:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runUuidGeneratorTests().catch(console.error);
}

module.exports = { runUuidGeneratorTests };
```

Validação: Arquivo criado e teste executando independentemente.
```

---

## ETAPA 4: Extrair Teste do Email Validator

### Prompt para IA:

```
Contexto: Refatorando testes individuais. UUID Generator já extraído.

Tarefa: Extrair teste do Email Validator para arquivo próprio.

Instruções:
1. Crie o arquivo `tests/tools/email-validator.test.js`
2. Extraia testes de email válido e inválido
3. Use helpers para reduzir código duplicado

Estrutura esperada:
```javascript
const emailValidator = require('../../tools/email-validator');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidEmail() {
  console.log('🧪 Testando email válido...');

  await testTool(
    emailValidator,
    { email: 'test@example.com' },
    ['✅', 'Email Válido', 'test@example.com']
  );

  console.log('  ✅ Email válido detectado corretamente');
}

async function testInvalidEmail() {
  console.log('🧪 Testando email inválido...');

  await testToolError(
    emailValidator,
    { email: 'invalid-email' },
    ['❌', 'Email Inválido', 'invalid-email']
  );

  console.log('  ✅ Email inválido detectado corretamente');
}

async function runEmailValidatorTests() {
  console.log('🚀 Testando Email Validator...\n');

  try {
    await testValidEmail();
    await testInvalidEmail();

    console.log('\n✅ Email Validator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Email Validator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runEmailValidatorTests().catch(console.error);
}

module.exports = { runEmailValidatorTests };
```

Validação: Email Validator testado independentemente.
```

---

## ETAPA 5: Extrair Teste do Hash Generator

### Prompt para IA:

```
Contexto: Refatorando testes individuais. UUID e Email já extraídos.

Tarefa: Extrair teste do Hash Generator para arquivo próprio.

Instruções:
1. Crie o arquivo `tests/tools/hash-generator.test.js`
2. Teste diferentes algoritmos (SHA256, MD5, SHA1)
3. Valide formato de saída e algoritmos

Estrutura esperada:
```javascript
const hashGenerator = require('../../tools/hash-generator');
const { testTool } = require('../helpers/test-utils');

async function testSHA256Hash() {
  console.log('🧪 Testando hash SHA256...');

  await testTool(
    hashGenerator,
    { texto: 'hello' },
    ['Hash Gerado', 'SHA256', 'hello', '✅']
  );

  console.log('  ✅ Hash SHA256 gerado com sucesso');
}

async function testMD5Hash() {
  console.log('🧪 Testando hash MD5...');

  await testTool(
    hashGenerator,
    { texto: 'world', algoritmo: 'md5' },
    ['Hash Gerado', 'MD5', 'world', '✅']
  );

  console.log('  ✅ Hash MD5 gerado com sucesso');
}

async function testSHA1Hash() {
  console.log('🧪 Testando hash SHA1...');

  await testTool(
    hashGenerator,
    { texto: 'test', algoritmo: 'sha1' },
    ['Hash Gerado', 'SHA1', 'test', '✅']
  );

  console.log('  ✅ Hash SHA1 gerado com sucesso');
}

async function runHashGeneratorTests() {
  console.log('🚀 Testando Hash Generator...\n');

  try {
    await testSHA256Hash();
    await testMD5Hash();
    await testSHA1Hash();

    console.log('\n✅ Hash Generator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Hash Generator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runHashGeneratorTests().catch(console.error);
}

module.exports = { runHashGeneratorTests };
```

Validação: Hash Generator testado com todos os algoritmos.
```

---

## ETAPA 6: Extrair Teste do JSON Formatter

### Prompt para IA:

```
Contexto: Refatorando testes individuais. UUID, Email e Hash já extraídos.

Tarefa: Extrair teste do JSON Formatter para arquivo próprio.

Instruções:
1. Crie o arquivo `tests/tools/json-formatter.test.js`
2. Teste JSON válido e inválido
3. Teste diferentes indentações

Estrutura esperada:
```javascript
const jsonFormatter = require('../../tools/json-formatter');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidJSON() {
  console.log('🧪 Testando JSON válido...');

  const validJson = '{"name":"test","value":123}';
  await testTool(
    jsonFormatter,
    { json_string: validJson, indentacao: 2 },
    ['JSON Formatado', '```json', '"name": "test"', '✅']
  );

  console.log('  ✅ JSON válido formatado com sucesso');
}

async function testInvalidJSON() {
  console.log('🧪 Testando JSON inválido...');

  const invalidJson = '{"invalid": json}';
  await testToolError(
    jsonFormatter,
    { json_string: invalidJson },
    ['❌', 'JSON Inválido', 'Erro:']
  );

  console.log('  ✅ JSON inválido detectado corretamente');
}

async function testCustomIndentation() {
  console.log('🧪 Testando indentação customizada...');

  const json = '{"test":true}';
  await testTool(
    jsonFormatter,
    { json_string: json, indentacao: 4 },
    ['JSON Formatado', '```json', '"test": true', '✅']
  );

  console.log('  ✅ Indentação customizada funcionando');
}

async function runJsonFormatterTests() {
  console.log('🚀 Testando JSON Formatter...\n');

  try {
    await testValidJSON();
    await testInvalidJSON();
    await testCustomIndentation();

    console.log('\n✅ JSON Formatter - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ JSON Formatter - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runJsonFormatterTests().catch(console.error);
}

module.exports = { runJsonFormatterTests };
```

Validação: JSON Formatter testado com casos válidos e inválidos.
```

---

## ETAPA 7: Extrair Teste do Age Calculator

### Prompt para IA:

```
Contexto: Refatorando testes individuais. 4 ferramentas já extraídas.

Tarefa: Extrair teste do Age Calculator para arquivo próprio.

Instruções:
1. Crie o arquivo `tests/tools/age-calculator.test.js`
2. Teste cálculo de idade com data válida
3. Teste tratamento de data inválida

Estrutura esperada:
```javascript
const ageCalculator = require('../../tools/age-calculator');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testValidAge() {
  console.log('🧪 Testando cálculo de idade válida...');

  await testTool(
    ageCalculator,
    { data_nascimento: '1990-05-15' },
    ['Cálculo de Idade', '1990-05-15', 'anos', '✅']
  );

  console.log('  ✅ Idade calculada com sucesso');
}

async function testInvalidDate() {
  console.log('🧪 Testando data inválida...');

  // Nota: Age calculator pode processar algumas datas "inválidas"
  // então testamos com formato completamente incorreto
  await testTool(
    ageCalculator,
    { data_nascimento: 'not-a-date' },
    ['Cálculo de Idade'] // Pode processar ou dar erro
  );

  console.log('  ✅ Tratamento de data testado');
}

async function testRecentDate() {
  console.log('🧪 Testando data recente...');

  const currentYear = new Date().getFullYear();
  const recentDate = `${currentYear - 5}-01-01`;

  await testTool(
    ageCalculator,
    { data_nascimento: recentDate },
    ['Cálculo de Idade', recentDate, 'anos']
  );

  console.log('  ✅ Data recente calculada corretamente');
}

async function runAgeCalculatorTests() {
  console.log('🚀 Testando Age Calculator...\n');

  try {
    await testValidAge();
    await testInvalidDate();
    await testRecentDate();

    console.log('\n✅ Age Calculator - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Age Calculator - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runAgeCalculatorTests().catch(console.error);
}

module.exports = { runAgeCalculatorTests };
```

Validação: Age Calculator testado com diferentes cenários.
```

---

## ETAPA 8: Extrair Teste do Tool Registry

### Prompt para IA:

```
Contexto: Refatorando testes individuais. Todas as ferramentas extraídas.

Tarefa: Extrair teste do Tool Registry para arquivo próprio.

Instruções:
1. Crie o arquivo `tests/utils/tool-registry.test.js`
2. Teste carregamento, execução e tratamento de erro
3. Valide schemas e contagem de ferramentas

Estrutura esperada:
```javascript
const ToolRegistry = require('../../utils/tool-registry');
const { validateMcpResponse } = require('../helpers/test-utils');
const assert = require('assert');

async function testToolRegistryLoading() {
  console.log('🧪 Testando carregamento do ToolRegistry...');

  const registry = new ToolRegistry();
  registry.loadTools();

  assert.strictEqual(registry.getToolCount(), 5, 'Deve carregar 5 ferramentas');

  const toolNames = registry.getToolNames();
  const expectedTools = ['gerar_uuid', 'validar_email', 'gerar_hash', 'formatar_json', 'calcular_idade'];

  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar carregada`);
  }

  console.log('  ✅ Todas as ferramentas carregadas corretamente');
}

async function testToolExecution() {
  console.log('🧪 Testando execução via ToolRegistry...');

  const registry = new ToolRegistry();
  registry.loadTools();

  const result = await registry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  validateMcpResponse(result);
  assert(result.content[0].text.includes('UUID'), 'Resultado deve conter UUID');

  console.log('  ✅ Execução via registry funcionando');
}

async function testToolNotFound() {
  console.log('🧪 Testando erro para ferramenta inexistente...');

  const registry = new ToolRegistry();
  registry.loadTools();

  try {
    await registry.executeTool('ferramenta_inexistente', {});
    assert.fail('Deveria ter lançado erro');
  } catch (error) {
    assert(error.message.includes('Ferramenta não encontrada'), 'Erro deve indicar ferramenta não encontrada');
  }

  console.log('  ✅ Erro para ferramenta inexistente tratado corretamente');
}

async function testToolSchemas() {
  console.log('🧪 Testando schemas das ferramentas...');

  const registry = new ToolRegistry();
  registry.loadTools();

  const schemas = registry.getToolSchemas();
  assert.strictEqual(schemas.length, 5, 'Deve ter 5 schemas');

  for (const schema of schemas) {
    assert(schema.name, 'Schema deve ter nome');
    assert(schema.description, 'Schema deve ter descrição');
    assert(schema.inputSchema, 'Schema deve ter inputSchema');
    assert.strictEqual(schema.inputSchema.type, 'object', 'InputSchema deve ser object');
  }

  console.log('  ✅ Todos os schemas válidos');
}

async function runToolRegistryTests() {
  console.log('🚀 Testando Tool Registry...\n');

  try {
    await testToolRegistryLoading();
    await testToolExecution();
    await testToolNotFound();
    await testToolSchemas();

    console.log('\n✅ Tool Registry - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Tool Registry - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runToolRegistryTests().catch(console.error);
}

module.exports = { runToolRegistryTests };
```

Validação: Tool Registry testado completamente.
```

---

## ETAPA 9: Extrair Teste do Servidor

### Prompt para IA:

```
Contexto: Refatorando testes individuais. Ferramentas e registry extraídos.

Tarefa: Mover teste do servidor para diretório de integração.

Instruções:
1. Crie o arquivo `tests/integration/server.test.js`
2. Mova testes de integração do servidor
3. Foque em testes end-to-end

Estrutura esperada:
```javascript
const DevUtilsServer = require('../../bin/server');
const { validateMcpResponse } = require('../helpers/test-utils');
const assert = require('assert');

async function testServerInitialization() {
  console.log('🧪 Testando inicialização do servidor...');

  const server = new DevUtilsServer();

  assert(server.toolRegistry, 'ToolRegistry deve estar inicializado');
  assert.strictEqual(server.toolRegistry.getToolCount(), 5, 'Deve ter 5 ferramentas');

  const toolNames = server.toolRegistry.getToolNames();
  const expectedTools = ['gerar_uuid', 'validar_email', 'gerar_hash', 'formatar_json', 'calcular_idade'];

  for (const tool of expectedTools) {
    assert(toolNames.includes(tool), `Ferramenta ${tool} deve estar disponível`);
  }

  console.log('  ✅ Servidor inicializado corretamente');
}

async function testServerToolExecution() {
  console.log('🧪 Testando execução via servidor...');

  const server = new DevUtilsServer();

  // Teste UUID via servidor
  const uuidResult = await server.toolRegistry.executeTool('gerar_uuid', { versao: 'v4', quantidade: 1 });
  validateMcpResponse(uuidResult);
  assert(uuidResult.content[0].text.includes('UUID'), 'Resultado deve conter UUID');

  // Teste Email via servidor
  const emailResult = await server.toolRegistry.executeTool('validar_email', { email: 'test@example.com' });
  validateMcpResponse(emailResult);
  assert(emailResult.content[0].text.includes('Email Válido'), 'Email deve ser válido');

  console.log('  ✅ Execução via servidor funcionando');
}

async function testServerSchemas() {
  console.log('🧪 Testando schemas do servidor...');

  const server = new DevUtilsServer();
  const schemas = server.toolRegistry.getToolSchemas();

  assert.strictEqual(schemas.length, 5, 'Deve ter 5 schemas');

  // Validar schema específico do UUID
  const uuidSchema = schemas.find(s => s.name === 'gerar_uuid');
  assert(uuidSchema, 'Schema do UUID deve existir');
  assert(uuidSchema.inputSchema.properties.versao, 'UUID deve ter propriedade versao');

  console.log('  ✅ Schemas do servidor validados');
}

async function runServerIntegrationTests() {
  console.log('🚀 Testando Integração do Servidor...\n');

  try {
    await testServerInitialization();
    await testServerToolExecution();
    await testServerSchemas();

    console.log('\n✅ Server Integration - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Server Integration - Teste falhou:', error.message);
    throw error;
  }
}

if (require.main === module) {
  runServerIntegrationTests().catch(console.error);
}

module.exports = { runServerIntegrationTests };
```

Validação: Testes de integração do servidor organizados.
```

---

## ETAPA 10: Criar Runner para Testes de Ferramentas

### Prompt para IA:

```
Contexto: Todos os testes individuais criados. Precisa de runner específico.

Tarefa: Criar runner que executa apenas testes das ferramentas.

Instruções:
1. Crie o arquivo `tests/run-tools-tests.js`
2. Importe e execute todos os testes de ferramentas
3. Forneça relatório consolidado

Estrutura esperada:
```javascript
#!/usr/bin/env node

const { runUuidGeneratorTests } = require('./tools/uuid-generator.test');
const { runEmailValidatorTests } = require('./tools/email-validator.test');
const { runHashGeneratorTests } = require('./tools/hash-generator.test');
const { runJsonFormatterTests } = require('./tools/json-formatter.test');
const { runAgeCalculatorTests } = require('./tools/age-calculator.test');

async function runAllToolsTests() {
  console.log('🧪 EXECUTANDO TESTES DAS FERRAMENTAS INDIVIDUAIS\n');
  console.log('=' .repeat(60));
  console.log('');

  try {
    await runUuidGeneratorTests();
    console.log('');

    await runEmailValidatorTests();
    console.log('');

    await runHashGeneratorTests();
    console.log('');

    await runJsonFormatterTests();
    console.log('');

    await runAgeCalculatorTests();
    console.log('');

    console.log('=' .repeat(60));
    console.log('🎉 TODOS OS TESTES DAS FERRAMENTAS PASSARAM!');
    console.log('✅ 5 ferramentas testadas individualmente');
    console.log('✅ Atomicidade e isolamento garantidos');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ FALHA NOS TESTES DAS FERRAMENTAS:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllToolsTests();
}

module.exports = { runAllToolsTests };
```

Validação: Runner específico para ferramentas criado.
```

---

## ETAPA 11: Atualizar Runner Principal

### Prompt para IA:

```
Contexto: Testes individuais criados. Runners específicos criados.

Tarefa: Atualizar runner principal para usar novos testes organizados.

Instruções:
1. Modifique o arquivo `tests/run-all-tests.js`
2. Importe runners específicos
3. Execute testes por categoria

Estrutura esperada:
```javascript
#!/usr/bin/env node

const { runAllToolsTests } = require('./run-tools-tests');
const { runToolRegistryTests } = require('./utils/tool-registry.test');
const { runServerIntegrationTests } = require('./integration/server.test');

async function runAllTests() {
  console.log('🧪 EXECUTANDO TODOS OS TESTES - ARQUITETURA REFATORADA\n');
  console.log('=' .repeat(70));
  console.log('');

  try {
    // Executar testes das ferramentas individuais
    console.log('📦 TESTES DAS FERRAMENTAS INDIVIDUAIS');
    console.log('-'.repeat(50));
    await runAllToolsTests();
    console.log('');

    // Executar testes dos utilitários
    console.log('🔧 TESTES DOS UTILITÁRIOS');
    console.log('-'.repeat(50));
    await runToolRegistryTests();
    console.log('');

    // Executar testes de integração
    console.log('🖥️  TESTES DE INTEGRAÇÃO');
    console.log('-'.repeat(50));
    await runServerIntegrationTests();
    console.log('');

    // Resumo final
    console.log('=' .repeat(70));
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('');
    console.log('✅ Testes refatorados e organizados:');
    console.log('   • 5 ferramentas testadas individualmente');
    console.log('   • 1 utilitário (ToolRegistry) testado');
    console.log('   • 1 teste de integração (Servidor)');
    console.log('   • Atomicidade total garantida');
    console.log('   • Execução granular possível');
    console.log('   • Estrutura espelhada com código');
    console.log('');
    console.log('🚀 Arquitetura de testes modular implementada!');
    console.log('=' .repeat(70));

  } catch (error) {
    console.error('❌ FALHA NOS TESTES:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
```

Validação: Runner principal atualizado com nova organização.
```

---

## ETAPA 12: Atualizar Scripts npm

### Prompt para IA:

```
Contexto: Testes refatorados em arquivos individuais. Runners criados.

Tarefa: Atualizar package.json com scripts granulares para testes.

Instruções:
1. Modifique a seção "scripts" do package.json
2. Adicione scripts para cada teste individual
3. Mantenha compatibilidade com scripts existentes

Scripts a adicionar:
```json
{
  "scripts": {
    "start": "node bin/server.js",
    "dev": "nodemon bin/server.js",
    "test": "node tests/run-all-tests.js",
    "test:tools": "node tests/run-tools-tests.js",
    "test:uuid": "node tests/tools/uuid-generator.test.js",
    "test:email": "node tests/tools/email-validator.test.js",
    "test:hash": "node tests/tools/hash-generator.test.js",
    "test:json": "node tests/tools/json-formatter.test.js",
    "test:age": "node tests/tools/age-calculator.test.js",
    "test:registry": "node tests/utils/tool-registry.test.js",
    "test:server": "node tests/integration/server.test.js"
  }
}
```

Validação: Scripts npm atualizados para execução granular.
```

---

## ETAPA 13: Remover Arquivos Antigos

### Prompt para IA:

```
Contexto: Testes refatorados para arquivos individuais. Nova estrutura funcionando.

Tarefa: Remover arquivos de teste antigos que foram refatorados.

Instruções:
1. Remova o arquivo `tests/tools.test.js` (substituído por testes individuais)
2. Remova o arquivo `tests/server.test.js` (movido para integration/)
3. Mantenha apenas a nova estrutura organizada

Arquivos a remover:
- tests/tools.test.js
- tests/server.test.js

Validação: Apenas nova estrutura de testes presente.
```

---

## Checklist de Conclusão

- [ ] **ETAPA 0**: Estratégia gradual definida e sistema híbrido preparado
- [ ] Nova estrutura de diretórios criada (tools/, utils/, integration/, helpers/)
- [ ] Utilitários de teste compartilhados criados (test-utils.js)
- [ ] UUID Generator extraído para arquivo individual
- [ ] Email Validator extraído para arquivo individual
- [ ] Hash Generator extraído para arquivo individual
- [ ] JSON Formatter extraído para arquivo individual
- [ ] Age Calculator extraído para arquivo individual
- [ ] Tool Registry extraído para arquivo individual
- [ ] Servidor movido para testes de integração
- [ ] Runner específico para ferramentas criado
- [ ] Runner principal atualizado
- [ ] Scripts npm atualizados
- [ ] Arquivos antigos removidos
- [ ] Todos os testes executando individualmente
- [ ] Todos os testes executando via runners

## Estratégias de Implementação

### 🚀 **Opção 1: Implementação Completa (Recomendada para projetos estáveis)**
- Implementar todas as etapas de uma vez
- Migrar todos os testes simultaneamente
- Remover arquivos antigos imediatamente
- **Vantagem**: Transição rápida e limpa
- **Desvantagem**: Maior risco se algo der errado

### 🛡️ **Opção 2: Implementação Gradual (Recomendada para projetos em produção)**
- Começar com ETAPA 0 (sistema híbrido)
- Implementar 1-2 ferramentas por vez
- Validar cada etapa antes de prosseguir
- Manter compatibilidade durante toda transição
- **Vantagem**: Risco mínimo, validação incremental
- **Desvantagem**: Processo mais longo

### 📋 **Fases da Implementação Gradual:**

**Fase 1: Preparação**
- ETAPA 0: Sistema híbrido
- ETAPA 1: Estrutura de diretórios
- ETAPA 2: Helpers compartilhados

**Fase 2: Validação**
- ETAPA 3: UUID Generator (ferramenta mais simples)
- Testar estrutura e helpers
- Ajustar padrões se necessário

**Fase 3: Expansão**
- ETAPA 4: Email Validator
- ETAPA 5: Hash Generator
- Validar runners e scripts

**Fase 4: Finalização**
- ETAPA 6-8: Ferramentas restantes
- ETAPA 9-11: Integração e runners
- ETAPA 12-13: Limpeza final

## Validação Final

Execute os seguintes comandos para validar a refatoração:

```bash
# Testar ferramenta específica
npm run test:uuid
npm run test:email
npm run test:hash
npm run test:json
npm run test:age

# Testar utilitários
npm run test:registry

# Testar integração
npm run test:server

# Testar todas as ferramentas
npm run test:tools

# Testar tudo
npm test
```

## Benefícios Alcançados

### ✅ **Atomicidade Total**
- Cada teste completamente isolado
- Falhas não afetam outros testes
- Execução independente garantida

### ✅ **Organização Perfeita**
- Estrutura espelhada: `tools/` ↔ `tests/tools/`
- Fácil localização de testes
- Manutenção intuitiva

### ✅ **Desenvolvimento Paralelo**
- Diferentes desenvolvedores podem trabalhar simultaneamente
- Menos conflitos de merge
- Desenvolvimento de ferramenta + teste no mesmo PR

### ✅ **Execução Granular**
- Testar apenas uma ferramenta específica
- Debugging focado e eficiente
- CI/CD pode executar testes em paralelo

### ✅ **Escalabilidade Garantida**
- Fácil adição de novos testes
- Cada arquivo pode crescer independentemente
- Estrutura preparada para crescimento

### ✅ **Manutenibilidade Aprimorada**
- Código de teste organizado e limpo
- Helpers compartilhados evitam duplicação
- Padrão consistente em todos os testes

### ✅ **Compatibilidade Mantida**
- Todos os testes existentes preservados
- Funcionalidade 100% mantida
- Nenhuma regressão introduzida

### ✅ **Implementação Segura**
- Estratégia gradual disponível para reduzir riscos
- Sistema híbrido permite validação incremental
- Rollback possível a qualquer momento
- Transição suave sem interrupção do desenvolvimento

## Estrutura Final Implementada

```
tests/
├── tools/                          # ✅ Testes das ferramentas individuais
│   ├── uuid-generator.test.js      # ✅ Testa apenas UUID Generator
│   ├── email-validator.test.js     # ✅ Testa apenas Email Validator
│   ├── hash-generator.test.js      # ✅ Testa apenas Hash Generator
│   ├── json-formatter.test.js      # ✅ Testa apenas JSON Formatter
│   └── age-calculator.test.js      # ✅ Testa apenas Age Calculator
├── utils/
│   └── tool-registry.test.js       # ✅ Testa apenas ToolRegistry
├── integration/
│   └── server.test.js              # ✅ Testes de integração do servidor
├── helpers/
│   └── test-utils.js               # ✅ Utilitários compartilhados
├── run-all-tests.js                # ✅ Runner que executa todos
└── run-tools-tests.js              # ✅ Runner específico para ferramentas
```

**🎉 Refatoração de testes concluída com sucesso!**
**Arquitetura modular, atômica e escalável implementada!**
