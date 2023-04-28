import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FunctionsIcon from '@mui/icons-material/Functions';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import WindowIcon from '@mui/icons-material/Window';
import CalculateIcon from '@mui/icons-material/Calculate';
import {disablePermanent} from '../../../styles/muiTheme';

const iconMap = {
  all: <FunctionsIcon />,
  builder: <FormatShapesIcon />,
  glass: <WindowIcon />,
  parametric: <CalculateIcon />,
};
export default React.forwardRef(({obj, tab, setTab, setting}, ref) => {

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return <Box ref={ref} sx={{ width: '100%' }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={tab}
        onChange={handleChange}
      >
        {setting.tabs
          .filter(({visible}) => visible)
          .map(({name, text}, index) => <Tab
            key={`tab-${index}`}
            icon={iconMap[name]}
            iconPosition="start"
            label={disablePermanent ? undefined : text}
          />)}
      </Tabs>
    </Box>
  </Box>;
});
