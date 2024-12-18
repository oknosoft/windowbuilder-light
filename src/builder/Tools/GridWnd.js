import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {PaddingLeft, HtmlTooltip} from '../../aggregate/App/styled';

const meta = {};
function GridWnd({editor, layer}) {
  const {tool, project} = editor;
  if(!layer) {
    layer = project.activeLayer;
  }

  const [tab, setTab] = React.useState('vert');
  const handleChange = (event, newValue) => setTab(newValue);

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation}/>
    </FormControl>
    <Tabs value={tab} onChange={handleChange}>
      <Tab value="vert" label="Стойки" />
      <Tab value="hor" label="Ригели" />
    </Tabs>

  </>;
}


export default GridWnd;
