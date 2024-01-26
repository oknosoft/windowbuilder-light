import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '../../../../packages/ui/DataField/Text';
import ParamField from '../../../../packages/ui/DataField/ParamField';
import {GlassesDetail} from '../../../aggregate/styled';


export default function GlassDetails({row, selected, glob}) {
  const {characteristic, inset, glassRow} = row.row;
  const gprops = [];
  const rprops = [<TextField
    obj={row.row}
    fld="note"
    onChange={(v) => characteristic.note = v}
  />];

  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const {utils, CatCharacteristicsParamsRow} = $p;
    const update = utils.debounce(function update (curr, flds){
      if(curr instanceof CatCharacteristicsParamsRow && curr._owner._owner === characteristic) {
        const {project} = row.row.editor;
        project.redraw();
        project.save_coordinates({})
          .then(() => {
            // const pkey = row.key - 1000;
            // const parent = glob.rows.find(({key}) => key === pkey);
            setIndex((i) => i + 1);
          });
      }
    });
    characteristic._manager.on({update});
    return () => characteristic._manager.off({update});
  }, [characteristic]);

  // параметры изделия
  characteristic.params.find_rows({cnstr: 0, region: 0}, (prow) => {
    gprops.push(<ParamField key={`pr-${prow.row}-${inset.ref}`} obj={prow} inset={inset} />);
  });
  // параметры вставки
  characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, (prow) => {
    gprops.push(<ParamField key={`pr-${prow.row}-${inset.ref}`} obj={prow} inset={inset} />);
  });
  // параметры рёбер
  const rrows = [];
  characteristic.coordinates.find_rows({cnstr: glassRow.cnstr, elm_type: 'Рама'}, (rrow) => {
    rrows.push(rrow);
  });
  characteristic.params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, (prow) => {
    rprops.push(<ParamField
      key={`pr-${prow.row}`}
      obj={prow}
      inset={rrows.find((rrow) => rrow.elm === -prow.cnstr).inset}
      label={`${prow.param.caption || prow.param.name} ${-prow.cnstr}`}
    />);
  });

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid sm={12} md={5}>
      <FormGroup>{gprops}</FormGroup>
    </Grid>
    <Grid sm={12} md={5}>
      <FormGroup>{rprops}</FormGroup>
    </Grid>
  </GlassesDetail>;
}
