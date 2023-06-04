import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ObjProductionToolbar({obj, handleAdd, handleDel, handleEdit, getRow, dp, setRows}) {

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={() => handleAdd({obj, dp, setRows})}><AddIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton onClick={() => {
          const row = getRow();
          handleAdd({obj, proto: row?.row?.characteristic, setRows});
        }}><CopyIcon/></IconButton>
      </HtmlTooltip>
      {handleEdit && <HtmlTooltip title="Изменить продукцию">
        <IconButton><EditIcon/></IconButton>
      </HtmlTooltip>}
      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={handleDel}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
