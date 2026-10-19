import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import {onKeyUp} from 'metadata-ui/DataField/enterTab';

export const {custom_sizes} = $p.job_prm.properties;
const label = custom_sizes?.name || 'Размеры заготовки';
const placeholder = 'Задаваемые пользователем размеры';

export function CustomSizes({characteristic, elm, onChange, inputProps, labelProps, fullWidth=true, enterTab, slotProps, ...other}) {
  const prow = characteristic.params.find({cnstr: -elm, region: 0, param: custom_sizes});
  const value = prow?.value || '';

  const [val, setVal] = React.useState(value);
  const setValue = ({target: {value}}) => {
    if(value) {
      value = value.replace(/х|\*|X|Х/g, 'x');
      if(prow) {
        prow.value = value;
      }
      else {
        characteristic.params.add({cnstr: -elm, region: 0, param: custom_sizes, value});
      }
    }
    else {
      if(prow) {
        characteristic.params.del(prow);
      }
    }
    setVal(value);
    onChange?.(value);
  };
  if(enterTab && !other.onKeyUp) {
    other.onKeyUp = onKeyUp;
  }
  return <FormControl fullWidth={fullWidth} {...other}>
    {inputProps?.label?.show === false ? null : <InputLabel {...labelProps}>{label}</InputLabel>}
    <Input
      inputProps={{placeholder, ...inputProps}}
      value={val}
      onChange={setValue}
      slotProps={slotProps}
    />
  </FormControl>;
}

