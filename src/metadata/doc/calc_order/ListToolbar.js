import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useNavigate} from 'react-router-dom';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ListToolbar({create, clone, open}) {

  return <Toolbar disableGutters>
    <HtmlTooltip title="Создать документ {Insert}">
      <IconButton onClick={create}><AddIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать документ копированием текущего {F9}">
      <IconButton onClick={clone}><CopyIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить документ">
      <IconButton onClick={open}><EditIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
