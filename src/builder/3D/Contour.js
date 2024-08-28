import React from 'react';
import * as THREE from 'three';
import {BBAnchor, Html} from '@react-three/drei'
import {profilesGeometry, profileExtrude} from './profileExtrude';
import {containersGeometry, containerExtrude} from './containerExtrude';

export default function Contour({layer, bounds, position}) {
  const {three, hidden} = layer;
  if(!bounds) {
    bounds = layer.bounds;
  }
  if(!position) {
    position = three.calculatedPosition;
  }
  const rotation= three.rotation.toArray();
  const pos = [
    bounds.x,
    bounds.y + bounds.height,
  ];

  const res = [];
  if(!layer.layer && !hidden) {
    res.push(<BBAnchor anchor={[1, 1, 1]} position={[60, 90, 40]}>
      <Html center>
        <span>{`L${layer._index}`}</span>
      </Html>
    </BBAnchor>);
  }

  const profiles = profilesGeometry(layer.profiles, pos);
  const containers = containersGeometry(layer.containers, pos);

  for(const [profile] of profiles) {
    res.push(profileExtrude(profile, profiles, hidden));
  }
  for(const [container] of containers) {
    res.push(containerExtrude(container, containers));
  }
  for(const contour of layer.contours) {
    res.push(<Contour key={`c-${contour.id}`} layer={contour} bounds={bounds} position={new THREE.Vector3()}/>);
  }
  for(const contour of three.children) {
    res.push(<Contour key={`c-${contour.id}`} layer={contour} />);
  }
  return (!three.bindable || three.bind.is('right') || three.bind.is('top')) ?
    <group position={[position.x, position.y, position.z + (layer.layer ? 14 : 0)]} rotation={rotation}>{res}</group> :
    <group rotation={rotation}>
      <group position={[position.x, position.y, position.z + (layer.layer ? 14 : 0)]}>{res}</group>
    </group>;
}
