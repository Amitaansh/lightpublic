'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * Studio light with nothing to download (brief §6.5): an overhead softbox,
 * two thin rim strips, a white floor bounce and a soft front fill, rendered
 * once into an environment map.
 */
export function Lighting() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4.5} position={[0, 3, 1.2]} scale={[5, 2.4, 1]} />
        <Lightformer form="rect" intensity={3.6} position={[-3, 0.6, 0.6]} scale={[0.35, 4, 1]} />
        <Lightformer form="rect" intensity={3.4} position={[3, 0.2, -0.4]} scale={[0.35, 4, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[0, -3, 0.6]} scale={[5, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#e8ecff" position={[0, 0, 3.5]} scale={[2.5, 2.5, 1]} />
      </Environment>
      <ambientLight intensity={0.18} />
      <directionalLight position={[0.6, 1.2, 1.4]} intensity={1.4} />
      <directionalLight position={[-1.2, -0.4, 0.8]} intensity={0.5} color="#dfe5ff" />
    </>
  )
}
