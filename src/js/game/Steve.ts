import { Cubic, gsap } from 'gsap'
import * as PIXI from '../pixi'
import Audio from '../fido/Audio'
import GAME from './Game'

class Steve {
  position: PIXI.Point
  runningFrames: PIXI.Texture<PIXI.Resource>[]
  flyingFrames: PIXI.Texture<PIXI.Resource>[]
  crashFrames: PIXI.Texture<PIXI.Resource>[]
  view: PIXI.AnimatedSprite
  ground: number
  gravity: number
  baseSpeed: number
  speed: PIXI.Point
  activeCount: number
  isFlying: boolean
  accel: number
  width: number
  height: number
  onGround: boolean
  rotationSpeed: number
  joyRiding: boolean
  level: number
  realAnimationSpeed: number
  volume: number
  isDead: any
  isActive: any
  onGroundCache: any
  bounce = -1

  constructor() {
    this.position = new PIXI.Point()

    this.runningFrames = [
      PIXI.Texture.from('characterRUNscaled_01.png'),
      PIXI.Texture.from('characterRUNscaled_02.png'),
      PIXI.Texture.from('characterRUNscaled_03.png'),
      PIXI.Texture.from('characterRUNscaled_04.png'),
      PIXI.Texture.from('characterRUNscaled_05.png'),
      PIXI.Texture.from('characterRUNscaled_06.png'),
      PIXI.Texture.from('characterRUNscaled_07.png'),
      PIXI.Texture.from('characterRUNscaled_08.png'),
      PIXI.Texture.from('characterRUNscaled_09.png'),
    ]

    this.flyingFrames = [
      PIXI.Texture.from('characterFLATflying_01.png'),
      PIXI.Texture.from('characterFLATflying_02.png'),
      PIXI.Texture.from('characterFLATflying_03.png'),
    ]

    this.crashFrames = [
      PIXI.Texture.from('characterFALLscaled3.png'),
      PIXI.Texture.from('characterFALLscaled1.png'),
      PIXI.Texture.from('characterFALLscaled3.png'),
    ]

    this.view = new PIXI.AnimatedSprite(this.flyingFrames)
    this.view.animationSpeed = 0.23

    this.view.anchor.x = 0.5
    this.view.anchor.y = 0.5

    this.position.y = 477
    this.ground = 477
    this.gravity = 0.3

    this.baseSpeed = 8
    this.speed = new PIXI.Point(this.baseSpeed, 0)

    this.activeCount = 0
    this.isFlying = false
    this.accel = 0

    this.width = 26
    this.height = 37

    this.onGround = false
    this.rotationSpeed = 0
    this.joyRiding = false
    this.level = 1
    this.realAnimationSpeed = 0.23

    this.volume = 0.3
  }

  update() {
    if (this.isDead)
      this.updateDieing()

    else
      this.updateRunning()
  }

  joyrideMode() {
    this.joyRiding = true
    Audio.setVolume('runRegular', 0)
    Audio.play('hyperMode')
    gsap.to(this.speed, {
      x: 20,
      ease: Cubic.easeIn,
      duration: 0.3,
    })
    this.realAnimationSpeed = 0.23 * 4
  }

  normalMode() {
    this.joyRiding = false
    Audio.setVolume('runFast', 0)
    if (this.onGround === true) Audio.setVolume('runRegular', this.volume)
    gsap.to(this.speed, {
      x: this.baseSpeed,
      ease: Cubic.easeOut,
      duration: 0.6,
    })
    this.realAnimationSpeed = 0.23
  }

  updateRunning() {
    this.view.animationSpeed = this.realAnimationSpeed * GAME.time.DELTA_TIME * this.level

    if (this.isActive)
      this.isFlying = true

    // const oldSpeed = this.speed.y

    if (this.isFlying) {
      this.accel = 0.6
      this.speed.y -= this.accel * GAME.time.DELTA_TIME
      if (this.speed.y > 0) this.speed.y -= 0.3 * GAME.time.DELTA_TIME
    }
    else {
      if (this.speed.y < 0) this.speed.y += 0.05 * GAME.time.DELTA_TIME
    }

    this.speed.y += this.gravity * GAME.time.DELTA_TIME

    if (this.speed.y > 8) this.speed.y = 8
    if (this.speed.y < -9) this.speed.y = -9

    // const accel = this.speed.y - oldSpeed
    this.position.x += this.speed.x * GAME.time.DELTA_TIME * this.level
    this.position.y += this.speed.y * GAME.time.DELTA_TIME

    if (this.onGround !== this.onGroundCache) {
      this.onGroundCache = this.onGround

      if (this.onGround) {
        (this.view as any)._textures = this.runningFrames
        this.view.update(0)
        if (this.joyRiding === true) {
          Audio.setVolume('runFast', this.volume)
          Audio.setVolume('runRegular', 0)
        }
        else {
          Audio.setVolume('runRegular', this.volume)
          Audio.setVolume('runFast', 0)
        }
      }
      else {
        Audio.setVolume('runFast', 0)
        Audio.setVolume('runRegular', 0);
        (this.view as any)._textures = this.flyingFrames
      }
    }

    GAME.camera.x = this.position.x - 100

    this.view.position.x = this.position.x - GAME.camera.x
    this.view.position.y = this.position.y - GAME.camera.y

    this.view.rotation += (this.speed.y * 0.05 - this.view.rotation) * 0.1
  }

  updateDieing() {
    this.speed.x *= 0.999

    if (this.onGround) this.speed.y *= 0.99

    this.speed.y += 0.1
    this.accel += (0 - this.accel) * 0.1 * GAME.time.DELTA_TIME

    this.speed.y += this.gravity * GAME.time.DELTA_TIME

    this.position.x += this.speed.x * GAME.time.DELTA_TIME
    this.position.y += this.speed.y * GAME.time.DELTA_TIME

    GAME.camera.x = this.position.x - 100

    this.view.position.x = this.position.x - GAME.camera.x
    this.view.position.y = this.position.y - GAME.camera.y

    if (this.speed.x < 5)
      this.view.rotation += this.rotationSpeed * (this.speed.x / 5) * GAME.time.DELTA_TIME

    else
      this.view.rotation += this.rotationSpeed * GAME.time.DELTA_TIME
  }

  jump() {
    if (this.isDead) {
      if (this.speed.x < 5) {
        this.isDead = false
        this.speed.x = 10
      }
    }

    if (this.position.y !== this.ground) {
      this.isFlying = true
    }
    else {
      this.isActive = true
      this.activeCount = 0
    }
  }

  die() {
    if (this.isDead) return

    Audio.setVolume('runFast', 0)
    Audio.setVolume('runRegular', 0)
    Audio.fadeOut('gameMusic')

    gsap.to(GAME.time, 0.5, {
      speed: 0.1,
      ease: Cubic.easeOut,
      onComplete() {
        Audio.play('deathJingle')
        gsap.to(GAME.time, {
          speed: 1,
          delay: 1,
          duration: 2,
        })
      },
    })

    this.isDead = true
    this.bounce = 0
    this.speed.x = 15
    this.speed.y = -15
    this.rotationSpeed = 0.3
    this.view.stop()
  }

  boil() {
    if (this.isDead) return

    Audio.setVolume('runFast', 0)
    Audio.setVolume('runRegular', 0)
    Audio.fadeOut('gameMusic')
    Audio.play('lavaSplosh')
    Audio.play('deathJingle')

    this.isDead = true
  }

  fall() {
    this.isActive = false
    this.isFlying = false
  }

  isAirbourne() { }

  stop() {
    this.view.stop()
    Audio.setVolume('runRegular', 0)
  }

  resume() {
    this.view.play()
    if (this.onGround) Audio.setVolume('runRegular', this.volume)
  }
}

export {
  Steve,
}
