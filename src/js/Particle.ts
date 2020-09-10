import * as Three from 'three'
import * as Bas from 'three-bas'

import vertexParameters from './glsl/vertexParameters.vert'
import vertexInit from './glsl/vertexInit.vert'
import vertexPosition from './glsl/vertexPosition.vert'

import { Position } from './StringToImageData'
import { PointData } from './helper'

export default class Particle extends Three.Mesh {
  public material: any
  public endPosition: any
  private count: number
  public geometry: any
  public endColor: any

  constructor({ count = 100000 } = {}) {
    const duration = 0.5
    const maxDelay = 0.5
    const prefabGeometry = new Three.PlaneGeometry()
    const geometry = new Bas.PrefabBufferGeometry(prefabGeometry, count)

    geometry.createAttribute('aStaggerTime', 4, (data): void => {
      new Three.Vector4(
        Three.MathUtils.randFloat(100, 800),
        Three.MathUtils.randFloat(100, 800),
        Three.MathUtils.randFloat(100, 800),
        Three.MathUtils.randFloat(100, 800)
      ).toArray(data)
    })

    geometry.createAttribute('aStagger', 4, (data): void => {
      new Three.Vector4(
        Math.random(),
        Math.random(),
        Math.random(),
        Three.MathUtils.randFloat(1, 2)
      ).toArray(data)
    })

    geometry.createAttribute('aDelayDuration', 2, (data): void => {
      data[0] = Math.random() * maxDelay
      data[1] = duration
    })

    geometry.createAttribute('aScale', 4, (data): void => {
      new Three.Vector4(
        Three.MathUtils.randFloat(2, 10),
        Three.MathUtils.randFloat(10, 50),
        Math.random(),
        Three.MathUtils.randFloat(3, 10)
      ).toArray(data)
    })

    geometry.createAttribute('aControl0', 3, (data): void => {
      new Three.Vector3(0, 0, 0).toArray(data)
    })

    geometry.createAttribute('aStartPosition', 3, (data): void => {
      const position = getRandomPointOnSphere(Math.random() * 5000)
      new Three.Vector3(position.x, position.y, position.z).toArray(data)
    })

    const aEndPosition = geometry.createAttribute(
      'aEndPosition',
      3,
      (data): void => {
        new Three.Vector3(
          Three.MathUtils.randFloatSpread(1000),
          Three.MathUtils.randFloatSpread(1000),
          0
        ).toArray(data)
      }
    )

    const aEndColor = geometry.createAttribute('aEndColor', 3, (data): void => {
      new Three.Vector3(
        Three.MathUtils.randFloatSpread(1),
        Three.MathUtils.randFloatSpread(1),
        Three.MathUtils.randFloatSpread(1)
      ).toArray(data)
    })

    geometry.createAttribute('aAxisAngle', 4, (data): void => {
      const vec3: Three.Vector3 = new Three.Vector3(
        Three.MathUtils.randFloatSpread(1),
        Three.MathUtils.randFloatSpread(1),
        Three.MathUtils.randFloatSpread(1)
      )
      vec3.normalize().toArray(data)
      data[3] = Math.random() * 360
    })

    const material = new Bas.StandardAnimationMaterial({
      side: Three.DoubleSide,
      flatShading: true,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uProgress: { type: 'f', value: 0 },
        uLoudness: { type: 'f', value: 0 },
        uStrLen: { type: 'f', value: 1 },
        uIsImage: { type: 'bool', value: false },
      },
      vertexFunctions: [
        Bas.ShaderChunk.cubic_bezier,
        Bas.ShaderChunk.ease_circ_in_out,
        Bas.ShaderChunk.ease_elastic_in_out,
        Bas.ShaderChunk.ease_quad_out,
        Bas.ShaderChunk.quaternion_rotation,
      ],
      vertexParameters,
      vertexInit,
      vertexNormal: [],
      vertexPosition,
      vertexColor: ['vColor = color;'],
    })

    super(geometry, material)
    this.frustumCulled = false
    this.material = material
    this.geometry = geometry
    this.count = count
    this.endPosition = aEndPosition
    this.endColor = aEndColor
  }

  get time(): number {
    return this.material.uniforms.uTime.value
  }

  set time(time: number) {
    this.material.uniforms.uTime.value = time
  }

  get uIsImage(): boolean {
    return this.material.uniforms.uIsImage.value
  }

  set uIsImage(val: boolean) {
    this.material.uniforms.uIsImage.value = val
  }

  get progress(): number {
    return this.material.uniforms.uProgress.value
  }

  set progress(progress: number) {
    this.material.uniforms.uProgress.value = progress
  }

  get loudness(): number {
    return this.material.uniforms.uLoudness.value
  }

  set loudness(loudness: number) {
    this.material.uniforms.uLoudness.value = loudness
  }

  get strLen(): number {
    return this.material.uniforms.uStrLen.value
  }

  set strLen(length: number) {
    this.material.uniforms.uStrLen.value = length
  }

  setEndPosition(
    position: Position[] | PointData[],
    width?: number,
    height?: number
  ): void {
    const ratio: number = width && height ? height / width : 1
    const positionLen: number = position.length
    const len: number = this.count
    const size = 2000

    for (let i = 0; i < len; i++) {
      const index: number = i % positionLen

      this.geometry.setPrefabData('aEndPosition', i, [
        position[index].x * size,
        position[index].y * (size * ratio),
        0,
      ])
    }

    this.endPosition.needsUpdate = true
  }

  setEndColor(
    colors: { r: number; g: number; b: number }[] | PointData[]
  ): void {
    const colorLen: number = colors.length
    const len: number = this.count

    for (let i = 0; i < len; i++) {
      const index: number = i % colorLen

      this.geometry.setPrefabData('aEndColor', i, [
        colors[index].r,
        colors[index].g,
        colors[index].b,
      ])
    }

    this.endColor.needsUpdate = true
  }
}

function getRandomPointOnSphere(
  r: number
): { x: number; y: number; z: number } {
  const u: number = Three.MathUtils.randFloat(0, 1)
  const v: number = Three.MathUtils.randFloat(0, 1)
  const theta: number = 2 * Math.PI * u
  const phi: number = Math.acos(2 * v - 1)
  const x: number = r * Math.sin(theta) * Math.sin(phi)
  const y: number = r * Math.cos(theta) * Math.sin(phi)
  const z: number = r * Math.cos(phi)

  return {
    x,
    y,
    z,
  }
}
