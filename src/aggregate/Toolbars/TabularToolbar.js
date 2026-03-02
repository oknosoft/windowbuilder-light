import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../App/styled';
import Divider from '@mui/material/Divider';
import FilterRemove from '../../styles/icons/FilterRemove';
import FilterAdd from '../../styles/icons/FilterAdd';


export default function TabularToolbar({clear, create, clone, remove, buttons=null, rows, selectedRows, selSelection, setSelSelection}) {

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
      <Divider orientation="vertical" flexItem sx={{m: 1}} />
      <HtmlTooltip title={`${selSelection ? 'Сбросить' : 'Установить'} фильтр по выделенному`}>
        <IconButton disabled={!selectedRows.size && !selSelection} onClick={() => {
          if(selSelection) {
            setSelSelection(null);
          }
          else {
            const key = Array.from(selectedRows)[0];
            const row = rows.find(v => v.row === key);
            if(row) {
              setSelSelection({nom: row.nom});
            }
          }
        }}>
          {selSelection ? <FilterRemove /> : <FilterAdd />}
        </IconButton>
      </HtmlTooltip>
      {buttons}
    </Toolbar>
  </ListSubheader>;
}
