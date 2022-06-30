import * as PIXI from '../../pixi'
import { gsap, Elastic, Cubic, Sine } from 'gsap'

let m_cCountdown = false;

const time = 0.1;
const time2 = 0.5;
const delay = 0;


class Countdown extends PIXI.Container {
    constructor() {
        super()
        this.three = PIXI.Sprite.from("3Get.png");
        this.two = PIXI.Sprite.from("2tricksy.png");
        this.one = PIXI.Sprite.from("1pixie.png");

        this.three.anchor.x = this.three.anchor.y = 0.5;
        this.two.anchor.x = this.two.anchor.y = 0.5;
        this.one.anchor.x = this.one.anchor.y = 0.5;

        this.three.alpha = 0;
        this.two.alpha = 0;
        this.one.alpha = 0;

        this.addChild(this.three);
        this.addChild(this.two);
        this.addChild(this.one);

        this.three.alpha = 0;
        this.two.alpha = 0;
        this.one.alpha = 0;

        m_cCountdown = this;
    }


    startCountDown(onComplete) {
        this.visible = true;
        this.onComplete = onComplete;

        this.three.alpha = 0;
        this.two.alpha = 0;
        this.one.alpha = 0;

        this.three.scale.x = this.three.scale.y = 2;
        this.two.scale.x = this.two.scale.y = 2;
        this.one.scale.x = this.one.scale.y = 2;

        let that = this;

        gsap.to(this.three, 1 * time2, {
            alpha: 1,
            onComplete: function () {
                m_cCountdown.onThreeShown();
            }
        });

        gsap.to(this.three.scale, 1 * time2, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });
    }


    onThreeShown() {
        let that = this;

        gsap.to(that.three, 1 * time, {
            alpha: 0,
            ease: Sine.easeOut,
            delay: delay
        });

        gsap.to(that.three.scale, 1 * time, {
            x: 0.5,
            y: 0.5,
            ease: Cubic.easeOut,
            delay: delay
        });

        gsap.to(that.two, 1 * time2, {
            alpha: 1,
            onComplete: function () {
                gsap.to(that.two, 1 * time, {
                    alpha: 0,
                    delay: delay
                });

                gsap.to(that.two.scale, 1 * time, {
                    x: 0.5,
                    y: 0.5,
                    ease: Cubic.easeOut,
                    delay: delay
                });

                gsap.to(that.one, 1 * time2, {
                    alpha: 1,
                    onComplete: function () {
                        gsap.to(that.one.scale, 1 * time, {
                            x: 0.5,
                            y: 0.5,
                            ease: Cubic.easeOut,
                            delay: delay
                        });

                        gsap.to(that.one, 1 * time, {
                            alpha: 0,
                            onComplete: function () {
                                that.visible = false;
                                that.onComplete();
                            },
                            delay: delay
                        });
                    },
                    delay: delay
                });

                gsap.to(that.one.scale, 1 * time2, {
                    x: 1,
                    y: 1,
                    ease: Elastic.easeOut,
                    delay: delay
                });
            },
            delay: delay
        });

        gsap.to(this.two.scale, 1 * time2, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut,
            delay: delay
        });
    }
}


export {
    Countdown
}
