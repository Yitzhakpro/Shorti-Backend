import fs from 'fs';
import path from 'path';
import convict from 'convict';

const config = convict({
  env: {
    doc: "The application's enviroment",
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'IP address of server',
    default: '0.0.0.0',
    env: 'IP_ADDR',
  },
  port: {
    doc: 'Port that the server listen on',
    default: 8080,
    env: 'PORT',
  },
});

const env = config.get('env');
const configFile = path.join(__dirname, `${env}.json`);
if (fs.existsSync(configFile)) {
  config.loadFile(configFile);
  console.log(`[V] Loaded ${env} config file successfully`);
}

export default config;
