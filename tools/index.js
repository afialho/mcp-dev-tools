const uuidGenerator = require('./uuid-generator');
const emailUtils = require('./email-utils');
const hashGenerator = require('./hash-generator');
const jsonFormatter = require('./json-formatter');
const ageCalculator = require('./age-calculator');
const cpfUtils = require('./cpf-utils');
const cnpjUtils = require('./cnpj-utils');
const passwordUtils = require('./password-utils');

module.exports = {
  uuidGenerator,
  emailUtils,
  hashGenerator,
  jsonFormatter,
  ageCalculator,
  cpfUtils,
  cnpjUtils,
  passwordUtils
};
