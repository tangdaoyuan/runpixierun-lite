import * as PIXI from '../pixi'
import { GameObjectPool } from './GameObjectPool'
import GAME from './Game'
import type { RprEngine } from './RprEngine'

class FloorManager {
  engine: RprEngine
  count: number
  floors: Floor[]
  floorPool: GameObjectPool<Floor>

  constructor(engine: RprEngine) {
    this.engine = engine
    this.count = 0
    this.floors = []
    this.floorPool = new GameObjectPool(Floor)
  }

  update() {
    for (let i = 0; i < this.floors.length; i++) {
      const floor = this.floors[i]
      floor.position.x = floor.originalX - GAME.camera.x - 16

      if (floor.position.x < -1135 - GAME.xOffset - 16) {
        this.floorPool.returnObject(floor)
        this.floors.splice(i, 1)
        i--
        this.engine.view.gameFront.removeChild(floor)
      }
    }
  }

  addFloor(floorData: number) {
    const floor = this.floorPool.getObject()
    floor.x = floorData
    floor.originalX = floorData
    floor.position.y = 640 - 158
    this.engine.view.gameFront.addChild(floor)
    this.floors.push(floor)
  }

  destroyAll() {
    for (let i = 0; i < this.floors.length; i++) {
      const floor = this.floors[i]
      this.floorPool.returnObject(floor)
      this.engine.view.gameFront.removeChild(floor)
    }

    this.floors = []
  }
}

class Floor extends PIXI.Sprite {
  originalX: number

  constructor() {
    super(PIXI.Texture.from('00_forest_floor.png'))
    this.originalX = 0
  }
}

export {
  FloorManager,
}
