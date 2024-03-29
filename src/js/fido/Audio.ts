import { Howl } from 'howler'
import { gsap } from 'gsap'
import _LocalStorage from './LocalStorage'

interface CSound {
  src: string
  volume: number
  maxVolume: number
  loop: boolean
  autoPlay: boolean
  type: string
  name: string
  audio?: Howl
}

const cSoundPool: Record<string, CSound> = {}
const DEFAULT_FADE_IN_TIME = 1
let MUTE_ALL = false

const LocalStorage = new _LocalStorage('audio')

const aSounds: CSound[] = [{
  src: 'audio/mainLoop',
  volume: 0.6,
  maxVolume: 0.6,
  loop: true,
  autoPlay: false,
  type: 'music',
  name: 'gameMusic',
},
{
  src: 'audio/footLoopRegular',
  volume: 0.0,
  maxVolume: 0.6,
  loop: true,
  autoPlay: false,
  type: 'music',
  name: 'runRegular',
},
{
  src: 'audio/footLoopFast',
  volume: 0.0,
  maxVolume: 0.6,
  loop: true,
  autoPlay: false,
  type: 'music',
  name: 'runFast',
},
{
  src: 'audio/thrustLoop',
  volume: 0.0,
  maxVolume: 0.4,
  loop: true,
  autoPlay: true,
  type: 'music',
  name: 'thrusters',
},
{
  src: 'audio/pickupGrab',
  volume: 0.5,
  maxVolume: 0.5,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'pickup',
},
{
  src: 'audio/blockHit',
  volume: 0.2,
  maxVolume: 0.2,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'blockHit',
},
{
  src: 'audio/lavaSplosh',
  volume: 0.5,
  maxVolume: 0.5,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'lavaSplosh',
},
{
  src: 'audio/fallThud',
  volume: 1.0,
  maxVolume: 1.0,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'thudBounce',
},
{
  src: 'audio/DeathJingle',
  volume: 0.7,
  maxVolume: 0.7,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'deathJingle',
},
{
  src: 'audio/hyperMode',
  volume: 0.2,
  maxVolume: 0.2,
  loop: false,
  autoPlay: false,
  type: 'sfx',
  name: 'hyperMode',
},
]

function init() {
  for (let i = 0; i < aSounds.length; i++) {
    const cSound = aSounds[i]

    cSound.audio = new Howl({
      src: [`${cSound.src}.mp3`],
      autoplay: cSound.autoPlay,
      loop: cSound.loop,
      volume: cSound.volume,
      onload() {
        // alert('loaded');
      },
      onend() {
        // alert('finished playing sound');
      },
      onloaderror() {
        console.error(`ERROR : Failed to load ${cSound.src}.m4a`)
      },
      onplay() {
        // alert('playing');
      },
    })

    cSoundPool[cSound.name] = cSound
  }

  if (LocalStorage.get('gameMuted') === 'true') muteAll()
}

function isMuted() {
  return MUTE_ALL
}

function muteAll() {
  MUTE_ALL = true
  LocalStorage.store('gameMuted', true)
  const cHolder = {
    volume: 1,
  }

  gsap.to(cHolder, {
    volume: 0,
    duration: 1,
    onUpdate() {
      Howler.volume(this.volume)
    },
    onComplete() {
      Howler.mute(true)
    },
  })
}

function muteOneSound(cSound: CSound, holder: Object) {
  gsap.to(holder, {
    volume: 0,
    duration: 1,
    onUpdate() {
      cSound.audio!.volume(this.volume)
    },
  })
}

function unMuteAll() {
  MUTE_ALL = false
  LocalStorage.store('gameMuted', false)
  const cHolder = {
    volume: 0,
  }

  Howler.mute(false)

  gsap.to(cHolder, {
    volume: 1,
    duration: 1,
    onUpdate(_cObject, _sProperty) {
      Howler.volume(this.volume)
    },
  })
}

function play(id: string) {
  if (id in cSoundPool) {
    if (cSoundPool[id].audio?.playing())
      return
    cSoundPool[id].audio?.play()
  }
  else {
    console.warn(`WARNING :: Couldn't find sound '${id}'.`)
  }
}

function fadeOut(sKey: string) {
  const cSound = cSoundPool[sKey]

  const holder = {
    volume: 0,
  }

  muteOneSound(cSound, holder)
}

function fadeIn(id: string, time?: number) {
  if (!soundExists(id)) return

  const cSound = cSoundPool[id]
  const nFadeInTime = time || DEFAULT_FADE_IN_TIME

  const cHolder = {
    volume: 0,
  }

  gsap.to(cHolder, {
    volume: cSound.maxVolume,
    duration: nFadeInTime,
    onUpdate(_cObject, _sProperty) {
      setVolume(id, this.volume)
    },
  })
}

function soundExists(id: string) {
  return id in cSoundPool
}

function setVolume(id: string, volume: number) {
  if (!soundExists(id)) return

  if (MUTE_ALL === true)
    cSoundPool[id].volume = volume

  else
    cSoundPool[id].audio?.volume(volume)
}

function stop(id: string) {
  cSoundPool[id].audio?.stop()
}

export default {
  init,
  play,
  stop,
  fadeOut,
  fadeIn,
  setVolume,
  muteAll,
  unMuteAll,
  isMuted,
}
