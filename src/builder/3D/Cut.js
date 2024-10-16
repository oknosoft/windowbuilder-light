import React from 'react';
import * as THREE from 'three';

export default function cutGeometry({activeCut}) {
  if(activeCut) {
    // extrudePath - вдоль него, будем выдавливать - нормаль к профилю сечения
    const {generatrix, project: {bounds, _scope}} = activeCut;
    const dy = bounds.y + bounds.height;
    const l2 = generatrix.length / 2;
    const w2 = 200;
    const {point, normal} = generatrix.getLocationAt(l2);
    point.y = dy - point.y;
    normal.y *= -1;
    const p2 = point.add(normal.multiply(6000));
    const v1 = new THREE.Vector3(point.x, point.y,  0);
    const v2 = new THREE.Vector3(p2.x, p2.y,  0);
    const extrudePath = new THREE.CurvePath();
    extrudePath.add( new THREE.LineCurve3( v1, v2 ) );

    const shape = new THREE.Shape();
    shape.moveTo(-w2, -l2);
    shape.lineTo(-w2, l2);
    shape.lineTo(w2, l2);
    shape.lineTo(w2, -l2);
    shape.lineTo(-w2, -l2);

    const extrudeSettings = {
      steps: 2,
      bevelEnabled: false,
      extrudePath,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }
  return null;
}
