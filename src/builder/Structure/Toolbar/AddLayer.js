import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AddchartOutlinedIcon from '@mui/icons-material/AddchartOutlined';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import {testProducts} from '../../Toolbar/TestProducts';

export const StyledMenu = styled((props) => (
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

export default function AddLayer({editor, project, layer, elm, setContext}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const addRoot = () => {
    const layer = project.addLayer();
    project.redraw();
    setContext({type: 'layer', layer, elm: null});
    const {square} = testProducts({
      editor,
      type: 'layer',
      layer,
      setContext,
      handleClose,
    });
    square();
  };
  const addFlap = () => {
    const {container} = (elm || layer);
    const child = container?.createChild({kind: 'flap'});
    if(child) {
      setContext({type: 'layer', layer: child, elm: null});
      project.redraw();
    }
    handleClose();
  };
  const addVirtual = () => {
    const {container} = (elm || layer);
    const child = container?.createChild({kind: 'virtual'});
    if(child) {
      setContext({type: 'layer', layer: child, elm: null});
      project.redraw();
    }
    handleClose();
  };

  const addGlass = () => {
    const {container} = (elm || layer);
    const child = container?.createChild({kind: 'glass'});
    if(child) {
      setContext({type: 'elm', layer: child.layer, elm: child});
      project.redraw();
    }
    handleClose();
  };
  return <>
    <HtmlTooltip title="Добавить/заменить элемент">
      <IconButton onClick={handleClick}><DataSaverOnIcon /></IconButton>
    </HtmlTooltip>
    {editor && <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={addRoot} disableRipple>
        <AddPhotoAlternateOutlinedIcon />
        Слой рамы
      </MenuItem>
      <MenuItem disabled={!elm} onClick={addFlap} disableRipple>
        <LibraryAddOutlinedIcon />
        Слой створки
      </MenuItem>
      <MenuItem disabled onClick={addFlap} disableRipple>
        <AspectRatioIcon />
        Слой проёма
      </MenuItem>
      <MenuItem onClick={addVirtual} disableRipple>
        <AddchartOutlinedIcon />
        Виртуальный слой
      </MenuItem>
      <MenuItem disabled={(elm instanceof editor.Filling)} onClick={addGlass} disableRipple>
        <AddBoxOutlinedIcon />
        Заполнение
      </MenuItem>
      <MenuItem disabled onClick={handleClose} disableRipple>
        <AddRoadIcon />
        Штульповые створки
      </MenuItem>
      <MenuItem disabled onClick={handleClose} disableRipple>
        <AddHomeWorkOutlinedIcon />
        Вложенное изделие
      </MenuItem>
    </StyledMenu>}
  </>;

}
