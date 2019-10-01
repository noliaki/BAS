import * as Three from 'three'
import OrbitControls from 'three-orbitcontrols'
import TrackballControls from 'three-trackballcontrols'

export default class ThreeBase {
  public scene: Three.Scene
  public camera: Three.PerspectiveCamera
  public renderer: Three.WebGLRenderer
  public controls: OrbitControls
  public timerId: number | null
  // public light: Three.AmbientLight

  constructor() {
    this.timerId = null
    this.scene = new Three.Scene()
    this.camera = new Three.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    this.camera.lookAt(this.scene.position)
    this.camera.position.z = 1000
    // camera.position.x = -100

    // this.light = new Three.DirectionalLight(0xffffff)
    // this.addToScene(this.light)

    this.renderer = new Three.WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
      antialias: true
    })
    this.renderer.setClearColor(new Three.Color(0x1a202c))

    this.controls = new TrackballControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', () => {
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
