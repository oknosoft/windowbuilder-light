import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ObjProductionToolbar({obj, handleAdd, handleEdit, dp, setRows}) {

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку">
        <IconButton onClick={() => handleAdd({obj, dp, setRows})}><AddIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Добавить строку копированием текущей">
        <IconButton><CopyIcon/></IconButton>
      </HtmlTooltip>
      {handleEdit && <HtmlTooltip title="Изменить продукцию">
        <IconButton><EditIcon/></IconButton>
      </HtmlTooltip>}
      <HtmlTooltip title="Удалить строку">
        <IconButton><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
