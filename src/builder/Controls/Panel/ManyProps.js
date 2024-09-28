import React from 'react';
import FieldInsetProfileGrp from '../../DataField/InsetProfileGrp';
import {fields} from './ProfileProps';

export default function PairProps({elm}) {
  return <>
    {`Группа элементов`}
    <FieldInsetProfileGrp obj={elm} fld="inset" meta={fields.inset}/>
  </>;
}
