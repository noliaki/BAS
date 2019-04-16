import * as Three from 'three'
import * as Bas from 'three-bas'

const prefabCount: number = 10000
const prefabGeometry: Three.TetrahedronGeometry = new Three.TetrahedronGeometry(
  1.0
)
const geometry: Bas.PrefabBufferGeometry = new Bas.PrefabBufferGeometry(
  prefabGeometry,
  prefabCount
)

const aStartPosition = geometry.createAttribute('aStartPosition', 3)
const aEndPosition = geometry.createAttribute('aEndPosition', 3)
const aDelayDuration = geometry.createAttribute('aDelayDuration', 2)

const duration: number = 1.0
const maxPrefabDelay: number = 0.5
