// update
import * as PIXI from './pixi'
import { gsap, Elastic } from "gsap"
import { Stress } from './game/StressTest'


window.addEventListener('DOMContentLoaded', () => {
  onReady();
})

window.addEventListener('resize', function() {
    resize();
});

window.onorientationchange = resize;


var GAME_MODE = {
    TITLE: 0,
    COUNT_DOWN: 1,
    PLAYING: 2,
    GAME_OVER: 3,
    INTRO: 4,
    PAUSED: 5
};

var loader;
var game;
var loadInterval = false;
var gameMode = 0;
var countdown;
var logo;
var black;
var interactive = true;
var stressTest;
var thrusters = 0;
var thrustersVolume = 0;
var pauseButton = false;
var pauseScreen = false;

var resumeButton = false;
var restartButton = false;
var soundOnButton = false;
var soundOffButton = false;

function onReady() {
    FidoAudio.init();
    stressTest = new Stress.StressTest(onStressTestComplete);
    resize();
}

function onStressTestComplete() {
    stressTest.end();
    GAME.lowMode = stressTest.result < 40;

    interactive = false;
    document.body.scroll = "no";

    loader =  new PIXI.Loader()
    loader.add([
      "img/stretched_hyper_tile.jpg",
      "img/SplashAssets.json",
      "img/WorldAssets-hd.json",
      "img/HudAssets-hd.json",
      "img/PixiAssets-hd.json",
      "img/iP4_BGtile.jpg",
      "img/blackSquare.jpg",
      "assets/hud/pausedPanel.png",
      "assets/hud/pixieRevised_controls.png",
      "assets/hud/ContinuePlay.png",
      "assets/hud/RestartPlay.png",
      "assets/hud/soundOff.png",
      "assets/hud/soundOn.png",
      "assets/hud/pause.png",
      "assets/hud/PersonalBest.png"
  ])

    loader.onComplete.add(() => {
      stressTest.remove();
      init();
      clearInterval(loadInterval);
    })

    loader.load();
    resize();
}

function onTap(event) {
    event.originalEvent.preventDefault();

    if (event.target.type !== 'button') {
        if (!interactive) return;

        if (gameMode === GAME_MODE.INTRO) {
            FidoAudio.play('gameMusic');
            FidoAudio.play('runRegular');
            FidoAudio.play('runFast');

            interactive = false;
            gameMode = GAME_MODE.TITLE;

            logo.alpha = 0;
            logo.scale.x = 1.5;
            logo.scale.y = 1.5;
            logo.setTexture(PIXI.Texture.fromURL("/assets/hud/pixieRevised_controls.png"));

            gsap.to(logo, 0.1, {
              alpha: 1
            })

            gsap.to(logo.scale, 1, {
              x: 1,
              y: 1,
              ease: Elastic.easeOut,
              onComplete: onIntroFaded
            })
        } else if (gameMode === GAME_MODE.TITLE) {
            interactive = false;

            game.start();
            gameMode = GAME_MODE.COUNT_DOWN;
            FidoAudio.setVolume('runRegular', 1);

            if (black) {
                gsap.to(black, 0.2, {
                    alpha: 0
                });
            }

            gsap.to(logo, 0.3, {
                alpha: 0,
                onComplete: function() {
                    logo.visible = false;
                    logo.setTexture(PIXI.Texture.fromFrame("gameOver.png"));
                    game.view.showHud();
                    game.view.hud.removeChild(black);
                    countdown.startCountDown(onCountdownComplete);
                }
            });
        } else if (gameMode === GAME_MODE.GAME_OVER) {
            interactive = false;

            game.view.stage.addChild(black);

            gsap.to(black, 0.3, {
                alpha: 1,
                onComplete: function() {
                    game.steve.normalMode();
                    game.joyrideComplete();

                    game.steve.position.x = 0;
                    GAME.camera.x = game.steve.position.x - 100;
                    game.reset();
                    logo.visible = false;
                    gameMode = GAME_MODE.COUNT_DOWN;

                    gsap.killTweensOf(GAME.camera);
                    GAME.camera.zoom = 1;

                    gsap.to(black, 0.3, {
                        alpha: 0,
                        onComplete: function() {
                            logo.visible = false;
                            game.start();
                            FidoAudio.fadeIn('gameMusic');
                            countdown.startCountDown(onCountdownComplete);
                        }
                    });
                }
            });
        } else {
            // handle our jump sound
            thrusters = true;
            if (game.isPlaying) game.steve.jump();
        }
    }
}

function init() {
    gameMode = GAME_MODE.INTRO;
    interactive = false;

    game = new GAME.RprEngine();

    document.body.appendChild(game.view.renderer.view);
    game.view.renderer.view.style.position = "absolute";
    game.view.renderer.view.webkitImageSmoothingEnabled = false

    if (GAME.lowMode) {
        setInterval(update, 1000 / 30);
    } else {
        requestAnimFrame(update);
    }

    game.onGameover = onGameover;

    black = new PIXI.Sprite.from("img/blackSquare.jpg");
    this.game.view.hud.addChild(black);

    gsap.to(black, 0.3, {
        alpha: 0.75,
        delay: 0.5
    });

    logo = PIXI.Sprite.fromFrame("runLogo.png");
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.alpha = 0;

    this.game.view.hud.addChild(logo);

    personalBestTitle = PIXI.Sprite.from("assets/hud/PersonalBest.png");
    personalBestTitle.anchor.x = 0.5;
    personalBestTitle.anchor.y = 0.5;
    personalBestTitle.alpha = 0;
    personalBestTitle.scale.x = 1.5;
    personalBestTitle.scale.y = 1.5;

    this.game.view.hud.addChild(personalBestTitle);

    var pressStart = PIXI.Sprite.fromFrame("spaceStart.png");
    pressStart.anchor.x = 0.5;
    pressStart.position.y = 200;

    gsap.to(logo, 0.1, {
        alpha: 1,
        delay: 0.6,
        onComplete: onIntroFaded
    });

    countdown = new GAME.Countdown();
    this.game.view.hud.addChild(countdown);

    pauseButton = PIXI.Sprite.from("/assets/hud/pause.png");
    pauseButton.interactive = true;
    pauseButton.anchor.x = 0.5;
    pauseButton.anchor.y = 0.5;
    pauseButton.alpha = 0;
    pauseButton.visible = false;
    pauseButton.type = "button";

    pauseScreen = PIXI.Sprite.from("/assets/hud/pausedPanel.png");
    pauseScreen.anchor.x = 0.5;
    pauseScreen.anchor.y = 0.5;
    pauseScreen.scale.x = 1.5;
    pauseScreen.scale.y = 1.5;
    pauseScreen.alpha = 0;
    pauseScreen.visible = false;

    // Buttons
    resumeButton = PIXI.Sprite.from("assets/hud/ContinuePlay.png");
    resumeButton.anchor.x = 0.5;
    resumeButton.anchor.y = 0.5;
    resumeButton.scale.x = 0;
    resumeButton.scale.y = 0;
    resumeButton.alpha = 0;
    resumeButton.interactive = true;

    resumeButton.touchstart = resumeButton.mousedown = function() {
        onResumePressed();
    }

    restartButton = PIXI.Sprite.from("assets/hud/RestartPlay.png");
    restartButton.anchor.x = 0.5;
    restartButton.anchor.y = 0.5;
    restartButton.scale.x = 0;
    restartButton.scale.y = 0;
    restartButton.alpha = 0;
    restartButton.interactive = true;

    restartButton.touchstart = restartButton.mousedown = function(event) {
        event.originalEvent.preventDefault();
        onRestartPressed();
    }

    soundOffButton = PIXI.Sprite.from("assets/hud/soundOff.png");
    soundOffButton.anchor.x = 0.5;
    soundOffButton.anchor.y = 0.5;
    soundOffButton.scale.x = 0;
    soundOffButton.scale.y = 0;
    soundOffButton.alpha = 0;
    soundOffButton.interactive = true;

    soundOffButton.touchstart = soundOffButton.mousedown = function(event) {
        event.originalEvent.preventDefault();
        onSoundOffPressed();
    }

    soundOnButton = PIXI.Sprite.from("assets/hud/soundOn.png");
    soundOnButton.anchor.x = 0.5;
    soundOnButton.anchor.y = 0.5;
    soundOnButton.scale.x = 0;
    soundOnButton.scale.y = 0;
    soundOnButton.alpha = 0;
    soundOnButton.interactive = true;

    soundOnButton.touchstart = soundOnButton.mousedown = function(event) {
        event.originalEvent.preventDefault();
        onSoundOnPressed();
    }

    this.game.view.stage.addChild(pauseScreen);
    this.game.view.stage.addChild(resumeButton);
    this.game.view.stage.addChild(restartButton);
    this.game.view.stage.addChild(soundOffButton);
    this.game.view.stage.addChild(soundOnButton);
    this.game.view.stage.addChild(pauseButton);

    pauseButton.mousedown = pauseButton.touchstart = function(event) {
        event.originalEvent.preventDefault();
        onPaused();
    }

    this.game.view.container.mousedown = this.game.view.container.touchstart = function(event) {
        onTap(event);
    }

    this.game.view.container.mouseup = this.game.view.container.touchend = function(event) {
        onTouchEnd(event);
    }

    resize();

    FidoAudio.play('gameMusic');
    FidoAudio.play('runRegular');
    FidoAudio.play('runFast');
}

function onResumePressed() {
    onPaused();
}

function onRestartPressed() {
    onPaused();
    game.steve.die();
    game.gameover();
}

function onSoundOnPressed() {
    FidoAudio.muteAll();


    gsap.to(soundOnButton.scale, 0.6, {
      x: 0,
      y: 0,
      ease: Elastic.easeOut
    });
    gsap.to(soundOnButton, 0.1, {
      alpha: 0
    });
    gsap.to(soundOffButton.scale, 0.6, {
      x: 1,
      y: 1,
      ease: Elastic.easeOut
    });
    gsap.to(soundOffButton, 0.1, {
      alpha: 1
    });
}

function onSoundOffPressed() {
    FidoAudio.unMuteAll();

    gsap.to(soundOffButton.scale, 0.6, {
      x: 0,
      y: 0,
      ease: Elastic.easeOut
    });
    gsap.to(soundOffButton, 0.1, {
      alpha: 0
    });

    gsap.to(soundOnButton.scale, 0.6, {
      x: 1,
      y: 1,
      ease: Elastic.easeOut
    });
    gsap.to(soundOnButton, 0.1, {
      alpha: 1
    });
}

var prevState = false;

function onPaused() {
    pauseButton.scale.set(0.5);

    gsap.to(pauseButton.scale, 0.5, {
        x: 1,
        y: 1,
        ease: Elastic.easeOut
    });

    if (gameMode === GAME_MODE.PAUSED) {
        game.steve.resume();

        interactive = true;
        gameMode = prevState;
        prevState = false;

        gsap.to(soundOffButton.scale, 0.6, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        gsap.to(soundOffButton, 0.1, {
            alpha: 0
        });

        gsap.to(soundOnButton.scale, 0.6, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        gsap.to(soundOnButton, 0.1, {
            alpha: 0
        });

        gsap.to(resumeButton.scale, 0.6, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        gsap.to(resumeButton, 0.1, {
            alpha: 0
        });

        gsap.to(restartButton.scale, 0.6, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        gsap.to(restartButton, 0.1, {
            alpha: 0
        });

        gsap.to(pauseScreen.scale, 1, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        gsap.to(pauseScreen, 0.1, {
            alpha: 0
        });
    } else {
        game.steve.stop();
        prevState = gameMode;
        gameMode = GAME_MODE.PAUSED;
        interactive = false;

        pauseScreen.visible = true;

        gsap.to(pauseScreen, 0.1, {
            alpha: 1,
        });

        gsap.to(pauseScreen.scale, 0.6, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });

        if (FidoAudio.isMuted() === false) {
            gsap.to(soundOnButton.scale, 0.6, {
                x: 1,
                y: 1,
                ease: Elastic.easeOut
            });
            gsap.to(soundOnButton, 0.1, {
                alpha: 1
            });
        } else {
            gsap.to(soundOffButton.scale, 0.6, {
                x: 1,
                y: 1,
                ease: Elastic.easeOut
            });
            gsap.to(soundOffButton, 0.1, {
                alpha: 1
            });
        }

        gsap.to(resumeButton, 0.1, {
            alpha: 1,
        });
        gsap.to(resumeButton.scale, 0.6, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });

        gsap.to(restartButton, 0.1, {
            alpha: 1,
        });
        gsap.to(restartButton.scale, 0.6, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });
    }
}

function onIntroFaded() {
    interactive = true;
}

function onGameover() {
    pauseButton.interactive = false;
    FidoAudio.setVolume('thrusters', 0);
    gsap.to(pauseButton, 0.6, {
        alpha: 0,
        onComplete: function() {
            pauseButton.visible = false;
        }
    });

    gameMode = GAME_MODE.GAME_OVER;
    interactive = false;
}

function showGameover() {
    logo.visible = true;
    gsap.to(logo, 0.3, {
        alpha: 1,
        onComplete: onGameoverShown
    });
}

function onGameoverShown() {
    this.isGameReallyOver = true;
    interactive = true;
}

function onTouchStart(event) {
    onTap(event);
}

function onCountdownComplete() {
    interactive = true;
    gameMode = GAME_MODE.PLAYING;
    pauseButton.visible = true;
    gsap.to(pauseButton, 0.6, {
        alpha: 1,
        onComplete: function() {
            pauseButton.interactive = true;
        }
    });
}

function onTouchEnd(event) {
    event.originalEvent.preventDefault();
    thrusters = false;
    FidoAudio.setVolume('thrusters', 0);
    if (game.isPlaying) game.steve.fall();
}

function resize() {
    window.scrollTo(0, 0);

    var h = 640;
    var width = window.innerWidth || document.body.clientWidth;
    var height = window.innerHeight || document.body.clientHeight;
    var ratio = height / h;

    if (game) {
        var view = game.view.renderer.view;
        view.style.height = h * ratio + "px";

        var newWidth = (width / ratio);

        view.style.width = width + "px";

        this.logo.position.x = newWidth / 2;
        this.logo.position.y = h / 2 - 20;

        if (black) {
            black.scale.x = newWidth / 16;
            black.scale.y = h / 16;
        }

        this.countdown.position.x = newWidth / 2;
        this.countdown.position.y = h / 2;

        game.view.resize(newWidth, h);

        pauseButton.position.x = newWidth - 60;
        pauseButton.position.y = h - 60;

        pauseScreen.position.x = (newWidth * 0.5);
        pauseScreen.position.y = h * 0.5;

        resumeButton.position.x = (newWidth * 0.5);
        resumeButton.position.y = (h * 0.5);

        restartButton.position.x = (newWidth * 0.5) + 125;
        restartButton.position.y = (h * 0.5);

        soundOffButton.position.x = (newWidth * 0.5) - 125;
        soundOffButton.position.y = (h * 0.5);

        soundOnButton.position.x = (newWidth * 0.5) - 125;
        soundOnButton.position.y = (h * 0.5);
    }

    GAME.width = (width / ratio);
    GAME.height = h;
}

function update() {
    game.update();

    if (!GAME.lowMode) {
        if (FidoAudio.isMuted() === false) {
            if (thrusters === true) {
                thrustersVolume += (0.4 - thrustersVolume) * 0.1;
            } else {
                thrustersVolume += (0 - thrustersVolume) * 0.1;
            }

            if (thrustersVolume < 0.01) thrustersVolume = 0;

            FidoAudio.setVolume('thrusters', thrustersVolume);
        }

        requestAnimFrame(update);
    }
}

Time = function() {
    this.deltaTime = 1;
    this.lastTime = 0;
}

Time.constructor = Time;

Time.prototype.update = function() {
    var time = Date.now();
    var currentTime = time;
    var passedTime = currentTime - this.lastTime;

    if (passedTime > 100) passedTime = 100;

    this.DELTA_TIME = (passedTime * 0.06);
    this.lastTime = currentTime;
}

// Override
PIXI.InteractionManager.prototype.onTouchStart = function(event) {
    var rect = this.interactionDOMElement.getBoundingClientRect();

    if (PIXI.AUTO_PREVENT_DEFAULT) event.preventDefault();

    var changedTouches = event.changedTouches;
    for (var i = 0; i < changedTouches.length; i++) {
        var touchEvent = changedTouches[i];

        var touchData = this.pool.pop();
        if (!touchData) touchData = new PIXI.InteractionData();

        touchData.originalEvent = event || window.event;

        this.touchs[touchEvent.identifier] = touchData;
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top) * (this.target.height / rect.height);

        var length = this.interactiveItems.length;

        for (var j = 0; j < length; j++) {
            var item = this.interactiveItems[j];

            if (item.touchstart || item.tap) {
                item.__hit = this.hitTest(item, touchData);

                if (item.__hit) {
                    //call the function!
                    if (item.touchstart) item.touchstart(touchData);
                    item.__isDown = true;
                    item.__touchData = touchData;

                    if (!item.interactiveChildren) break;
                }
            }
        }
    }
};
