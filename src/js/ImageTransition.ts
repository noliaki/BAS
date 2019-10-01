import * as Three from 'three'
import * as Bas from 'three-bas'

export default class ImageTransition extends Three.Mesh {
  public material: Three.Material
  public geometry: Three.Geometry
  public duration: number

  constructor(image: HTMLImageElement) {
    const width: number = image.width
    const height: number = image.height

    const plane: Three.PlaneGeometry = new Three.PlaneGeometry(
      width,
      height,
      width,
      height
    )

    Bas.Utils.separateFaces(plane)

    const imageGeo: any = new ImageGeometry(plane)
    // imageGeo.bufferUVs()

    const aAnimation = imageGeo.createAttribute('aAnimation', 2)
    const aStartPosition = imageGeo.createAttribute('aStartPosition', 3)
    const aControl0 = imageGeo.createAttribute('aControl0', 3)
    const aControl1 = imageGeo.createAttribute('aControl1', 3)
    const aEndPosition = imageGeo.createAttribute('aEndPosition', 3)

    const minDuration: number = 0.8
    const maxDuration: number = 1.2
    const maxDelayX: number = 0.9
    const maxDelayY: number = 0.125
    const stretch: number = 0.11

    const totalDuration: number = maxDuration + maxDelayX + maxDelayY + stretch
    const len: number = imageGeo.faceCount

    const startPosition: Three.Vector3 = new Three.Vector3()
    const endPosition: Three.Vector3 = new Three.Vector3()
    const control0: Three.Vector3 = new Three.Vector3()
    const control1: Three.Vector3 = new Three.Vector3()

    for (
      let i: number = 0, j: number = 0, k: number = 0, l: number = 0;
      i < len;
      i++, j += 6, k += 9, l += 12
    ) {
      const face: Three.Face3 = plane.faces[i]
      const centroid = Bas.Utils.computeCentroid(plane, face)

      const duration: number = Three.Math.randFloat(minDuration, maxDuration)
      const delayX: number = Three.Math.mapLinear(
        centroid.x,
        -width / 2,
        width / 2,
        0,
        maxDelayX
      )
      const delayY: number = Three.Math.mapLinear(
        Math.abs(centroid.y),
        0,
        height / 2,
        0,
        maxDelayY
      )

      for (let m: number = 0; m < 6; m += 2) {
        aAnimation.array[j + m + 0] =
          delayX + delayY + Math.random() * stretch * duration
        aAnimation.array[j + m + 1] = duration
      }

      const temp: Three.Vector3 = new Three.Vector3()
      const signY: number = Math.sign(centroid.y)

      temp.x = Three.Math.randFloat(0.3, 0.6) * 50
      temp.y = signY * Three.Math.randFloat(0.3, 0.6) * 70
      temp.z = Three.Math.randFloatSpread(20)

      startPosition.copy(centroid)
      endPosition.copy(centroid)
      control0.copy(centroid).sub(temp)
      control1.copy(centroid).sub(temp)

      for (let v: number = 0; v < 9; v += 3) {
        aStartPosition.array[k + v + 0] = startPosition.x
        aStartPosition.array[k + v + 1] = startPosition.y
        aStartPosition.array[k + v + 2] = startPosition.z

        aControl0.array[k + v + 0] = control0.x
        aControl0.array[k + v + 1] = control0.y
        aControl0.array[k + v + 2] = control0.z

        aControl1.array[k + v + 0] = control1.x
        aControl1.array[k + v + 1] = control1.y
        aControl1.array[k + v + 2] = control1.z

        aEndPosition.array[k + v + 0] = endPosition.x
        aEndPosition.array[k + v + 1] = endPosition.y
        aEndPosition.array[k + v + 2] = endPosition.z
      }
    }

    const material = new Bas.BasicAnimationMaterial(
      {
        shading: Three.FlatShading,
        side: Three.DoubleSide,
        uniforms: {
          uTime: { type: 'f', value: 0 }
        },
        shaderFunctions: [
          Bas.ShaderChunk.cubic_bezier,
          Bas.ShaderChunk.ease_in_out_cubic,
          Bas.ShaderChunk.quaternion_rotation
        ],
        shaderParameters: [
          'uniform float uTime;',
          'attribute vec2 aAnimation;',
          'attribute vec3 aStartPosition;',
          'attribute vec3 aControl0;',
          'attribute vec3 aControl1;',
          'attribute vec3 aEndPosition;'
        ],
        shaderVertexInit: [
          'float tDelay = aAnimation.x;',
          'float tDuration = aAnimation.y;',
          'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
          'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
        ],
        shaderTransformPosition: [
          'transformed *= tProgress;',
          'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
        ]
      },
      {
        map: new Three.Texture()
      }
    )

    super(imageGeo, material)
    this.frustumCulled = false

    this.material = material
    this.geometry = imageGeo
    this.duration = totalDuration
    this.setTexture(image)
  }

  getCentroidPoint(centroid: any): Three.Vector3 {
    const temp: Three.Vector3 = new Three.Vector3()
    const signY: number = Math.sign(centroid.y)

    temp.x = Three.Math.randFloat(0.3, 0.6) * 50
    temp.y = signY * Three.Math.randFloat(0.3, 0.6) * 70
    temp.z = Three.Math.randFloatSpread(20)

    return temp
  }

  setTexture(texture: HTMLImageElement): void {
    console.log((this.material as any).uniforms.map)
    ;(this.material as any).uniforms.map.value.image = texture
    ;(this.material as any).uniforms.map.value.needsUpdate = true
  }

  get time(): number {
    return (this.material as any).uniforms.uTime.value
  }

  set time(time: number) {
    ;(this.material as any).uniforms.uTime.value = time
  }
}

class ImageGeometry extends Bas.ModelBufferGeometry {
  public model: Three.Geometry

  constructor(model: Three.Geometry) {
    super(model)
    this.model = model
  }

  public bufferPositions(): void {
    const self = this as Bas.ModelBufferGeometry
    const positionBuffer: any[] = self.createAttribute('position', 3).array

    for (let i: number = 0, len: number = self.faceCount; i < len; i++) {
      const face = self.modelGeometry.faces[i]
      const centroid = Bas.Utils.computeCentroid(self.modelGeometry, face)

      const a = self.modelGeometry.vertices[face.a]
      const b = self.modelGeometry.vertices[face.b]
      const c = self.modelGeometry.vertices[face.c]

      positionBuffer[face.a * 3 + 0] = a.x = centroid.x
      positionBuffer[face.a * 3 + 1] = a.y = centroid.y
      positionBuffer[face.a * 3 + 2] = a.z = centroid.z

      positionBuffer[face.b * 3 + 0] = b.x = centroid.x
      positionBuffer[face.b * 3 + 1] = b.y = centroid.y
      positionBuffer[face.b * 3 + 2] = b.z = centroid.z

      positionBuffer[face.c * 3 + 0] = c.x = centroid.x
      positionBuffer[face.c * 3 + 1] = c.y = centroid.y
      positionBuffer[face.c * 3 + 2] = c.z = centroid.z
    }
  }
}
