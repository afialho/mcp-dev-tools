# MCP Dev Utils

> 8 ferramentas essenciais para desenvolvedores via MCP - Arquitetura modular e extensível

**Ferramentas disponíveis:** UUID, Email, Hash, JSON, Idade, CPF, CNPJ, Senhas

## Configuração

Adicione no arquivo de configuração MCP da sua IDE:

```json
{
  "mcpServers": {
    "dev-utils": {
      "command": "npx",
      "args": ["-y", "mcp-dev-utils@latest"]
    }
  }
}
```

## ✨ Recursos Destacados

- 🇧🇷 **Suporte completo ao Brasil:** CPF e CNPJ com validação, geração e formatação
- 🔐 **Segurança:** Geração de senhas, análise de força, verificação de vazamentos
- 📧 **Email completo:** Validação, geração, extração, análise e formatação
- 🆔 **Identificadores únicos:** UUIDs v1 e v4 para todas as necessidades
- 📊 **Processamento em lote:** Até 100 itens por operação (CPF/CNPJ)
- 🎯 **Casos de uso reais:** Workflows prontos para desenvolvimento e testes

## Ferramentas

### 🆔 Gerar UUID
- `"Gere um UUID"`
- `"Gere 3 UUIDs v4"`
- `"Crie um UUID versão 1"`
- `"Preciso de 5 UUIDs para IDs únicos"`
- `"Gere UUID v4 para identificador de sessão"`

### 📧 Utilitários de Email
- **Validar:** `"Valide o email admin@empresa.com"`
- **Gerar:** `"Gere 3 emails aleatórios"` | `"Crie emails profissionais para empresa TechCorp"`
- **Extrair:** `"Extraia emails do texto: Contatos: admin@test.com, suporte@site.org"`
- **Analisar:** `"Analise o email temporario@10minutemail.com"`
- **Formatar:** `"Formate emails: ADMIN@TEST.COM, user@SITE.ORG"`

### 🔐 Gerar Hash
- `"Gere hash SHA256 da palavra 'password'"`
- `"Crie hash MD5 da string 'hello world'"`
- `"Hash da senha 'MinhaSenh@123' usando SHA1"`
- `"SHA256 do texto 'dados importantes'"`
- `"Hash MD5 para verificação de integridade: arquivo.txt"`

### 📝 Formatar JSON
- `"Formate este JSON: {'nome':'João','idade':30}"`
- `"Organize: {'users':[{'id':1,'name':'Ana'}],'total':1}"`
- `"Valide e formate com indentação 4: {'config':{'debug':true}}"`
- `"Limpe este JSON: {'api':{'key':'123','url':'test.com'}}"`
- `"Formate resposta da API: {'status':'ok','data':[1,2,3]}"`

### 🎂 Calcular Idade
- `"Calcule a idade de quem nasceu em 1990-05-15"`
- `"Qual idade de alguém nascido em 1985-12-25?"`
- `"Idade para data de nascimento 2000-03-10"`
- `"Quantos anos tem quem nasceu em 15/03/1992?"`
- `"Calcular idade para 25/12/1980 (formato DD/MM/YYYY ou YYYY-MM-DD)"`

### 🇧🇷 Utilitários de CPF
- **Gerar:** `"Gere um CPF válido"` | `"Crie 5 CPFs para testes"`
- **Validar:** `"Valide o CPF 123.456.789-09"` | `"Verifique CPFs: 11111111111, 123.456.789-09"`
- **Formatar:** `"Adicione máscara ao CPF 12345678909"` | `"Remova máscara de 123.456.789-09"`

### 🏢 Utilitários de CNPJ
- **Gerar:** `"Gere um CNPJ válido"` | `"Crie 3 CNPJs para testes"`
- **Validar:** `"Valide o CNPJ 11.222.333/0001-81"` | `"Verifique CNPJs: 11222333000181, 12.345.678/0001-90"`
- **Formatar:** `"Adicione máscara ao CNPJ 11222333000181"` | `"Remova máscara de 11.222.333/0001-81"`

### 🔒 Utilitários de Senha
- **Gerar:** `"Gere uma senha forte"` | `"Crie 3 senhas médias"` | `"Senha numérica de 6 dígitos"`
- **Analisar:** `"Analise a força da senha 'MinhaSenh@123'"` | `"Verifique senhas: password, Senh@Forte2024"`
- **Validar:** `"Valide senhas contra critérios: abc123, Senha@Forte2024"`
- **Frase-senha:** `"Gere frase-senha memorável"` | `"Crie frase-senha com números e símbolos"`
- **Verificar vazamentos:** `"Verifique se a senha 'password123' foi vazada"`

## Workflows Completos

### 👤 **Perfil de Usuário**
```
"Crie um perfil de usuário: gere UUID para ID, valide email admin@test.com, hash da senha 'pass123', formate em JSON incluindo nome 'João Silva', e calcule idade para 15/03/1990"
```

### 🏢 **Cadastro de Empresa**
```
"Para cadastro empresarial: gere CNPJ válido, valide email contato@empresa.com, crie UUID para ID da empresa, gere hash da senha administrativa, e formate dados em JSON"
```

### 🇧🇷 **Sistema Brasileiro**
```
"Sistema nacional: gere 3 CPFs válidos, 2 CNPJs para testes, valide emails suporte@gov.br e admin@receita.fazenda.gov.br, calcule idades para 01/01/1980 e 15/06/1995"
```

### 🔐 **Segurança e Autenticação**
```
"Setup de segurança: gere senha forte, analise força de 'MinhaSenh@123', crie hash SHA256, gere UUID para sessão, e verifique se senha 'password123' foi vazada"
```

### 📊 **Processamento de Dados**
```
"Processe dados: extraia emails do texto 'Contatos: admin@test.com, suporte@site.org', valide CPFs encontrados, formate em JSON, e gere UUIDs para cada registro"
```

### 🧪 **Ambiente de Testes**
```
"Dados de teste: gere 5 CPFs, 3 CNPJs, 10 emails aleatórios, senhas variadas (forte, média, numérica), e UUIDs para IDs únicos"
```

### 🎯 **EXEMPLO COMPLETO - Todas as 8 Ferramentas**
```
"Sistema completo de cadastro empresarial brasileiro:

1. Gere UUID v4 para ID da empresa
2. Crie CNPJ válido para registro
3. Gere CPF válido para representante legal
4. Valide email contato@novaempresa.com.br
5. Gere senha forte para acesso administrativo
6. Analise força da senha criada
7. Crie hash SHA256 da senha para armazenamento
8. Calcule idade do representante nascido em 15/03/1985
9. Formate todos os dados em JSON estruturado

Resultado esperado: JSON com empresa_id (UUID), cnpj (formatado), representante_cpf (formatado), email (validado), senha_hash (SHA256), representante_idade (anos), e metadados de segurança."
```

**Comando simplificado:**
```
"Cadastro completo: gere UUID, CNPJ, CPF, valide email admin@empresa.com, crie senha forte, hash SHA256, calcule idade para 1985-03-15, formate em JSON"
```

**Resultado do exemplo completo:**
```json
{
  "empresa_id": "d4b26815-6b34-49b8-be1d-4a847ee82443",
  "cnpj": "19.801.123/3509-91",
  "representante_cpf": "420.298.752-79",
  "email": "contato@novaempresa.com.br",
  "email_valido": true,
  "senha_hash": "95dc1a19b34ba6208f74e7c9221d76deeb3b711c87d0c175b5690f74d07958ae",
  "representante_idade": 40,
  "metadados_seguranca": {
    "senha_forca": "Muito Forte",
    "entropia_bits": 104.9,
    "algoritmo_hash": "SHA256",
    "data_criacao": "2025-06-26"
  }
}
```

✅ **Demonstração prática:** Todas as 8 ferramentas trabalhando em conjunto para criar um sistema completo de cadastro empresarial brasileiro!

## Exemplos Práticos

### 🚀 **Comandos Rápidos**
```bash
# Gerar dados únicos
"Gere UUID v4"
"Crie CPF válido"
"Gere senha forte de 16 caracteres"

# Validação
"Valide email usuario@exemplo.com"
"Verifique CPF 123.456.789-09"
"Analise força da senha 'MinhaSenh@2024'"

# Formatação
"Formate JSON: {'nome':'Ana','cpf':'12345678909'}"
"Adicione máscara ao CPF 12345678909"
"Remova máscara do CNPJ 11.222.333/0001-81"
```

### 🔄 **Processamento em Lote**
```bash
# Múltiplos itens
"Gere 10 UUIDs v4"
"Valide emails: admin@test.com, user@invalid, suporte@site.org"
"Crie 5 senhas médias"
"Gere 3 CNPJs para ambiente de teste"

# Análise de dados
"Extraia emails do texto: Entre em contato via admin@empresa.com ou suporte@help.org"
"Analise senhas: password, 123456, Senh@Forte2024, abc123"
```

### 🎯 **Casos de Uso Específicos**

**Desenvolvimento de API:**
```
"Para API de usuários: gere UUID para ID, valide email do payload, hash da senha com SHA256, e formate resposta em JSON"
```

**Testes Automatizados:**
```
"Dados para testes: 5 CPFs válidos, 3 emails de teste, senhas variadas (forte, fraca, média), e UUIDs para identificadores"
```

**Migração de Dados:**
```
"Processe migração: extraia emails de 'Usuários: admin@old.com, user@legacy.org', gere novos UUIDs, valide CPFs existentes, e formate em JSON"
```

## Documentação

- 📖 **[Guia de Desenvolvimento](docs/DEVELOPMENT.md)** - Setup, arquitetura, adicionar ferramentas, testes e debugging
- 🤝 **[Guia de Contribuição](docs/CONTRIBUTING.md)** - Como contribuir, publicação e padrões do projeto

## Contribuição

Contribuições são bem-vindas! Consulte o [Guia de Contribuição](docs/CONTRIBUTING.md) para detalhes sobre:

- Como configurar o ambiente de desenvolvimento
- Padrões de código e testes
- Processo de submissão de PRs
- Como adicionar novas ferramentas

## Requisitos

- Node.js 18+

## Licença

MIT
