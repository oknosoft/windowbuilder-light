import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from 'metadata-ui/DataField/Text';
import ParamField from '../../../../packages/ui/DataField/ParamField';
import {GlassesDetail} from '../../../aggregate/styled';


export default function GlassDetails({row, selected, glob}) {
  const {characteristic, inset, glassRow} = row.row;
  const gprops = [];
  const rprops = [<TextField key="note" obj={row.row} fld="note" onChange={(v) => characteristic.note = v}/>];

  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const {utils, CatCharacteristicsParamsRow, cat: {characteristics}} = $p;
    let kb = {shift: false, rows: new Set()};

    function keydown({altKey, shiftKey}) {
      if(altKey || shiftKey) {
        kb.shift = true;
      }
    }

    function keyup({altKey, shiftKey}) {
      if(!altKey && !shiftKey) {
        kb.shift = false;
      }
    }

    const update = utils.debounce(function update (curr, flds){
      if(curr instanceof CatCharacteristicsParamsRow && curr._owner._owner === characteristic) {

        const fin = () => {
          kb.rows.clear();
          setIndex((i) => i + 1);
        };

        if(kb.shift && curr.cnstr < 0 && !kb.rows.has(curr)) {
          kb.shift = false;
          kb.rows.add(curr);
          const value = curr.value?.valueOf();
          curr._owner.find_rows({
            inset: curr.inset,
            param: curr.param,
            region: curr.region,
          }, (row) => {
            kb.rows.add(row);
            row._obj.value = value;
          });
        }

        const {project} = row.row.editor;
        project.redraw();
        project.save_coordinates({})
          .then(fin)
          .catch(fin);
      }
    });
    characteristics.on({update});
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    return () => {
      characteristics.off({update});
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
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
      key={`pr-${prow.row}-${index}`}
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
