import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import {onKeyUp} from './enterTab';
import {autoFocusAndSelect} from './Number';

export default function Text({obj, fld, meta, label, labelProps, value, onChange, inputProps, fullWidth=true, enterTab, slotProps, ...other}) {
  if((typeof value !== 'string') && obj && fld) {
    value = obj[fld];
    if(inputProps?.type === 'date') {
      value = $p.utils.moment(value).format('YYYY-MM-DD');
    }
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
    onChange?.(value);
  };
  if(enterTab && !other.onKeyUp) {
    other.onKeyUp = onKeyUp;
  }
  return <FormControl fullWidth={fullWidth} {...other}>
    <InputLabel {...labelProps}>{label}</InputLabel>
    <Input
      inputProps={{placeholder, ...inputProps}}
      value={val}
      onChange={setValue}
      slotProps={slotProps}
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

export function TextCell({row, column, onRowChange, onClose}) {
  const obj = row instanceof $p.classes.TabularSectionRow ? row : row.row;
  const fld = column.key;
  const [value, setValue] = React.useState(obj[fld]);

  return <input
    ref={autoFocusAndSelect}
    className="rdg-text-editor tlmcuo07-0-0-beta-41"
    value={value}
    onChange={({target}) => {
      setValue(target.value);
    }}
    onKeyDown={(ev) => {
      const {key} = ev;
      if(key === 'Enter' || key === 'Tab') {
        obj[fld] = value;
        onRowChange(row instanceof $p.classes.TabularSectionRow ? row : {...row}, true);
        setValue(obj[fld]);
      }
    }}
  />;
}
