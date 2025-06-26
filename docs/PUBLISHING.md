# Guia de Publicação no Registry

Este documento contém instruções completas para publicar o pacote `mcp-dev-utils` no registry npm.

## Preparação para Publicação

### 1. Validação Completa

```bash
# Executar todos os testes
npm test

# Verificar se não há problemas de lint/formato
npm run dev # Testar servidor localmente

# Verificar estrutura do pacote
npm pack --dry-run
```

### 2. Atualizar Versão

```bash
# Versão patch (1.1.0 → 1.1.1) - correções de bugs
npm version patch

# Versão minor (1.1.0 → 1.2.0) - novas funcionalidades
npm version minor

# Versão major (1.1.0 → 2.0.0) - mudanças breaking
npm version major
```

> **Nota**: Os comandos `npm version` executam automaticamente os testes e fazem commit/push das mudanças graças aos scripts `version` e `postversion` configurados no package.json.

### 3. Verificar package.json

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

## Processo de Publicação

### 1. Login no npm

```bash
# Fazer login (apenas na primeira vez)
npm login

# Verificar usuário logado
npm whoami
```

### 2. Publicar

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

### 3. Verificar Publicação

```bash
# Verificar se foi publicado
npm view mcp-dev-utils

# Verificar versões disponíveis
npm view mcp-dev-utils versions --json

# Testar instalação
npx mcp-dev-utils@latest
```

## Versionamento Semântico

Siga o padrão [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (1.X.0): Novas funcionalidades compatíveis
- **PATCH** (1.1.X): Correções de bugs compatíveis

### Exemplos de Versionamento

```bash
# Correção de bug no UUID Generator
npm version patch  # 1.1.0 → 1.1.1

# Nova ferramenta adicionada (Password Generator)
npm version minor  # 1.1.1 → 1.2.0

# Mudança na interface MCP (breaking change)
npm version major  # 1.2.0 → 2.0.0
```

## Automatização com GitHub Actions

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

## Scripts Automáticos Configurados

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

### Fluxo Automático

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

## Checklist de Publicação

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

### Atualizando CHANGELOG.md

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

## Comandos Úteis

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

## Otimização do Pacote

### .npmignore

O arquivo `.npmignore` está configurado para excluir:

```
# Arquivos de desenvolvimento
.git/
.github/
.vscode/
.idea/

# Logs e temporários
logs
*.log
.DS_Store

# Arquivos específicos
TEST_REFACTORING_GUIDE.md
```

### Verificar Conteúdo

```bash
# Ver o que será incluído no pacote
npm pack --dry-run

# Verificar tamanho
npm pack
ls -la *.tgz
```

## Troubleshooting

### Problemas Comuns

#### Nome já existe
```bash
# Verificar se nome está disponível
npm view mcp-dev-utils

# Alternativas se estiver ocupado
npm view @seu-username/mcp-dev-utils
npm view mcp-developer-utils
```

#### Erro de autenticação
```bash
# Verificar login
npm whoami

# Fazer login novamente
npm logout
npm login
```

#### Testes falhando
```bash
# Executar testes individualmente
npm run test:tools
npm run test:uuid

# Verificar logs detalhados
DEBUG=* npm test
```

### Rollback

Se precisar reverter uma publicação:

```bash
# Deprecar versão problemática
npm deprecate mcp-dev-utils@1.1.1 "Versão com problemas, use 1.1.0"

# Publicar correção
npm version patch
npm publish
```

## Fluxo Completo

### Processo Recomendado

```bash
# 1. Atualizar CHANGELOG.md manualmente
# 2. Executar versionamento (automático)
npm version patch  # ou minor/major

# 3. Publicar
npm publish

# 4. Verificar
npm view mcp-dev-utils@latest
```

### Resultado Esperado

Após a publicação, o pacote estará disponível:

```bash
# Instalação global
npm install -g mcp-dev-utils

# Uso via npx
npx mcp-dev-utils

# Instalação em projetos
npm install mcp-dev-utils
```

## Monitoramento

### Métricas

- **Downloads**: Acompanhar via npm stats
- **Issues**: Monitorar GitHub issues
- **Feedback**: Acompanhar comentários e reviews

### Manutenção

- **Atualizações regulares**: Manter dependências atualizadas
- **Correções de bugs**: Responder rapidamente a issues
- **Novas funcionalidades**: Baseadas no feedback da comunidade
