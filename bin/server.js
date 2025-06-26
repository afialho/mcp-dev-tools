#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} = require('@modelcontextprotocol/sdk/types.js');
const ToolRegistry = require('../utils/tool-registry.js');

class DevToolsServer {
  constructor() {
    const packageJson = require('../package.json');

    this.server = new Server(
      {
        name: 'dev-tools-server',
        version: packageJson.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.toolRegistry = new ToolRegistry();
    this.toolRegistry.loadTools();

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // Listar todas as ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.toolRegistry.getToolSchemas()
      };
    });

    // Executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        return await this.toolRegistry.executeTool(name, args);
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    const packageJson = require('../package.json');
    console.error(`🚀 MCP Dev Tools Server v${packageJson.version} iniciado!`);
    console.error(`📦 Ferramentas carregadas: ${this.toolRegistry.getToolCount()}`);
  }
}

// Iniciar o servidor
if (require.main === module) {
  const server = new DevToolsServer();
  server.run().catch(console.error);
}

module.exports = DevToolsServer;