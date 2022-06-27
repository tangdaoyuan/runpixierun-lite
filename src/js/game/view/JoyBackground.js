import * as PIXI from '../../pixi'
import { BackgroundElement } from './Background';
import GAME from '../Game';

const JoyBackground = function() {
    PIXI.Container.call(this);
    this.swoosh = new BackgroundElement(PIXI.Texture.from("img/stretched_hyper_tile.jpg"), 0, this);
    this.initialWidth = 1000
    this.width = 1000;
    this.scrollPosition = 1500;
    const SCALE = 1 // 0.5
    this.swoosh.speed = 0.7
    this.scale.y = 1.7;
    this.scale.x = 4;
}

// constructor
JoyBackground.constructor = JoyBackground;

JoyBackground.prototype = Object.create(PIXI.Container.prototype);

JoyBackground.prototype.updateTransform = function() {
    this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;

    this.swoosh.setPosition(this.scrollPosition);
    PIXI.Container.prototype.updateTransform.call(this);
}

export {
    JoyBackground
}
