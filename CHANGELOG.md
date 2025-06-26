# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2024-12-26

### Added
- ✨ **Instruções completas de publicação no npm registry** no README
- ✨ **Scripts automáticos** para versionamento e publicação:
  - `prepublishOnly`: Executa testes antes de publicar
  - `prepack`: Executa testes antes de empacotar
  - `version`: Testa e adiciona mudanças ao commit
  - `postversion`: Push automático após versioning
- ✨ **Arquivo .npmignore** para otimização do pacote publicado
- ✨ **CHANGELOG.md** para documentação de versões
- ✨ **Workflow GitHub Actions** para publicação automatizada
- ✨ **Checklist completo** de publicação no README

### Changed
- 🔄 **README.md expandido** com seção detalhada de publicação
- 🔄 **package.json** com scripts automáticos de lifecycle
- 🔄 **Documentação de versionamento semântico** com exemplos práticos

### Improved
- ⚡ **Processo de publicação automatizado** com validação de qualidade
- ⚡ **Fluxo de desenvolvimento** otimizado com scripts automáticos
- ⚡ **Qualidade garantida** com testes obrigatórios antes da publicação
- ⚡ **Documentação profissional** para contribuidores e mantenedores

### Technical
- 🔧 **Configuração completa** para publicação no npm registry
- 🔧 **Automação de git operations** durante versionamento
- 🔧 **Otimização do tamanho** do pacote com .npmignore
- 🔧 **Padronização do processo** de release

## [1.1.0] - 2024-12-25

### Added
- ✨ **Arquitetura de testes refatorada**: Testes individuais e atômicos
- ✨ **Execução granular**: Possibilidade de testar ferramentas específicas
- ✨ **Scripts npm granulares**: `test:uuid`, `test:email`, `test:hash`, etc.
- ✨ **Helpers de teste compartilhados**: Redução de duplicação de código
- ✨ **Estrutura modular**: `tests/tools/`, `tests/utils/`, `tests/integration/`
- ✨ **Runners específicos**: `run-tools-tests.js` para testes das ferramentas
- ✨ **JSON Formatter melhorado**: Suporte a formatos `rich`, `plain` e `both`

### Changed
- 🔄 **Estrutura de testes**: Migração de arquivos únicos para estrutura modular
- 🔄 **README atualizado**: Instruções detalhadas de testes e publicação
- 🔄 **package.json**: Scripts granulares para execução individual de testes

### Improved
- ⚡ **Atomicidade total**: Cada teste completamente isolado
- ⚡ **Debugging focado**: Falhas não afetam outros testes
- ⚡ **Desenvolvimento paralelo**: Diferentes desenvolvedores podem trabalhar simultaneamente
- ⚡ **CI/CD otimizado**: Testes podem ser executados em paralelo
- ⚡ **Manutenção simplificada**: Fácil localização e correção de problemas

### Technical
- 🔧 **5 ferramentas** com testes isolados e atômicos
- 🔧 **1 utilitário** (ToolRegistry) com testes específicos
- 🔧 **1 teste de integração** do servidor completo
- 🔧 **100% de sucesso** em todos os testes
- 🔧 **Cobertura completa** de funcionalidades

## [1.0.0] - 2024-12-24

### Added
- 🎉 **Versão inicial** do MCP Dev Utils
- ⚡ **5 ferramentas essenciais**:
  - UUID Generator (v4 e v1)
  - Email Validator
  - Hash Generator (SHA256, MD5, SHA1)
  - JSON Formatter
  - Age Calculator
- 🏗️ **Arquitetura modular**: Sistema ToolRegistry para carregamento automático
- 🧪 **Testes automatizados**: Validação completa de todas as funcionalidades
- 📦 **Servidor MCP**: Interface compatível com Model Context Protocol
- 🔧 **Sistema extensível**: Fácil adição de novas ferramentas

### Technical
- 🚀 **74% redução** no código do servidor principal
- 🔄 **Carregamento automático** de ferramentas
- ✅ **100% compatibilidade** com versões anteriores
- 📋 **Schemas JSON** para validação de parâmetros
- 🛡️ **Tratamento robusto** de erros

---

## Formato das Entradas

### Types
- `Added` para novas funcionalidades
- `Changed` para mudanças em funcionalidades existentes
- `Deprecated` para funcionalidades que serão removidas
- `Removed` para funcionalidades removidas
- `Fixed` para correções de bugs
- `Security` para correções de vulnerabilidades

### Emojis
- ✨ Novas funcionalidades
- 🔄 Mudanças
- 🐛 Correções de bugs
- 🔧 Melhorias técnicas
- 📚 Documentação
- ⚡ Performance
- 🛡️ Segurança
- 🎉 Marcos importantes
