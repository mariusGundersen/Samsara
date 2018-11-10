import 'babel-polyfill';
import socketIO from 'socket.io';
import http from 'http';

import samsara from 'samsara-lib';
import app from './app';
import socketServerEventHandler from './private/socketServerEventHandler';

console.log('starting upgrade');
samsara().upgrade().then(() => {
  console.log('upgrade done');
  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(process.env.PORT || '8080');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Create SocketIo app
   */

  const io = socketIO(server);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Hook socket server to the eventBus
   */

  socketServerEventHandler(io);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }


  process.on('SIGTERM', function(){
    console.log("SIGTERM");
    server.close();
    process.exit(1);
  });
  process.on('SIGINT', function(){
    console.log("SIGINT");
    server.close();
    process.exit(1);
  });
}).catch(e => {
  console.error(e);
  console.error(e.stack);
  process.exit();
});
process.on('unhandledRejection', function(reason, p) {
  console.error(p, reason);
});
