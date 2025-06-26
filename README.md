# MCP Dev Tools

Ferramentas úteis para desenvolvedores via MCP - Arquitetura modular e extensível

## Configuração

Para usar com assistentes de IA em IDEs como **Cursor**, **VS Code**, **Augment Code**, **Claude Desktop** e outros que suportam MCP.

Adicione no arquivo de configuração MCP da sua IDE:

```json
{
  "mcpServers": {
    "dev-tools": {
      "command": "npx",
      "args": ["-y", "mcp-dev-tools@latest"]
    }
  }
}
```

## Ferramentas

### 🆔 **UUID** - Identificadores únicos
- `"Gere UUID v4"`
- `"Crie 5 UUIDs para IDs únicos"`
- `"UUID versão 1 com timestamp"`

### 📧 **Email** - Validação, geração e análise
- `"Valide email admin@empresa.com"`
- `"Gere 3 emails profissionais"`
- `"Extraia emails do texto: Contatos: admin@test.com, suporte@site.org"`
- `"Analise email temporario@10minutemail.com"`
- `"Formate emails: ADMIN@TEST.COM, user@SITE.ORG"`

### 🔐 **Hash** - Criptografia e integridade
- `"Hash SHA256 da senha 'password'"`
- `"MD5 do arquivo dados.txt"`
- `"SHA1 para verificação de integridade"`

### 📝 **JSON** - Formatação e validação
- `"Formate JSON: {'nome':'João','idade':30}"`
- `"Valide e organize com indentação 4"`
- `"Limpe este JSON: {'api':{'key':'123','url':'test.com'}}"`

### 🎂 **Idade** - Cálculos temporais
- `"Calcule idade para nascimento em 1990-05-15"`
- `"Idade de quem nasceu em 15/03/1992"`
- `"Quantos anos tem quem nasceu em 25/12/1980"`

### 🇧🇷 **CPF** - Documentos brasileiros
- `"Gere CPF válido"`
- `"Valide 123.456.789-09"`
- `"Adicione máscara ao CPF 12345678909"`
- `"Remova máscara de 123.456.789-09"`
- `"Verifique CPFs: 11111111111, 123.456.789-09"`

### 🏢 **CNPJ** - Empresas brasileiras
- `"Gere CNPJ válido"`
- `"Valide 11.222.333/0001-81"`
- `"Adicione máscara ao CNPJ 11222333000181"`
- `"Remova máscara do CNPJ 11.222.333/0001-81"`
- `"Crie 3 CNPJs para testes"`

### 🔒 **Senhas** - Segurança e análise
- `"Gere senha forte"`
- `"Analise força de 'MinhaSenh@123'"`
- `"Crie frase-senha memorável"`
- `"Gere 3 senhas médias"`
- `"Senha numérica de 6 dígitos"`
- `"Verifique se senha 'password123' foi vazada"`

### 💳 **Cartões** - Pagamentos e testes
- `"Gere cartão Visa com CVV"`
- `"Valide 4111111111111111"`
- `"Identifique bandeira do cartão 4532123456789012"`
- `"Gere 3 cartões mistos com datas vencidas"`
- `"Analise cartão completo: 4111111111111111"`
- `"Formate cartões com máscara: 4111111111111111"`

### 📅 **Datas** - Timestamps e operações temporais
- `"Gere timestamp atual com milissegundos"`
- `"Gere 5 datas aleatórias em 2024"`
- `"Valide datas: 2024-01-15, 15/01/2024, 01/15/2024"`
- `"Converta 2024-01-15 para formato brasileiro"`
- `"Calcule diferença entre 2024-01-01 e 2024-12-31 em dias"`
- `"Calcule idade para nascimento em 1990-05-15"`
- `"Adicione 30 dias úteis a 2024-01-15"`
- `"Formate 2024-01-15 por extenso em português"`
- `"Analise informações completas de 2024-01-15"`
- `"Gere próximos 10 dias úteis a partir de hoje"`

### 📊 **Competências** - Períodos contábeis/fiscais (MM/YYYY, MM/YY, YY-MM)
- `"Gere últimos 12 meses de competências"`
- `"Valide competências: 01/2024, 02/24, 24-03, 13/24"`
- `"Converta 01/24 para formato MM/YYYY"`
- `"Calcule diferença entre 01/2024 e 12/2024"`
- `"Adicione 6 meses à competência 03/2024"`
- `"Formate 01/2024 por extenso: Janeiro de 2024"`
- `"Gere sequência de 01/2024 até 06/2024"`
- `"Converta 03/2024 para primeiro e último dia do mês"`

## Workflows Completos

### 👤 **Perfil de Usuário**
`"Crie perfil: gere UUID para ID, valide email admin@test.com, hash da senha 'pass123', calcule idade para 15/03/1990, formate em JSON"`

### 🏢 **Cadastro Empresarial**
`"Cadastro empresa: gere CNPJ válido, valide email contato@empresa.com, crie UUID, hash da senha administrativa, formate dados em JSON"`

### 🇧🇷 **Sistema Brasileiro**
`"Sistema nacional: gere 3 CPFs, 2 CNPJs, valide emails gov.br, calcule idades para 01/01/1980 e 15/06/1995"`

### 🔐 **Segurança e Autenticação**
`"Setup segurança: gere senha forte, analise força, crie hash SHA256, gere UUID para sessão, verifique vazamentos"`

### 📊 **Processamento de Dados**
`"Processe dados: extraia emails do texto, valide CPFs encontrados, formate em JSON, gere UUIDs para registros"`

### 🧪 **Ambiente de Testes**
`"Dados teste: gere 5 CPFs, 3 CNPJs, 10 emails aleatórios, senhas variadas, cartões de teste, UUIDs únicos"`

### 🎯 **EXEMPLO COMPLETO - Todas as Ferramentas**

**Comando:**
```
"Sistema completo de cadastro empresarial brasileiro: gere UUID para ID da empresa, crie CNPJ válido para registro, gere CPF válido para representante legal, valide email contato@novaempresa.com.br, gere senha forte para acesso administrativo, analise força da senha criada, crie hash SHA256 da senha para armazenamento, calcule idade do representante nascido em 15/03/1985, gere timestamp atual para data de cadastro, gere competência atual para período de ativação, gere cartão de crédito corporativo Mastercard com CVV e data futura, formate todos os dados em JSON estruturado"
```

**Resultado esperado:**
```json
{
  "empresa_id": "d4b26815-6b34-49b8-be1d-4a847ee82443",
  "cnpj": "19.801.123/3509-91",
  "representante_cpf": "420.298.752-79",
  "email": "contato@novaempresa.com.br",
  "email_valido": true,
  "senha_hash": "95dc1a19b34ba6208f74e7c9221d76deeb3b711c87d0c175b5690f74d07958ae",
  "representante_idade": 40,
  "timestamp_cadastro": 1704067200,
  "competencia_ativacao": "01/2024",
  "cartao_corporativo": {
    "numero": "5555 4444 3333 2222",
    "bandeira": "Mastercard",
    "cvv": "123",
    "validade": "12/2028"
  },
  "metadados": {
    "senha_forca": "Muito Forte",
    "algoritmo_hash": "SHA256",
    "data_criacao": "2024-01-15"
  }
}
```

✅ **Demonstração prática:** Todas as ferramentas trabalhando em conjunto!

## Casos de Uso

### 🚀 **Comandos Rápidos**
- `"Gere UUID v4"`
- `"Crie CPF válido"`
- `"Gere senha forte de 16 caracteres"`
- `"Valide email usuario@exemplo.com"`
- `"Formate JSON: {'nome':'Ana'}"`
- `"Gere cartão Visa com CVV"`

### 🔄 **Processamento em Lote**
- `"Gere 10 UUIDs v4"`
- `"Valide emails: admin@test.com, user@invalid, suporte@site.org"`
- `"Crie 5 senhas médias"`
- `"Gere 3 CNPJs para ambiente de teste"`
- `"Analise senhas: password, 123456, Senh@Forte2024"`
- `"Identifique bandeiras: 4111111111111111, 5555555555554444"`

### 🎯 **Casos Específicos**

**Desenvolvimento de API:**
- `"Para API de usuários: gere UUID para ID, valide email do payload, hash da senha com SHA256, formate resposta em JSON"`

**Testes Automatizados:**
- `"Dados para testes: 5 CPFs válidos, 3 emails de teste, senhas variadas (forte, fraca, média), UUIDs para identificadores"`

**E-commerce/Pagamentos:**
- `"Sistema de pagamento: gere cartões de teste para Visa, Mastercard e Amex, valide números existentes, identifique bandeiras"`

**Migração de Dados:**
- `"Processe migração: extraia emails de texto, gere novos UUIDs, valide CPFs existentes, formate em JSON"`

**Sistemas Contábeis:**
- `"Gere competências 2024, valide formatos MM/YY, calcule vencimentos fiscais, analise períodos de apuração"`

## Documentação

- 📖 **[Desenvolvimento](docs/DEVELOPMENT.md)** - Setup, arquitetura, testes e debugging
- 🤝 **[Contribuição](docs/CONTRIBUTING.md)** - Como contribuir, publicação e padrões

## Contribuição

Contribuições são bem-vindas! Veja o [guia de contribuição](docs/CONTRIBUTING.md) para:
- Configuração do ambiente de desenvolvimento
- Padrões de código e testes
- Processo de submissão de PRs
- Como adicionar novas ferramentas

**Requisitos:** Node.js 18+

## Licença

MIT
