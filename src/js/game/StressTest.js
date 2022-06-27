// update
import * as PIXI from '../pixi'
import _Device from '../fido/Device'
import { SpritePool } from '../GoodBoySplash'


export const Stress = {};

Stress.StressTest = function(callback) {
    this.Device = new _Device();

    this.width = window.innerWidth || document.body.clientWidth;
    this.height = window.innerHeight || document.body.clientHeight;

    this.frameCount = 0;
    this.tick = 0;
    this.loadingFrames = [
        "/img/loading_01.png",
        "/img/loading_02.png",
        "/img/loading_03.png",
        "/img/loading_04.png"
    ];
    this.currentLoadSprite = false;

    let assetLoader = new PIXI.Loader()
    assetLoader.add(this.loadingFrames);
    assetLoader.load();

    this.callback = callback;
    this.renderer = PIXI.autoDetectRenderer({
        width: this.width,
        height: this.height,
    })
    this.stage = new PIXI.Stage();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x25284A);
    this.graphics.drawRect(0, 0, this.width, this.height);
    this.stage.addChild(this.graphics);

    document.body.appendChild(this.renderer.view);

    this.stage.touchstart = this.stage.mousedown = function(event) {
        event.originalEvent.preventDefault();
    }


    this.duration = 3;

    let scope = this;
    PIXI.Texture.fromURL("/img/testImage.png").then(res => {
      this.texture = res;
      scope.begin();
      this.frameRate = [];
    });
}

// constructor
Stress.StressTest.constructor = Stress.StressTest;

Stress.StressTest.prototype.begin = async function() {
    this.testSprites = [];
    for (let i = 0; i < 300; i++) {
        let bunny = new PIXI.Sprite(this.texture);

        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        bunny.position.x = 50 + Math.random() * 400;
        bunny.position.y = 10;

        this.stage.addChild(bunny);
        this.testSprites.push(bunny);
    };

    this.graphics2 = new PIXI.Graphics();
    this.graphics2.beginFill(0x25284A);
    this.graphics2.drawRect(0, 0, this.width, this.height);
    this.stage.addChild(this.graphics2);

    const r = await PIXI.Texture.fromURL('/img/goodboy_logo.png')
    let logo = new PIXI.Sprite(r);
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.position.x = this.width * 0.5;
    logo.position.y = this.height * 0.48;


    logo.scale.set(1);

    this.stage.addChild(logo);

    this.renderer.render(this.stage);

    this.startTime = Date.now();
    this.lastTime = Date.now();

    let scope = this;
    requestAnimationFrame(function() {
        scope.update();
    });
}

Stress.StressTest.prototype.resize = function(w, h) {
    this.width = w;
    this.height = h;
}

Stress.StressTest.prototype.update = function() {
    this.frameCount++;

    if (this.frameCount % 12 === 1) {
        if (this.tick === this.loadingFrames.length) {
            this.tick = 0;
        }

        let sprite = SpritePool.getInstance().get(this.loadingFrames[this.tick])
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = this.width * 0.5;
        sprite.position.y = this.height * 0.5 + 40;

        this.stage.addChild(sprite);
        if (this.currentLoadSprite !== false) this.stage.removeChild(this.currentLoadSprite);

        this.currentLoadSprite = sprite;

        this.tick++;
    }

    let currentTime = Date.now();

    for (let i = 0; i < this.testSprites.length; i++) {
        this.testSprites[i].rotation += 0.3;
    }

    this.renderer.render(this.stage);

    let diff = currentTime - this.lastTime;
    diff *= 0.06;

    this.frameRate.push(diff);

    this.lastTime = currentTime;

    let elapsedTime = currentTime - this.startTime;

    if (elapsedTime < this.duration * 1000) {
        let scope = this;
        requestAnimationFrame(function() {
            scope.update()
        });
    } else {
        if (this.callback) this.callback();
    }
}

Stress.StressTest.prototype.end = function() {
    this.result = this.frameRate.length / this.duration;
}

Stress.StressTest.prototype.remove = function() {
    document.body.removeChild(this.renderer.view);
    this.cover = null;
    this.renderer = null;
}
