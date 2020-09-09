import * as Three from 'three'

const UA: string = navigator.userAgent.toLocaleLowerCase()

export interface PointData {
  x: number
  y: number
  z: number
  r: number
  g: number
  b: number
  a: number
}

export function getPointFromImage(
  image: HTMLImageElement | HTMLCanvasElement
): PointData[] {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

  if (!context) {
    throw new Error('can not get context')
  }

  const imageWidth: number =
    image instanceof HTMLImageElement ? image.naturalWidth : image.width
  const imageHeight: number =
    image instanceof HTMLImageElement ? image.naturalHeight : image.height

  canvas.width = imageWidth
  canvas.height = imageHeight

  context.drawImage(image, 0, 0, imageWidth, imageHeight)

  const imageData: ImageData = context.getImageData(
    0,
    0,
    imageWidth,
    imageHeight
  )
  const data: Uint8ClampedArray = imageData.data
  const step = 1

  const pointData: PointData[] = []

  for (let y = 0; y < imageHeight; y += step) {
    for (let x = 0; x < imageWidth; x += step) {
      const index: number = (imageWidth * y + x) * 4
      const a: number = data[index + 3] / 255

      if (a > 0) {
        const positionX: number = (x * 2 - imageWidth) / imageWidth
        const positionY: number = (y * 2 - imageHeight) / imageHeight
        const r: number = data[index + 0] / 255
        const g: number = data[index + 1] / 255
        const b: number = data[index + 2] / 255

        pointData.push({
          x: positionX,
          y: -positionY,
          z: (r + g + b) / 3 / 2,
          r,
          g,
          b,
          a,
        })
      }
    }
  }

  return pointData
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject): void => {
    const img: HTMLImageElement = new Image()
    img.addEventListener('load', (): void => {
      resolve(img)
    })
    img.addEventListener('error', (event: Event): void => {
      reject(event)
    })

    img.src = src
  })
}

export function loadTexture(src: string): Promise<Three.Texture> {
  return new Promise((resolve: (texture: Three.Texture) => void): void => {
    const textureLoader: Three.TextureLoader = new Three.TextureLoader()
    textureLoader.load(src, (texture: Three.Texture): void => {
      resolve(texture)
    })
  })
}

export function isPC(): boolean {
  return !/(iphone|ipad|ipod|android)/i.test(UA)
}
