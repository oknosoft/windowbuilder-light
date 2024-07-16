/**
 * Концевые соединения профиля
 */


import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const mgr = $p.cat.cnns;

function renderOption(props, option) {
  return 'cnn';
}

export default function FieldEndConnection({obj, onChange, fullWidth=true, enterTab, ...other}) {

  const [cnn, setCnn] = React.useState(obj.cnn);
  const [cnnOuter, setCnnOuter] = React.useState(obj.cnnOuter);
  const [cnnOptions, setCnnOptions] = React.useState([cnn]);
  const [outerOptions, setOuterOptions] = React.useState(cnnOuter ? [cnnOuter] : []);

  React.useEffect(() => {
    if(obj.owner.isInserted()) {
      const {project} = obj.owner;

      function update (curr, flds){
        setCnn(obj.cnn);
        setCnnOuter(obj.cnnOuter);
      }

      setCnnOptions([cnn]);
      setOuterOptions(cnnOuter ? [cnnOuter] : []);

      project.on({update});
      return () => {
        project.off({update});
      };
    }
  }, [obj]);

  const {name, owner, profile, profilePoint} = obj

  return <Autocomplete
    options={cnnOptions}
    onChange={(event, newValue, reason, details) => {
      obj.cnn = newValue;
      onChange?.(newValue);
      setCnn(obj.cnn);
    }}
    value={cnn}
    label={`Соедин ${name} -> ${profile._index + 1}${profilePoint?.name || 't'} (${obj.vertex.key})`}
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    renderOption={renderOption}
    {...other}
  />;
}

