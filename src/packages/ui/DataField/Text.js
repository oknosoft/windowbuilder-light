import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

export default function Text({obj, fld, meta, label, value, onChange, inputProps, fullWidth=true, ...other}) {
  if((typeof value !== 'string') && obj && fld) {
    value = obj[fld];
  }
  if(!meta && obj && fld) {
    meta = obj._metadata(fld);
  }
  if(!label && meta) {
    label = meta.synonym;
  }
  if(!other.tooltip && meta?.tooltip) {
    other.tooltip = meta.tooltip;
  }
  if(meta?.read_only) {
    other.readOnly = true;
  }
  const placeholder = meta?.placeholder;
  const [val, setVal] = React.useState(value);
  const setValue = ({target: {value}}) => {
    if(obj && fld) {
      obj[fld] = value;
      setVal(value);
    }
    onChange?.(value)
  };
  return <FormControl fullWidth={fullWidth} {...other}>
    <InputLabel>{label}</InputLabel>
    <Input
      inputProps={{placeholder, ...inputProps}}
      value={val}
      onChange={setValue}
    />
  </FormControl>;
}

export function TextFormatter({row, column}) {

  const obj = row instanceof $p.classes.TabularSectionRow ? row : row.row;

  const [value, setValue] = React.useState(obj[column.key]);

  React.useEffect(() => {
    function update (curr, flds){
      if(obj.equals?.(curr) || curr === obj || curr === obj?._owner?._owner) {
        setValue(obj[column.key]);
      }
    }
    obj._manager.on({update, rows: update});
    return () => {
      obj._manager.off({update, rows: update});
    };
  }, [obj, column.key]);

  return value;
}
