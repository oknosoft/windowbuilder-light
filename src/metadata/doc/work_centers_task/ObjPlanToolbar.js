import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useNavigate} from 'react-router-dom';
import {useBackdropContext} from '../../../components/App';
import {ListSubheader} from '../../_common/styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ObjPlanToolbar({
  obj, rows, handleAdd, handleDel, handleEdit, getRow, setRows, setModified, selectedRowsChange}) {

  const navigate = useNavigate();
  const {setSnack, setBackdrop} = useBackdropContext();

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={() => handleAdd({obj, rows, setRows, setBackdrop, setModified, selectedRowsChange})}>
          <AddIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!getRow} onClick={() => {
          const row = getRow();
          handleAdd({obj, proto: row?.row?.characteristic, rows, setRows, setBackdrop, setModified, selectedRowsChange});
        }}><CopyIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={handleDel}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
