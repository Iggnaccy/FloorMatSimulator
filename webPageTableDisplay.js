// webPageTableDisplay.js

class WebPageTableDisplay {
    constructor(webSocketClients) {
      this.webSocketClients = webSocketClients;
    }
  
    process(table, width, height) {
      const data = {
        table,
        width,
        height,
      };
  
      const message = JSON.stringify(data);
  
      // Send the table data to all connected clients
      this.webSocketClients.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(message);
        }
      });
    }
  }
  
  module.exports = WebPageTableDisplay;
  