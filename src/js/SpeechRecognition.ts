import EventEmitter, { EventName } from './EventEmitter'
import { startConnect } from './AudioContext'

const recognizingClassName: string = 'is-recognizing'
const $speechBtn: HTMLButtonElement = document.getElementById(
  'speech'
) as HTMLButtonElement
let recognition: SpeechRecognition
let isRecognizing: boolean = false
let doneInit: boolean = false

export default function init(): void {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    ;($speechBtn.parentNode as Node).removeChild($speechBtn)
    return
  }

  $speechBtn.addEventListener(
    'click',
    (event: MouseEvent): void => {
      event.preventDefault()
      event.stopPropagation()

      if (!doneInit) {
        doneInit = true
        setUpRecognition()
        startConnect()
      }

      if (isRecognizing) {
        recognition.stop()
      } else {
        recognition.start()
      }
    },
    false
  )
}

function setUpRecognition(): void {
  recognition = new (window.SpeechRecognition ||
    (window as any).webkitSpeechRecognition)()

  recognition.lang = navigator.language || 'ja-JP'
  recognition.addEventListener('result', onResult, false)
  recognition.addEventListener('start', onStart, false)
  recognition.addEventListener('end', onEnd, false)
  recognition.addEventListener('error', onError, false)
}

function onResult(event: Event): void {
  const text: string = (event as any).results[0][0].transcript
  EventEmitter.emit(EventName.ON_INPUT_TEXT, text)

  isRecognizing = false
  $speechBtn.classList.remove(recognizingClassName)
}

function onStart(): void {
  isRecognizing = true
  $speechBtn.classList.add(recognizingClassName)
}

function onEnd(): void {
  isRecognizing = false
  $speechBtn.classList.remove(recognizingClassName)
}

function onError(): void {
  isRecognizing = false
  $speechBtn.classList.remove(recognizingClassName)
}
