import * as Three from 'three'
import ThreeBase from './ThreeBase'
import Particle from './Particle'
import { TweenLite, Power0 } from 'gsap/all'
import StringToImageData from './StringToImageData'
import { getByteFrequencyDataAverage, startConnect } from './AudioContext'

startConnect()

const threeBase = new ThreeBase()
const light = new Three.AmbientLight(0xffffff)
const light2 = new Three.DirectionalLight(0xffffff)
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

const form: HTMLElement | null = document.getElementById('form')

if (!form) {
  throw new Error('`#form` is not found')
}

const timeline = {
  progress: 0
}

form.addEventListener('submit', async event => {
  event.preventDefault()

  const inputEl: HTMLElement | null = document.getElementById('input-text')

  if (!inputEl) return

  const text: string = (inputEl as HTMLInputElement).value
  timerStop()

  if (timeline.progress !== 0) {
    await reverseProgress(1)
  }

  const { width, height, position } = stringToImageData.drawText(text)
  particle.setEndPosition(position, width, height)
  particle.strLen = text.length
  await forwardsProgress()
  timerStart()
})

loop()

function loop() {
  particle.time += 1
  particle.loudness = getByteFrequencyDataAverage()
  threeBase.tick()
  requestAnimationFrame(loop)
}

function forwardsProgress(duration: number = 2): Promise<void> {
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

function reverseProgress(duration: number = 2): Promise<void> {
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
  }, 3000)
}

function timerStop(): void {
  if (reverseTimer !== null) {
    clearTimeout(reverseTimer)
  }
}
