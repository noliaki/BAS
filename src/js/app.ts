import * as Three from 'three'
import ThreeBase from './ThreeBase'
import Particle from './Particle'
import { gsap } from 'gsap'
import StringToImageData from './StringToImageData'
import { getByteFrequencyDataAverage } from './AudioContext'
import EventEmitter, { EventName } from './EventEmitter'
import SpeechRecognitionInit from './SpeechRecognition'
import { loadImage, getPointFromImage, PointData } from './helper'

SpeechRecognitionInit()

const initText: string = location.hash.replace(/^#/, '')
const reverseInterval = 5000
const defaultDuration = 2
const threeBase = new ThreeBase({ initText })
const light = new Three.AmbientLight(0xffffff)
const light2 = new Three.DirectionalLight(0xffffff)
const fileInput: HTMLInputElement | null = document.querySelector('#file-input')
const fileReader: FileReader = new FileReader()

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
  progress: 0,
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

fileReader.addEventListener(
  'load',
  async (event: Event): Promise<void> => {
    if (fileInput) {
      fileInput.value = ''
    }

    const img: HTMLImageElement = await loadImage(
      (event?.target as any)?.result
    )
    const pointData: PointData[] = getPointFromImage(img)

    for (let i: number = pointData.length - 1; i >= 0; i--) {
      const r: number = Math.floor(Math.random() * (i + 1))
      const t: PointData = pointData[i]
      pointData[i] = pointData[r]
      pointData[r] = t
    }

    timerStop()

    if (timeline.progress !== 0) {
      await reverseProgress(1)
    }

    particle.setEndColor(pointData)
    particle.setEndPosition(pointData, img.naturalWidth, img.naturalHeight)
    particle.uIsImage = true

    await forwardsProgress()
    timerStart()
  }
)

if (fileInput) {
  fileInput.addEventListener('change', (event: Event): void => {
    const file: File | undefined = (event?.target as HTMLInputElement)
      ?.files?.[0]

    if (!file || !/^image\//.test(file.type)) {
      return
    }

    fileReader.readAsDataURL(file)
  })
}

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
    gsap.to(timeline, {
      duration,
      progress: 1,
      ease: 'none',
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      },
    })
  })
}

function reverseProgress(duration: number = defaultDuration): Promise<void> {
  return new Promise((resolve: () => void): void => {
    gsap.to(timeline, {
      duration,
      progress: 0,
      ease: 'none',
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      },
    })
  })
}

function updateParticleProgress(): void {
  particle.progress = timeline.progress
}

function timerStart(): void {
  timerStop()

  reverseTimer = window.setTimeout(async (): Promise<void> => {
    await reverseProgress(2)
    particle.uIsImage = false
  }, reverseInterval)
}

function timerStop(): void {
  if (reverseTimer !== null) {
    clearTimeout(reverseTimer)
  }
}
