const registry = require('./registry');

function getAboutJson(clientIp) {
  return registry.getAboutJson(clientIp);
}

module.exports = { getAboutJson };
