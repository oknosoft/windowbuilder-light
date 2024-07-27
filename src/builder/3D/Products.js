import React from 'react';
import { PivotControls } from '@react-three/drei'
import { Geometry, Base, Subtraction } from '@react-three/csg'
import {useBuilderContext} from '../Context';
import Product from './Product';

export default function Products() {
  const csg = React.useRef();
  const context = useBuilderContext();
  const {editor} = context;
  if(!editor) {
    return null;
  }
  return editor.projects.map((project, ind) => <Product key={`prod-${ind}`} editor={editor} project={project} />);

}
