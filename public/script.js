let currentManipulator = 'TableRandomizer';
let currentDisplay = 'ConsoleTableLogger';

const ws = new WebSocket('ws://' + location.host);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  renderTable(data.table, data.width, data.height);
};

function setTableManipulator(manipulator) {
  fetch('/set-table-manipulator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ manipulator })
  })
    .then((response) => response.json())
    .then((data) => {
      currentManipulator = manipulator;
      updateManipulatorButtons();
      updateCircleParamsVisibility();
      updateChanceVisibility();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
}

function setTableSize() {
  const width = document.getElementById('tableWidth').value;
  const height = document.getElementById('tableHeight').value;

  fetch('/set-table-size', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ width, height })
  })
    .then((response) => response.json())
    .then((data) => {
      // No alert needed on success
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
}

function setDisplayMethod(displayMethod) {
  fetch('/set-display-method', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ displayMethod })
  })
    .then((response) => response.json())
    .then((data) => {
      currentDisplay = displayMethod;
      updateDisplayButtons();
      updateTableContainerVisibility();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
}

function setFramerate() {
  const framerate = document.getElementById('framerateInput').value;

  fetch('/set-framerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ framerate })
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.status);
        });
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById('currentFramerate').innerText = framerate;
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
}

function setCircleParameters() {
  const x = document.getElementById('circleX').value;
  const y = document.getElementById('circleY').value;
  const radius = document.getElementById('circleRadius').value;

  fetch('/set-circle-parameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ x, y, radius })
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.status);
        });
      }
      return response.json();
    })
    .then((data) => {
      // No alert needed on success
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
}

function setChance() {
    const chance = document.getElementById('chance').value;
    
    fetch('/set-chance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chance})
    })
      .then((response) => {
        if(!response.ok) {
            return response.json().then((data) => {
                throw new Error(data.status);
            });
        }
        return response.json();
      })
      .then((data) => {
        // No alert on success
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
      })
}

function updateManipulatorButtons() {
  const btnTableRandomizer = document.getElementById('btnTableRandomizer');
  const btnCircleTableWalker = document.getElementById('btnCircleTableWalker');

  btnTableRandomizer.disabled = currentManipulator === 'TableRandomizer';
  btnCircleTableWalker.disabled = currentManipulator === 'CircleTableWalker';
}

function updateCircleParamsVisibility() {
  const circleParamsDiv = document.getElementById('circleParams');
  if (currentManipulator === 'CircleTableWalker') {
    circleParamsDiv.style.display = 'block';
  } else {
    circleParamsDiv.style.display = 'none';
  }
}

function updateChanceVisibility() {
    const chanceParamsDiv = document.getElementById('chanceParams');
    if(currentManipulator === 'TableRandomizer') {
        chanceParamsDiv.style.display = 'block';
    } else {
        chanceParamsDiv.style.display = 'none';
    }
}

function updateDisplayButtons() {
  const btnConsoleDisplay = document.getElementById('btnConsoleDisplay');
  const btnWebDisplay = document.getElementById('btnWebDisplay');

  btnConsoleDisplay.disabled = currentDisplay === 'ConsoleTableLogger';
  btnWebDisplay.disabled = currentDisplay === 'WebPageTableDisplay';
}

function updateTableContainerVisibility() {
  const tableContainer = document.getElementById('tableContainer');
  if (currentDisplay === 'WebPageTableDisplay') {
    tableContainer.style.display = 'block';
  } else {
    tableContainer.style.display = 'none';
  }
}

function renderTable(table, width, height) {
  const tableDisplay = document.getElementById('tableDisplay');
  tableDisplay.innerHTML = ''; // Clear previous content

  const cellSize = 20; // Adjust as needed
  tableDisplay.style.width = width * cellSize + 'px';
  tableDisplay.style.height = height * cellSize + 'px';
  tableDisplay.style.display = 'grid';
  tableDisplay.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
  tableDisplay.style.gridTemplateRows = `repeat(${height}, ${cellSize}px)`;

  for (let i = 0; i < table.length; i++) {
    const cell = document.createElement('div');
    cell.style.width = cellSize + 'px';
    cell.style.height = cellSize + 'px';
    cell.style.boxSizing = 'border-box';

    cell.style.backgroundColor = table[i] ? '#000' : '#fff';
    cell.style.border = '1px solid #ccc';

    tableDisplay.appendChild(cell);
  }
}

function close() {
    fetch('/close', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/none'
        }
    })
}

// Initialize the buttons and visibility on page load
document.addEventListener('DOMContentLoaded', () => {
  updateManipulatorButtons();
  updateCircleParamsVisibility();
  updateChanceVisibility();
  updateDisplayButtons();
  updateTableContainerVisibility();
  document.getElementById('currentFramerate').innerText = '2'; // Default framerate
});
