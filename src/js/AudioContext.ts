const audioContext: AudioContext = new (window.AudioContext ||
  (window as any).webkitAudioContext)()
const analyser: AnalyserNode = audioContext.createAnalyser()
const frequencies: Uint8Array = new Uint8Array(analyser.frequencyBinCount)

function getUserMedia(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
}

export async function startConnect(): Promise<void> {
  const stream: MediaStream | void = await getUserMedia().catch(error => {
    throw new Error(error)
  })

  if (!stream) return

  audioContext.createMediaStreamSource(stream).connect(analyser)
}

export function getByteFrequencyDataAverage(): number {
  analyser.getByteFrequencyData(frequencies)

  return (
    frequencies.reduce((prev, current): number => prev + current) /
    analyser.frequencyBinCount
  )
}
