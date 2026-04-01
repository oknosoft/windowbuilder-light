import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import {HtmlTooltip} from '../../../aggregate/App/styled';

export function ToolbarMenu({title, icon, items}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return <>
    <HtmlTooltip title={title}>
      <IconButton onClick={openMenu}>{icon}</IconButton>
    </HtmlTooltip>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={closeMenu}
      slotProps={{
        list: {
          'aria-labelledby': 'basic-button',
        },
      }}
    >
      {open && items.map(({text, action}, index) => <MenuItem key={`mi-${index}`} onClick={() => {
        closeMenu();
        action();
      }}>{text}</MenuItem>)}
    </Menu>
  </>;
}

export default function Cut2DMenu({obj, setBackdrop, selected, run2D}) {
  return ToolbarMenu({
    title: 'Раскрой 2D',
    icon: <ViewQuiltIcon/>,
    items: [
      {text: 'Оптимизировать всё', action() {run2D(obj, setBackdrop, selected, 'all')}},
      {text: 'Текущую номенклатуру', action() {run2D(obj, setBackdrop, selected, 'currentNom')}},
      {text: 'Только на текущем листе', action() {run2D(obj, setBackdrop, selected, 'currentScrap')}},
    ]
  })
}
