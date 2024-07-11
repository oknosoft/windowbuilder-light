import React from 'react';
import * as THREE from 'three';
import {profilesGeometry, profileExtrude} from './profileExtrude';
import {containersGeometry, containerExtrude} from './containerExtrude';

export default function Contour({layer, bounds, position, rotation}) {

  const pos = [
    bounds.x,
    bounds.y + bounds.height,
  ];

  const profiles = profilesGeometry(layer.profiles, pos);
  const containers = containersGeometry(layer.containers, pos);

  const res = [];
  for(const [profile] of profiles) {
    res.push(profileExtrude(profile, profiles));
  }
  for(const [container] of containers) {
    res.push(containerExtrude(container, containers));
  }
  for(const contour of layer.contours) {
    res.push(<Contour key={`c-${contour.id}`} layer={contour} bounds={bounds} position={new THREE.Vector3()}/>);
  }
  return <group position={[position.x, position.y, position.z + (layer.layer ? 14 : 0)]} rotation={rotation}>{res}</group>;
}
