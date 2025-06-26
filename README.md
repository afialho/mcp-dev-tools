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

### 📧 Validar Email
- `"Valide o email admin@empresa.com"`
- `"Verifique se teste@gmail.com é válido"`
- `"Este email está correto: user@domain.co.uk?"`

### 🔐 Gerar Hash
- `"Gere hash SHA256 da palavra 'password'"`
- `"Crie hash MD5 da string 'hello world'"`
- `"Hash da senha 'MinhaSenh@123' usando SHA1"`

### 📝 Formatar JSON
- `"Formate este JSON: {'nome':'João','idade':30}"`
- `"Organize: {'users':[{'id':1,'name':'Ana'}],'total':1}"`
- `"Valide e formate com indentação 4: {'config':{'debug':true}}"`

### 🎂 Calcular Idade
- `"Calcule a idade de quem nasceu em 1990-05-15"`
- `"Qual idade de alguém nascido em 1985-12-25?"`
- `"Idade para data de nascimento 2000-03-10"`

## Workflow Completo

```
"Crie um perfil de usuário: gere UUID para ID, valide email admin@test.com, hash da senha 'pass123', formate em JSON incluindo nome 'João Silva', e calcule idade para 1990-05-15"
```

## Documentação

- 📖 **[Guia de Desenvolvimento](docs/DEVELOPMENT.md)** - Setup local, arquitetura e desenvolvimento
- 🧪 **[Guia de Testes](docs/TESTING.md)** - Execução e criação de testes
- 📦 **[Guia de Publicação](docs/PUBLISHING.md)** - Como publicar no npm registry
- 🤝 **[Guia de Contribuição](docs/CONTRIBUTING.md)** - Como contribuir com o projeto

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
