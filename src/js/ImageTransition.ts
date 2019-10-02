import * as Three from 'Three'
import * as Bas from 'Three-bas'

import vertexParameters from './glsl/ImageTransition/vertexParameters.vert'
import vertexInit from './glsl/ImageTransition//vertexInit.vert'
import vertexPosition from './glsl/ImageTransition/vertexPosition.vert'

export default class ImageTransition extends Three.Mesh {
  public material: Three.Material
  public geometry: Three.Geometry
  public duration: number

  constructor(texture: Three.Texture, texture2: Three.Texture) {
    const image: any = texture.image
    const width: number = image.width
    const height: number = image.height

    const duration: number = 1.0
    const maxPrefabDelay: number = 0.5

    const plane: Three.PlaneGeometry = new Three.PlaneGeometry(
      width,
      height,
      width,
      height
    )

    Bas.Utils.separateFaces(plane)

    const imageGeo: any = new Bas.ModelBufferGeometry(plane, {
      localizeFaces: true,
      computeCentroids: true
    })
    imageGeo.bufferUvs()

    imageGeo.createAttribute('aAnimation', 2)
    imageGeo.createAttribute('aPosition', 4, (data, index): void => {
      const centroid = imageGeo.centroids[index]

      new Three.Vector4(
        centroid.x,
        centroid.y,
        centroid.z,
        Math.random() * -2 + 1
      ).toArray(data)
    })
    imageGeo.createAttribute('aEndPosition', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloatSpread(1000),
        Three.Math.randFloatSpread(1000),
        Three.Math.randFloatSpread(1000),
        Math.random() * -2 + 1
      ).toArray(data)
    })

    imageGeo.createAttribute('aControl0', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloatSpread(300),
        Three.Math.randFloatSpread(300),
        Three.Math.randFloatSpread(300),
        Math.random() * -2 + 1
      ).toArray(data)
    })

    imageGeo.createAttribute('aControl1', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloatSpread(300),
        Three.Math.randFloatSpread(300),
        Three.Math.randFloatSpread(300),
        Math.random() * -2 + 1
      ).toArray(data)
    })

    imageGeo.createAttribute(
      'aDelayDuration',
      4,
      (data, index, faceCount): void => {
        if (index === 5) {
          console.log(data, faceCount)
        }

        new Three.Vector4(
          (index / faceCount) * maxPrefabDelay,
          duration
        ).toArray(data)
      }
    )

    texture.minFilter = Three.LinearFilter

    const material = new Bas.BasicAnimationMaterial({
      side: Three.DoubleSide,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uSize: { type: 'vf2', value: [width, height] },
        map: { type: 't', value: texture },
        map2: { type: 't', value: texture2 }
      },
      vertexFunctions: [
        Bas.ShaderChunk.cubic_bezier,
        Bas.ShaderChunk.ease_quad_in_out,
        Bas.ShaderChunk.quaternion_rotation
      ],
      vertexParameters,
      vertexInit,
      vertexPosition,
      vertexColor: ['vColor = vec3(texelColor);']
    })
    material.uniforms.map.value.needsUpdate = true
    material.uniforms.map2.value.needsUpdate = true

    super(imageGeo, material)
    this.frustumCulled = false

    this.material = material
    this.geometry = imageGeo
    // this.duration = totalDuration
    // this.setTexture(image)
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
