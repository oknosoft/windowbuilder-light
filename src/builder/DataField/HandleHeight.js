import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';

const label = 'Высота ручки';

export default function HandleHeight({layer, meta, onChange}) {
 return <NumberField
   obj={layer}
   fld="handleHeight"
   meta={meta}
   onChange={onChange}
   label={label}
   disabled={Boolean(layer.handleFix)}
 />;
}
