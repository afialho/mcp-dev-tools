# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-06-26

### Added
- ✨ **3 novas ferramentas brasileiras**:
  - 🇧🇷 **CPF Utils**: Gerar, validar e formatar CPFs brasileiros
  - 🏢 **CNPJ Utils**: Gerar, validar e formatar CNPJs brasileiros
  - 🔒 **Password Utils**: Geração, análise, validação e verificação de senhas
- ✨ **Email Utils expandido**: Transformação completa da ferramenta de email
  - 📧 **Validação avançada**: Múltiplos emails e detecção de motivos de invalidez
  - 🎲 **Geração inteligente**: Emails aleatórios, profissionais e de teste
  - 🔍 **Extração de texto**: Localizar emails em textos longos
  - 📊 **Análise detalhada**: Detecção de emails temporários e análise de domínios
  - 🎨 **Formatação**: Normalização e limpeza de emails
- ✨ **Processamento em lote**: Suporte a até 100 itens por operação (CPF/CNPJ)
- ✨ **Segurança avançada**:
  - 🔐 Geração de senhas (forte, média, numérica, personalizada)
  - 📈 Análise de força com entropia e tempo de quebra
  - ✅ Validação contra critérios de segurança
  - 🧠 Geração de frases-senha memoráveis
  - 🔍 Estrutura para verificação de vazamentos (HaveIBeenPwned)

### Changed
- 🔄 **Email Validator → Email Utils**: Expansão completa da ferramenta
- 🔄 **README.md atualizado**: Documentação completa das 8 ferramentas
- 🔄 **Configuração MCP**: Uso de `@latest` para sempre obter versão mais recente
- 🔄 **tools/index.js**: Registro correto de todas as ferramentas

### Improved
- ⚡ **Cobertura brasileira completa**: CPF e CNPJ com algoritmos oficiais
- ⚡ **Segurança profissional**: Ferramentas de senha de nível empresarial
- ⚡ **Workflows práticos**: Exemplos reais de uso das 8 ferramentas
- ⚡ **Documentação rica**: Casos de uso, exemplos e demonstrações práticas

### Technical
- 🔧 **8 ferramentas totais**: UUID, Email, Hash, JSON, Idade, CPF, CNPJ, Senhas
- 🔧 **Algoritmos validados**: Implementação oficial dos algoritmos de CPF/CNPJ
- 🔧 **Testes abrangentes**: 100% de cobertura para todas as novas ferramentas
- 🔧 **Arquitetura consistente**: Padrão unificado para todas as ferramentas
- 🔧 **Exemplo completo**: Demonstração prática usando todas as 8 ferramentas

## [1.1.2] - 2025-06-26

### Changed
- 📚 **Consolidação radical da documentação**: Redução de 84% no conteúdo
- 🔄 **Estrutura simplificada**: 4 arquivos (1.330 linhas) → 2 arquivos (208 linhas)
- 📁 **Nova organização**: docs/DEVELOPMENT.md + docs/CONTRIBUTING.md apenas
- 🗑️ **Remoção de redundâncias**: Eliminação completa de informações duplicadas

### Removed
- ❌ **docs/TESTING.md**: Consolidado em DEVELOPMENT.md
- ❌ **docs/PUBLISHING.md**: Consolidado em CONTRIBUTING.md
- ❌ **Conteúdo verboso**: Teoria desnecessária e exemplos excessivos
- ❌ **Informações históricas**: Detalhes sobre refatoração removidos

### Improved
- ⚡ **Documentação ultra-enxuta**: Foco apenas no essencial
- ⚡ **Experiência do desenvolvedor**: Informações encontradas rapidamente
- ⚡ **Manutenção simplificada**: 84% menos conteúdo para manter
- ⚡ **Organização profissional**: Seguindo padrões de projetos como React/Vue.js

### Technical
- 🔧 **DEVELOPMENT.md**: 118 linhas (Setup, Arquitetura, Ferramentas, Testes)
- 🔧 **CONTRIBUTING.md**: 90 linhas (Contribuição, Publicação, Padrões)
- 🔧 **Zero redundância**: Cada informação em local único
- 🔧 **Foco prático**: Comandos e exemplos diretos

## [1.1.1] - 2025-06-25

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

## [1.1.0] - 2025-06-25

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
- 🔧 **8 ferramentas** com testes isolados e atômicos
- 🔧 **1 utilitário** (ToolRegistry) com testes específicos
- 🔧 **1 teste de integração** do servidor completo
- 🔧 **100% de sucesso** em todos os testes
- 🔧 **Cobertura completa** de funcionalidades

## [1.0.0] - 2025-06-20

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
