import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { SUBTRACTION, ADDITION, Brush, Evaluator } from 'three-bvh-csg';

const evaluator = new Evaluator();

const adtShape = new THREE.Shape();
adtShape.moveTo( -50, -250 );
adtShape.lineTo( 100, -250 );
adtShape.lineTo( 100, 0 );
adtShape.lineTo( -50, 0 );
adtShape.lineTo( -50, -250 );

function profilePath(profile, b, e, pos) {
  const v1 = new THREE.Vector3(b.outer.x - pos[0], pos[1] - b.outer.y, 0);
  const v2 = new THREE.Vector3(e.outer.x - pos[0], pos[1] - e.outer.y, 0);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

function irrelevantAD(paper, {name, inner, outer}, pos) {
  const path = new paper.Path({
    insert: false,
    segments: [[inner.x - pos[0], pos[1] - inner.y], [outer.x - pos[0], pos[1] - outer.y]],
  }).elongation(100);
  const normal = path.getNormalAt(0).multiply(name === 'e' ? 200 : -200);
  const b = path[name === 'e' ? 'lastSegment' : 'firstSegment'].point;
  const b1 = b.add(normal);

  const v1 = new THREE.Vector3(b.x, b.y, 0);
  const v2 = new THREE.Vector3(b1.x, b1.y, 0);
  const extrudePath = new THREE.CurvePath();
  extrudePath.add( new THREE.LineCurve3( v1, v2 ) );

  const extrudeSettings = {
    steps: 3,
    bevelEnabled: false,
    extrudePath,
  };

  const geometry = new THREE.ExtrudeGeometry( adtShape, extrudeSettings );

  return new Brush(geometry);
}

function cutIrrelevant(geometry, b, e, profile, pos) {
  let brush;
  if(b.cnn.node1.empty()) {
    if(b.cnnType.is('ad')) {
      const sub = irrelevantAD(profile.project._scope, b, pos);
      brush = evaluator.evaluate( new Brush(geometry), sub, SUBTRACTION );
      geometry = brush.geometry;
    }
    if(b.cnnType.is('short') || b.cnnType.is('t')) {

    }
  }
  if(e.cnn.node1.empty()) {
    if(e.cnnType.is('ad')) {
      const sub = irrelevantAD(profile.project._scope, e, pos);
      if(!brush) {
        brush = new Brush(geometry);
      }
      const res = evaluator.evaluate( brush, sub, SUBTRACTION );
      geometry = res.geometry;
    }
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
      new THREE.ExtrudeGeometry(profile.shape, extrudeSettings), b, e, profile, pos);
    res.set(profile, geometry);

  }
  return res;
}


export function profileExtrude(profile, profiles, cut) {

  //const [hovered, setHover] = useState(false);
  //onPointerOver={(event) => setHover(true)}
  //onPointerOut={(event) => setHover(false)}
  const {hidden, project} = profile;
  const {stamp} = project.props;
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
