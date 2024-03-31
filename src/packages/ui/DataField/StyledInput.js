import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

export default function StyledInput ({inputProps, InputProps, InputLabelProps, labelProps, id, label, placeholder, fullWidth, ...other}) {
  return <FormControl fullWidth={fullWidth} {...other}>
    <InputLabel {...InputLabelProps} {...labelProps} filled>{label}</InputLabel>
    <Input placeholder={placeholder} inputProps={inputProps} {...InputProps} />
  </FormControl>;
}

export function CellInput ({inputProps: {className, ...inputProps}, InputProps, id, placeholder, fullWidth, ...other}) {
  inputProps.className = `rdg-text-editor tlmcuo07-0-0-beta-41 ${className}`;
  return <Input
    classes={{root: "cell-input"}}
    placeholder={placeholder}
    inputProps={inputProps}
    {...InputProps}
  />;
}
