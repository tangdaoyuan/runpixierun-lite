import * as PIXI from '../pixi'
import { Explosion } from './Explosion'
import Audio from '../fido/Audio'
import GAME from './Game';

class Enemy {
    constructor() {
        this.position = new PIXI.Point();
        this.view = new PIXI.Sprite(PIXI.Texture.from("spike_box.png"));
        this.view.anchor.x = 0.5;
        this.view.anchor.y = 0.5;
        this.isHit = false;
        this.width = 150;
        this.height = 150;
    }


    reset() {
        if (this.explosion) {
            this.view.removeChild(this.explosion);
            this.explosion.reset();
        }

        this.isHit = false;
        this.view.width = 157;
    }

    hit() {
        if (this.isHit) return;

        Audio.stop('blockHit');
        Audio.play('blockHit');

        this.isHit = true;

        if (!this.explosion) this.explosion = new Explosion();

        this.explosion.explode();
        this.view.addChild(this.explosion);

        this.view.texture = PIXI.Texture.from("img/empty.png")
    }

    update() {
        this.view.position.x = this.position.x - GAME.camera.x;
        this.view.position.y = this.position.y;
    }
}

export {
    Enemy
}
