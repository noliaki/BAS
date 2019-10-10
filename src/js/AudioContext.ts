let analyser: AnalyserNode
let frequencies: Uint8Array

function getUserMedia(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
}

export async function startConnect(): Promise<void> {
  if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
    return
  }

  const audioContext: AudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)()

  analyser = audioContext.createAnalyser()
  frequencies = new Uint8Array(analyser.frequencyBinCount)

  const stream: MediaStream | void = await getUserMedia().catch(error => {
    throw new Error(error)
  })

  if (!stream) return

  audioContext.createMediaStreamSource(stream).connect(analyser)
}

export function getByteFrequencyDataAverage(): number {
  if (!analyser) return 0

  analyser.getByteFrequencyData(frequencies)

  return (
    frequencies.reduce((prev, current): number => prev + current) /
    analyser.frequencyBinCount
  )
}
