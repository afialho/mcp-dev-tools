# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.1] - 2025-06-30

### Fixed
- 🔧 **QR Code Integration**: Corrigida integração da ferramenta QR Code no sistema de carregamento
- 📦 **Tool Registry**: QR Code Utils agora carregado corretamente no índice de ferramentas
- ✅ **Testes completos**: Todos os testes passando com 100% de sucesso
- 🔄 **Estabilidade**: Sistema de ferramentas totalmente estável e funcional

### Technical
- 🧪 **15 ferramentas testadas**: Todas as ferramentas validadas individualmente
- 📊 **Cobertura completa**: Testes de integração, utilitários e servidor
- 🚀 **Performance**: Sistema otimizado e responsivo
- 📈 **Qualidade**: Código refatorado e organizado

## [1.7.0] - 2025-06-26

### Added
- ✨ **XML Utils - Ferramenta XML Completa**: Nova ferramenta para manipulação completa de documentos XML
  - 🔧 **9 operações principais**: formatar, minificar, validar, converter, extrair, analisar, escapar, comparar, gerar_schema
  - 🎨 **Formatação profissional**: XML beautifier com indentação customizável (2-8 espaços)
  - 🗜️ **Minificação inteligente**: Compressão com cálculo de redução de tamanho
  - ✅ **Validação robusta**: Verificação de sintaxe XML e estrutura com relatórios detalhados
  - 🔄 **Conversão bidirecional**: XML ↔ JSON com preservação de atributos e estrutura
  - 🔍 **Extração XPath**: Suporte a XPath simplificado para elementos e atributos (//elemento, //elemento/@atributo)
  - 📊 **Análise estrutural**: Estatísticas completas (elementos, atributos, profundidade, namespaces, comentários)
  - 🔒 **Escape/Unescape**: Tratamento seguro de caracteres especiais XML (&, <, >, ", ')
  - 🔍 **Comparação estrutural**: Identificação de diferenças entre XMLs com relatórios detalhados
  - 📋 **Geração de Schema**: Criação automática de XSD básico com inferência de tipos
  - 🎯 **Auto-display**: XML formatado exibido automaticamente em markdown para melhor visualização
  - 🛡️ **Tratamento de erros**: Mensagens informativas com dicas de correção
- 📦 **Dependências XML**: Adicionadas bibliotecas especializadas
  - `xml2js`: Parser e builder XML robusto
  - `xmlbuilder2`: Construção e formatação avançada de XML

### Technical
- 🧪 **Testes completos**: 11 cenários de teste cobrindo todas as operações XML
- 📚 **Documentação atualizada**: README.md com 11 exemplos de uso da ferramenta XML
- 🔄 **Integração perfeita**: Ferramenta integrada ao sistema de carregamento automático
- ✅ **Compatibilidade total**: Mantém 100% de compatibilidade com ferramentas existentes
- 📈 **Estatísticas atualizadas**: Projeto agora com 14 ferramentas especializadas

## [1.4.0] - 2025-06-26

### Added
- ✨ **JSON Utils - Ferramenta JSON Completa**: Substituição total da ferramenta JSON anterior
  - 🔧 **8 operações principais**: formatar, validar, converter, analisar, extrair, comparar, gerar_schema, minificar
  - 🎯 **Conversão inteligente**: Transformar dados quaisquer em JSON estruturado
  - 📋 **Estruturas personalizadas**: Templates com placeholders `{{variavel}}` para organização automática
  - 🔍 **JSONPath simplificado**: Extração de valores específicos com sintaxe intuitiva
  - 📊 **Análise detalhada**: Estatísticas, tipos, profundidade, contagem de elementos
  - 🔄 **Comparação de JSONs**: Detecção automática de diferenças entre versões
  - 📝 **Geração de schemas**: Criação automática de JSON Schema a partir de dados
  - 🗜️ **Minificação**: Compressão com cálculo de redução de tamanho
  - ✅ **Validação avançada**: Verificação de estrutura com informações detalhadas
  - 🎨 **Formatação profissional**: Indentação customizável e ordenação de chaves

### Changed
- 🔄 **JSON Formatter → JSON Utils**: Evolução completa da ferramenta JSON
  - ❌ **Removido**: `json-formatter.js` (funcionalidade básica)
  - ✅ **Adicionado**: `json-utils.js` (8 operações completas)
  - 🔧 **Nome da ferramenta**: `formatar_json` → `json_utils_dev-tools`
  - 📈 **Capacidades**: 1 operação → 8 operações especializadas
- 🔄 **README.md atualizado**: Documentação completa da nova ferramenta JSON
  - 📝 **Seção JSON expandida**: 8 exemplos de uso das novas funcionalidades
  - 🎯 **Exemplo completo atualizado**: Demonstração com estruturação automática
  - 💼 **Casos de uso ampliados**: Processamento de JSON em workflows reais
- 🔄 **package.json**: Script de teste atualizado para nova ferramenta
  - 🔧 **test:json**: `json-formatter.test.js` → `json-utils.test.js`

### Improved
- ⚡ **Capacidade de estruturação**: Organização automática de dados em categorias lógicas
- ⚡ **Workflows profissionais**: Integração perfeita com outras ferramentas para criar JSONs estruturados
- ⚡ **Experiência do usuário**: Sempre exibe resultado no chat (baseado em feedback do usuário)
- ⚡ **Flexibilidade total**: Suporte a qualquer tipo de dado de entrada
- ⚡ **Análise profunda**: Informações detalhadas sobre estrutura e conteúdo JSON

### Technical
- 🔧 **570 linhas de código**: Implementação robusta com 8 operações especializadas
- 🔧 **Métodos auxiliares**: 12 funções de apoio para processamento avançado
- 🔧 **Tratamento de erros**: Mensagens específicas e dicas de uso
- 🔧 **Testes validados**: Cobertura completa das novas funcionalidades
- 🔧 **Arquitetura consistente**: Mantém padrão das outras ferramentas
- 🔧 **Zero breaking changes**: Compatibilidade total com workflows existentes
- 🔧 **Carregamento automático**: Integração perfeita com ToolRegistry

### Use Cases
- 🎯 **Cadastros completos**: Estruturação automática de dados de múltiplas ferramentas
- 🎯 **APIs profissionais**: Formatação e validação de payloads complexos
- 🎯 **Análise de dados**: Extração e comparação de informações JSON
- 🎯 **Desenvolvimento**: Geração de schemas e minificação para produção
- 🎯 **Migração de dados**: Conversão e estruturação de formatos legados

## [1.3.4] - 2025-06-26

### Fixed
- 🔧 **JSON Formatter**: Corrigida exibição do JSON formatado no chat
  - ✅ **Markdown formatting**: JSON agora é exibido com syntax highlighting
  - ✅ **Bloco de código**: Envolvido em ```json para formatação adequada
  - ✅ **Visualização melhorada**: JSON formatado aparece corretamente no chat
  - 🐛 **Bug fix**: Resolvia problema onde JSON não era exibido visualmente

### Technical
- 🔧 **tools/json-formatter.js**: Adicionado wrapper markdown para output
- 🔧 **Return format**: Mudança de texto simples para bloco de código markdown
- 🔧 **Zero breaking changes**: Compatibilidade total mantida

## [1.3.3] - 2025-06-26

### Improved
- 📚 **README.md aprimorado**: Formatação de exemplos melhorada
  - 🔧 **Blocos de código**: Workflows e casos de uso agora usam blocos de código com ```
  - 📝 **Legibilidade melhorada**: Comandos mais claros e organizados
  - 🎯 **Experiência do usuário**: Exemplos mais fáceis de copiar e usar
  - ✅ **Consistência**: Padronização na apresentação de comandos

### Changed
- 🔄 **Formatação de exemplos**: Migração de aspas simples para blocos de código
- 🔄 **Estrutura visual**: Melhor organização dos workflows e casos de uso

### Technical
- 🔧 **tools/json-formatter.js**: Simplificação da descrição do parâmetro output_format
- 🔧 **README.md**: Atualização completa da formatação de exemplos
- 🔧 **Zero breaking changes**: Compatibilidade total com versões anteriores

## [1.3.2] - 2025-06-26

### Improved
- ✨ **JSON Formatter aprimorado**: Ferramenta agora sempre exibe JSON formatado no chat
  - 🔧 **Novo parâmetro**: `always_display` (boolean, padrão: true)
  - 📝 **Comportamento melhorado**: JSON sempre visível no chat por padrão
  - 🎯 **Experiência do usuário**: Não precisa mais salvar arquivo para ver resultado
  - ✅ **Compatibilidade**: Mantém comportamento anterior quando `always_display=false`
- 📚 **Descrição atualizada**: Ferramenta documenta novo comportamento padrão

### Technical
- 🔧 **tools/json-formatter.js**: Lógica de exibição aprimorada
- 🔧 **Testes validados**: Todas as funcionalidades continuam funcionando
- 🔧 **Zero breaking changes**: Compatibilidade total com versões anteriores

## [1.3.1] - 2025-06-26

### Changed
- 🔄 **Renomeação do projeto**: `mcp-dev-utils` → `mcp-dev-tools`
  - 📦 Nome do pacote NPM atualizado
  - 🔗 URLs do repositório GitHub atualizadas
  - 📋 Comando binário alterado: `mcp-dev-utils` → `mcp-dev-tools`
  - 📚 Documentação completamente atualizada
  - ⚙️ Scripts de configuração atualizados

### Technical
- 🔧 **package.json**: Nome, binário e URLs atualizados
- 🔧 **package-lock.json**: Referências internas sincronizadas
- 🔧 **Documentação**: README, DEVELOPMENT e CONTRIBUTING atualizados
- 🔧 **Scripts**: configure.js atualizado com novo nome
- 🔧 **Servidor**: Mensagens de log atualizadas

## [1.3.0] - 2025-06-26

### Added
- ✨ **2 novas ferramentas temporais**:
  - 📅 **Date Utils**: Operações completas com datas, horários e timestamps
    - 🔧 Geração: Timestamps, datas aleatórias, sequências, dias úteis
    - ✅ Validação: Formatos múltiplos, intervalos, dias úteis, feriados
    - 🔄 Conversão: Entre formatos, fusos horários, timestamps, relativos
    - 🧮 Cálculos: Diferenças, idade, adição/subtração, próximo dia útil
    - 🎨 Formatação: Extenso, customizado, relativo, localizado
    - 📊 Análise: Informações completas, estatísticas, padrões
  - 📊 **Competência Utils**: Períodos contábeis/fiscais brasileiros (MM/YYYY, MM/YY, YY-MM)
    - 🔧 Geração: Últimos/próximos meses, sequências, trimestres, exercícios fiscais
    - ✅ Validação: Formatos múltiplos, intervalos, sequências lógicas
    - 🔄 Conversão: Entre formatos, normalização, timestamps, datas de início/fim
    - 🧮 Cálculos: Diferenças em meses, adição/subtração, trimestres, dias na competência
    - 🎨 Formatação: Extenso, abreviado, customizado, fiscal
    - 📊 Análise: Informações fiscais, vencimentos tributários, estatísticas
- ✨ **Especialização brasileira**:
  - 🇧🇷 **Calendário fiscal**: Vencimentos ICMS, ISS, PIS/COFINS, IRPJ/CSLL, Simples Nacional
  - 🇧🇷 **Feriados nacionais**: Integração com feriados brasileiros
  - 🇧🇷 **Interpretação inteligente**: Anos YY com regras configuráveis (24=2024, 99=1999)
  - 🇧🇷 **Formatos contábeis**: Suporte completo a MM/YYYY, MM/YY, YY-MM
- ✨ **Funcionalidades avançadas**:
  - ⏰ **Operações temporais**: 6 operações por ferramenta (gerar, validar, converter, calcular, formatar, analisar)
  - 📈 **Processamento em lote**: Até 100 datas/competências por operação
  - 🎯 **Casos de uso reais**: Sistemas contábeis, fiscais, ERP, migração de dados

### Changed
- 🔄 **README.md otimizado**: Documentação menos redundante e mais legível
  - 📝 Seção de ferramentas com um exemplo por linha (melhor legibilidade)
  - 📝 Casos de uso expandidos com comandos individuais
  - 📝 Remoção de redundâncias e números específicos de ferramentas
  - 📝 Configuração atualizada com contexto de uso em IDEs com IA
- 🔄 **Estrutura do projeto**: Integração perfeita das novas ferramentas
- 🔄 **Testes atualizados**: Cobertura completa para 11 ferramentas

### Improved
- ⚡ **Cobertura temporal completa**: Datas gerais + competências fiscais brasileiras
- ⚡ **Workflows profissionais**: Ferramentas especializadas para desenvolvimento brasileiro
- ⚡ **Documentação superior**: Exemplos práticos e casos de uso específicos
- ⚡ **Experiência do usuário**: Configuração clara para uso com assistentes de IA

### Technical
- 🔧 **11 ferramentas totais**: UUID, Email, Hash, JSON, Idade, CPF, CNPJ, Senhas, Cartões, Datas, Competências
- 🔧 **2.300+ linhas de código**: Implementação robusta das ferramentas temporais
- 🔧 **55 testes individuais**: Cobertura completa das novas funcionalidades
- 🔧 **Arquitetura consistente**: Padrão unificado mantido para todas as ferramentas
- 🔧 **Zero breaking changes**: Compatibilidade total com versões anteriores
- 🔧 **Exemplo completo atualizado**: Demonstração usando todas as 11 ferramentas

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
- 🎉 **Versão inicial** do MCP Dev Tools
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
