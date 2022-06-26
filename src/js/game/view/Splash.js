import * as PIXI from '../../pixi'
import GAME from '../Game';

const Splash = function(owner) {
    this.textures = [PIXI.Texture.from("lavaFrame_01.png"),
        PIXI.Texture.from("lavaFrame_02.png"),
        PIXI.Texture.from("lavaFrame_03.png"),
        PIXI.Texture.from("lavaFrame_04.png"),
        PIXI.Texture.from("lavaFrame_05.png"),
        PIXI.Texture.from("lavaFrame_06.png"),
        PIXI.Texture.from("lavaFrame_07.png"),
        PIXI.Texture.from("lavaFrame_08.png"),
        PIXI.Texture.from("lavaFrame_09.png"),
        PIXI.Texture.from("lavaFrame_10.png"),
        PIXI.Texture.from("lavaFrame_11.png"),
        PIXI.Texture.from("lavaFrame_12.png")
    ];

    PIXI.AnimatedSprite.call(this, this.textures);
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.scale.x = this.scale.y = 2;
    this.animationSpeed = 0.3;
    this.visible = false;

    this.realPosition;
}



Splash.constructor = Splash;
Splash.prototype = Object.create(PIXI.AnimatedSprite.prototype);

Splash.prototype.splash = function(position) {
    this.realPosition = position.x;

    this.position.y = 620; //this.engine.steve.view.position.y;

    this.gotoAndPlay(0)
    this.visible = true;
}

Splash.prototype.updateTransform = function() {
    if (!this.visible) return;

    PIXI.AnimatedSprite.prototype.updateTransform.call(this);
    this.position.x = this.realPosition - GAME.camera.x


    if (this.currentFrame > this.textures.length - 1) {
        this.stop();
        this.visible = false;
    }
}
export {
    Splash
}
