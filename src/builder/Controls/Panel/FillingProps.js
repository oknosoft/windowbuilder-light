import React from 'react';
import FieldInsetProfile from '../../DataField/InsetProfile';

const {dp, utils} = $p;
export const {fields} =  dp.builderPen.metadata();

export default function FillingProps({layer, elm}) {
  return <>
    {`Заполнение ${elm.index}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
  </>;
}
