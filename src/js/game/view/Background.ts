import * as PIXI from '../../pixi'
import GAME from '../Game'
import type { JoyBackground } from './JoyBackground'
import type { LowFiBackground } from './LowFiBackground'

class Background extends PIXI.Container {
  initialWidth: number
  scrollPosition: number
  foggyTrees: BackgroundElement
  rearSilhouette: BackgroundElement
  rearCanopy: BackgroundElement
  tree1: PIXI.Sprite
  tree2: PIXI.Sprite
  farCanopy: BackgroundElement
  vines: Vines
  roofLeaves: BackgroundElement
  frontSilhouette: BackgroundElement

  constructor() {
    super()
    this.initialWidth = 1000
    this.scrollPosition = 1500
    // {"x":604,"y":803,"w":600,"h":799},
    // {"x":1206,"y":2,"w":600,"h":799},
    // {"x":604,"y":2,"w":600,"h":799},

    this.foggyTrees = new BackgroundElement(PIXI.Texture.from('05_far_BG.jpg'), 40, this)
    this.rearSilhouette = new BackgroundElement(PIXI.Texture.from('03_rear_silhouette.png'), 358, this)
    this.rearCanopy = new BackgroundElement(PIXI.Texture.from('03_rear_canopy.png'), 0, this)

    this.tree1 = PIXI.Sprite.from('02_tree_1.png')
    this.tree1.anchor.x = 0.5
    this.addChild(this.tree1)

    this.tree2 = PIXI.Sprite.from('02_tree_2.png')
    this.tree2.anchor.x = 0.5
    this.tree2.position.y = 50
    this.addChild(this.tree2)

    this.farCanopy = new BackgroundElement(PIXI.Texture.from('02_front_canopy.png'), 0, this)
    this.vines = new Vines(this)
    this.roofLeaves = new BackgroundElement(PIXI.Texture.from('00_roof_leaves.png'), 0, this)

    this.frontSilhouette = new BackgroundElement(PIXI.Texture.from('01_front_silhouette.png'), 424, this)

    this.foggyTrees.speed = 1 / 2
    this.rearSilhouette.speed = 1.2 / 2

    this.rearCanopy.speed = 1.2 / 2
    this.farCanopy.speed = 1.5 / 2
    this.frontSilhouette.speed = 1.6 / 2
    this.roofLeaves.speed = 2 / 2
  }

  updateTransform() {
    this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;

    let treePos = -this.scrollPosition * 1.5 / 2
    treePos %= this.initialWidth + 556
    treePos += this.initialWidth + 556
    treePos -= this.tree1.width / 2
    this.tree1.position.x = treePos - GAME.xOffset

    let treePos2 = -(this.scrollPosition + this.initialWidth / 2) * 1.5 / 2
    treePos2 %= this.initialWidth + 556
    treePos2 += this.initialWidth + 556
    treePos2 -= this.tree2.width / 2
    this.tree2.position.x = treePos2 - GAME.xOffset

    this.foggyTrees.setPosition(this.scrollPosition)

    this.rearSilhouette.setPosition(this.scrollPosition)
    this.rearCanopy.setPosition(this.scrollPosition)
    this.farCanopy.setPosition(this.scrollPosition)
    this.frontSilhouette.setPosition(this.scrollPosition)

    this.roofLeaves.setPosition(this.scrollPosition)

    this.vines.setPosition(this.scrollPosition)

    super.updateTransform()
  }
}

interface Vine extends PIXI.Sprite {
  speed?: number
  offset?: number
}

class Vines {
  vines: Vine[]
  owner: Background
  speed: number

  constructor(owner: Background) {
    this.vines = []
    this.owner = owner

    for (let i = 0; i < 10; i++) {
      const vine: Vine = PIXI.Sprite.from('01_hanging_flower3.png')
      vine.offset = i * 100 + Math.random() * 50
      vine.speed = (1.5 + Math.random() * 0.25) / 2
      vine.position.y = Math.random() * -200
      owner.addChild(vine)
      vine.position.x = 200
      this.vines.push(vine)
    }

    this.speed = 1
  }

  setPosition(position: number) {
    for (let i = 0; i < this.vines.length; i++) {
      const vine = this.vines[i]

      let pos = -(position + (vine as any).offset) * (vine.speed || 1) // * this.speed;
      pos %= this.owner.initialWidth
      pos += this.owner.initialWidth

      vine.position.x = pos // vine.offset// Math.floor(pos)
      // this.sky[i].position.y = Math.round(this.sky[i].position.y);
    }
  }
}

class BackgroundElement {
  speed: number
  sprites: PIXI.Sprite[]
  spriteWidth: number

  constructor(texture: PIXI.Texture, y: number, owner: Background | JoyBackground | LowFiBackground) {
    this.sprites = []
    this.spriteWidth = texture.width - 1
    let amount = Math.ceil(940 / this.spriteWidth)
    if (amount < 3) amount = 3

    for (let i = 0; i < amount; i++) {
      const sprite = new PIXI.Sprite(texture)
      sprite.position.y = y
      owner.addChild(sprite)
      this.sprites.push(sprite)
    }

    this.speed = 1
  }

  setPosition(position: number) {
    const h = this.spriteWidth

    for (let i = 0; i < this.sprites.length; i++) {
      let pos = -position * this.speed
      pos += i * h
      pos %= h * this.sprites.length
      pos += h * 2

      this.sprites[i].position.x = Math.floor(pos) - (GAME.xOffset || 0)
    }
  }
}

export {
  Background,
  BackgroundElement,
  Vines,
}
