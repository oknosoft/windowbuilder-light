import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const glob = {
  init(curr) {
    if(!this.meta) {
      this.meta = $p.dp.builderPen.metadata();
      this.options = this.meta.fields.mode.list.map((text, key) => ({text, key}));
    }
    return this.options.find((v) => v.key === curr);
  }
};



export function PenSelectMode({obj, onChange, enterTab, ...other}) {

  const [value, setValue] = React.useState(glob.init(obj.mode));
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    function update(curr, flds) {
      if('elm_type' in flds) {
        if(!glob.meta.fields.mode.exTypes.includes(obj.elm_type.name) && obj.mode) {
          obj.mode = 0;
          setValue(glob.init(0));
          onChange?.(0);
        }
        else {
          setIndex(index + 1);
        }
      }
    }
    obj._manager.on({update});
    return () => obj._manager.off({update});
  }, []);

  return <Autocomplete
    options={glob.options}
    onChange={(event, newValue, reason, details) => {
      obj.mode = newValue.key;
      setValue(glob.init(obj.mode));
      onChange?.(newValue.key);
    }}
    value={value}
    getOptionLabel={(v) => v.text}
    label="Режим"
    fullWidth
    disableClearable
    disabled={!glob.meta.fields.mode.exTypes.includes(obj.elm_type.name)}
    {...other}
  />;
}
