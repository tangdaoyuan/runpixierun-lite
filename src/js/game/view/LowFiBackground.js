import * as PIXI from '../../pixi'
import { BackgroundElement } from './Background';
import GAME from '../Game'

class LowFiBackground extends PIXI.Container {
    constructor() {
        super()
        const texture = PIXI.Texture.from("img/iP4_BGtile.jpg")
        this.swoosh = new BackgroundElement(texture, 0, this);
        this.width = 1000;
        this.scrollPosition = 1500;
        this.swoosh.speed = 0.7
    }

    updateTransform() {
        this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;
        this.swoosh.setPosition(this.scrollPosition);
        super.updateTransform()
    }

}


export {
    LowFiBackground
}
