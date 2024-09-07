import React from 'react';
import FieldSet from '@oknosoft/ui/DataField/FieldSet';
import RefField from '@oknosoft/ui/DataField/RefField';

const {furns} = $p.cat;
const openTypeMeta = furns.metadata('open_type');
const directionMeta = {};

export default function LayerPropsFurn({layer}) {
  return layer?.layer ? <FieldSet title="Свойства фурнитуры" defaultExpanded>
    <RefField obj={layer} fld="openType" meta={openTypeMeta} />
    <RefField obj={layer} fld="direction" meta={directionMeta} label="Напр. открывания" />
  </FieldSet> : null;
}
