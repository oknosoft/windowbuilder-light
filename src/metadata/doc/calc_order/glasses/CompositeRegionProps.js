import React from 'react';
import Typography from '@mui/material/Typography';
import ParamField from '../../../../packages/ui/DataField/ParamField';
import RefField from '../../../../packages/ui/DataField/RefField';

export default function CompositeRegionProps({elm, glRow}) {
  if (!glRow) {
    return <Typography variant="h5">
      <small>{'Параметры ряда:\xA0'}</small>
      {`Ряд не выбран`}
    </Typography>;
  }
  const {inset} = glRow;
  const obj = elm.region(glRow);
  const {fields} = obj._metadata;
  const {clr} = fields;
  $p.cat.clrs.selection_exclude_service(clr, inset, elm.ox);

  const content = [
    <Typography variant="h5">
      <small>{'Параметры ряда:\xA0'}</small>
      {inset.name}
    </Typography>,
    <RefField key={`clr-${inset.ref}-${glRow.row}`} obj={obj} fld="clr" meta={clr} />
  ];

  for (const prm of inset.used_params()) {
    if(!prm.is_calculated) {
      const {ref} = prm;
      content.push(<ParamField key={`${ref}-${glRow.row}`} obj={obj} fld={ref} param={prm} inset={inset} meta={fields[ref]}/>);
    }
  }
  return <div style={{
    display: 'flex',
    flexDirection: 'column'
  }}>
    {content}
  </div>;

}
