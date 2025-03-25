import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowUp from '@mui/icons-material/ArrowUpward';
import FlipCameraAndroid from '@mui/icons-material/FlipCameraAndroid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {handlers} from './handlers';

export default function TabularToolbar({tabular, selection, gridRef, rows, getRow, setRows, setBackdrop, setModified, setSelectedRows}) {

  const row = getRow();

  const {add, delRow, clear} = handlers({tabular, selection, rows, setRows, setSelectedRows, gridRef});

  const clone = (ev) => {
    add(ev, row.toJSON());
  };

  const del = () => delRow(row);

  const handleUp = () => {

  };

  const handleDown = () => {

  };

  const handleReverse = () => {

  };

  return <Toolbar disableGutters>
    <HtmlTooltip title="Добавить строку {Insert}">
      <IconButton onClick={add}><AddIcon/></IconButton>
    </HtmlTooltip>

    <HtmlTooltip title="Добавить строку копированием текущей {F9}">
      <IconButton disabled={!row} onClick={clone}><CopyIcon/></IconButton>
    </HtmlTooltip>

    <Divider orientation="vertical" flexItem sx={{m: 1}} />

    <HtmlTooltip title="Удалить строку {Delete}">
      <IconButton disabled={!row} onClick={del}><DeleteOutlineIcon/></IconButton>
    </HtmlTooltip>

    <HtmlTooltip title="Очистить (Удалить все строки)">
      <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
    </HtmlTooltip>

    <Divider orientation="vertical" flexItem sx={{m: 1}} />

    <HtmlTooltip title="Переместить вверх">
      <IconButton disabled onClick={handleUp}><ArrowUp/></IconButton>
    </HtmlTooltip>

    <HtmlTooltip title="Переместить вниз">
      <IconButton disabled onClick={handleDown}><ArrowDown/></IconButton>
    </HtmlTooltip>

    <HtmlTooltip title="Перевернуть состав">
      <IconButton disabled onClick={handleReverse}><FlipCameraAndroid/></IconButton>
    </HtmlTooltip>


  </Toolbar>;
}
