import React from 'react';
import RefField from '@oknosoft/ui/DataField/RefField';

const {fields} =  $p.dp.builderPen.metadata();

export default function ProfileProps({layer, elm, node}) {
  const {b, e} = elm;
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <RefField obj={elm} fld="inset" meta={fields.inset}/>
  </>;
}
