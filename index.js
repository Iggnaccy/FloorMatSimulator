// index.js

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const GameLoop = require('./gameLoop');
const TableRandomizer = require('./tableRandomizer');
const CircleTableWalker = require('./circleTableWalker');
const ConsoleTableLogger = require('./consoleTableLogger');
const WebPageTableDisplay = require('./webPageTableDisplay');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));
app.use(express.json());

// Initialize table size
let tableWidth = 28;
let tableHeight = 14;
let tableSize = tableWidth * tableHeight;

// Initialize the table
let table = new Array(tableSize).fill(false);

// Create instances of manipulators
let tableManipulator = new TableRandomizer(0.5); // Default manipulator
let consoleLogger = new ConsoleTableLogger();

// Keep track of the current manipulator
let currentManipulatorName = 'TableRandomizer';

// Keep track of connected WebSocket clients
let webSocketClients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
  webSocketClients.push(ws);

  ws.on('close', () => {
    webSocketClients = webSocketClients.filter((client) => client !== ws);
  });
});

// Create an instance of WebPageTableDisplay
let webPageDisplay = new WebPageTableDisplay(webSocketClients);

// Start the game loop with the default display method
let currentDisplay = consoleLogger; // Default display method
let currentDisplayName = 'ConsoleTableLogger';

// Define the game loop process function
function gameLoopProcess() {
  // Use the table manipulator to update the table
  tableManipulator.process(table, tableWidth, tableHeight);

  // Use the selected display method
  currentDisplay.process(table, tableWidth, tableHeight);
}

// Create and start the game loop
const gameLoop = new GameLoop(gameLoopProcess, 2);
gameLoop.start();

// API endpoint to change the table manipulator
app.post('/set-table-manipulator', (req, res) => {
  const { manipulator } = req.body;

  if (manipulator === 'TableRandomizer') {
    tableManipulator = new TableRandomizer(0.5);
    currentManipulatorName = 'TableRandomizer';
  } else if (manipulator === 'CircleTableWalker') {
    tableManipulator = new CircleTableWalker(
      Math.floor(tableWidth / 2),
      Math.floor(tableHeight / 2),
      Math.min(tableWidth, tableHeight) / 4
    );
    currentManipulatorName = 'CircleTableWalker';
  }
  table = new Array(tableSize).fill(false);
  res.json({ status: 'Table manipulator changed to ' + manipulator });
});

// API endpoint to change the table size
app.post('/set-table-size', (req, res) => {
  const { width, height } = req.body;

  tableWidth = parseInt(width);
  tableHeight = parseInt(height);

  if(isNaN(tableWidth) || isNaN(tableHeight)) {
    return res.status(400).json({status: 'Invalid parameters'});
  }

  tableSize = tableWidth * tableHeight;
  table = new Array(tableSize).fill(false);

  // Reinitialize the table manipulator with the new size
  if (currentManipulatorName === 'TableRandomizer') {
    tableManipulator = new TableRandomizer(0.5);
  } else if (currentManipulatorName === 'CircleTableWalker') {
    tableManipulator = new CircleTableWalker(
      Math.floor(tableWidth / 2),
      Math.floor(tableHeight / 2),
      Math.min(tableWidth, tableHeight) / 4
    );
  }

  res.json({ status: 'Table size changed to ' + tableWidth + 'x' + tableHeight });
});

// API endpoint to set CircleTableWalker parameters
app.post('/set-circle-parameters', (req, res) => {
  const { x, y, radius } = req.body;

  if (currentManipulatorName === 'CircleTableWalker' && tableManipulator instanceof CircleTableWalker) {
    const newX = parseInt(x);
    const newY = parseInt(y);
    const newRadius = parseInt(radius);

    if (
      isNaN(newX) || isNaN(newY) || isNaN(newRadius) ||
      newX < 0 || newX >= tableWidth ||
      newY < 0 || newY >= tableHeight ||
      newRadius < 1
    ) {
      return res.status(400).json({ status: 'Invalid parameters' });
    }

    tableManipulator.setPositionAndRadius(newX, newY, newRadius);

    // Reset the table
    table = new Array(tableSize).fill(false);

    res.json({ status: 'CircleTableWalker parameters updated' });
  } else {
    res.status(400).json({ status: 'CircleTableWalker is not the current manipulator' });
  }
});

// API endpoint to change the display method
app.post('/set-display-method', (req, res) => {
  const { displayMethod } = req.body;

  if (displayMethod === 'ConsoleTableLogger') {
    currentDisplay = consoleLogger;
    currentDisplayName = 'ConsoleTableLogger';
  } else if (displayMethod === 'WebPageTableDisplay') {
    currentDisplay = webPageDisplay;
    currentDisplayName = 'WebPageTableDisplay';
  }
  res.json({ status: 'Display method changed to ' + displayMethod });
});

// API endpoint to change the framerate
app.post('/set-framerate', (req, res) => {
    const { framerate } = req.body;
    const newFramerate = parseFloat(framerate);
  
    if (isNaN(newFramerate) || newFramerate <= 0) {
      return res.status(400).json({ status: 'Invalid framerate value' });
    }
  
    gameLoop.setFramerate(newFramerate);
  
    res.json({ status: 'Framerate updated to ' + newFramerate + ' FPS' });
  });

// API endpoint to change the randomizer chance
app.post('/set-chance', (req, res) => {
    const { chance } = req.body;
    const newChance = parseFloat(chance);

    if(isNaN(newChance) || newChance < 0 || newChance > 1) {
        return res.status(400).json({status: 'Invalid chance value'});
    }

    if(tableManipulator instanceof TableRandomizer) {
        tableManipulator.setChance(newChance);
    } else {
        return res.status(400).json({status: 'TableRandomizer is not current table manipulator'});
    }

    res.json({status: 'Chance updated to ' + chance});
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
