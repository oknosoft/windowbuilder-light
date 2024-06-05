import React from 'react';
import Autocomplete from './Autocomplete';
import {onKeyUp} from './enterTab';

export const getOptions = (obj, fld, meta, value) => {
  const {utils} = $p;
  let mgr = value?._manager || obj._manager.value_mgr(obj, fld, meta.type);
  if(Array.isArray(meta.list)) {
    return meta.list.map((v) => utils.is_data_obj(v) ? v : mgr.get(v));
  }
  const res = [];
  const elmOnly = meta.choice_groups_elm === 'elm';
  for(const {name, path} of (meta.choice_params || [])) {
    if(name === 'ref') {
      if(Array.isArray(path)) {
        mgr = path.map(ref => mgr.get(ref));
      }
      else if(Array.isArray(path.in)) {
        mgr = path.in.map(ref => mgr.get(ref));
      }
      break;
    }
  }
  for(const o of mgr) {
    if(elmOnly && o.is_folder) {
      continue;
    }
    // для связей параметров выбора, значение берём из объекта
    let stop;
    for(const choice of meta.choice_links || []) {
      if(choice.name?.[0] == 'selection') {
        // if(choice.name[1] == 'owner' && !meta.has_owners) {
        //   continue;
        // }
        if(utils.is_tabular(obj)) {
          if(choice.path.length < 2) {
            if(o[choice.name[1]] != obj[choice.path[0]]) {
              stop = true;
              break;
            }
          }
          else {
            if(o[choice.name[1]] != obj[choice.path[1]]) {
              stop = true;
              break;
            }
          }
        }
        else {
          if(o[choice.name[1]] != obj[choice.path[0]]) {
            stop = true;
            break;
          }
        }
      }
    }

    if(!stop) {
      res.push(o);
    }
  }
  return res;
};

export default function RefField({obj, fld, meta, label, onChange, fullWidth=true, enterTab, ...other}) {

  let [value, setValue] = React.useState();
  if(value === undefined && obj && fld) {
    value = obj[fld];
  }
  if(!meta && obj && fld) {
    meta = obj._metadata(fld);
  }
  if(!label && label !== false && meta) {
    label = meta.synonym;
  }

  React.useEffect(() => {
    function update (curr, flds){
      if(fld in flds && (curr === obj || obj.equals?.(curr))) {
        setValue(obj[fld]);
      }
    }
    obj._manager.on({update});
    return () => {
      obj._manager.off({update});
    };
  }, [obj]);

  const options = getOptions(obj, fld, meta, value);

  if(enterTab && !other.onKeyUp) {
    other.onKeyUp = onKeyUp;
  }

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
    disableClearable={Boolean(meta.mandatory)}
    placeholder="Нет"
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
