import * as PIXI from '../../pixi'
import GAME from '../Game';

const Lava = function(owner) {
    this.textures = [PIXI.Texture.from("lava_slosh_01.png"),
        PIXI.Texture.from("lava_slosh_02.png"),
        PIXI.Texture.from("lava_slosh_03.png"),
        PIXI.Texture.from("lava_slosh_04.png"),
        PIXI.Texture.from("lava_slosh_05.png"),
        PIXI.Texture.from("lava_slosh_06.png"),
        PIXI.Texture.from("lava_slosh_07.png"),
        PIXI.Texture.from("lava_slosh_08.png"),
        PIXI.Texture.from("lava_slosh_07.png"),
        PIXI.Texture.from("lava_slosh_06.png"),
        PIXI.Texture.from("lava_slosh_05.png"),
        PIXI.Texture.from("lava_slosh_04.png"),
        PIXI.Texture.from("lava_slosh_03.png"),
        PIXI.Texture.from("lava_slosh_02.png"),
        PIXI.Texture.from("lava_slosh_01.png")
    ];

    let texture = this.textures[0];

    this.sprites = [];
    this.spriteWidth = texture.width - 1;
    let amount = 8;

    if (amount < 3) amount = 3;

    for (let i = 0; i < amount; i++) {
        let sprite = new PIXI.Sprite(texture);
        sprite.position.y = 580;
        owner.addChild(sprite);
        this.sprites.push(sprite);
    };

    this.speed = 1;
    this.offset = 0;
    this.count = 0;
}

Lava.prototype.setPosition = function(position) {
    let h = this.spriteWidth;
    let frame = (this.count) % this.textures.length;
    frame = Math.floor(frame);

    this.offset += 2.5

    position += this.offset;

    this.count += 0.3;
    for (let i = 0; i < this.sprites.length; i++) {
        let pos = -position * this.speed;
        pos += i * h;
        pos %= h * this.sprites.length;
        pos += h * 2;

        this.sprites[i].texture = this.textures[frame]
        this.sprites[i].position.x = Math.floor(pos) + 800 - GAME.xOffset;
    };
}

export {
    Lava
}
