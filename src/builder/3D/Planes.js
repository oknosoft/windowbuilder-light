import React from 'react';
import * as THREE from 'three';
import {useBuilderContext} from '../Context';
import RootLayer from './RootLayer';
import cutGeometry from './Cut';

export default function Planes() {
  const {editor, project} = useBuilderContext();
  if(project) {
    const cut = cutGeometry(project);
    const res = project.contours
      .filter((layer) => !layer.three.parent && layer.visible)
      .map((layer, ind) => <RootLayer key={`l-${ind}`} editor={editor} project={project} layer={layer} cut={cut}/>);
    if(cut) {
      // const material = new THREE.MeshLambertMaterial({
      //   color: 0xddeeee,
      //   wireframe: false,
      //   transparent: true,
      //   opacity: 0.3,
      // });
      // res.push(<mesh key={`p-cut`} geometry={cut} material={material} />);
    }
    return res;
  }
  return null;


}
