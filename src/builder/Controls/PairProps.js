import React from 'react';
import ManyProps from './ManyProps';

export default function PairProps(props) {
  let {elm: [elm1, elm2], layer, editor, project} = props;
  // у пары заполнений, команды такие же, как у кучи
  if(elm1 instanceof editor.Filling && elm2 instanceof editor.Filling) {
    return <ManyProps {...props}/>;
  }
  if(elm1 instanceof editor.GeneratrixElement && elm2 instanceof editor.GeneratrixElement) {
    // это пара профилей
    if(elm2.nearest === elm1) {
      [elm1, elm2] = [elm2, elm1];
    }
    if(elm1.nearest === elm2) {
      return <>
        {`примыкающие профили`}
      </>;
    }
    let node1, node2;
    for(const node of 'be') {
      if(!node1 && elm1[node].profile === elm2 || elm1[node].profileOuter === elm2) {
        node1 = node;
      }
      if(!node2 && elm2[node].profile === elm1 || elm2[node].profileOuter === elm1) {
        node2 = node;
      }
    }
    if(node1 && node2) {
      return <>
        {`угловое соединение профилей`}
      </>;
    }
    if(node1 || node2) {
      return <>
        {`T-образное соединение профилей`}
      </>;
    }
    return <>
       {`профили без соединений`}
    </>;
  }
  if(elm2 instanceof editor.Filling) {
    [elm1, elm2] = [elm2, elm1];
  }
  return <>
    {`Ребро заполнения`}
  </>;
}
