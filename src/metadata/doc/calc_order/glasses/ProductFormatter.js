import React from 'react';
import Typography from '@mui/material/Typography';

export default function ProductFormatter({row}) {
  const {characteristic, inset, glassRow} = row.row;
  const main = [];
  const other = [];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const {utils, CatCharacteristicsParamsRow} = $p;
    const update = utils.debounce(function update (curr, flds){
      if((curr === characteristic) || (curr instanceof CatCharacteristicsParamsRow && curr._owner?._owner === characteristic)) {
        setIndex((i) => i + 1);
      }
    });
    characteristic._manager.on({update});
    return () => characteristic._manager.off({update});
  }, [characteristic]);

  if(inset.insert_type.is('composite')) {
    main.push(characteristic.owner.toString());
    const glrow = characteristic.glasses.find({elm: glassRow.elm});
    if(glrow) {
      main.push(glrow.formula);
      other.push(`${glrow.thickness}мм`);
    }
    other.push(`${glassRow.s.toFixed(3)}м²`);
    other.push(`${characteristic.elm_weight(glassRow.elm).round(1)}кг`);
    other.push(characteristic.note);

    // параметры изделия
    characteristic.params.find_rows({cnstr: 0, region: 0}, ({param, value}) => {
      if(param.include_to_name || param.include_to_description) {
        main.push(value.toString());
      }
    });

  }
  else {
    const parts = characteristic.prod_name2({elm: glassRow.elm, cnstr: glassRow.cnstr});
    main.push(...parts.main);
    other.push(...parts.other);
  }


  return <>
    <Typography component="span">{`${main.join(', ')}${other.length ? ',' : ''}\u00A0`}</Typography>
    <Typography component="span" variant="body2" color="primary">{other.join(', ')}</Typography>
  </>;
}
