import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';


export default function FieldFurn({layer, onChange, fullWidth=true, enterTab, ...other}) {

  const {furn} = layer;
  const [index, setRefresh] = React.useState(0);
  const refresh = React.useMemo(() => () => setRefresh((index) => index + 1), []);
  const furns = layer.furns();
  const options = Array.from(furns.keys());
  const error = !options.includes(furn);
  if(error) {
    options.push(furn);
  }

  React.useEffect(() => {
    const {project} = layer;
    project.on({update: refresh});
    return () => project.off({update: refresh});
  }, [layer]);

  return <Autocomplete
    options={options}
    onChange={(event, newValue, reason, details) => {
      layer.furn = newValue;
      refresh();
    }}
    value={furn}
    label="Фурнитура"
    fullWidth={fullWidth}
    disableClearable
    placeholder="Не задана"
    openList
    {...other}
  />;
}

