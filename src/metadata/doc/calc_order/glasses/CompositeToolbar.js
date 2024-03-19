import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import {Toolbar, HtmlTooltip} from '../../../../components/App/styled';


export default function CompositeToolbar({elm, glRow, setSelectedRows}) {

  const {glass_specification} = elm.ox;
  const add = () => {
    const row = glass_specification.add({elm: elm.elm});
    setSelectedRows(new Set([row.row]));
  };
  const clone = () => {
    const row = glass_specification.add({elm: elm.elm, inset: glRow.inset, dop: Object.assign({}, glRow.dop)});
    setSelectedRows(new Set([row.row]));
  };
  const del = () => {
    glass_specification.del(glRow);
    setSelectedRows(new Set());
  };
  const clear = () => {
    glass_specification.clear({elm: elm.elm});
    setSelectedRows(new Set());
  };

  return <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={add}><AddIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!glRow} onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton disabled={!glRow} onClick={del}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />

    </Toolbar>;
}
