import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
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

const map = {
  carcass: ["Проволочная модель", PolylineIcon],
  normal: ["Профили", AutoFixNormalIcon],
  plane: ["Плоскости", SplitscreenIcon],
};

export default function SelectMode({show3d, toggle3D, editor}) {

  const [view, setView] = React.useState(editor?.project?.props?.carcass || 'carcass');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (nextView) => {
    if(editor?.project) {
      editor.project.props.carcass = nextView;
      setView(nextView);
      if(nextView === 'plane') {
        editor.project.deselectAll();
      }
    }
    handleClose();
  };

  const [title, Icon] = map[view];

  return <>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title={`Текущий режим: ${title}`} placement="right">
      <IconButton sx={{ml: 1}} onClick={handleClick}><Icon/></IconButton>
    </HtmlTooltip>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      onClick={handleClose}
      >
      {Object.keys(map).map((key) => {
        const [title, Icon] = map[key];
        return <MenuItem key={key} onClick={() => handleChange(key)}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          {title}
        </MenuItem>;
      })}

    </Menu>
    <HtmlTooltip title={show3d ? 'Скрыть вид 3D' : 'Показать вид 3D'} placement="right">
      <IconButton sx={{ml: 1}} onClick={toggle3D}><Show3dIcon show3d={show3d}/></IconButton>
    </HtmlTooltip>
  </>;
}
