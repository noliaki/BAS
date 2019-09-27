import * as Three from 'three'
import * as Bas from 'three-bas'

import vertexParameters from './glsl/vertexParameters.vert'
import vertexInit from './glsl/vertexInit.vert'
import vertexPosition from './glsl/vertexPosition.vert'

export default class Particle extends Three.Mesh {
  public material: any

  constructor({ count = 50000 } = {}) {
    const prefabCount = count
    const prefabGeometry = new Three.DodecahedronGeometry()
    const geometry = new Bas.PrefabBufferGeometry(prefabGeometry, prefabCount)

    const aDelayDuration = geometry.createAttribute('aDelayDuration', 2)
    const duration = 1.0
    const maxPrefabDelay = 0.5

    const axis = new Three.Vector3()
    const aStartPosition = geometry.createAttribute('aStartPosition', 3)
    const aEndPosition = geometry.createAttribute('aEndPosition', 3)

    const range = 400

    for (let i = 0; i < prefabCount; i++) {
      const angle = (Math.random() * 360 * Math.PI) / 180
      const r = Three.Math.randFloat(0, range)

      geometry.setPrefabData(aStartPosition, i, [
        r * Math.cos(angle),
        r * Math.sin(angle),
        0
      ])

      const latitude = (Math.random() * 360 * Math.PI) / 180
      const longitude = (Math.random() * 360 * Math.PI) / 180

      geometry.setPrefabData(aEndPosition, i, [
        -r * Math.cos(latitude) * Math.cos(longitude),
        r * Math.sin(latitude),
        r * Math.cos(latitude) * Math.sin(longitude)
      ])

      // const delay = Math.random() * maxPrefabDelay

      for (
        let j = 0,
          len = prefabGeometry.vertices.length * aDelayDuration.itemSize;
        j < len;
        j += aDelayDuration.itemSize
      ) {
        aDelayDuration.array[len * i + j + 0] = Math.random() * maxPrefabDelay
        aDelayDuration.array[len * i + j + 1] = duration
      }
    }

    geometry.createAttribute('aAxisAngle', 4, data => {
      axis.x = Three.Math.randFloatSpread(2)
      axis.y = Three.Math.randFloatSpread(2)
      axis.z = Three.Math.randFloatSpread(2)
      axis.normalize()
      axis.toArray(data)
      data[3] = Math.PI * Three.Math.randFloat(4.0, 8.0)
    })

    const material = new Bas.StandardAnimationMaterial({
      flatShading: true,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { value: 0 }
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
      vertexColor: ['vColor = vec3(0.0, 0.6, 1.0);']
    })

    super(geometry, material)
    this.frustumCulled = false
    this.material = material
  }
}
