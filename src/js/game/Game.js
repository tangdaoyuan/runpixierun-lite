import * as PIXI from '../pixi'

const GAME = {}
GAME.HIGH_MODE = true;
GAME.camera = new PIXI.Point();
GAME.height;
GAME.bundleId = "com.goodboy.runpixierun";
GAME.newHighScore = false;
GAME.gameMode = 0
GAME.GAME_MODE = {
  TITLE: 0,
  COUNT_DOWN: 1,
  PLAYING: 2,
  GAME_OVER: 3,
  INTRO: 4,
  PAUSED: 5
};
GAME.interactive = true


export default GAME
