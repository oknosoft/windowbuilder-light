import React, { useRef, useState } from 'react';
import {Edges} from '@react-three/drei';
import Gltf from './Gltf';

function visualization(profile) {
  const {layer, index} = profile;
  const res = [];
  for(const row of layer.specification.procedures) {
    const {procedure} = row;
    if(!procedure.visualization.empty() && procedure.visualization.name.includes('Ручка')) {
      if(row.elm === index) {
        res.push(row);
      }
    }
  }
  return res;
}

function drawVisualization(profile, vrow) {
  return <Gltf />;
}

export default function ProfileVisualisation({profile, cut}) {
  const {hidden, project} = profile;
  if(hidden) {
    return null;
  }
  const vrows = visualization(profile);
  const edges = cut ? <Edges key={`e-${project.props.stamp}`} color="grey" /> : <Edges color="grey" />;
  if(!vrows.length) {
    return edges;
  }
  return <>
    {edges}
    {vrows.map(vrow => drawVisualization(profile, vrow))}
  </>;

}
