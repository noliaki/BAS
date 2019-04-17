import * as Three from 'three'
import ThreeBase from './ThreeBase'
import Particle from './Particle'
import { TweenLite } from 'gsap/TweenLite'

const threeBase = new ThreeBase()
const particle = new Particle()

const light = new Three.DirectionalLight(0xff00ff)
const light2 = new Three.DirectionalLight(0x00ffff)
light2.position.y = -1

threeBase.addToScene(light)
threeBase.addToScene(light2)
threeBase.addToScene(particle)

const obj = {
  time: 0
}

TweenLite.fromTo(
  obj,
  10,
  {
    time: 0
  },
  {
    time: 1.5,
    onUpdate() {
      particle.material.uniforms.uTime.value = obj.time
    }
  }
)
