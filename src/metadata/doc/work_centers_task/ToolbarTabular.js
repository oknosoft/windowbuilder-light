import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {ListSubheader} from '../../_common/styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';


export default function ToolbarTabular({clear, create, clone, remove, buttons=null}) {

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={create}>
          <AddIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={remove}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
      {buttons}
    </Toolbar>
  </ListSubheader>;
}
