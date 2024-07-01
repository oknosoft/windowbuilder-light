import React from 'react';
import * as THREE from 'three';
import {profilesGeometry, profileExtrude} from './profileExtrude';
import {containersGeometry, containerExtrude} from './containerExtrude';

export default function Contour({layer, bounds, position, rotation, quaternion}) {

  const pos = [
    bounds.x - position.x,
    position.y + bounds.y + bounds.height,
    position.z + (layer.layer ? 12 : 0),
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
    res.push(<Contour key={`c-${contour.id}`} layer={contour} bounds={bounds} position={position} rotation={[0,0,0]} quaternion={[0, 0, 0, 1]}/>);
  }
  return <group rotation={rotation}>{res}</group>;
}
