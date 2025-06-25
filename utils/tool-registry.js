const path = require('path');
const fs = require('fs');

class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  loadTools() {
    const toolsDir = path.join(__dirname, '../tools');
    const toolFiles = fs.readdirSync(toolsDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js');

    for (const file of toolFiles) {
      const tool = require(path.join(toolsDir, file));
      this.tools.set(tool.name, tool);
    }
  }

  getToolSchemas() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }));
  }

  async executeTool(name, args) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Ferramenta não encontrada: ${name}`);
    }
    return await tool.execute(args);
  }

  getToolNames() {
    return Array.from(this.tools.keys());
  }

  getToolCount() {
    return this.tools.size;
  }

  hasTool(name) {
    return this.tools.has(name);
  }

  getTool(name) {
    return this.tools.get(name);
  }
}

module.exports = ToolRegistry;
