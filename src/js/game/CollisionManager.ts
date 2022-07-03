import Audio from '../fido/Audio'
import { showGameover } from '../RunPixieRun'
import GAME from './Game'
import type { RprEngine } from './RprEngine'

class CollisionManager {
  engine: RprEngine

  constructor(engine: RprEngine) {
    this.engine = engine
  }

  update() {
    // if(this.engine.isPlaying)
    this.playerVsBlock()
    this.playerVsPickup()
    this.playerVsFloor()
  }

  playerVsBlock() {
    const enemies = this.engine.enemyManager.enemies
    const steve = this.engine.steve

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]

      const xdist = enemy.position.x - steve.position.x
      if (xdist > -enemy.width / 2 && xdist < enemy.width / 2) {
        const ydist = enemy.position.y - steve.position.y

        if (ydist > -enemy.height / 2 - 20 && ydist < enemy.height / 2) {
          if (!steve.joyRiding) {
            steve.die()
            this.engine.gameover()
            enemy.hit()
          }
        }
      }
    }
  }

  playerVsPickup() {
    const pickups = this.engine.pickupManager.pickups
    const steve = this.engine.steve

    for (let i = 0; i < pickups.length; i++) {
      const pickup = pickups[i]
      if (pickup.isPickedUp) continue

      const xdist = pickup.position.x - steve.position.x
      if (xdist > -pickup.width / 2 && xdist < pickup.width / 2) {
        const ydist = pickup.position.y - steve.position.y

        if (ydist > -pickup.height / 2 && ydist < pickup.height / 2) {
          this.engine.pickupManager.removePickup(i)
          this.engine.pickup()
        }
      }
    }
  }

  playerVsFloor() {
    const floors = this.engine.floorManager.floors
    const steve = this.engine.steve

    const max = floors.length
    steve.onGround = false

    if (steve.position.y > 610) {
      if (this.engine.isPlaying) {
        steve.boil()
        this.engine.view.doSplash()
        this.engine.gameover()
      }
      else {
        steve.speed.x *= 0.95

        if (!GAME.interactive) {
          showGameover()
          GAME.interactive = true
        }

        if (steve.bounce === 0) {
          steve.bounce++
          steve.boil()
          this.engine.view.doSplash()
        }

        return
      }
    }

    for (let i = 0; i < max; i++) {
      const floor = floors[i]
      const xdist = floor.originalX - steve.position.x + 1135

      if (steve.position.y > 477) {
        if (xdist > 0 && xdist < 1135) {
          if (steve.isDead) {
            steve.bounce++

            if (steve.bounce > 2)
              return

            Audio.play('thudBounce')
            steve.view.texture = steve.crashFrames[steve.bounce]

            steve.speed.y *= -0.7
            steve.speed.x *= 0.8

            if (steve.rotationSpeed > 0)
              steve.rotationSpeed = Math.random() * -0.3

            else if (steve.rotationSpeed === 0)
              steve.rotationSpeed = Math.random() * 0.3

            else
              steve.rotationSpeed = 0
          }
          else {
            steve.speed.y = -0.3
          }

          if (!steve.isFlying) {
            steve.position.y = 478
            steve.onGround = true
          }
        }
      }
    }

    if (steve.position.y < 0) {
      steve.position.y = 0
      steve.speed.y *= 0
    }
  }
}

export {
  CollisionManager,
}
