import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import ParamField from '../../../../packages/ui/DataField/ParamField';
import RefField from '../../../../packages/ui/DataField/RefField';
import {GlassesDetail} from '../../../_common/styled';
import CompositeGrid from './CompositeGrid';

const {blank} = $p.utils;
// http://localhost:2222/doc/calc_order/82f1a0b0-fac8-11ed-bbc3-e1c5499d8d7a

export default function CompositeDetails({row, selected}) {
  const {characteristic, inset, glassRow, editor} = row.row;
  const elm = editor.elm(glassRow.elm);
  const {fields} = elm.__metadata(false);

  fields.inset.list = [elm.inset];
  const gprops = [
    <RefField
      key={`inset`}
      obj={elm}
      fld="inset"
      meta={fields.inset}
      //handleValueChange={() => this.set_row(null)}
    />
  ];
  const rprops = [];

  // параметры изделия
  characteristic.params.find_rows({cnstr: 0, region: 0}, (prow) => {
    if(prow.param.is_calculated || prow.param.predefined_name === 'auto_align') {
      return;
    }
    gprops.push(<ParamField key={`pr-${prow.row}`} obj={prow} />);
  });

  // параметры заполнения
  for(const {ref} of elm.elm_props()) {
    gprops.push(<ParamField key={ref} obj={elm} fld={ref} meta={fields[ref]}/>);
  }

  // параметры рёбер - пока пропускаем
  const rrows = [];

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid sm={12} md={5}>
      <FormGroup>{gprops}</FormGroup>
      <CompositeGrid elm={elm} />
    </Grid>
    <Grid sm={12} md={5}>
      <FormGroup>{rprops}</FormGroup>
    </Grid>
  </GlassesDetail>;
}
