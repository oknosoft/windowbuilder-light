import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';

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

  const v1 = new THREE.Vector3(pb.x - pos[0], pos[1] - pb.y, 0);
  const v2 = new THREE.Vector3(pe.x - pos[0], pos[1] - pe.y, 0);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

export function profilesGeometry(profiles, pos) {
  const res = new Map();
  for(const profile of profiles) {
    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: profilePath(profile, pos),
    };
    res.set(profile, new THREE.ExtrudeGeometry(profile.shape, extrudeSettings));
  }
  return res;
}


export function profileExtrude(profile, profiles, hidden, cut) {

  //const [hovered, setHover] = useState(false);
  //onPointerOver={(event) => setHover(true)}
  //onPointerOut={(event) => setHover(false)}
  const geometry = profiles.get(profile);
  const material = new THREE.MeshLambertMaterial({
    color: 0xeeffee,
    wireframe: false,
    transparent: hidden,
    opacity: hidden ? 0.2 : 1,
  });

  return cut ?
    <mesh key={`pc-${profile.elm}`} material={material}>
      <Geometry>
        <Base geometry={geometry}/>
        <Subtraction geometry={cut}/>
      </Geometry>
      {!hidden && <Edges color="grey" />}
    </mesh> :
    <mesh key={`p-${profile.elm}`} geometry={geometry} material={material}>
    {!hidden && <Edges color="grey" />}
  </mesh>;
}
