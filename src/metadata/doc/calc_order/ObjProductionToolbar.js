import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GridOnIcon from '@mui/icons-material/GridOn';
import {useNavigate} from 'react-router-dom';
import {useBackdropContext} from '../../../components/App';
import {ListSubheader} from '../../_common/styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ObjProductionToolbar({
  obj, rows, handleAdd, handleDel, handleEdit, getRow, setRows, setBackdrop, setModified, selectedRowsChange}) {

  const navigate = useNavigate();
  const {setSnack} = useBackdropContext();

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
      {handleEdit && <HtmlTooltip title="Изменить продукцию">
        <IconButton><EditIcon/></IconButton>
      </HtmlTooltip>}
      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={handleDel}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="Детали продукции">
        <IconButton disabled={!getRow} onClick={() => {
          const row = getRow();
          if(row) {
            navigate(`/cat/characteristics/${row.row.characteristic.ref}`);
          }
          else {
            setSnack('Укажите строку табчасти для открытия деталей продукции');
          }
        }}><GridOnIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
