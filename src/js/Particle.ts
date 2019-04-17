import * as Three from 'three'
import * as Bas from 'three-bas'

export default class Particle extends Three.Mesh {
  public material: any

  constructor({ count = 100000 } = {}) {
    const prefabCount = count
    const prefabGeometry = new Three.ConeGeometry()
    const geometry = new Bas.PrefabBufferGeometry(prefabGeometry, prefabCount)

    const aDelayDuration = geometry.createAttribute('aDelayDuration', 2)
    const duration = 1.0
    const maxPrefabDelay = 0.5

    const axis = new Three.Vector3()
    const aStartPosition = geometry.createAttribute('aStartPosition', 3)
    const aEndPosition = geometry.createAttribute('aEndPosition', 3)

    const range = 400

    for (let i = 0; i < prefabCount; i++) {
      geometry.setPrefabData(aStartPosition, i, [
        Three.Math.randFloatSpread(range) - range * 0.5,
        Three.Math.randFloatSpread(range),
        Three.Math.randFloatSpread(range)
      ])
      geometry.setPrefabData(aEndPosition, i, [
        Three.Math.randFloatSpread(range) + range * 0.5,
        Three.Math.randFloatSpread(range),
        Three.Math.randFloatSpread(range)
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
      uniforms: {
        uTime: { value: 0 }
      },
      uniformValues: {
        metalness: 0.5,
        roughness: 0.5
      },
      vertexFunctions: [
        Bas.ShaderChunk['ease_cubic_in_out'],
        Bas.ShaderChunk['ease_quad_out'],
        Bas.ShaderChunk['quaternion_rotation']
      ],
      vertexParameters: [
        'uniform float uTime;',
        'attribute vec2 aDelayDuration;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aEndPosition;',
        'attribute vec4 aAxisAngle;'
      ],
      vertexInit: [
        'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
        'tProgress = easeCubicInOut(tProgress);',
        'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);'
      ],
      vertexNormal: [],
      vertexPosition: [
        'float scl = easeQuadOut(tProgress, 0.5, 1.5, 1.0);',
        'transformed *= scl;',
        'transformed = rotateVector(tQuat, transformed);',
        'transformed += mix(aStartPosition, aEndPosition, tProgress);'
      ]
    })

    super(geometry as any, material as any)
    this.frustumCulled = false
    this.material = material
  }
}
