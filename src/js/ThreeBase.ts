import * as Three from 'three'
import OrbitControls from 'three-orbitcontrols'

export default class ThreeBase {
  private scene: Three.Scene
  private camera: Three.PerspectiveCamera
  private renderer: Three.WebGLRenderer
  private controls: OrbitControls
  private timerId: number

  constructor() {
    this.scene = new Three.Scene()
    this.camera = new Three.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.lookAt(this.scene.position)
    this.camera.position.z = 100
    // camera.position.x = -100

    this.renderer = new Three.WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement
    })

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', event => {
      if (this.timerId) {
        clearTimeout(this.timerId)
      }

      this.timerId = setTimeout(() => {
        this.setSize()
      }, 300)
    })

    this.setSize()
    this.tick()
  }

  addToScene(obj) {
    this.scene.add(obj)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  tick() {
    this.controls.update()
    this.render()
    requestAnimationFrame(() => {
      this.tick()
    })
  }

  setSize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
