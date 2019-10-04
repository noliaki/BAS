export interface Position {
  x: number
  y: number
}

export default class StringToImageData {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D | null
  private text: string
  private fontSize: number
  private fontFamily: string
  private textBaseline: CanvasTextBaseline

  constructor(text: string) {
    this.fontSize = 30
    this.text = text
    this.fontFamily = 'serif'
    this.textBaseline = 'middle'

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    if (this.context === null) {
      throw new Error('cannot get context 2D')
    }

    this.drawText()
  }

  calcTextHeight(): number {
    const el: HTMLDivElement = document.createElement('div')
    el.style.fontFamily = this.fontFamily
    el.style.fontSize = `${this.fontSize}px`
    el.textContent = this.text

    document.body.appendChild(el)
    const height: number = el.scrollHeight
    document.body.removeChild(el)

    return height
  }

  drawText(): void {
    if (this.context === null) return

    this.context.textBaseline = this.textBaseline
    this.context.font = `${this.fontSize}px serif`
    const textMetrics: TextMetrics = this.context.measureText(this.text)

    this.canvas.width = textMetrics.width
    this.canvas.height = this.calcTextHeight()
    this.context.textBaseline = this.textBaseline
    this.context.font = `${this.fontSize}px ${this.fontFamily}`
    this.context.fillText(this.text, 0, 20)
  }

  getImageDate(): ImageData {
    if (this.context === null) {
      throw new Error('context is not found')
    }

    return this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  getPosition(): Position[] {
    const width: number = this.canvas.width
    const height: number = this.canvas.height
    const data: Uint8ClampedArray = this.getImageDate().data
    const dataLen: number = data.length
    const step: number = 1

    const position: Position[] = []

    for (let i: number = 0; i < dataLen; i += 4 * step) {
      const a: number = data[i + 3]

      if (a === 0) continue

      position.push({
        x: i % width,
        y: Math.floor(i / width)
      })
    }
  }
}
