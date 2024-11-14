import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';

function profilePath(profile, b, e, pos) {
  const v1 = new THREE.Vector3(b.outer.x - pos[0], pos[1] - b.outer.y, 0);
  const v2 = new THREE.Vector3(e.outer.x - pos[0], pos[1] - e.outer.y, 0);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

function cutIrrelevant(geometry, b, e, extrudePath) {
  if(b.cnnType.is('ad')) {

  }
  if(e.cnnType.is('ad')) {

  }
  return geometry;
}

export function profilesGeometry(profiles, pos) {
  const res = new Map();
  for(const profile of profiles) {
    const {b, e} = profile.points(true);
    const extrudeSettings = {
      steps: 3,
      bevelEnabled: false,
      extrudePath: profilePath(profile, b, e, pos),
    };
    const geometry = cutIrrelevant(
      new THREE.ExtrudeGeometry(profile.shape, extrudeSettings), b, e, extrudeSettings.extrudePath);
    res.set(profile, geometry);

  }
  return res;
}


export function profileExtrude(profile, profiles, hidden, cut) {

  //const [hovered, setHover] = useState(false);
  //onPointerOver={(event) => setHover(true)}
  //onPointerOut={(event) => setHover(false)}
  const {stamp} = profile.project.props;
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
      {!hidden && <Edges key={`e-${stamp}`} color="grey" />}
    </mesh> :
    <mesh key={`p-${profile.elm}`} geometry={geometry} material={material}>
    {!hidden && <Edges color="grey" />}
  </mesh>;
}
