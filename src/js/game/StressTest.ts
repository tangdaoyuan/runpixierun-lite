// update
import * as PIXI from '../pixi'
import _Device from '../fido/Device'
import SpritePool from '../SpritePool'

export class StressTest {
    Device: _Device;
    callback: Function;
    width: number;
    height: number;
    testSprites: PIXI.Sprite[];
    frameCount: number;
    tick: number;
    loadingFrames: string[];
    currentLoadSprite: false | PIXI.Sprite;
    renderer: PIXI.AbstractRenderer | null;
    stage: PIXI.Stage;
    graphics: PIXI.Graphics;
    duration: number;
    texture!: PIXI.Texture<PIXI.Resource>;
    frameRate!: number[];
    graphics2!: PIXI.Graphics;
    startTime!: number;
    lastTime!: number;
    result!: number;
    cover!: null;

    constructor(callback: Function) {
        this.Device = new _Device();

        this.callback = callback;
        this.width = window.innerWidth || document.body.clientWidth;
        this.height = window.innerHeight || document.body.clientHeight;
        this.testSprites = [];

        this.frameCount = 0;
        this.tick = 0;
        this.loadingFrames = [
            "/img/loading_01.png",
            "/img/loading_02.png",
            "/img/loading_03.png",
            "/img/loading_04.png"
        ];
        this.currentLoadSprite = false;

        const assetLoader = new PIXI.Loader()
        assetLoader.add(this.loadingFrames);
        assetLoader.load();

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

        // (this.stage as any).touchstart = (this.stage as any).mousedown = function (event: any) {
        //     event.originalEvent.preventDefault();
        // }

        this.duration = 3;

        PIXI.Texture
            .fromURL("/img/testImage.png")
            .then(res => {
                this.texture = res;
                this.begin()
                this.frameRate = [];
            });
    }
    async begin() {
        for (let i = 0; i < 300; i++) {
            const bunny = new PIXI.Sprite(this.texture);

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

        this.renderer!.render(this.stage);

        this.startTime = Date.now();
        this.lastTime = Date.now();

        const scope = this;
        requestAnimationFrame(() => {
            scope.update();
        });
    }
    resize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }
    async update() {
        this.frameCount++;

        if (this.frameCount % 12 === 1) {
            if (this.tick === this.loadingFrames.length) {
                this.tick = 0;
            }

            const sprite = SpritePool.getInstance().get(this.loadingFrames[this.tick])
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.position.x = this.width * 0.5;
            sprite.position.y = this.height * 0.5 + 40;

            this.stage.addChild(sprite);
            if (this.currentLoadSprite !== false) this.stage.removeChild(this.currentLoadSprite);

            this.currentLoadSprite = sprite;

            this.tick++;
        }

        const currentTime = Date.now();

        for (let i = 0; i < this.testSprites.length; i++) {
            this.testSprites[i].rotation += 0.3;
        }

        this.renderer!.render(this.stage);

        let diff = currentTime - this.lastTime;
        diff *= 0.06;

        this.frameRate.push(diff);

        this.lastTime = currentTime;

        let elapsedTime = currentTime - this.startTime;

        if (elapsedTime < this.duration * 1000) {
            requestAnimationFrame(() => {
                this.update()
            });
        } else {
            if (this.callback) this.callback();
        }
    }
    end() {
        this.result = this.frameRate.length / this.duration;
    }
    remove() {
        document.body.removeChild(this.renderer!.view);
        this.cover = null;
        this.renderer = null;
    }
}
