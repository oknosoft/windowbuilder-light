import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import DefauitInsetIcon from '../../../aggregate/styles/icons/DefauitInset';
import {StyledMenu} from '../../Structure/Toolbar/AddLayer';
import {HtmlTooltip} from '../../../aggregate/App/styled';

const onClick = (obj, handleClose) => () => {
  handleClose();
  obj?.defaults?.();
};

export default function InsetSelection({type, project, layer, elm, setContext}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <>
    <HtmlTooltip title="Подбор вставок">
      <IconButton onClick={handleClick}><DefauitInsetIcon /></IconButton>
    </HtmlTooltip>
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={onClick(project, handleClose)} disableRipple>
        Во всём изделии
      </MenuItem>
      <MenuItem onClick={onClick(layer, handleClose)} disableRipple>
        В текущем слое
      </MenuItem>
      <MenuItem disabled onClick={null} disableRipple>
        С учётом статики
      </MenuItem>
    </StyledMenu>
  </>;
}
