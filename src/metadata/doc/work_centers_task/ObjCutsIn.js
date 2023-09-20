import React from 'react';
import ObjTabular from './ObjTabular';
import {NumberCell, NumberFormatter} from '../../../packages/ui/DataField/Number';
import {PresentationFormatter} from '../../../packages/ui/DataField/RefField';

const columns = [
  {key: "obj", name: "Объект", width: '*', renderCell: PresentationFormatter},
  {key: "power", name: "Мощность", width: 120, renderEditCell: NumberCell, renderCell: NumberFormatter}
];

export default function ObjCutsIn({tabRef, obj}) {
  return <ObjTabular tabRef={tabRef} tabular={obj.planning} columns={columns}/>;
}
