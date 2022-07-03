// update
import * as PIXI from './pixi'
import { gsap, Elastic } from "gsap"
import Audio from './fido/Audio'
import { RprEngine } from './game/RprEngine'
import { StressTest } from './game/StressTest'
import GAME from './game/Game'
import { Countdown } from './game/view/Countdown'
import { GAME_MODE } from './constant'


window.addEventListener('DOMContentLoaded', () => {
    onReady();
})

window.addEventListener('resize', function () {
    resize();
});

window.onorientationchange = resize;

let loader;
let game: RprEngine;
let loadInterval: false | number = false;
let countdown: Countdown;
let logo: PIXI.Sprite;
let black: PIXI.Sprite;
let stressTest: StressTest;
let thrusters = false;
let thrustersVolume = 0;
let pauseButton: PIXI.Sprite;
let pauseScreen: PIXI.Sprite;

let resumeButton: PIXI.Sprite;
let restartButton: PIXI.Sprite;
let soundOnButton: PIXI.Sprite;
let soundOffButton: PIXI.Sprite;

function onReady() {
    Audio.init();
    stressTest = new StressTest(onStressTestComplete);
    resize();
}

function onStressTestComplete() {
    stressTest.end();
    GAME.lowMode = stressTest.result < 40;

    GAME.interactive = false;
    // document.body.scroll = "no";

    loader = new PIXI.Loader()
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
        if (typeof loadInterval === 'number') {
            clearInterval(loadInterval);
        }
        
    })

    loader.load();
    resize();
}

function onTap(event: any) {
    // event.originalEvent.preventDefault();

    if (event.target.type !== 'button') {
        if (!GAME.interactive) return;

        if (GAME.gameMode === GAME_MODE.INTRO) {
            Audio.play('gameMusic');
            Audio.play('runRegular');
            Audio.play('runFast');

            GAME.interactive = false;
            GAME.gameMode = GAME_MODE.TITLE;

            logo.alpha = 0;
            logo.scale.x = 1.5;
            logo.scale.y = 1.5;
            logo.texture = PIXI.Texture.from("assets/hud/pixieRevised_controls.png");

            gsap.to(logo, 0.1, {
                alpha: 1
            })

            gsap.to(logo.scale, 1, {
                x: 1,
                y: 1,
                ease: Elastic.easeOut,
                onComplete: onIntroFaded
            })
        } else if (GAME.gameMode === GAME_MODE.TITLE) {
            GAME.interactive = false;

            game.start();
            GAME.gameMode = GAME_MODE.COUNT_DOWN;
            Audio.setVolume('runRegular', 1);

            if (black) {
                gsap.to(black, 0.2, {
                    alpha: 0
                });
            }

            gsap.to(logo, 0.3, {
                alpha: 0,
                onComplete: function () {
                    logo.visible = false;
                    logo.texture = PIXI.Texture.from("gameOver.png");
                    game.view.showHud();
                    game.view.hud.removeChild(black);
                    countdown.startCountDown(onCountdownComplete);
                }
            });
        } else if (GAME.gameMode === GAME_MODE.GAME_OVER) {
            GAME.interactive = false;

            game.view.stage.addChild(black);

            gsap.to(black, 0.3, {
                alpha: 1,
                onComplete: function () {
                    game.steve.normalMode();
                    game.joyrideComplete();

                    game.steve.position.x = 0;
                    GAME.camera.x = game.steve.position.x - 100;
                    game.reset();
                    logo.visible = false;
                    GAME.gameMode = GAME_MODE.COUNT_DOWN;

                    gsap.killTweensOf(GAME.camera);
                    GAME.camera.zoom = 1;

                    gsap.to(black, 0.3, {
                        alpha: 0,
                        onComplete: function () {
                            logo.visible = false;
                            game.start();
                            Audio.fadeIn('gameMusic');
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
    GAME.gameMode = GAME_MODE.INTRO;
    GAME.interactive = false;

    game = new RprEngine();

    document.body.appendChild(game.view.renderer.view);
    game.view.renderer.view.style.position = "absolute";
    game.view.renderer.view.webkitImageSmoothingEnabled = false

    if (GAME.lowMode) {
        setInterval(update, 1000 / 30);
    } else {
        requestAnimationFrame(update);
    }

    game.onGameover = onGameover;

    black = PIXI.Sprite.from("img/blackSquare.jpg");
    game.view.hud.addChild(black);

    gsap.to(black, 0.3, {
        alpha: 0.75,
        delay: 0.5
    });

    logo = PIXI.Sprite.from("runLogo.png");
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.alpha = 0;

    game.view.hud.addChild(logo);

    const personalBestTitle = PIXI.Sprite.from("assets/hud/PersonalBest.png");
    personalBestTitle.anchor.x = 0.5;
    personalBestTitle.anchor.y = 0.5;
    personalBestTitle.alpha = 0;
    personalBestTitle.scale.x = 1.5;
    personalBestTitle.scale.y = 1.5;

    game.view.hud.addChild(personalBestTitle);

    const pressStart = PIXI.Sprite.from("spaceStart.png");
    pressStart.anchor.x = 0.5;
    pressStart.position.y = 200;

    gsap.to(logo, 0.1, {
        alpha: 1,
        delay: 0.6,
        onComplete: onIntroFaded
    });

    countdown = new Countdown();
    game.view.hud.addChild(countdown);

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

    resumeButton.touchstart = resumeButton.mousedown = function () {
        onResumePressed();
    }

    restartButton = PIXI.Sprite.from("assets/hud/RestartPlay.png");
    restartButton.anchor.x = 0.5;
    restartButton.anchor.y = 0.5;
    restartButton.scale.x = 0;
    restartButton.scale.y = 0;
    restartButton.alpha = 0;
    restartButton.interactive = true;

    restartButton.touchstart = restartButton.mousedown = function (event) {
        // event.originalEvent.preventDefault();
        onRestartPressed();
    }

    soundOffButton = PIXI.Sprite.from("assets/hud/soundOff.png");
    soundOffButton.anchor.x = 0.5;
    soundOffButton.anchor.y = 0.5;
    soundOffButton.scale.x = 0;
    soundOffButton.scale.y = 0;
    soundOffButton.alpha = 0;
    soundOffButton.interactive = true;

    soundOffButton.touchstart = soundOffButton.mousedown = function (event) {
        // event.originalEvent.preventDefault();
        onSoundOffPressed();
    }

    soundOnButton = PIXI.Sprite.from("assets/hud/soundOn.png");
    soundOnButton.anchor.x = 0.5;
    soundOnButton.anchor.y = 0.5;
    soundOnButton.scale.x = 0;
    soundOnButton.scale.y = 0;
    soundOnButton.alpha = 0;
    soundOnButton.interactive = true;

    soundOnButton.touchstart = soundOnButton.mousedown = function (event) {
        // event.originalEvent.preventDefault();
        onSoundOnPressed();
    }

    game.view.stage.addChild(pauseScreen);
    game.view.stage.addChild(resumeButton);
    game.view.stage.addChild(restartButton);
    game.view.stage.addChild(soundOffButton);
    game.view.stage.addChild(soundOnButton);
    game.view.stage.addChild(pauseButton);

    pauseButton.mousedown = pauseButton.touchstart = function (event) {
        // event.originalEvent.preventDefault();
        onPaused();
    }

    game.view.container.mousedown = game.view.container.touchstart = function (event) {
        onTap(event);
    }

    game.view.container.mouseup = game.view.container.touchend = function (event) {
        onTouchEnd();
    }

    resize();

    Audio.play('gameMusic');
    Audio.play('runRegular');
    Audio.play('runFast');
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
    Audio.muteAll();


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
    Audio.unMuteAll();

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

let prevState: number | false = false;

function onPaused() {
    pauseButton.scale.set(0.5);

    gsap.to(pauseButton.scale, 0.5, {
        x: 1,
        y: 1,
        ease: Elastic.easeOut
    });

    if (GAME.gameMode === GAME_MODE.PAUSED) {
        game.steve.resume();

        GAME.interactive = true;
        GAME.gameMode = +prevState;
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
        prevState = GAME.gameMode;
        GAME.gameMode = GAME_MODE.PAUSED;
        GAME.interactive = false;

        pauseScreen.visible = true;

        gsap.to(pauseScreen, 0.1, {
            alpha: 1,
        });

        gsap.to(pauseScreen.scale, 0.6, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });

        if (Audio.isMuted() === false) {
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
    GAME.interactive = true;
}

function onGameover() {
    (<PIXI.Sprite>pauseButton).interactive = false;
    Audio.setVolume('thrusters', 0);
    gsap.to((<PIXI.Sprite>pauseButton), 0.6, {
        alpha: 0,
        onComplete: function () {
            (<PIXI.Sprite>pauseButton).visible = false;
        }
    });

    GAME.gameMode = GAME_MODE.GAME_OVER;
    GAME.interactive = false;
}

function onGameoverShown() {
    // this.isGameReallyOver = true;
    GAME.interactive = true;
}

function onCountdownComplete() {
    if (!(pauseButton instanceof PIXI.Sprite)) {
        return
    }
    GAME.interactive = true;
    GAME.gameMode = GAME_MODE.PLAYING;
    pauseButton.visible = true;
    gsap.to(pauseButton, 0.6, {
        alpha: 1,
        onComplete: function () {
            (<PIXI.Sprite>pauseButton).interactive = true;
        }
    });
}

function onTouchEnd() {
    thrusters = false;
    Audio.setVolume('thrusters', 0);
    if (game.isPlaying) game.steve.fall();
}

function resize() {
    window.scrollTo(0, 0);

    let h = 640;
    let width = window.innerWidth || document.body.clientWidth;
    let height = window.innerHeight || document.body.clientHeight;
    let ratio = height / h;

    if (game) {
        let view = game.view.renderer.view;
        view.style.height = h * ratio + "px";

        let newWidth = (width / ratio);

        view.style.width = width + "px";

        logo.position.x = newWidth / 2;
        logo.position.y = h / 2 - 20;

        if (black) {
            black.scale.x = newWidth / 16;
            black.scale.y = h / 16;
        }

        countdown.position.x = newWidth / 2;
        countdown.position.y = h / 2;

        game.view.resize(newWidth, h, width);

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
        if (Audio.isMuted() === false) {
            if (thrusters === true) {
                thrustersVolume += (0.4 - thrustersVolume) * 0.1;
            } else {
                thrustersVolume += (0 - thrustersVolume) * 0.1;
            }

            if (thrustersVolume < 0.01) thrustersVolume = 0;

            Audio.setVolume('thrusters', thrustersVolume);
        }

        requestAnimationFrame(update);
    }
}

export function showGameover() {
    logo.visible = true;
    gsap.to(logo, 0.3, {
        alpha: 1,
        onComplete: onGameoverShown
    });
}


export {
    game
}
