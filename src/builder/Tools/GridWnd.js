import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabularSection from '../../aggregate/TabularSection';

import {NumberField, NumberCell, NumberFormatter} from '@oknosoft/ui/DataField/Number';
import RefField from '@oknosoft/ui/DataField/RefField';
const columns = [
  {key: "sz", name: "Размер", renderEditCell: NumberCell, renderCell: NumberFormatter},
  //{key: "inset", name: "Вставка", width: 120, renderCell: PresentationFormatter},
];

const meta = {};
function GridWnd({editor, layer}) {
  const {tool, project} = editor;
  if(!layer) {
    layer = project.activeLayer;
  }

  const [tab, setTab] = React.useState('vert');
  const handleChange = (event, newValue) => setTab(newValue);
  const tabRef = React.useRef(null);
  const selection = React.useMemo(() => (tab === 'vert' ? {elm: 1} : (
    tab === 'hor' ? {elm: 0} : {elm: 3}
  )), [tab]);

  React.useEffect(() => {
    function update(o, flds) {
      Promise.resolve().then(tool.createProfiles.bind(tool));
    }
    tool.dp._manager.on({update, rows: update});
    return () => tool.dp._manager.off({update, rows: update});
  }, [tool]);

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation}/>
    </FormControl>
    <Tabs value={tab} onChange={handleChange}>
      <Tab value="vert" label="Стойки" />
      <Tab value="hor" label="Ригели" />
      <Tab value="overlaps" label="Перекрытия" />
    </Tabs>
    <NumberField obj={tool.dp} fld="h"/>
    {tab === 'overlaps' ?
      <FormControl fullWidth readOnly>
        <InputLabel>Опора</InputLabel>
        <Input readOnly value="Низ"/>
      </FormControl> : <RefField obj={tool.dp} fld={tab === 'vert' ? 'align_by_x' : 'align_by_y'} />}
    <Box ref={tabRef} sx={{ width: '100%' }}>
      <TabularSection tabRef={tabRef} obj={tool.dp} ts="sizes" columns={columns} selection={selection}/>
    </Box>

  </>;
}


export default GridWnd;
