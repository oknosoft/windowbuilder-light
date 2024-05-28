
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RefInField({row, placeholder}) {
  const [states, setStates] = React.useState([]);
  const [mgr, options] = React.useMemo(() => {
    const mgr = $p.md.mgr_by_class_name(row.right_value_type);
    const options = [];
    for(const v of mgr) {
      if(!v.is_folder) {
        options.push(v);
      }
    }
    return [mgr, options];
  }, []);
  React.useEffect(() => {
    if(row.right_value) {
      setStates(row.right_value.split(',').map(ref => mgr.get(ref)));
    }
  }, []);
  return <Autocomplete
    multiple
    limitTags={1}
    value={states}
    options={options}
    disableCloseOnSelect
    ChipProps={{size: 'small'}}
    onChange={(e,v) => {
      setStates(v);
    }}
    getOptionLabel={(option) => {
      return option.name;
    }}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.name}
      </li>
    )}
    //style={{ width: 500 }}
    renderInput={(params) => {
      Object.assign(params.inputProps, {label: {show: false}});
      return <TextField {...params} variant="standard" minWidth={200} placeholder={placeholder} />;
    }}
  />;
}
