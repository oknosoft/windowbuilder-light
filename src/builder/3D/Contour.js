import React from 'react';
import {profilesGeometry, profileExtrude} from './profileExtrude';
import {containersGeometry, containerExtrude} from './containerExtrude';

export default function Contour({layer, bounds}) {

  const profiles = profilesGeometry(layer.profiles, bounds);
  const containers = containersGeometry(layer.containers, bounds);

  const res = [];
  for(const [profile] of profiles) {
    res.push(profileExtrude(profile, profiles));
  }
  for(const [container] of containers) {
    res.push(containerExtrude(container, containers));
  }
  return res;
}
