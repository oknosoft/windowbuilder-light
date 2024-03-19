import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import ParamField from '../../../../packages/ui/DataField/ParamField';
import RefField from '../../../../packages/ui/DataField/RefField';
import TextField from '../../../../packages/ui/DataField/Text';
import {GlassesDetail} from '../../../aggregate/styled';
import CompositeGrid from './CompositeGrid';
import CompositeRegionProps from './CompositeRegionProps';

const {blank} = $p.utils;
// http://localhost:2222/doc/calc_order/82f1a0b0-fac8-11ed-bbc3-e1c5499d8d7a

export default function CompositeDetails({row, selected}) {
  const {characteristic, inset, glassRow, editor} = row.row;
  const elm = editor.elm(glassRow.elm);
  const {fields} = elm.__metadata(false);

  const [index, setIndex] = React.useState(0);
  React.useEffect(function prompt() {
    function update (curr, flds){
      if(flds?.inset && curr?._owner?._owner === characteristic) {
        setIndex((index) => index+1);
      }
    }
    characteristic._manager.on({update});
    return () => {
      characteristic._manager.off({update});
    };
  }, [characteristic]);

  fields.inset.list = [elm.inset];
  const gprops = [];

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

  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const rows = [];
  elm.ox.glass_specification.find_rows({elm: elm.elm}, (row) => {
    rows.push(row);
  });
  const glKey = Array.from(selectedRows)[0];
  const glRow = glKey !== undefined && rows.find((row) => row.row === glKey);
  //const glInset = glRow ? glRow.inset : null;

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid sm={12} md={5}>
      <FormGroup>
        <RefField
          obj={elm}
          fld="inset"
          meta={fields.inset}
          //handleValueChange={() => this.set_row(null)}
        />
        <TextField
          obj={row.row}
          fld="note"
          onChange={(v) => characteristic.note = v}
        />
      </FormGroup>
    </Grid>
    <Grid sm={12} md={5} style={{borderBottom: '1px gray dashed'}}>
      <FormGroup>{gprops}</FormGroup>
    </Grid>
    <Grid sm={12} md={5}>
      <CompositeGrid
        elm={elm}
        glRow={glRow}
        rows={rows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </Grid>
    <Grid sm={12} md={5}>
      <CompositeRegionProps
        elm={elm}
        glRow={glRow}
        index={index}
      />
    </Grid>
  </GlassesDetail>;
}

