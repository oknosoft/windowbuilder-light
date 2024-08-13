import React from 'react';
import { PivotControls } from '@react-three/drei'
import { Geometry, Base, Subtraction } from '@react-three/csg'
import {useBuilderContext} from '../Context';
import RootLayer from './RootLayer';

export default function Planes() {
  const csg = React.useRef();
  const {editor, project} = useBuilderContext();
  return project ? project.contours.map((layer, ind) => <RootLayer key={`l-${ind}`} editor={editor} project={project} layer={layer}/>) : null;

}
