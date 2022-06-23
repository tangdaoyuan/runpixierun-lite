import * as PIXI from '../../pixi'
import { BackgroundElement } from './Background';

const LowFiBackground = function() {
    PIXI.DisplayObjectContainer.call(this);
    this.width = 1000;
    this.scrollPosition = 1500;
    var SCALE = 1 // 0.5
    this.swoosh = new BackgroundElement(PIXI.Texture.from("/img/iP4_BGtile.jpg"), 0, this);
    this.swoosh.speed = 0.7
}

// constructor
LowFiBackground.constructor = LowFiBackground;

LowFiBackground.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

LowFiBackground.prototype.updateTransform = function() {
    this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;

    this.swoosh.setPosition(this.scrollPosition);
    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
}

export {
    LowFiBackground
}
