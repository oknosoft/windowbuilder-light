import React from 'react';
import FieldSet from '@oknosoft/ui/DataField/FieldSet';
import RefField from '@oknosoft/ui/DataField/RefField';
import CurrentParams from './CurrentParams';
import FieldFurn from '../../DataField/Furn';
import HandleHeight from '../../DataField/HandleHeight';

const {furns} = $p.cat;
const openTypeMeta = furns.metadata('open_type');
const directionMeta = {};

export default function LayerPropsFurn({layer}) {
  const onChange = React.useMemo(() => () => {
    Promise.resolve().then(() => {
      layer.project.calculateSpec();
      layer.project.redraw();
    });
  }, [layer]);
  return layer?.level > 0 ? <FieldSet title="Свойства фурнитуры" defaultExpanded>
    <RefField obj={layer} fld="openType" meta={openTypeMeta} onChange={onChange} />
    <FieldFurn layer={layer} />
    <RefField obj={layer} fld="direction" meta={directionMeta} label="Напр. открывания" onChange={onChange}/>
    <HandleHeight layer={layer} meta={directionMeta} onChange={onChange}/>
    <CurrentParams params={layer.params} flat />
  </FieldSet> : null;
}
