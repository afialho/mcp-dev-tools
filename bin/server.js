#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} = require('@modelcontextprotocol/sdk/types.js');

class DevUtilsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'dev-utils-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // Listar todas as ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'gerar_uuid',
            description: 'Gera um UUID único',
            inputSchema: {
              type: 'object',
              properties: {
                versao: {
                  type: 'string',
                  description: 'Versão do UUID (v4 ou v1)',
                  enum: ['v1', 'v4'],
                  default: 'v4'
                },
                quantidade: {
                  type: 'number',
                  description: 'Quantidade de UUIDs para gerar',
                  minimum: 1,
                  maximum: 10,
                  default: 1
                }
              }
            }
          },
          {
            name: 'validar_email',
            description: 'Valida se um email tem formato correto',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Email para validar'
                }
              },
              required: ['email']
            }
          },
          {
            name: 'gerar_hash',
            description: 'Gera hash de uma string',
            inputSchema: {
              type: 'object',
              properties: {
                texto: {
                  type: 'string',
                  description: 'Texto para gerar hash'
                },
                algoritmo: {
                  type: 'string',
                  description: 'Algoritmo de hash',
                  enum: ['md5', 'sha1', 'sha256'],
                  default: 'sha256'
                }
              },
              required: ['texto']
            }
          },
          {
            name: 'formatar_json',
            description: 'Formata e valida JSON',
            inputSchema: {
              type: 'object',
              properties: {
                json_string: {
                  type: 'string',
                  description: 'String JSON para formatar'
                },
                indentacao: {
                  type: 'number',
                  description: 'Número de espaços para indentação',
                  minimum: 2,
                  maximum: 8,
                  default: 2
                }
              },
              required: ['json_string']
            }
          },
          {
            name: 'calcular_idade',
            description: 'Calcula idade baseada na data de nascimento',
            inputSchema: {
              type: 'object',
              properties: {
                data_nascimento: {
                  type: 'string',
                  description: 'Data de nascimento (YYYY-MM-DD)',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$'
                }
              },
              required: ['data_nascimento']
            }
          }
        ]
      };
    });

    // Executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'gerar_uuid':
            return await this.gerarUuid(args);
          case 'validar_email':
            return await this.validarEmail(args);
          case 'gerar_hash':
            return await this.gerarHash(args);
          case 'formatar_json':
            return await this.formatarJson(args);
          case 'calcular_idade':
            return await this.calcularIdade(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Ferramenta desconhecida: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Erro ao executar ${name}: ${error.message}`
        );
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  // Implementação das ferramentas
  async gerarUuid(args) {
    const { versao = 'v4', quantidade = 1 } = args;
    const crypto = require('crypto');
    
    const uuids = [];
    
    for (let i = 0; i < quantidade; i++) {
      if (versao === 'v4') {
        uuids.push(crypto.randomUUID());
      } else if (versao === 'v1') {
        // Simulação simples de UUID v1
        const timestamp = Date.now().toString(16);
        const randomPart = crypto.randomBytes(6).toString('hex');
        uuids.push(`${timestamp}-${randomPart}`);
      }
    }

    const resultado = `🆔 **UUIDs Gerados (${versao.toUpperCase()})**\n\n`;
    const listaUuids = uuids.map((uuid, index) => `${index + 1}. \`${uuid}\``).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: resultado + listaUuids + `\n\n✅ **${quantidade} UUID(s) gerado(s) com sucesso!**`
        }
      ]
    };
  }

  async validarEmail(args) {
    const { email } = args;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isValid = emailRegex.test(email);
    const resultado = isValid 
      ? `✅ **Email XXXVálido**\n\n📧 \`${email}\` tem formato correto.`
      : `❌ **Email AAAInválido**\n\n📧 \`${email}\` não tem formato correto.\n\n**Problemas possíveis:**\n- Falta @\n- Domínio inválido\n- Caracteres especiais incorretos`;

    return {
      content: [
        {
          type: 'text',
          text: resultado
        }
      ]
    };
  }

  async gerarHash(args) {
    const { texto, algoritmo = 'sha256' } = args;
    const crypto = require('crypto');
    
    const hash = crypto.createHash(algoritmo).update(texto).digest('hex');
    
    const resultado = `🔐 **Hash Gerado**\n\n**Algoritmo:** ${algoritmo.toUpperCase()}\n**Texto:** \`${texto}\`\n**Hash:** \`${hash}\`\n\n✅ Hash gerado com sucesso!`;

    return {
      content: [
        {
          type: 'text',
          text: resultado
        }
      ]
    };
  }

  async formatarJson(args) {
    const { json_string, indentacao = 2 } = args;
    
    try {
      const jsonObj = JSON.parse(json_string);
      const jsonFormatado = JSON.stringify(jsonObj, null, indentacao);
      
      const resultado = `📝 **JSON Formatado**\n\n\`\`\`json\n${jsonFormatado}\n\`\`\`\n\n✅ JSON válido e formatado com sucesso!`;

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ **JSON Inválido**\n\n**Erro:** ${error.message}\n\n**String recebida:**\n\`\`\`\n${json_string}\n\`\`\``
          }
        ]
      };
    }
  }

  async calcularIdade(args) {
    const { data_nascimento } = args;
    
    try {
      const nascimento = new Date(data_nascimento);
      const hoje = new Date();
      
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      const dias = Math.floor((hoje - nascimento) / (1000 * 60 * 60 * 24));
      const anos = Math.floor(dias / 365.25);
      const meses = Math.floor((dias % 365.25) / 30.44);

      const resultado = `🎂 **Cálculo de Idade**\n\n**Data de Nascimento:** ${data_nascimento}\n**Data Atual:** ${hoje.toISOString().split('T')[0]}\n\n**Idade:** ${idade} anos\n**Detalhes:** ${anos} anos e ${meses} meses\n**Total de dias:** ${dias.toLocaleString()} dias\n\n✅ Idade calculada com sucesso!`;

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Data Inválida**\n\n**Erro:** ${error.message}\n\n**Formato esperado:** YYYY-MM-DD (ex: 1990-05-15)`
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 MCP Dev Utils Server iniciado!');
  }
}

// Iniciar o servidor
if (require.main === module) {
  const server = new DevUtilsServer();
  server.run().catch(console.error);
}

module.exports = DevUtilsServer;