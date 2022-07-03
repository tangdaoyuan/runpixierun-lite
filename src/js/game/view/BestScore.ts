import * as PIXI from '../../pixi'
import GAME from '../Game'
import _LocalStorage from '../../fido/LocalStorage'
import { formatScore } from './Score'

class BestScore extends PIXI.Container {
  LocalStorage: _LocalStorage
  ratio: number
  glyphs: Record<string, PIXI.Texture> = {}
  digits: PIXI.Sprite[]
  title: PIXI.Sprite

  constructor() {
    super()

    this.LocalStorage = new _LocalStorage(GAME.bundleId)
    this.ratio = 0

    const glyphs = {
      '0': 'number_00.png',
      '1': 'number_01.png',
      '2': 'number_02.png',
      '3': 'number_03.png',
      '4': 'number_04.png',
      '5': 'number_05.png',
      '6': 'number_06.png',
      '7': 'number_07.png',
      '8': 'number_08.png',
      '9': 'number_09.png',
      ',': 'number_comma.png',
    } as Record<string, string>

    for (const i in glyphs) this.glyphs[i] = PIXI.Texture.from(glyphs[i])

    this.digits = []

    for (let i = 0; i < 8; i++) {
      this.digits[i] = new PIXI.Sprite(this.glyphs[i])
      this.digits[i].scale.set(0.36)
      this.addChild(this.digits[i])
    }

    this.title = PIXI.Sprite.from('assets/hud/PersonalBest.png')
    this.title.anchor.x = 0
    this.title.anchor.y = 0
    this.title.position.y = 1
    this.addChild(this.title)
  }

  setScore(score: number) {
    const split = formatScore(score).split('')
    let position = 0
    const gap = 3

    this.title.position.x = 0
    position += 70 + gap

    for (let i = 0; i < split.length; i++) {
      const digit = this.digits[i]
      digit.visible = true
      digit.texture = this.glyphs[split[i]]
      digit.position.x = position
      digit.anchor.x = 0
      digit.anchor.y = 0
      position += digit.width - gap
    }

    position = 150 + position / 2
    this.title.position.x -= position

    for (let i = 0; i < this.digits.length; i++)
      this.digits[i].position.x -= position

    for (let i = split.length; i < this.digits.length; i++)
      this.digits[i].visible = false
  }

  jump() {
    this.ratio = 2.2
  }

  update() {
    this.setScore(Math.round(parseInt(this.LocalStorage.get('highscore') || '0')) || 0)
  }
}

export {
  BestScore,
}
