import * as Three from 'three'
import ThreeBase from './ThreeBase'
// import Particle from './Particle'
import ImageTransition from './ImageTransition'
// import Points from './Points'
import { TweenLite } from 'gsap/TweenLite'

import { loadImage } from './helper'

// const threeBase = new ThreeBase()
// // const particle = new Particle()
// const points: Points = new Points()

// const light = new Three.DirectionalLight(0x00aaff)
// const light2 = new Three.DirectionalLight(0x00ffff)
// light2.position.y = -1000
// light2.position.x = -1000

// const axes = new Three.AxesHelper(1000)

// threeBase.addToScene(light)
// threeBase.addToScene(light2)
// threeBase.addToScene(axes)
// threeBase.addToScene(points)

// let toggle = false
// const obj = {
//   time: 0
// }

// const btn: HTMLElement | null = document.getElementById('animation-toggle')

// if (btn) {
//   btn.addEventListener('click', async event => {
//     event.preventDefault()

//     const imgEl: HTMLImageElement = await loadImage('./cat.jpg')
//     const pointdata: PointData[] | void = getPointFromImage(imgEl)

//     console.log(pointdata)

//     if (pointdata) {
//       points.setEndPointData(pointdata)
//     }

//     console.log(imgEl)

//     toggle = !toggle

//     TweenLite.fromTo(
//       obj,
//       3,
//       {
//         time: obj.time
//       },
//       {
//         time: toggle ? 1.5 : 0,
//         onUpdate() {
//           points.time = obj.time
//         }
//       }
//     )
//   })
// }

async function init(): Promise<void> {
  const threeBase = new ThreeBase()
  const light = new Three.DirectionalLight(0x00aaff)
  const light2 = new Three.DirectionalLight(0x00ffff)
  light2.position.y = -1000
  light2.position.x = -1000

  const axes = new Three.AxesHelper(1000)

  const imgEl: HTMLImageElement = await loadImage('./cat.jpg')

  const imageTransition: ImageTransition = new ImageTransition(imgEl)

  threeBase.addToScene(light)
  threeBase.addToScene(light2)
  threeBase.addToScene(axes)
  threeBase.addToScene(imageTransition)

  const btn: HTMLElement | null = document.getElementById('animation-toggle')

  if (!btn) return

  const obj = {
    time: 0
  }
  let toggle: boolean = true

  btn.addEventListener('click', async event => {
    event.preventDefault()

    toggle = !toggle

    TweenLite.fromTo(
      obj,
      3,
      {
        time: obj.time
      },
      {
        time: toggle ? 1.5 : 0,
        onUpdate() {
          imageTransition.time = obj.time
        }
      }
    )
  })
}

init()
