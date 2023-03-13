import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FunctionsIcon from '@mui/icons-material/Functions';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import WindowIcon from '@mui/icons-material/Window';
import CalculateIcon from '@mui/icons-material/Calculate';
import {disablePermanent} from '../../../styles/muiTheme';

export default React.forwardRef(({obj, tab, setTab}, ref) => {

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return <Box ref={ref} sx={{ width: '100%' }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={tab}
        onChange={handleChange}
      >
        <Tab icon={<FunctionsIcon />} iconPosition="start" label={disablePermanent ? undefined : 'Все строки'} />
        <Tab icon={<FormatShapesIcon />} iconPosition="start" label={disablePermanent ? undefined : 'Построитель'} />
        <Tab icon={<WindowIcon />} iconPosition="start" label={disablePermanent ? undefined : 'Заполнения'} />
        <Tab icon={<CalculateIcon />} iconPosition="start" label={disablePermanent ? undefined : 'Параметрик'} />
      </Tabs>
    </Box>
  </Box>;
});
