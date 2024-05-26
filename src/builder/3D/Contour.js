import React from 'react';
import {profilesGeometry, profileExtrude} from './ProfileExtrude';

export default function Contour({layer, bounds}) {

  const profiles = profilesGeometry(layer.profiles, bounds);

  const res = [];
  for(const [profile] of profiles) {
    res.push(profileExtrude(profile, profiles));
  }
  return res;
}
