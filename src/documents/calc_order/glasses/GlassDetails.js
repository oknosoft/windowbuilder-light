import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import TextField from 'metadata-ui/DataField/Text';
import ParamField from 'metadata-ui/DataField/ParamField';
import {GlassesDetail} from '../../../aggregate/Toolbars/styled';
import scale_svg from '../../../aggregate/AppLoad/scale_svg';
import {CustomSizes, custom_sizes} from './CustomSizes';


export default function GlassDetails({row, selected, glob}) {
  const {characteristic, inset, glassRow, editor} = row.row;
  const gprops = [];
  const readOnly = editor.project.is_read_only;
  const rprops = [<TextField key="note" obj={row.row} fld="note" onChange={(v) => characteristic.note = v} readOnly={readOnly} enterTab/>];
  if(custom_sizes) {
    rprops.push(<CustomSizes characteristic={characteristic} elm={glassRow.elm} readOnly={readOnly} enterTab/>);
  }

  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const {CatCharacteristicsParamsRow, cat: {characteristics}, utils} = $p;
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

    function update (curr, flds){
      if(curr instanceof CatCharacteristicsParamsRow &&
          curr._owner._owner === characteristic && kb.shift && curr.cnstr < 0 && !kb.rows.has(curr)) {

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
        setTimeout(() => {
          kb.rows.clear();
          setIndex((i) => i + 1);
        }, 100);
      }
    }

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
    if(prow.param.predefined_name !== 'auto_align') {
      gprops.push(<ParamField key={`pr-${prow.row}-${inset.ref}`} obj={prow} inset={inset} readOnly={readOnly}/>);
    }
  });
  // параметры вставки
  characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, (prow) => {
    if(prow.param !== custom_sizes) {
      gprops.push(<ParamField key={`pr-${prow.row}-${inset.ref}`} obj={prow} inset={inset} readOnly={readOnly}/>);
    }
  });
  // параметры рёбер
  const rrows = [];
  characteristic.coordinates.find_rows({cnstr: glassRow.cnstr, elm_type: 'Рама'}, (rrow) => {
    rrows.push(rrow);
  });
  characteristic.params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, (prow) => {
    const profile = editor.elm(-prow.cnstr);
    rprops.push(<ParamField
      key={`pr-${prow.row}-${index}`}
      obj={prow}
      inset={rrows.find((rrow) => rrow.elm === -prow.cnstr).inset}
      label={`${prow.param.caption || prow.param.name} ${profile.pos.name} ${profile.angle_hor.round(2)}°`}
      readOnly={readOnly}
    />);
  });

  const {svg} = characteristic;

  return <GlassesDetail container spacing={2} selected={selected}>
    <Grid size={{sm: 12, md: 5}}>
      <FormGroup>{gprops}</FormGroup>
    </Grid>
    <Grid size={{sm: 12, md: 5}}>
      <FormGroup>{rprops}</FormGroup>
    </Grid>
    <Grid size={{sm: 4, md: 2}}>
      <div style={{marginLeft: 16, marginTop: 16}} dangerouslySetInnerHTML={{__html: svg ? scale_svg(svg, {height: 150, width: 180, zoom: 0.6}, 0) : ''}}/>
    </Grid>
  </GlassesDetail>;
}
