import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';

const meta = {};

export default function DimensionProps({elm}) {

  const sizeChange = () => {
    elm.szMsg({wnd: elm, name: 'auto', size: elm.size});
  };

  return <>
    {`Линия размера ${elm.index}`}
    <NumberField obj={elm} fld="offset" meta={meta} label="Смещение" />
    <NumberField obj={elm} fld="size" meta={meta} onChange={sizeChange} label="Размер" />
  </>;
}
