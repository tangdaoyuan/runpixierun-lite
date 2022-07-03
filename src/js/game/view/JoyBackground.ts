import * as PIXI from '../../pixi'
import { BackgroundElement } from './Background';
import GAME from '../Game';

class JoyBackground extends PIXI.Container {
    swoosh: BackgroundElement;
    initialWidth: number;
    scrollPosition: number;

    constructor() {
        super()
        this.swoosh = new BackgroundElement(
            PIXI.Texture.from("img/stretched_hyper_tile.jpg")
            ,
            0,
            this
        );
        this.initialWidth = 1000
        this.width = 1000;
        this.scrollPosition = 1500;
        this.swoosh.speed = 0.7
        this.scale.y = 1.7;
        this.scale.x = 4;
    }

    updateTransform() {
        this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;

        this.swoosh.setPosition(this.scrollPosition);
        super.updateTransform()
    }

}
export {
    JoyBackground
}
