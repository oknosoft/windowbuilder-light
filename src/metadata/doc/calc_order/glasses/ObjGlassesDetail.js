import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import CellExpanderFormatter from './CellExpanderFormatter';
import PropField from '../../../../packages/ui/DataField/PropField';
import {useSelectedContext} from './selectedContext';
import {GlassesDetail} from '../styled';

export default function ObjGlassesDetail({ row, tabIndex, isCellEditable, onRowChange }) {
  if (row.type === 'DETAIL') {
    return Details(row);
  }

  return (
    <CellExpanderFormatter
      expanded={row.expanded}
      tabIndex={tabIndex}
      onCellExpand={() => onRowChange({ ...row, expanded: !row.expanded })}
    />
  );
}

const options = [{ref: 1, name: 'Без обработки'}, {ref: 2, name: 'Фаска'}];
function Details(row) {
  const {characteristic, inset, glassRow} = row.row;
  const gprops = [];
  const rprops = [];
  // параметры изделия
  characteristic.params.find_rows({cnstr: 0, region: 0}, (prow) => {
    gprops.push(<PropField key={`pr-${prow.row}`} obj={prow} inset={inset} />);
  });
  // параметры вставки
  characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, (prow) => {
    gprops.push(<PropField key={`pr-${prow.row}`} obj={prow} inset={inset} />);
  });
  // параметры рёбер
  const rrows = [];
  characteristic.coordinates.find_rows({cnstr: glassRow.cnstr, elm_type: 'Рама'}, (rrow) => {
    rrows.push(rrow);
  });
  characteristic.params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, (prow) => {
    rprops.push(<PropField
      key={`pr-${prow.row}`}
      obj={prow}
      inset={rrows.find((rrow) => rrow.elm === -prow.cnstr).inset}
      label={`${prow.param.caption || prow.param.name} ${-prow.cnstr}`}
    />);
  });

  const selected = useSelectedContext() === row.key;

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid sm={12} md={5}>
      <FormGroup>{gprops}</FormGroup>
    </Grid>
    <Grid sm={12} md={5}>
      <FormGroup>{rprops}</FormGroup>
    </Grid>
  </GlassesDetail>;
}
