import config from './config';
import createServer from './server';

const PORT = config.get('port');
const IP = config.get('ip');

const server = createServer();

server.listen({ port: PORT, host: IP }, (err, _addr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
