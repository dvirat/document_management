const path = require('path');

// Try to resolve config from dist (production) or src (development)
let configPath;
try {
  configPath = require.resolve('./dist/config/database.config');
} catch {
  configPath = require.resolve('./src/config/database.config');
}
const { databaseConfig } = require(configPath);
module.exports = databaseConfig; 