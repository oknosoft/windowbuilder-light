import React from 'react';
import {useBuilderContext} from '../Context';
import Contour from './Contour';

export default function Product() {
  const context = useBuilderContext();
  const {editor} = context;
  if(!editor) {
    return null;
  }
  const {bounds} = editor.project;
  return editor.project.contours.map((layer) => <Contour key={`c-${layer.id}`} layer={layer} bounds={bounds}/>);
}
