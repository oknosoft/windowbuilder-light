
import * as THREE from 'three';

import ramaShape from './ramaShape';
import impostShape from './impostShape';

function profilePath(profile, bounds) {
  const {b, e} = profile;
  const y = bounds.height + bounds.top;
  const v1 = new THREE.Vector3(b.point.x, (y - b.point.y), 0);
  const v2 = new THREE.Vector3(e.point.x, (y - e.point.y), 0);
  const path = new THREE.CurvePath();
  path.add( new THREE.LineCurve3( v1, v2 ) );
  return path;
}

export default function profileExtrude(profile, bounds) {

  const extrudeSettings = {
    steps: 10,
    bevelEnabled: false,
    extrudePath: profilePath(profile, bounds),
  };

  return {
    geometry: new THREE.ExtrudeGeometry(profile.b.isT ? impostShape : ramaShape, extrudeSettings),
    material: new THREE.MeshLambertMaterial({color: 0xbbffee, wireframe: false}),
  };
}
