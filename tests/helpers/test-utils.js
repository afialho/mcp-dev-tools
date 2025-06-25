const assert = require('assert');

// Helper para validar estrutura de resposta MCP
function validateMcpResponse(response) {
  assert(response, 'Response deve existir');
  assert(response.content, 'Response deve ter content');
  assert(Array.isArray(response.content), 'Content deve ser array');
  assert(response.content.length > 0, 'Content não pode estar vazio');
  assert(response.content[0].type === 'text', 'Primeiro item deve ser text');
  assert(response.content[0].text, 'Text não pode estar vazio');
}

// Helper para testar ferramentas
async function testTool(tool, args, expectedIncludes) {
  const result = await tool.execute(args);
  validateMcpResponse(result);
  
  for (const expected of expectedIncludes) {
    assert(result.content[0].text.includes(expected), 
           `Resultado deve incluir: ${expected}`);
  }
  
  return result;
}

// Helper para testar erros
async function testToolError(tool, args, expectedErrorIncludes) {
  const result = await tool.execute(args);
  validateMcpResponse(result);
  
  for (const expected of expectedErrorIncludes) {
    assert(result.content[0].text.includes(expected), 
           `Erro deve incluir: ${expected}`);
  }
  
  return result;
}

module.exports = {
  validateMcpResponse,
  testTool,
  testToolError
};
