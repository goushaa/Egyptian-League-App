const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Broadcast function to send data to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { broadcast, wss };
