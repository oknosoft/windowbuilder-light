import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const mgr = $p.cat.inserts;

export default function FieldInsetProfile({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const [value, setValue] = React.useState(obj[fld]);
  const [options, setOptions] = React.useState([]);


  React.useEffect(() => {
    if(obj.isInserted()) {
      const {project, layer} = obj;

      function update (curr, flds){
        if((!flds || fld in flds) && (curr === obj || obj.equals?.(curr))) {
          setValue(obj[fld]);
        }
      }
      if(value !== obj[fld]) {
        setValue(obj[fld]);
      }

      setOptions(layer.sys.inserts({elm: obj}));

      project.on({update});
      return () => {
        project.off({update});
      };
    }
  }, [obj]);

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

