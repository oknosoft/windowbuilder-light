import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import {Toolbar, HtmlTooltip} from '../App/styled';

export default function RemaindersToolbar() {

  return <Toolbar disableGutters>
    <HtmlTooltip title="Создать документ {Insert}">
      <IconButton onClick={null}><AddIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить документ">
      <IconButton onClick={null}><EditIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
