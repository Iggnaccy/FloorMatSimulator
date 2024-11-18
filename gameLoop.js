// gameLoop.js

class GameLoop {
  constructor(updateFunction, frameRate = 2) {
    this.updateFunction = updateFunction;
    this.frameRate = frameRate;
    this.frameDuration = 1000 / this.frameRate;
    this.isRunning = false;
    this.state = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop = () => {
    if (!this.isRunning) return;

    try {
      this.state = this.updateFunction(this.state);
    } catch (err) {
      console.error('Error in frame loop:', err);
    } finally {
      this.loopTimeout = setTimeout(this.loop, this.frameDuration);
    }
  };

  setUpdateFunction(updateFunction) {
    this.updateFunction = updateFunction;
  }
  
  setFramerate(newFrameRate) {
    if (typeof newFrameRate !== 'number' || newFrameRate <= 0) {
      throw new Error('Framerate must be a positive number.');
    }
    this.frameRate = newFrameRate;
    this.frameDuration = 1000 / this.frameRate;

    // If the game loop is running, restart the loop to apply the new framerate immediately
    if (this.isRunning) {
      clearTimeout(this.loopTimeout);
      this.loop();
    }
  }
}

module.exports = GameLoop;
