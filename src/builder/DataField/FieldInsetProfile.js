import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';
import {onKeyUp} from '@oknosoft/ui/DataField/enterTab';

const mgr = $p.cat.inserts;
const options = [...mgr].sort($p.utils.sort('name'));

export default function FieldInsetProfile({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const [value, setValue] = React.useState(obj[fld]);
  const [options, setOptions] = React.useState([]);


  React.useEffect(() => {
    function update (curr, flds){
      if((!flds || fld in flds) && (curr === obj || obj.equals?.(curr))) {
        setValue(obj[fld]);
      }
    }
    if(value !== obj[fld]) {
      setValue(obj[fld]);
    }

    setOptions(obj.layer.sys.inserts({elm: obj}))

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
    label="Материал"
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    {...other}
  />;
}

