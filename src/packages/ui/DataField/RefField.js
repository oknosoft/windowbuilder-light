import React from 'react';
import Autocomplete from './Autocomplete';

export default function RefField({obj, fld, meta, label, onChange, fullWidth=true, ...other}) {

  let [value, setValue] = React.useState();
  if(value === undefined && obj && fld) {
    value = obj[fld];
  }
  if(!meta && obj && fld) {
    meta = obj._metadata(fld);
  }
  if(!label && meta) {
    label = meta.synonym;
  }

  const options = React.useMemo(() => {
    let mgr = obj._manager.value_mgr(obj, fld, meta.type);
    if(Array.isArray(meta.list)) {
      const {utils} = $p;
      return meta.list.map((v) => utils.is_data_obj(v) ? v : mgr.get(v));
    }
    const res = [];
    const elmOnly = meta.choice_groups_elm === 'elm';
    for(const {name, path} of (meta.choice_params || [])) {
      if(name === 'ref' && Array.isArray(path.in)) {
        mgr = path.in;
        break;
      }
    }
    for(const o of mgr) {
      if(elmOnly && o.is_folder) {
        continue;
      }
      res.push(o);
    }
    return res;
  }, [obj]);

  return <Autocomplete
    options={options}
    onChange={(event, newValue, reason, details) => {
      obj[fld] = newValue;
      onChange?.(newValue);
      setValue(obj[fld]);
    }}
    value={value}
    label={label}
    fullWidth={fullWidth}
    {...other}
  />;
}

export function PresentationFormatter ({column, row, value, isCellEditable, tabIndex, onRowChange, raw}) {
  if(!value) {
    value = row[column.key];
  }
  let text = typeof value === 'string' ? value : (value && value.presentation) || '';
  if(text === '_') {
    text = '';
  }
  return raw ? text : <div title={text}>{text}</div>;
}
