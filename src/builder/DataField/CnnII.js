/**
 * Примыкающее соединение профиля
 */


import React from 'react';
import MenuItem  from '@mui/material/MenuItem';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const mgr = $p.cat.cnns;

function renderOption(props, option, state, ownerState) {
  return <MenuItem value={option.valueOf()} {...props}>
    <div className={option.cnn_type._raw('css')} />
    {option.toString()}
  </MenuItem>;
}

export default function FieldCnnII({obj, onChange, fullWidth=true, enterTab, ...other}) {


  const {nearest, layer} = obj;
  const [cnn, setCnn] = React.useState(obj.cnnII);
  const [cnns, setCnns] = React.useState([cnn]);

  React.useEffect(() => {
    if(obj.isInserted()) {
      const {project} = obj;
      const {md, utils} = project.root;
      const redraw = utils.debounce(function onRedraw (curr, flds){
        if(curr === project) {
          setCnn(obj.cnnII);
          const cnns = mgr.iiCnns(obj);
          if(!cnns.includes(cnn)) {
            cnns.unshift(cnn);
          }
          setCnns(cnns);
        }
      });

      redraw(project);
      md.on({redraw});
      return () => md.off({redraw});
    }
  }, [obj]);


  return nearest ? <Autocomplete
    options={cnns}
    onChange={(event, newValue, reason, details) => {
      obj.cnnII = newValue;
      onChange?.(newValue);
      setCnn(obj.cnnII);
      obj.project.redraw();
    }}
    value={cnn}
    label={`Соедин II ${obj._index + 1} -> ${nearest._index + 1}`}
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    //renderOption={renderOption}
    {...other}
  /> : null;
}

