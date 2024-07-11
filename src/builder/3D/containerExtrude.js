import React, { useRef, useState } from 'react'
import * as THREE from 'three';
//import { Geometry, Base, Subtraction, Intersection, Difference, ReverseSubtraction } from '@react-three/csg';

//const loader = new THREE.TextureLoader();
//const texture = loader.load('./glass.png');
//const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');

function glassPath(container, pos) {
  const {perimeter, pathInner} = container;
  const points = pathInner.map(v => {
    //const {point} = v.endVertex;
    return {x: v.x - pos[0], y: pos[1] - v.y};
  })
  const start = points[0];

  const v1 = new THREE.Vector3(start.x, start.y,  -26);
  const v2 = new THREE.Vector3(start.x, start.y,  -66);
  const extrudePath = new THREE.CurvePath();
  extrudePath.add( new THREE.LineCurve3( v1, v2 ) );
  const shape = new THREE.Shape();
  //shape.moveTo( 0, 0 );
  for(let i = points.length - 1; i >= 0; i--) {
    const {x, y} = points[i];
    shape.lineTo( start.y - y, start.x - x);
  }
  shape.lineTo( 0, 0);
  return {extrudePath, shape};
}

export function containersGeometry(containers, pos) {
  const res = new Map();
  for(const container of containers) {
    if(container.kind === 'glass') {
      const {extrudePath, shape} = glassPath(container, pos);
      const extrudeSettings = {
        steps: 2,
        bevelEnabled: false,
        extrudePath,
      };
      res.set(container, new THREE.ExtrudeGeometry(shape, extrudeSettings));
    }
  }
  return res;
}


export function containerExtrude(profile, profiles) {

  //const [hovered, setHover] = useState(false);
  //onPointerOver={(event) => setHover(true)}
  //onPointerOut={(event) => setHover(false)}
  const geometry = profiles.get(profile);

  return <mesh
    key={`p-${profile.key}`}
    geometry={geometry}
    material={
//     new THREE.MeshPhysicalMaterial({
//       metalness: .9,
//       roughness: .05,
//       envMapIntensity: 0.9,
//       clearcoat: 1,
//       transparent: true,
// // transmission: .95,
//       opacity: .5,
//       reflectivity: 0.2,
//       refractionRatio: 0.985,
//       ior: 0.9,
//       side: THREE.BackSide,
//     })
      new THREE.MeshPhongMaterial({
      color: 0x8080c0,
      //map: texture,
      //metalness: .1,
      //roughness: .2,
      //envMapIntensity: 0.6,
      //clearcoat: 1,
      //transmission: .95,
      // refractionRatio: 0.985,
      //ior: 0.9,
      transparent: true,
      opacity: .14,
      reflectivity: 0.8,
      side: THREE.DoubleSide,
    })
  }
  >
  </mesh>;
}
