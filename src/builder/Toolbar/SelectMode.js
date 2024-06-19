import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {styled} from '@mui/material/styles';
import {HtmlTooltip} from '../../aggregate/App/styled';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

import PolylineIcon from '@mui/icons-material/Polyline';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import Splitscreen from '@mui/icons-material/Splitscreen';

const Show3dIcon = styled(VerticalAlignBottomIcon, {
  shouldForwardProp: (prop) => prop !== 'show3d',
})(({ theme, show3d }) => ({
  ...(!show3d && {transform: 'rotate(180deg)'}),
}));

const SplitscreenIcon = styled(Splitscreen)(({ theme }) => (
  {transform: 'rotate(90deg)'}
));

export default function SelectMode({show3d, toggle3D}) {

  const [view, setView] = React.useState('list');

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return <>
    <Box sx={{flex: 1}} />
    <Tabs value={view} orientation="vertical" onChange={handleChange} >
      <Tab value="list" accent icon={<HtmlTooltip title="Проволочная модель" placement="right"><PolylineIcon /></HtmlTooltip>} aria-label="select" />
      <Tab value="module" accent icon={<HtmlTooltip title="Профили 2D" placement="right"><AutoFixNormalIcon /></HtmlTooltip>} aria-label="draw" />
      <Tab value="quilt" accent icon={<HtmlTooltip title="Плоскости" placement="right"><SplitscreenIcon /></HtmlTooltip>} aria-label="draw" />
    </Tabs>

    <HtmlTooltip title={show3d ? 'Скрыть вид 3D' : 'Показать вид 3D'} placement="right">
      <IconButton sx={{ml: 1}} onClick={toggle3D}><Show3dIcon show3d={show3d}/></IconButton>
    </HtmlTooltip>
  </>;
}
