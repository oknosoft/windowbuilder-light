import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import PropField from '../../../../packages/ui/DataField/PropField';
import {GlassesDetail} from '../styled';

const {blank} = $p.utils;
// http://localhost:2222/doc/calc_order/82f1a0b0-fac8-11ed-bbc3-e1c5499d8d7a

export default function CompositeDetails({row, selected}) {
  const {characteristic, inset, glassRow} = row.row;
  const gprops = [];
  const rprops = [];

  // параметры изделия
  characteristic.params.find_rows({cnstr: 0, region: 0}, (prow) => {
    if(prow.param.is_calculated || prow.param.predefined_name === 'auto_align') {
      return;
    }
    gprops.push(<PropField key={`pr-${prow.row}`} obj={prow} inset={blank.guid} />);
  });

  // параметры вставки
  characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, (prow) => {
    gprops.push(<PropField key={`pr-${prow.row}`} obj={prow} inset={inset} />);
  });

  // параметры рёбер
  const rrows = [];

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid sm={12} md={5}>
      <FormGroup>{gprops}</FormGroup>
    </Grid>
    <Grid sm={12} md={5}>
      <FormGroup>{rprops}</FormGroup>
    </Grid>
  </GlassesDetail>;
}

