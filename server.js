//Dependencies
const http = require('http');
const app = require('./app');

// defining port
const port = process.env.port || 8000;

//creating server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
    console.log('The server is up and running now on port '+ port);
});

module.exports = server;