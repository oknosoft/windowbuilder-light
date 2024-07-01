import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
//import { Geometry, Base, Subtraction, Intersection, Difference, ReverseSubtraction } from '@react-three/csg';

import {rama, impost, flap} from './shapes';

function profilePath(profile, pos) {
  const {b, e, generatrix} = profile;
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

  const v1 = new THREE.Vector3(pb.x - pos[0], pos[1] - pb.y, pos[2]);
  const v2 = new THREE.Vector3(pe.x - pos[0], pos[1] - pe.y, pos[2]);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

export function profilesGeometry(profiles, pos) {
  const res = new Map();
  for(const profile of profiles) {
    const extrudeSettings = {
      steps: 10,
      bevelEnabled: false,
      extrudePath: profilePath(profile, pos),
    };
    let shape = rama;
    if(profile.b.isT || profile.e.isT) {
      shape = impost;
    }
    else if(pos[2]) {
      shape = flap;
    }
    res.set(profile, new THREE.ExtrudeGeometry(shape, extrudeSettings));
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
    material={new THREE.MeshLambertMaterial({color: 0xeeffee, wireframe: false})}
  >
    <Edges color="grey" />
  </mesh>;
}
