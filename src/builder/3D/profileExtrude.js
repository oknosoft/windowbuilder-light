import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
//import { Geometry, Base, Subtraction, Intersection, Difference, ReverseSubtraction } from '@react-three/csg';

import {rama, impost} from './shapes';

function profilePath(profile, bounds) {
  const {b, e, generatrix} = profile;
  const y = bounds.height + bounds.top;
  let pb = b.point;
  let pe = e.point;
  if(b.isT) {
    pb = generatrix.getPointAt(30);
  }
  else if(Math.abs(pb.y - pe.y) < 100) {
    pb = generatrix.getPointAt(38);
  }
  if(e.isT) {
    pe = generatrix.getPointAt(generatrix.length - 30);
  }
  else if(Math.abs(pb.y - pe.y) < 100) {
    pe = generatrix.getPointAt(generatrix.length - 38);
  }

  const v1 = new THREE.Vector3(pb.x, (y - pb.y), 0);
  const v2 = new THREE.Vector3(pe.x, (y - pe.y), 0);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

export function profilesGeometry(profiles, bounds) {
  const res = new Map();
  for(const profile of profiles) {
    const extrudeSettings = {
      steps: 10,
      bevelEnabled: false,
      extrudePath: profilePath(profile, bounds),
    };
    res.set(profile, new THREE.ExtrudeGeometry(profile.b.isT ? impost : rama, extrudeSettings));
  }
  return res;
}


export function profileExtrude(profile, profiles) {

  //const [hovered, setHover] = useState(false);
  //onPointerOver={(event) => setHover(true)}
  //onPointerOut={(event) => setHover(false)}
  const geometry = profiles.get(profile);

  return <mesh
    key={`p-${profile.elm}`}
    geometry={geometry}
    material={new THREE.MeshLambertMaterial({color: 0xddeeee, wireframe: false})}
  >
    <Edges color="grey" />
  </mesh>;
}
