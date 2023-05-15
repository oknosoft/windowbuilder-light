import React from 'react';
import Typography from '@mui/material/Typography';

export default function ProductFormatter({row}) {
  const {characteristic, inset, glassRow} = row.row;
  const main = [];
  const other = [];
  // параметры изделия
  characteristic.params.find_rows({cnstr: 0, region: 0}, ({value}) => {
    main.push(value.toString());
  });
  // параметры вставки
  characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, ({param, value}) => {
    if(param.type.types.includes('boolean')) {
      if(value) {
        other.push(param.caption || param.name);
      }
    }
    else if(value) {
      other.push(value.toString());
    }
  });

  // параметры рёбер
  const rrows = [];
  characteristic.coordinates.find_rows({cnstr: glassRow.cnstr, elm_type: 'Рама'}, (rrow) => {
    rrows.push(rrow);
  });
  const rprops = new Set();
  characteristic.params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, ({value}) => {
    if(!value.empty() && value.toString() !== 'Нет') {
      rprops.add(value.toString());
    }
  });
  for(const rp of rprops) {
    other.push(rp);
  }
  return <>
    <Typography component="span">{`${main.join(', ')}\u00A0`}</Typography>
    <Typography component="span" variant="body2" color="primary">{other.join(', ')}</Typography>
  </>;
}
