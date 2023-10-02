import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import {Toolbar, HtmlTooltip} from '../../_common/App/styled';

export default function SelectTool() {
  const [tool, setTool] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTool(newValue);
  };
  return <Toolbar>
    <Tabs value={tool} onChange={handleChange} >
      <Tab value={0} icon={<PhoneIcon />} aria-label="phone" />
      <Tab value={1} icon={<FavoriteIcon />} aria-label="favorite" />
      <Tab value={2} icon={<PersonPinIcon />} aria-label="person" />
    </Tabs>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Настройки">
      <IconButton onClick={null}><PersonPinIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
