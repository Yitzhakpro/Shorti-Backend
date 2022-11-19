import createServer from './server';

const server = createServer();

server.listen({ port: 8080, host: '0.0.0.0' }, (err, _addr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
