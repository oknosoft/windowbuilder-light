import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GridOnIcon from '@mui/icons-material/GridOn';
import CalculateIcon from '@mui/icons-material/Calculate';
import {ListSubheader} from '../../../aggregate/styled';
import {Toolbar, HtmlTooltip} from '../../../../components/App/styled';
import ClipBoard from '../../../aggregate/ClipBoard';

export default function ObjProductionToolbar({obj, rows, getRow, setRows, setBackdrop, setModified, selectedRowsChange, rawSetSelectedRows, methods}) {


  const {create, clone, open, del, clear, recalc, load} = methods;

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={create}><AddIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!getRow} onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Изменить продукцию">
        <IconButton disabled onClick={open}><EditIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={del}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>

      <ClipBoard execute={load}/>

      <Typography sx={{flex: 1}}></Typography>

      <HtmlTooltip title="Пересчитать строку">
        <IconButton disabled={!getRow} onClick={recalc}><CalculateIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Детали продукции">
        <IconButton disabled={!getRow} onClick={open}><GridOnIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
