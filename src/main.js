const http = require('http');

const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, () => {
  const url = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
  console.log(`URL completo do servidor: ${url}`);

});
