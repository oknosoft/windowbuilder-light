import React from 'react';
import ObjTabular from './ObjTabular';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';

const columns = [
  {key: "obj", name: "Объект", width: '*', renderCell: PresentationFormatter},
  {key: "power", name: "Мощность", width: 120, renderEditCell: NumberCell, renderCell: NumberFormatter}
];

export default function ObjPlan({tabRef, obj}) {
  return <ObjTabular tabRef={tabRef} tabular={obj.planning} columns={columns}/>;
}
