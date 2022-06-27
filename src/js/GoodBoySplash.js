import * as PIXI from './pixi'

// update
const GoodBoySplash = (function() {
    let paperView = false;
    let paperStage = false;
    let paperRenderer = false;
    let interval = false;

    let nStageWidth = 0;
    let nStageHeight = 0;

    let loadingFrames = [
        "img/loading_01.png",
        "img/loading_02.png",
        "img/loading_03.png",
        "img/loading_04.png",
        "img/goodboy_logo.png"
    ];


    function preload(fCallBack) {
        const assetLoader = new PIXI.Loader()
        assetLoader.add(loadingFrames);
        assetLoader.onComplete = fCallBack;
        assetLoader.load();
    }

    function init() {
        paperView = document.createElement('canvas');
        paperStage = new PIXI.Stage(0x25284A, true);
        paperRenderer = PIXI.autoDetectRenderer({
          width: nStageWidth,
          height: nStageHeight,
          view: paperView
        });

        document.body.appendChild(paperRenderer.view);

        preload(function() {
            let tick = 0;

            interval = setInterval(function() {
                tick++;
                if (tick === loadingFrames.length) {
                    tick = 0;
                }

                paperStage.stage.children = [];

                const sprite = SpritePool.getInstance().get(loadingFrames[tick])
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                sprite.position.x = nStageWidth * 0.5;
                sprite.position.y = nStageHeight * 0.5;
                sprite.scale.set(1);

                paperStage.addChild(sprite);
                paperRenderer.render(paperStage);

            }, 200);
        });
    }


    function show() {

    }

    function hide() {
        clearInterval(interval);
        for (let i = 1; i <= 100; i++) {
            setTimeout((function(x) {
                return function() {
                    fadeOutStep(100 - x)
                };
            })(i), i * 10);
        }
    }

    function fadeOutStep(nOpacity) {
        paperRenderer.view.style.opacity = nOpacity;
        if (nOpacity === 0) {
            document.body.removeChild(paperRenderer.view);
        }
    }

    function resize(nWidth, nHeight) {
        nStageWidth = nWidth;
        nStageHeight = nHeight;

        paperRenderer.view.style.width = nStageWidth + "px";
        paperRenderer.view.style.height = nStageHeight + "px";

        paperRenderer.resize(nStageWidth, nStageHeight);
    }

    return {
        resize: resize,
        init: init,
        hide: hide
    }
})();

/***********
 *SpritePool
 */
function SpritePool() {
    if (SpritePool._isBirth)
        throw new Error("This class is a singleton!");
    else {
        SpritePool._instance = this;
        SpritePool._isBirth = true;
    };
    const _pool = [];
    this.get = function(frameId) {
        for (let i in _pool) {
            if (_pool[i].texture === PIXI.utils.TextureCache[frameId])
                return _pool.splice(i, 1)[0];
        }
        return PIXI.Sprite.from(frameId);
    };
    this.recycle = function(sprite) {
        _pool.push(sprite);
    }
};
SpritePool._isBirth = false;
SpritePool.getInstance = function() {
    return SpritePool._instance != null ? SpritePool._instance : new SpritePool();
};


export {
  SpritePool,
  GoodBoySplash,
}
