import * as Three from 'three'
import ThreeBase from './ThreeBase'
import Particle from './Particle'
import { TweenLite, Power0 } from 'gsap/all'
import StringToImageData from './StringToImageData'
import { getByteFrequencyDataAverage } from './AudioContext'
import EventEmitter, { EventName } from './EventEmitter'
import SpeechRecognitionInit from './SpeechRecognition'

SpeechRecognitionInit()

const reverseInterval: number = 3000
const defaultDuration: number = 2
const threeBase = new ThreeBase()
const light = new Three.AmbientLight(0xffffff)
const light2 = new Three.DirectionalLight(0xffffff)
const initText: string = location.hash.replace(/^#/, '')
// light.position.x = 1000
light.position.y = -1000
light.position.z = 1000

// light2.position.x = 1000
light2.position.y = 1000
light2.position.z = 1000

const particle: Particle = new Particle()

threeBase.addToScene(light)
threeBase.addToScene(light2)
threeBase.addToScene(particle)

if (process.env.NODE_ENV === 'development') {
  const axes = new Three.AxesHelper(1000)
  threeBase.addToScene(axes)
}

const stringToImageData = new StringToImageData()
let reverseTimer: number | null = null

const timeline = {
  progress: 0
}

const inputEl: HTMLInputElement = document.getElementById(
  'input-text'
) as HTMLInputElement

EventEmitter.on(
  EventName.ON_INPUT_TEXT,
  async (text: string): Promise<void> => {
    if (inputEl.value !== text) {
      inputEl.value = text
    }

    location.hash = text

    timerStop()

    if (timeline.progress !== 0) {
      await reverseProgress(1)
    }

    const { width, height, position } = stringToImageData.drawText(text)
    particle.setEndPosition(position, width, height)
    particle.strLen = text.length
    await forwardsProgress()
    timerStart()
  }
)
;(document.getElementById('form') as HTMLFormElement).addEventListener(
  'submit',
  (event: Event): void => {
    event.preventDefault()

    const text: string = inputEl.value

    if (!text) return

    EventEmitter.emit(EventName.ON_INPUT_TEXT, text)
  }
)

loop()

if (initText) {
  console.log(decodeURIComponent(initText))
  EventEmitter.emit(EventName.ON_INPUT_TEXT, decodeURIComponent(initText))
}

function loop() {
  particle.time += 1
  particle.loudness = getByteFrequencyDataAverage()
  threeBase.tick()
  requestAnimationFrame(loop)
}

function forwardsProgress(duration: number = defaultDuration): Promise<void> {
  return new Promise((resolve: () => void): void => {
    TweenLite.to(timeline, duration, {
      progress: 1,
      ease: Power0.easeNone,
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      }
    })
  })
}

function reverseProgress(duration: number = defaultDuration): Promise<void> {
  return new Promise((resolve: () => void): void => {
    TweenLite.to(timeline, duration, {
      progress: 0,
      ease: Power0.easeNone,
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      }
    })
  })
}

function updateParticleProgress(): void {
  particle.progress = timeline.progress
}

function timerStart(): void {
  timerStop()

  reverseTimer = window.setTimeout((): void => {
    reverseProgress(2)
  }, reverseInterval)
}

function timerStop(): void {
  if (reverseTimer !== null) {
    clearTimeout(reverseTimer)
  }
}
