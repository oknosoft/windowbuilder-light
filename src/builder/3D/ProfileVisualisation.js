import React, { useRef, useState } from 'react';
import {MathUtils} from 'three';
const {degToRad} = MathUtils;
import Gltf from './Gltf';

function visualization(profile) {
  const {layer, index} = profile;
  const res = [];
  for(const row of layer.specification.procedures) {
    const {visualization} = row.procedure;
    if(!visualization.empty() && visualization.name.includes('Ручка')) {
      if(row.elm === index) {
        res.push(row);
      }
    }
  }
  return res;
}

function drawVisualization({profile, vrow, box}) {
  const {angleHor, generatrix, inner, outer, layer, bounds, pos} = box;
  const {sketch_view} = vrow.procedure.visualization;
  const pt = generatrix.getPointAt(vrow.len).subtract(generatrix.getNormalAt(vrow.len).multiply(15));
  let res = [];
  if(!sketch_view.length || sketch_view.find(v => v.kind.is('inner'))) {
    res.push(<Gltf
      key="inner"
      position={[pt.x, pos[1] - pt.y, 0]}
      rotation={[0, 0, degToRad(angleHor - 90)]}
    />);
  }
  if(sketch_view.find(v => v.kind.is('outer'))) {
    res.push(<Gltf
      key="outer"
      position={[pt.x, pos[1] - pt.y, -profile.thickness]}
      rotation={[0, 0, degToRad(angleHor - 90)]}
      scale={[1, 1, -1]}
    />);
  }
  return res;
}

export default function ProfileVisualisation({profile, pos}) {
  const {hidden, project} = profile;
  if(hidden) {
    return null;
  }
  const vrows = visualization(profile);
  let box;
  if(vrows.length) {
    const {angleHor, generatrix, inner, outer, layer: {layer, bounds}} = profile;
    box = {angleHor, generatrix, inner, outer, layer, bounds, pos};
    return vrows.map(vrow => drawVisualization({profile, vrow, box}));
  }
  return null;

}
