import * as PIXI from '../pixi'
import { GameObjectPool } from '../game/GameObjectPool'
import type { Steve } from './Steve'

class SteveTrailFire {
  stage: PIXI.Container
  target: PIXI.Point | Steve
  particals: ParticalFire[]
  particalPool: GameObjectPool<ParticalFire>
  max: number
  count: number
  mOffset: PIXI.Matrix
  spare: PIXI.Matrix

  constructor(stage: PIXI.Container) {
    this.stage = stage
    this.target = new PIXI.Point()

    this.particals = []
    this.particalPool = new GameObjectPool<ParticalFire>(ParticalFire)
    this.max = 100
    this.count = 0

    this.mOffset = PIXI.Matrix.IDENTITY // PIXI.mat3.identity(PIXI.mat3.create());
    this.mOffset.tx = -30 // this.position.x;
    this.mOffset.ty = 30 // this.position.y;
    this.spare = PIXI.Matrix.IDENTITY // PIXI.mat3.identity();
  }

  update() {
    // PIXI.Rope.prototype.updateTransform.call(this);

    if ((this.target as any).isDead) {
      // PIXI.Matrix.multiply(this.mOffset, this.target.view.localTransform, this.spare);

      this.count++

      if (this.count % 3) {
        const partical = this.particalPool.getObject()

        this.stage.addChild(partical)
        partical.position.x = this.spare.tx
        partical.position.y = this.spare.ty

        partical.speed.x = 1 + Math.random() * 2
        partical.speed.y = 1 + Math.random() * 2

        partical.speed.x *= -1
        partical.speed.y *= 1
        /*
                partical.direction = 0;
                partical.dirSpeed = Math.random() > 0.5 ? -0.1 : 0.1
                partical.sign = this.particals.length % 2 ? -1 : 1;
                partical.scaly = Math.random() *2 -1// - this.target.speed.x * 0.3;
                partical.speed.y = this.target.accel * 3;
                partical.alphay = 2;
                */
        partical.alphay = 2
        partical.rotation = Math.random() * Math.PI * 2
        partical.scale.x = partical.scale.y = 0.2 + Math.random() * 0.5
        this.particals.push(partical)
      }
    } // add partical!

    for (let i = 0; i < this.particals.length; i++) {
      const partical = this.particals[i]

      partical.scale.x = partical.scale.y *= 1.02
      partical.alphay *= 0.85

      partical.alpha = partical.alphay > 1 ? 1 : partical.alphay
      partical.position.x += partical.speed.x * 2
      partical.position.y += partical.speed.y * 2

      if (partical.alpha < 0.01) {
        this.stage.removeChild(partical)
        this.particals.splice(i, 1)
        this.particalPool.returnObject(partical)
        i--
      }
    }
  }
}

class ParticalFire extends PIXI.Sprite {
  speed: PIXI.Point
  alphay = 0

  constructor() {
    super(PIXI.Texture.from('fireCloud.png'))
    this.anchor.x = 0.5
    this.anchor.y = 0.5

    this.speed = new PIXI.Point()
  }
}

export {
  SteveTrailFire,
  ParticalFire,
}
