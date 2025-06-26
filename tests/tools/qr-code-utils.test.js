const qrCodeUtils = require('../../tools/qr-code-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testQRCodeTexto() {
  console.log('🧪 Testando QR Code com texto...');
  
  await testTool(
    qrCodeUtils, 
    { 
      operacao: 'gerar', 
      dados: 'Olá, mundo!', 
      tipo: 'texto',
      formato: 'terminal'
    },
    ['QR Code Gerado', 'Terminal', 'TEXTO', 'Olá, mundo!', '✅']
  );
  
  console.log('  ✅ QR Code de texto gerado com sucesso');
}

async function testQRCodeURL() {
  console.log('🧪 Testando QR Code com URL...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'github.com/afialho/mcp-dev-tools', 
      tipo: 'url',
      formato: 'svg'
    },
    ['QR Code Gerado', 'SVG', 'URL', 'github.com', '✅']
  );
  
  console.log('  ✅ QR Code de URL gerado com sucesso');
}

async function testQRCodeEmail() {
  console.log('🧪 Testando QR Code com email...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'test@example.com', 
      tipo: 'email',
      formato: 'terminal'
    },
    ['QR Code Gerado', 'Terminal', 'EMAIL', 'test@example.com', '✅']
  );
  
  console.log('  ✅ QR Code de email gerado com sucesso');
}

async function testQRCodeTelefone() {
  console.log('🧪 Testando QR Code com telefone...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: '+5511999999999', 
      tipo: 'telefone',
      formato: 'terminal'
    },
    ['QR Code Gerado', 'Terminal', 'TELEFONE', '+5511999999999', '✅']
  );
  
  console.log('  ✅ QR Code de telefone gerado com sucesso');
}

async function testQRCodeWiFi() {
  console.log('🧪 Testando QR Code com WiFi...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'MinhaRede,MinhaSenh@123,WPA2', 
      tipo: 'wifi',
      formato: 'terminal'
    },
    ['QR Code Gerado', 'Terminal', 'WIFI', 'MinhaRede', '✅']
  );
  
  console.log('  ✅ QR Code de WiFi gerado com sucesso');
}

async function testQRCodeVCard() {
  console.log('🧪 Testando QR Code com vCard...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'João Silva,+5511999999999,joao@example.com', 
      tipo: 'vcard',
      formato: 'terminal'
    },
    ['QR Code Gerado', 'Terminal', 'VCARD', 'João Silva', '✅']
  );
  
  console.log('  ✅ QR Code de vCard gerado com sucesso');
}

async function testQRCodePNGBase64() {
  console.log('🧪 Testando QR Code PNG Base64...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'Teste PNG', 
      tipo: 'texto',
      formato: 'png_base64',
      tamanho: 200
    },
    ['QR Code Gerado', 'PNG Base64', 'TEXTO', 'data:image/png;base64', '✅']
  );
  
  console.log('  ✅ QR Code PNG Base64 gerado com sucesso');
}

async function testQRCodeConfiguracoes() {
  console.log('🧪 Testando QR Code com configurações personalizadas...');
  
  await testTool(
    qrCodeUtils,
    { 
      operacao: 'gerar', 
      dados: 'Teste configurações', 
      tipo: 'texto',
      formato: 'svg',
      correcao_erro: 'H',
      margem: 2,
      cor_fundo: '#FFFFFF',
      cor_frente: '#000000'
    },
    ['QR Code Gerado', 'SVG', 'TEXTO', '**Correção de Erro:** H', '**Margem:** 2', '✅']
  );
  
  console.log('  ✅ QR Code com configurações personalizadas gerado com sucesso');
}

async function testQRCodeDadosVazios() {
  console.log('🧪 Testando QR Code com dados vazios...');
  
  await testToolError(
    qrCodeUtils,
    { operacao: 'gerar', dados: '' },
    ['❌ **Erro de Geração**', 'necessário fornecer dados']
  );
  
  console.log('  ✅ Erro de dados vazios tratado corretamente');
}

async function testQRCodeOperacaoInvalida() {
  console.log('🧪 Testando operação inválida...');
  
  await testToolError(
    qrCodeUtils,
    { operacao: 'invalida', dados: 'teste' },
    ['❌ **Operação Inválida**', 'Operação não suportada']
  );
  
  console.log('  ✅ Erro de operação inválida tratado corretamente');
}

async function runQRCodeUtilsTests() {
  console.log('🚀 Testando QR Code Utils...\n');
  
  try {
    await testQRCodeTexto();
    await testQRCodeURL();
    await testQRCodeEmail();
    await testQRCodeTelefone();
    await testQRCodeWiFi();
    await testQRCodeVCard();
    await testQRCodePNGBase64();
    await testQRCodeConfiguracoes();
    await testQRCodeDadosVazios();
    await testQRCodeOperacaoInvalida();
    
    console.log('\n✅ QR Code Utils - Todos os testes passaram!');
  } catch (error) {
    console.error('❌ QR Code Utils - Teste falhou:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runQRCodeUtilsTests().catch(console.error);
}

module.exports = { runQRCodeUtilsTests };
