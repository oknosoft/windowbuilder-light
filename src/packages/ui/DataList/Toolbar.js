import React from 'react';

import {Toolbar, HtmlTooltip} from '../../../components/App/styled';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

export default function (props) {
  return <Toolbar disableGutters>
    {props.selectionMode && <>
      <Button startIcon={<PlaylistAddCheckIcon/>} onClick={null}>Выбрать</Button>
      <Divider orientation="vertical" flexItem />
    </>}
    <HtmlTooltip title="Создать папку">
      <IconButton disabled onClick={null}><CreateNewFolderOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Переместить текущий элемент в папку">
      <IconButton disabled onClick={null}><DriveFileMoveOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать элемент">
      <IconButton disabled onClick={null}><AddCircleOutlineIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать элемент копированием текущего">
      <IconButton disabled onClick={null}><ControlPointDuplicateOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить элемент">
      <IconButton onClick={null}><DriveFileRenameOutlineIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
