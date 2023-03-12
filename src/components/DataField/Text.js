import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

export default function Text({obj, fld, meta, label, value, onChange, inputProps, fullWidth=true, ...other}) {
  if(!value && obj && fld) {
    value = obj[fld];
  }
  if(!label && meta) {
    label = meta.synonym;
  }
  //tooltip: fld_meta.tooltip
  const placeholder = meta?.placeholder;
  return <FormControl fullWidth={fullWidth} {...other}>
    <InputLabel>{label}</InputLabel>
    <Input
      inputProps={{placeholder, ...inputProps}}
      value={value}
      onChange={({target}) => onChange?.(target.value)}
    />
  </FormControl>;
}
