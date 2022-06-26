import * as PIXI from '../../pixi'
import { BackgroundElement } from './Background';
import GAME from '../Game'

const LowFiBackground = function() {
    PIXI.Container.call(this);
    const texture = PIXI.Texture.from("img/iP4_BGtile.jpg")
    this.swoosh = new BackgroundElement(texture, 0, this);
    this.width = 1000;
    this.scrollPosition = 1500;
    this.swoosh.speed = 0.7
}

// constructor
LowFiBackground.constructor = LowFiBackground;

LowFiBackground.prototype = Object.create(PIXI.Container.prototype);

LowFiBackground.prototype.updateTransform = function() {
    this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;
    this.swoosh.setPosition(this.scrollPosition);
    PIXI.Container.prototype.updateTransform.call(this);
}




export {
    LowFiBackground
}
