import * as Three from 'three'
import * as Bas from 'three-bas'

import vertexParameters from './glsl/vertexParameters.vert'
import vertexInit from './glsl/vertexInit.vert'
import vertexPosition from './glsl/vertexPosition.vert'

export default class Particle extends Three.Mesh {
  public material: any
  public endPosition: any
  private count: number
  private geometry: any

  constructor({ count = 1000000 } = {}) {
    const duration: number = 0.5
    const maxDelay: number = 0.5
    const prefabGeometry = new Three.PlaneGeometry()
    const geometry = new Bas.PrefabBufferGeometry(prefabGeometry, count)

    geometry.createAttribute('aStagger', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloat(100, 200),
        Three.Math.randFloat(100, 200),
        Three.Math.randFloat(100, 200),
        Three.Math.randFloatSpread(200)
      ).toArray(data)
    })

    geometry.createAttribute('aDelayDuration', 2, (data): void => {
      data[0] = Math.random() * maxDelay
      data[1] = duration
    })

    geometry.createAttribute('aStartPosition', 3, (data): void => {
      new Three.Vector3(
        Three.Math.randFloatSpread(1000),
        Three.Math.randFloatSpread(1000),
        Three.Math.randFloatSpread(1000)
      ).toArray(data)
    })

    const aEndPosition = geometry.createAttribute(
      'aEndPosition',
      3,
      (data): void => {
        new Three.Vector3(
          Three.Math.randFloatSpread(1000),
          Three.Math.randFloatSpread(1000),
          0
        ).toArray(data)
      }
    )

    console.log(aEndPosition)

    // for (let i = 0; i < prefabCount; i++) {
    //   const angle = (Math.random() * 360 * Math.PI) / 180
    //   const r = Three.Math.randFloat(0, range)

    //   geometry.setPrefabData(aStartPosition, i, [
    //     r * Math.cos(angle),
    //     r * Math.sin(angle),
    //     0
    //   ])

    //   const latitude = (Math.random() * 360 * Math.PI) / 180
    //   const longitude = (Math.random() * 360 * Math.PI) / 180

    //   geometry.setPrefabData(aEndPosition, i, [
    //     -r * Math.cos(latitude) * Math.cos(longitude),
    //     r * Math.sin(latitude),
    //     r * Math.cos(latitude) * Math.sin(longitude)
    //   ])

    //   // const delay = Math.random() * maxPrefabDelay

    //   // aDelayDuration.array[i + 0] = Math.random() * maxPrefabDelay
    //   // aDelayDuration.array[i + 1] = duration

    //   // for (
    //   //   let j = 0,
    //   //     len = prefabGeometry.vertices.length * aDelayDuration.itemSize;
    //   //   j < len;
    //   //   j += aDelayDuration.itemSize
    //   // ) {
    //   //   aDelayDuration.array[len * i + j + 0] = Math.random() * maxPrefabDelay
    //   //   aDelayDuration.array[len * i + j + 1] = duration
    //   // }
    // }

    // for (let i = 0; i < prefabCount; i++) {
    //   for (
    //     let j = 0,
    //       len = prefabGeometry.vertices.length * aDelayDuration.itemSize;
    //     j < len;
    //     j += aDelayDuration.itemSize
    //   ) {
    //     aDelayDuration.array[len * i + j + 0] = Math.random() * maxPrefabDelay
    //     aDelayDuration.array[len * i + j + 1] = duration
    //   }
    // }

    geometry.createAttribute('aAxisAngle', 4, (data): void => {
      const vec3: Three.Vector3 = new Three.Vector3(
        Three.Math.randFloatSpread(1),
        Three.Math.randFloatSpread(1),
        Three.Math.randFloatSpread(1)
      )
      vec3.normalize().toArray(data)
      data[3] = (Math.PI / 180) * (Math.random() * 360)
      // axis.x = Three.Math.randFloatSpread(2)
      // axis.y = Three.Math.randFloatSpread(2)
      // axis.z = Three.Math.randFloatSpread(2)
      // axis.normalize()
      // axis.toArray(data)
      // data[3] = Math.PI * Three.Math.randFloat(4.0, 8.0)
    })

    const material = new Bas.StandardAnimationMaterial({
      side: Three.DoubleSide,
      flatShading: true,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uProgress: { type: 'f', value: 0 }
      },
      // uniformValues: {
      //   metalness: 0.5,
      //   roughness: 0.5
      // },
      vertexFunctions: [
        Bas.ShaderChunk.ease_cubic_in_out,
        Bas.ShaderChunk.ease_quad_out,
        Bas.ShaderChunk.quaternion_rotation
      ],
      vertexParameters,
      vertexInit,
      vertexNormal: [],
      vertexPosition,
      vertexColor: ['vColor = color;']
    })

    super(geometry, material)
    this.frustumCulled = false
    this.material = material
    this.geometry = geometry
    this.count = count
    this.endPosition = aEndPosition
  }

  get time() {
    return this.material.uniforms.uTime.value
  }

  set time(time: number) {
    this.material.uniforms.uTime.value = time
  }

  get progress() {
    return this.material.uniforms.uProgress.value
  }

  set progress(progress: number) {
    this.material.uniforms.uProgress.value = progress
  }

  setEndPosition(position: number[]): void {
    const positionLen: number = position.length
    const len: number = this.endPosition.count
    const itemSize: number = this.endPosition.itemSize

    console.log(len, itemSize, this.endPosition)

    for (let i: number = 0; i < len; i++) {
      const index: number = i % positionLen

      this.endPosition.array[i * itemSize + 0] = position[index]
      this.endPosition.array[i * itemSize + 1] = position[index]
      this.endPosition.array[i * itemSize + 2] = 0
    }

    this.endPosition.needsUpdate = true
  }
}
