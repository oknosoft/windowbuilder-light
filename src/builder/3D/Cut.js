import React from 'react';
import * as THREE from 'three';

export default function cutGeometry({activeCut}) {
  if(activeCut) {
    const geometry = new THREE.BoxGeometry(2000, 1000, 1000);
    geometry.translate(500,1500 - activeCut.b.point.y,0 );
    return geometry;
  }
  return null;
}
