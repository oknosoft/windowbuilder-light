import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import {useNavigate} from 'react-router';
import {HtmlTooltip} from './styled';

export default function GoTo({items}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  return <>
    <HtmlTooltip title="Перейти">
      <IconButton onClick={handleClick}><CallMissedOutgoingIcon/></IconButton>
    </HtmlTooltip>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    > {
      items.map((item, index) => <MenuItem key={`menu-${index}`} onClick={() => navigate(item.path)}>
        {item.name}
      </MenuItem>)
    }
    </Menu>
  </>;
}
