import EventEmitter, { EventName } from './EventEmitter'

const recognition: SpeechRecognition = new (window.SpeechRecognition ||
  (window as any).webkitSpeechRecognition)()

const $speechBtn: HTMLButtonElement = document.getElementById(
  'speech'
) as HTMLButtonElement
const recognizingClassName: string = 'is-recognizing'
let isRecognizing: boolean = false

recognition.lang = navigator.language || 'ja'
recognition.addEventListener('result', onResult, false)
recognition.addEventListener('start', onStart, false)
recognition.addEventListener('end', onEnd, false)
recognition.addEventListener('error', onError, false)

$speechBtn.addEventListener(
  'click',
  (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()

    if (isRecognizing) {
      recognition.stop()
    } else {
      recognition.start()
    }
  },
  false
)

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
