import GAME from './Game'
import { GameObjectPool } from './GameObjectPool'
import { Pickup } from './Pickup'
import type { RprEngine } from './RprEngine'

class PickupManager {
  engine: RprEngine
  pickups: Pickup[]
  pickupPool: GameObjectPool<Pickup>
  spawnCount: number
  pos: number

  constructor(engine: RprEngine) {
    this.engine = engine

    this.pickups = []

    this.pickupPool = new GameObjectPool(Pickup)

    this.spawnCount = 0

    this.pos = 0
  }

  update() {
    if (this.engine.joyrideMode) {
      this.spawnCount += GAME.time.DELTA_TIME

      if (this.spawnCount > 5) {
        this.pos += 0.15
        this.spawnCount = 0
        this.addPickup(GAME.camera.x + GAME.width, 280 + Math.sin(this.pos) * 180)
      }
    }

    for (let i = 0; i < this.pickups.length; i++) {
      const pickup = this.pickups[i]

      pickup.update()

      if (pickup.isPickedUp) {
        pickup.ratio += (1 - pickup.ratio) * 0.3 * GAME.time.DELTA_TIME
        // pickup.view.scale.x = 1-pickup.ratio;
        // pickup.view.scale.y = 1-pickup.ratio;
        // pickup.position.x = pickup.pickupPosition.x + (this.engine.player.position.x - pickup.pickupPosition.x) * pickup.ratio;
        // pickup.position.y = pickup.pickupPosition.y + (this.engine.player.position.y - pickup.pickupPosition.y) * pickup.ratio;

        if (pickup.ratio > 0.99) {
          this.pickupPool.returnObject(pickup)
          this.pickups.splice(i, 1)
          this.engine.view.game.removeChild(pickup.view)
          i--
        }
      }
      else {
        if (pickup.view.position.x < -100 - GAME.xOffset) {
          // remove!
          this.engine.view.game.removeChild(pickup.view)
          this.pickupPool.returnObject(pickup)
          this.pickups.splice(i, 1)
          i--
        }
      }
    }
  }

  addPickup(x: number, y: number) {
    const pickup = this.pickupPool.getObject()
    pickup.position.x = x
    pickup.position.y = y

    this.pickups.push(pickup)
    this.engine.view.game.addChild(pickup.view)
  }

  removePickup(index: number) {
    const pickup = this.pickups[index]
    pickup.isPickedUp = true
    pickup.steve = this.engine.steve
    pickup.pickupPosition = {
      x: pickup.position.x,
      y: pickup.position.y,
    } // .clone();
    pickup.ratio = 0
  }

  destroyAll() {
    for (let i = 0; i < this.pickups.length; i++) {
      const pickup = this.pickups[i]
      // remove!
      this.pickupPool.returnObject(pickup)
      this.engine.view.game.removeChild(pickup.view)
    }

    this.pickups = []
  }

  destroyAllOffScreen() {
    for (let i = 0; i < this.pickups.length; i++) {
      const pickup = this.pickups[i]

      if (pickup.x > GAME.camera.x + GAME.width) {
        this.pickupPool.returnObject(pickup)
        this.engine.view.game.removeChild(pickup.view)
        this.pickups.splice(i, 1)
        i--
      }
      // remove!
    }
  }
}

export {
  PickupManager,
}
