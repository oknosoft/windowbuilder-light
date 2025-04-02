import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

export const glob = {
  init(curr) {
    if(!this.meta) {
      this.meta = $p.dp.builderPen.metadata();
      this.options = this.meta.fields.mode.list.map((text, key) => ({text, key}));
    }
    return this.options.find((v) => v.key === curr);
  }
};


export function PenSelectMode({obj, ref, onChange, enterTab, ...other}) {

  const [value, setValue] = React.useState(glob.init(obj.mode));
  if(!ref.current) {
    ref.current = {setValue};
  }

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
