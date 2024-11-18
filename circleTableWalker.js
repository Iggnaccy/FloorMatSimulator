// circleTableWalker.js

class CircleTableWalker {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.calculatePositions();
    }

    calculatePositions() {
        this.positions = [];
        this.currentPosition = 0;
        const x0 = this.x;
        const y0 = this.y;
        const radius = Math.round(this.radius);
    
        let x = 0;
        let y = radius;
        let d = 1 - radius;
    
        this.plotCirclePoints(x0, y0, x, y);
    
        while (x < y) {
          x++;
          if (d < 0) {
            d += 2 * x + 1;
          } else {
            y--;
            d += 2 * (x - y) + 1;
          }
          this.plotCirclePoints(x0, y0, x, y);
        }
    
        // Remove duplicate points if any
        this.positions = this.positions.filter(
          (pos, index, self) =>
            index ===
            self.findIndex(
              p => p[0] === pos[0] && p[1] === pos[1]
            )
        );
        
        this.sortPositions();
      }
    
      plotCirclePoints(x0, y0, x, y) {
        // Add all eight symmetric points
        this.positions.push([x0 + x, y0 + y]);
        this.positions.push([x0 - x, y0 + y]);
        this.positions.push([x0 + x, y0 - y]);
        this.positions.push([x0 - x, y0 - y]);
        this.positions.push([x0 + y, y0 + x]);
        this.positions.push([x0 - y, y0 + x]);
        this.positions.push([x0 + y, y0 - x]);
        this.positions.push([x0 - y, y0 - x]);
      }
    
      sortPositions() {
        const x0 = this.x;
        const y0 = this.y;
    
        // Calculate angles for each position
        const positionsWithAngles = this.positions.map(pos => {
          const angle = Math.atan2(pos[1] - y0, pos[0] - x0);
          return { pos, angle };
        });
    
        // Sort positions based on angles
        positionsWithAngles.sort((a, b) => a.angle - b.angle);
    
        // Update the positions array with sorted positions
        this.positions = positionsWithAngles.map(item => item.pos);
      }
    
      process(table, width, height) {
        // Get the current point
        let currentPoint = this.positions[this.currentPosition];
        let currentFlatPosition = currentPoint[0] + currentPoint[1] * width;
      
        // Move to the next position
        this.currentPosition++;
        this.currentPosition %= this.positions.length;
      
        // Get the new point
        let newPoint = this.positions[this.currentPosition];
        let newFlatPosition = newPoint[0] + newPoint[1] * width;
      
        // Check if currentFlatPosition is within the table bounds
        if (
          currentPoint[0] >= 0 &&
          currentPoint[0] < width &&
          currentPoint[1] >= 0 &&
          currentPoint[1] < height
        ) {
          table[currentFlatPosition] = false;
        }
      
        // Check if newFlatPosition is within the table bounds
        if (
          newPoint[0] >= 0 &&
          newPoint[0] < width &&
          newPoint[1] >= 0 &&
          newPoint[1] < height
        ) {
          table[newFlatPosition] = true;
        }
      }

    setRadius(radius) {
        this.radius = radius;
        this.calculatePositions();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.calculatePositions();
    }

    setPositionAndRadius(x, y, radius)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.calculatePositions();
    }
}

module.exports = CircleTableWalker;