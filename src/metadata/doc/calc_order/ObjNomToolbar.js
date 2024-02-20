import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GridOnIcon from '@mui/icons-material/GridOn';
import {useBackdropContext} from '../../../components/App';
import {ListSubheader} from '../../aggregate/styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';
import {handlers} from './glasses/data';


export default function ObjNomToolbar({obj, rows, getRow, setRows, setBackdrop, setModified, setSelectedRows}) {

  const create = () => {
    const row = obj.production.add();
    setSelectedRows(new Set([row.row]));
  };

  const clone = () => {
    const proto = getRow();
    const row = obj.production.add();
    setSelectedRows(new Set([row.row]));
  };

  const del = () => {
    const row = getRow();
    if(row) {
      obj.production.del(row);
      setModified(true);
      setSelectedRows(new Set());
    }
  };

  const clear = () => {
    const rows = [];
    for(const row of obj.production) {
      if(row.characteristic.empty() || row.characteristic.calc_order.empty()) {
        rows.push(row);
      }
    }
    for(const row of rows) {
      obj.production.del(row);
    }
    if(rows.length){
      setModified(true);
      setSelectedRows(new Set());
    }
  };

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={create}><AddIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!getRow} onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={del}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>

      <Typography sx={{flex: 1}}></Typography>

    </Toolbar>
  </ListSubheader>;
}
