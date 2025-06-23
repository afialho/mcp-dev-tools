#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class MCPConfigurator {
  constructor() {
    this.packageName = 'mcp-dev-utils';
    this.serverName = 'mcp-dev-utils';
    this.binaryName = 'mcp-dev-server';
  }

  log(message, type = 'info') {
    const icons = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    console.log(`${icons[type]} ${message}`);
  }

  findNodeExecutable() {
    const possiblePaths = [];
    
    // Adicionar o node atual (mais confiável)
    possiblePaths.push(process.execPath);
    
    try {
      // Tentar 'which node'
      const whichNode = execSync('which node', { encoding: 'utf8' }).trim();
      if (whichNode) possiblePaths.push(whichNode);
    } catch {}

    // Caminhos comuns
    const commonPaths = [
      '/usr/local/bin/node',
      '/opt/homebrew/bin/node',
      '/usr/bin/node'
    ];
    possiblePaths.push(...commonPaths);

    // Verificar NVM
    const homeDir = os.homedir();
    const nvmDir = path.join(homeDir, '.nvm', 'versions', 'node');
    
    if (fs.existsSync(nvmDir)) {
      try {
        const versions = fs.readdirSync(nvmDir);
        if (versions.length > 0) {
          const latestVersion = versions.sort().reverse()[0];
          possiblePaths.unshift(path.join(nvmDir, latestVersion, 'bin', 'node'));
        }
      } catch {}
    }

    // Retornar o primeiro que existir
    for (const nodePath of possiblePaths) {
      if (fs.existsSync(nodePath)) {
        return nodePath;
      }
    }

    return 'node'; // Fallback
  }

  getGlobalBinaryPath() {
    try {
      // Tentar encontrar o binário global
      const whichResult = execSync(`which ${this.binaryName}`, { encoding: 'utf8' }).trim();
      if (whichResult && fs.existsSync(whichResult)) {
        return whichResult;
      }
    } catch {}

    try {
      // Fallback: procurar no npm global
      const globalPath = execSync('npm root -g', { encoding: 'utf8' }).trim();
      const serverPath = path.join(globalPath, this.packageName, 'bin', 'server.js');
      if (fs.existsSync(serverPath)) {
        return serverPath;
      }
    } catch {}

    return null;
  }

  createMCPConfig() {
    const binaryPath = this.getGlobalBinaryPath();
    
    if (!binaryPath) {
      this.log('Não foi possível localizar o servidor instalado', 'error');
      return null;
    }

    // Se for um binário executável direto, use ele
    if (binaryPath.endsWith(this.binaryName)) {
      return {
        command: binaryPath,
        args: []
      };
    }

    // Senão, use node + script
    const nodePath = this.findNodeExecutable();
    return {
      command: nodePath,
      args: [binaryPath]
    };
  }

  configureVSCode() {
    const platform = os.platform();
    const homeDir = os.homedir();
    
    let settingsPath;
    if (platform === 'win32') {
      settingsPath = path.join(homeDir, 'AppData', 'Roaming', 'Code', 'User', 'settings.json');
    } else if (platform === 'darwin') {
      settingsPath = path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'settings.json');
    } else {
      settingsPath = path.join(homeDir, '.config', 'Code', 'User', 'settings.json');
    }

    try {
      let settings = {};
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf8');
        settings = JSON.parse(content);
      }

      if (!settings['augment.advanced']) {
        settings['augment.advanced'] = {};
      }
      if (!settings['augment.advanced'].mcpServers) {
        settings['augment.advanced'].mcpServers = {};
      }

      const mcpConfig = this.createMCPConfig();
      if (!mcpConfig) return false;

      settings['augment.advanced'].mcpServers[this.serverName] = mcpConfig;

      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      
      this.log('VS Code configurado com sucesso!', 'success');
      return true;
    } catch (error) {
      this.log(`Erro ao configurar VS Code: ${error.message}`, 'error');
      return false;
    }
  }

  configurePyCharm() {
    const platform = os.platform();
    const homeDir = os.homedir();
    
    let jetbrainsDir;
    if (platform === 'win32') {
      jetbrainsDir = path.join(homeDir, 'AppData', 'Roaming', 'JetBrains');
    } else if (platform === 'darwin') {
      jetbrainsDir = path.join(homeDir, 'Library', 'Application Support', 'JetBrains');
    } else {
      jetbrainsDir = path.join(homeDir, '.config', 'JetBrains');
    }

    if (!fs.existsSync(jetbrainsDir)) {
      this.log('PyCharm não encontrado', 'warning');
      return false;
    }

    try {
      const dirs = fs.readdirSync(jetbrainsDir);
      const pycharmDirs = dirs.filter(dir => 
        dir.includes('PyCharm') || dir.includes('IntelliJ') || dir.includes('WebStorm')
      );

      if (pycharmDirs.length === 0) {
        this.log('IDEs JetBrains não encontradas', 'warning');
        return false;
      }

      const mcpConfig = this.createMCPConfig();
      if (!mcpConfig) return false;

      let configured = false;
      for (const ideDir of pycharmDirs) {
        try {
          const augmentDir = path.join(jetbrainsDir, ideDir, 'augment');
          const configFile = path.join(augmentDir, 'settings.json');

          let config = {};
          if (fs.existsSync(configFile)) {
            config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
          }

          if (!config.mcpServers) {
            config.mcpServers = {};
          }

          config.mcpServers[this.serverName] = mcpConfig;

          fs.mkdirSync(augmentDir, { recursive: true });
          fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
          
          this.log(`${ideDir} configurado!`, 'success');
          configured = true;
        } catch (error) {
          this.log(`Erro ao configurar ${ideDir}: ${error.message}`, 'warning');
        }
      }
      
      return configured;
    } catch (error) {
      this.log(`Erro ao configurar JetBrains IDEs: ${error.message}`, 'error');
      return false;
    }
  }

  showManualInstructions() {
    const mcpConfig = this.createMCPConfig();
    if (!mcpConfig) return;

    this.log('INSTRUÇÕES MANUAIS (caso automática falhe):', 'info');
    
    console.log('\n🔧 Para VS Code - adicione em settings.json:');
    console.log(JSON.stringify({
      "augment.advanced": {
        "mcpServers": {
          [this.serverName]: mcpConfig
        }
      }
    }, null, 2));

    console.log('\n🔧 Para PyCharm - adicione em augment/settings.json:');
    console.log(JSON.stringify({
      "mcpServers": {
        [this.serverName]: mcpConfig
      }
    }, null, 2));
  }

  run() {
    console.log('🚀 Configurando MCP Dev Utils para Augment Code...\n');

    const vsCodeConfigured = this.configureVSCode();
    const jetbrainsConfigured = this.configurePyCharm();

    if (vsCodeConfigured || jetbrainsConfigured) {
      this.log('\nConfiguração automática concluída!', 'success');
      this.log('🔄 Reinicie suas IDEs para aplicar as mudanças', 'info');
      this.log('🧪 Teste com: "Gere um UUID"', 'info');
    } else {
      this.log('\nConfiguração automática falhou', 'warning');
      this.showManualInstructions();
    }

    console.log('\n📚 Para reconfigurar: mcp-dev-configure');
    console.log('🐛 Issues: https://github.com/afialho/mcp-dev-utils/issues');
  }
}

if (require.main === module) {
  const configurator = new MCPConfigurator();
  configurator.run();
}

module.exports = MCPConfigurator;