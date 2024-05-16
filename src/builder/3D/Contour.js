import React from 'react';
import profileExtrude from './ProfileExtrude';
import {Edges} from '@react-three/drei'

export default function Contour({layer, bounds}) {

  const res = [];
  for(const profile of layer.profiles) {
    res.push(<mesh key={`p-${profile.elm}`} {...profileExtrude(profile, bounds)}>
      <Edges color="grey" />
    </mesh>);
  }
  return res;
}
