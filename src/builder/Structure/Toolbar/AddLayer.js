import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import AddchartOutlinedIcon from '@mui/icons-material/AddchartOutlined';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import {HtmlTooltip} from '../../../aggregate/App/styled';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
    transformOrigin={{vertical: 'top', horizontal: 'left'}}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

export default function AddLayer() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <>
    <HtmlTooltip title="Добавить/заменить элемент">
      <IconButton onClick={handleClick}><DataSaverOnIcon /></IconButton>
    </HtmlTooltip>
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleClose} disableRipple>
        <AddPhotoAlternateOutlinedIcon />
        Слой рамы
      </MenuItem>
      <MenuItem onClick={handleClose} disableRipple>
        <LibraryAddOutlinedIcon />
        Слой створки
      </MenuItem>
      <MenuItem onClick={handleClose} disableRipple>
        <AddBoxOutlinedIcon />
        Заполнение
      </MenuItem>
      <MenuItem disabled onClick={handleClose} disableRipple>
        <AddRoadIcon />
        Штульповые створки
      </MenuItem>
      <MenuItem disabled onClick={handleClose} disableRipple>
        <AddchartOutlinedIcon />
        Виртуальный слой
      </MenuItem>
      <MenuItem disabled onClick={handleClose} disableRipple>
        <AddHomeWorkOutlinedIcon />
        Вложенное изделие
      </MenuItem>
    </StyledMenu>
  </>;

}
