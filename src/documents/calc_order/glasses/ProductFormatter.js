import React from 'react';
import Typography from '@mui/material/Typography';

const {builder} = $p.job_prm;

export default function ProductFormatter({row}) {
  const {characteristic, inset, glassRow} = row.row;
  const main = [];
  const other = [];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const {utils, CatCharacteristicsParamsRow} = $p;
    const debounced = utils.debounce(() => setIndex((i) => i + 1));
    const update = (curr, flds) => {
      if((curr === characteristic) || (curr instanceof CatCharacteristicsParamsRow && curr._owner?._owner === characteristic)) {
        debounced();
      }
    };
    characteristic._manager.on({update, specification_adjustment: update});
    return () => characteristic._manager.off({update, specification_adjustment: update});
  }, [characteristic]);

  if(inset.insert_type.is('composite')) {
    main.push(characteristic.owner.toString());
    const glrow = characteristic.glasses.find({elm: glassRow.elm});
    if(glrow) {
      main.push(glrow.formula);
      other.push(`${glrow.thickness.round(1)}мм`);
    }
    other.push(`${glassRow.s.round(3)}м²`);
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

  const hasErrors = characteristic.errors(true);
  return <>
    <Typography component="span" color={hasErrors ? 'error' : undefined}>{`${main.join(', ')}${other.length ? ',' : ''}\u00A0`}</Typography>
    <Typography component="span" variant="body2" color={hasErrors ? 'error' : 'primary'}>{other.join(', ')}</Typography>
  </>;
}
