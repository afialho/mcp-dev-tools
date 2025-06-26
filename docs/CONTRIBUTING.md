# Guia de Contribuição

## Como Contribuir

### Setup
```bash
# Fork no GitHub, depois:
git clone https://github.com/SEU_USERNAME/mcp-dev-utils.git
cd mcp-dev-utils
npm install
git remote add upstream https://github.com/afialho/mcp-dev-utils.git
npm test
```

### Fluxo
```bash
git checkout main && git pull upstream main
git checkout -b feature/nova-ferramenta
# fazer mudanças
npm test
git push origin feature/nova-ferramenta
# criar PR no GitHub
```

## Publicação

### Fluxo Básico
```bash
npm test                    # Validar
npm version patch           # Atualizar versão (patch/minor/major)
npm publish                 # Publicar no npm
```

### Checklist
- [ ] Todos os testes passando
- [ ] CHANGELOG.md atualizado
- [ ] Versão correta no package.json
- [ ] Testado localmente

### Versionamento (SemVer)
- **patch**: Correções de bugs (1.1.0 → 1.1.1)
- **minor**: Novas funcionalidades (1.1.0 → 1.2.0)
- **major**: Breaking changes (1.1.0 → 2.0.0)

## Padrões

### Commits
```bash
feat(tools): add password generator
fix(uuid): correct v1 timestamp
docs(readme): update examples
test(email): add edge cases
```

### Código
- Manter consistência com ferramentas existentes
- Adicionar testes para novas funcionalidades
- Usar tratamento de erro robusto
- Seguir padrão de resposta MCP

### Testes
- Um arquivo por ferramenta em `tests/tools/`
- Usar helpers de `test-utils.js`
- Testar casos de sucesso e erro
- Executar `npm test` antes de commit

### Tipos de Contribuição
- **🛠️ Novas ferramentas**: Adicionar em `tools/` + testes
- **🐛 Correções**: Manter compatibilidade + testes de regressão
- **📚 Documentação**: README, docs/, comentários
- **🧪 Testes**: Novos casos, helpers, integração

## Comunicação

### Reportar Bugs
1. Verificar issues existentes
2. Incluir passos para reproduzir
3. Informar ambiente (Node.js, OS)

### Sugerir Funcionalidades
1. Descrever problema que resolve
2. Propor solução clara
3. Considerar impacto em usuários

## Código de Conduta

- Usar linguagem respeitosa e inclusiva
- Aceitar críticas construtivas
- Focar no que é melhor para o projeto
- Tratar todos com profissionalismo
