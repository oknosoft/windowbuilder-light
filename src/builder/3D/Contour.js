import React from 'react';
import * as THREE from 'three';
import {profilesGeometry, profileExtrude} from './profileExtrude';
import {containersGeometry, containerExtrude} from './containerExtrude';

export default function Contour({layer, bounds}) {

  const pos = [
    0,
    0,
    layer.layer ? 12 : 0,
  ];
  const profiles = profilesGeometry(layer.profiles, bounds, pos);
  const containers = containersGeometry(layer.containers, bounds, pos);
  const ref = React.useRef();

  const rotate = () => {
    const {current} = ref;
    if(current) {
      if(current.rotation.y < -2.2) {
        ref.sign = 1;
      }
      else if(current.rotation.y > -0.01) {
        ref.sign = -1;
      }
      current.rotation.y += ref.sign * 0.003;
    }
    requestAnimationFrame(rotate, 50);
  }

  // if(pos[2]) {
  //   setTimeout(rotate, 1000);
  // }

  const res = [];
  for(const [profile] of profiles) {
    res.push(profileExtrude(profile, profiles));
  }
  for(const [container] of containers) {
    res.push(containerExtrude(container, containers));
  }
  for(const contour of layer.contours) {
    res.push(<Contour key={`c-${contour.id}`} layer={contour} bounds={bounds} />);
  }
  return <group ref={ref} >{res}</group>;
}
