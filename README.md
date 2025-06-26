# MCP Dev Utils

> Ferramentas úteis para desenvolvedores via MCP - Arquitetura modular e extensível

## Configuração

Adicione no arquivo de configuração MCP da sua IDE:

```json
{
  "mcpServers": {
    "dev-utils": {
      "command": "npx",
      "args": ["-y", "mcp-dev-utils"]
    }
  }
}
```

## Ferramentas

### 🆔 Gerar UUID
- `"Gere um UUID"`
- `"Gere 3 UUIDs v4"`
- `"Crie um UUID versão 1"`
- `"Preciso de 5 UUIDs para IDs únicos"`
- `"Gere UUID v4 para identificador de sessão"`

### 📧 Validar Email
- `"Valide o email admin@empresa.com"`
- `"Verifique se teste@gmail.com é válido"`
- `"Este email está correto: user@domain.co.uk?"`
- `"Confirme se contato@meusite.com.br é válido"`
- `"Validar lista: admin@test.org, user@invalid"`

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
- `"Calcular idade para 25/12/1980 (formato brasileiro)"`

## Workflow Completo

```
"Crie um perfil de usuário: gere UUID para ID, valide email admin@test.com, hash da senha 'pass123', formate em JSON incluindo nome 'João Silva', e calcule idade para 15/03/1990"
```

**Exemplo com múltiplas ferramentas:**
```
"Para o sistema de cadastro: gere 2 UUIDs v4, valide emails user@test.com e admin@site.org, crie hash SHA256 da senha 'MinhaSenh@2024', e calcule idades para 25/12/1985 e 1992-07-10"
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
