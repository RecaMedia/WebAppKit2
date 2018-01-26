'use strict';

// Get needed libraries and declare variables
const Hapi = require('hapi');
const validate = require('./validation');
const user = require('./routes/user');
const env = (process.argv[2]?process.argv[2]:process.env.name);
var server_type;
var port;

// Set environment variables
if (env == 'production') {
  port = 2100;
  server_type = 'production';
} else {
  port = 2101;
  server_type = 'development';
}

// Create a server with a host and port
const server = Hapi.server({ 
  host: 'localhost', 
  port: port 
});

// Add default route
server.route({
  method: 'GET',
  path:'/',
  config: validate().config,
  handler: function (request, h) {
    return {
      server: server_type,
      version: '1.0.0'
    };
  }
});
// Show node details if on development
if (server_type == 'development') {
  server.route({
    method: 'GET',
    path:'/nodedetails',
    config: validate().config,
    handler: function (request, h) {
      return {
        process: process.env
      };
    }
  });
}
// Add multiple routes by route path
user.forEach((u) => {
  server.route(u);
});

// Start the server
async function start() {
  try {
    await server.start();
  }
  catch (err) {
    process.exit(1);
  }
  console.log('Server running at:', server.info.uri, env);
};

start();