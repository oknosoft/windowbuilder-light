import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

export default function StyledInput ({inputProps, InputProps, InputLabelProps, id, label, placeholder, fullWidth, ...other}) {
  return <FormControl fullWidth={fullWidth} {...other}>
    <InputLabel {...InputLabelProps} filled>{label}</InputLabel>
    <Input placeholder={placeholder} inputProps={inputProps} {...InputProps} />
  </FormControl>;
}
