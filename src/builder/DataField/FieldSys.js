import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';
import {onKeyUp} from '@oknosoft/ui/DataField/enterTab';

const options = [...$p.cat.productionParams].sort($p.utils.sort('name'));

export default function FieldSys({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  let [value, setValue] = React.useState();
  if(value === undefined && obj && fld) {
    value = obj[fld];
  }

  React.useEffect(() => {
    function update (curr, flds){
      if((!flds || fld in flds) && (curr === obj || obj.equals?.(curr))) {
        setValue(obj[fld]);
      }
    }
    if(value !== obj[fld]) {
      setValue(obj[fld]);
    }
    obj.project.on({update});
    return () => {
      obj.project.off({update});
    };
  }, [obj]);

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
    label="Система"
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    {...other}
  />;
}

