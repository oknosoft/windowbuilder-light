import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabularSection from '../../aggregate/TabularSection';

const meta = {};
function GridWnd({editor, layer}) {
  const {tool, project} = editor;
  if(!layer) {
    layer = project.activeLayer;
  }

  const [tab, setTab] = React.useState('vert');
  const handleChange = (event, newValue) => setTab(newValue);
  const tabRef = React.useRef(null);

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation}/>
    </FormControl>
    <Tabs value={tab} onChange={handleChange}>
      <Tab value="vert" label="Стойки" />
      <Tab value="hor" label="Ригели" />
    </Tabs>
    <Box ref={tabRef} sx={{ width: '100%' }}>
      {tab === 'vert' && <TabularSection tabRef={tabRef} obj={tool.dp} ts="sizes" />}
    </Box>

  </>;
}


export default GridWnd;
