/**
 * Концевые соединения профиля
 */


import React from 'react';
import MenuItem  from '@mui/material/MenuItem';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const mgr = $p.cat.cnns;

function renderOption(props, option) {
  return <MenuItem value={option.valueOf()}>
    <div className={option.cnn_type.css} />
    {option.toString()}
  </MenuItem>;
}

export default function FieldEndConnection({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const [cnn, setCnn] = React.useState(obj[fld]);
  const [cnns, setCnns] = React.useState([cnn]);

  let {name, owner, profile, profilePoint, hasOuter} = obj;
  if(fld === 'cnnOuter') {
    profile = obj.profileOuter;
    profilePoint = obj.profilePointOuter;
  }
  React.useEffect(() => {
    if(owner.isInserted()) {
      const {project} = owner;
      const {md, utils} = project.root;
      const redraw = utils.debounce(function onRedraw (curr, flds){
        if(curr === project) {
          setCnn(obj[fld]);
          const cnns = obj[fld === 'cnn' ? 'cnns' : 'cnnsOuter'];
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



  return fld === 'cnnOuter' && (!hasOuter || !profile) ? null : <Autocomplete
    options={cnns}
    onChange={(event, newValue, reason, details) => {
      obj[fld] = newValue;
      onChange?.(newValue);
      setCnn(obj[fld]);
    }}
    value={cnn}
    label={`Соедин ${name} -> ${profile ? profile._index + 1 : ''}${profile ? (profilePoint?.name || 't') : 'i'} (${obj.vertex.key})`}
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    renderOption={renderOption}
    {...other}
  />;
}

