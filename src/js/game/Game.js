import * as PIXI from '../pixi'

// TODO
// wrapper with setter/getter

class GAME {
  static HIGH_MODE = true
  static camera = new PIXI.Point()
  static width = 0
  static height = 0
  static bundleId = "com.goodboy.runpixierun"
  static newHighScore = false
  static gameMode = 0
  static interactive = true
  static time = null
  static lowMode = false // 
  static HIGH_MODE = true // if Support webGLRenderer
  static xOffset = 0

  static initTimer() {
    GAME.time = new Time()
  }
}

class Time {
  constructor() {
    this.DELTA_TIME = 1;
    this.lastTime = Date.now();
    this.speed = 1;
  }
  update() {
    const currentTime = Date.now();
    let passedTime = currentTime - this.lastTime;

    this.DELTA_TIME = ((passedTime) * 0.06);
    this.DELTA_TIME *= this.speed;

    if (this.DELTA_TIME > 2.3) this.DELTA_TIME = 2.3;

    this.lastTime = currentTime;
  }
}



export default GAME
