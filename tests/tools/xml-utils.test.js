const xmlUtils = require('../../tools/xml-utils');
const { testTool, testToolError } = require('../helpers/test-utils');

async function testFormatar() {
  console.log('🧪 Testando formatação XML...');

  const xmlMinificado = '<root><pessoa nome="Joao"><idade>30</idade><cidade>Sao Paulo</cidade></pessoa></root>';

  await testTool(
    xmlUtils,
    {
      operacao: 'formatar',
      xml_string: xmlMinificado,
      indentacao: 2,
      incluir_declaracao: true
    },
    ['✅ **XML Formatado**', 'Indentação:', '2 espaços', 'Declaração XML:', 'Incluída', '<root>']
  );

  console.log('  ✅ Formatação básica funcionando');
}

async function testMinificar() {
  console.log('🧪 Testando minificação XML...');

  const xmlFormatado = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <pessoa nome="Joao">
    <idade>30</idade>
    <cidade>Sao Paulo</cidade>
  </pessoa>
</root>`;
  
  await testTool(
    xmlUtils,
    { operacao: 'minificar', xml_string: xmlFormatado },
    ['🗜️ **XML Minificado**', 'Tamanho Original:', 'Tamanho Minificado:', 'Redução:', '%']
  );

  console.log('  ✅ Minificação funcionando');
}

async function testValidar() {
  console.log('🧪 Testando validação XML...');

  // XML válido
  const xmlValido = '<root><elemento>valor</elemento></root>';
  
  await testTool(
    xmlUtils,
    { operacao: 'validar', xml_string: xmlValido },
    ['✅ **XML Válido**', 'Sintaxe correta', 'Elementos:', 'Atributos:', 'Profundidade:']
  );

  // XML inválido
  const xmlInvalido = '<root><elemento>valor</root>';
  
  await testToolError(
    xmlUtils,
    { operacao: 'validar', xml_string: xmlInvalido },
    ['❌ **XML Inválido**', 'Erro:', 'Dicas para Correção']
  );

  console.log('  ✅ Validação funcionando');
}

async function testConverterXmlParaJson() {
  console.log('🧪 Testando conversão XML → JSON...');

  const xml = '<pessoa nome="Joao"><idade>30</idade><cidade>Sao Paulo</cidade></pessoa>';

  await testTool(
    xmlUtils,
    {
      operacao: 'converter',
      xml_string: xml,
      formato_destino: 'json'
    },
    ['🔄 **XML Convertido para JSON**', 'Formato Destino:', 'JSON', 'pessoa', 'nome']
  );

  console.log('  ✅ Conversão XML → JSON funcionando');
}

async function testConverterJsonParaXml() {
  console.log('🧪 Testando conversão JSON → XML...');

  const json = '{"pessoa": {"nome": "Joao", "idade": 30, "cidade": "Sao Paulo"}}';

  await testTool(
    xmlUtils,
    {
      operacao: 'converter',
      dados_json: json,
      formato_destino: 'xml',
      elemento_raiz: 'dados'
    },
    ['🔄 **JSON Convertido para XML**', 'Elemento Raiz:', 'dados', '<dados>', 'pessoa']
  );

  console.log('  ✅ Conversão JSON → XML funcionando');
}

async function testExtrair() {
  console.log('🧪 Testando extração XPath...');

  const xml = '<root><pessoa nome="Joao"><idade>30</idade></pessoa><pessoa nome="Maria"><idade>25</idade></pessoa></root>';

  await testTool(
    xmlUtils,
    {
      operacao: 'extrair',
      xml_string: xml,
      xpath: '//idade'
    },
    ['🔍 **Valores Extraídos**', 'XPath:', '//idade', 'Resultados encontrados:']
  );

  console.log('  ✅ Extração XPath funcionando');
}

async function testAnalisar() {
  console.log('🧪 Testando análise estrutural...');

  const xml = '<!-- Comentario --><root xmlns:ns="http://example.com"><pessoa nome="Joao"><idade>30</idade></pessoa></root>';

  await testTool(
    xmlUtils,
    {
      operacao: 'analisar',
      xml_string: xml,
      incluir_estatisticas: true
    },
    ['📊 **Análise Estrutural do XML**', 'Elementos:', 'Atributos:', 'Profundidade Máxima:', 'Namespaces:', 'Estatísticas Detalhadas']
  );

  console.log('  ✅ Análise estrutural funcionando');
}

async function testEscapar() {
  console.log('🧪 Testando escape de caracteres...');

  const textoComCaracteresEspeciais = 'Texto com <tags> & "aspas" e \'apostrofes\'';
  
  await testTool(
    xmlUtils,
    { 
      operacao: 'escapar', 
      texto_para_escapar: textoComCaracteresEspeciais,
      tipo_escape: 'escapar'
    },
    ['🔒 **Caracteres XML Escapados**', '&lt;', '&gt;', '&amp;', '&quot;', '&apos;']
  );

  // Teste de desescape
  const textoEscapado = 'Texto com &lt;tags&gt; &amp; &quot;aspas&quot; e &apos;apostrofes&apos;';
  
  await testTool(
    xmlUtils,
    { 
      operacao: 'escapar', 
      texto_para_escapar: textoEscapado,
      tipo_escape: 'desescapar'
    },
    ['🔓 **Caracteres XML Desescapados**', '<tags>', '&', '"aspas"', "'apostrofes'"]
  );

  console.log('  ✅ Escape/desescape funcionando');
}

async function testComparar() {
  console.log('🧪 Testando comparação de XMLs...');

  const xml1 = '<root><pessoa nome="Joao"><idade>30</idade></pessoa></root>';
  const xml2 = '<root><pessoa nome="Joao"><idade>30</idade></pessoa></root>';

  // XMLs idênticos
  await testTool(
    xmlUtils,
    {
      operacao: 'comparar',
      xml_string: xml1,
      xml_comparacao: xml2
    },
    ['🔍 **Comparação de XMLs**', '✅ **XMLs são estruturalmente idênticos**']
  );

  // XMLs diferentes
  const xml3 = '<root><pessoa nome="Maria"><idade>25</idade></pessoa></root>';

  await testTool(
    xmlUtils,
    {
      operacao: 'comparar',
      xml_string: xml1,
      xml_comparacao: xml3
    },
    ['🔍 **Comparação de XMLs**', '❌ **XMLs são diferentes**', 'Diferenças encontradas:']
  );

  console.log('  ✅ Comparação funcionando');
}

async function testGerarSchema() {
  console.log('🧪 Testando geração de schema...');

  const xml = '<pessoa nome="Joao"><idade>30</idade><ativo>true</ativo></pessoa>';

  await testTool(
    xmlUtils,
    {
      operacao: 'gerar_schema',
      xml_string: xml
    },
    ['📋 **Schema XSD Gerado**', 'xs:schema', 'xs:element', 'xs:complexType', 'xs:attribute']
  );

  console.log('  ✅ Geração de schema funcionando');
}

async function testErros() {
  console.log('🧪 Testando tratamento de erros...');

  // Teste sem parâmetros obrigatórios
  await testToolError(
    xmlUtils,
    { operacao: 'formatar' },
    ['❌ **Erro de Parâmetro**', 'xml_string', 'obrigatório']
  );

  // Teste com operação inválida
  await testToolError(
    xmlUtils,
    { operacao: 'operacao_inexistente' },
    ['❌ **Operação Inválida**', 'Operações disponíveis:']
  );

  console.log('  ✅ Tratamento de erros funcionando');
}

async function runXmlUtilsTests() {
  console.log('🚀 Testando XML Utils...\n');

  await testFormatar();
  await testMinificar();
  await testValidar();
  await testConverterXmlParaJson();
  await testConverterJsonParaXml();
  await testExtrair();
  await testAnalisar();
  await testEscapar();
  await testComparar();
  await testGerarSchema();
  await testErros();

  console.log('✅ XML Utils - Todos os testes passaram!');
}

if (require.main === module) {
  runXmlUtilsTests().catch(console.error);
}

module.exports = { runXmlUtilsTests };
