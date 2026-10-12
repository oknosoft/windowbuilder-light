import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GridOnIcon from '@mui/icons-material/GridOn';
import CalculateIcon from '@mui/icons-material/Calculate';
import {ListSubheader} from '../../../aggregate/Toolbars/styled';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import ClipBoard from '../../../aggregate/FrmObj/ClipBoard';
import {FromDXF} from './fromDXF';

const {wsql} = $p;

export default function ObjProductionToolbar({obj, rows, getRow, setRows, setBackdrop, setModified, selectedRowsChange, rawSetSelectedRows, methods}) {


  const {create, clone, open, del, clear, recalc, load, builder} = methods;

  const [flipFormula, setFlipFormula] = React.useState(wsql.get_user_param('flip_formula', 'boolean'));
  const [triangles, setTriangles] = React.useState(false);
  const [flipTriangles, setFlipTriangles] = React.useState(false);

  const clipBoardAdds = <Toolbar disableGutters>
    <FormControlLabel
      control={<Checkbox color="primary" checked={flipFormula} onChange={({target}) => {
        wsql.set_user_param('flip_formula', target.checked);
        setFlipFormula(target.checked);
      }} />}
      label="Перевернуть формулу"
    />
    <FormControlLabel
      control={<Checkbox color="primary" checked={triangles} onChange={({target}) => setTriangles(target.checked)} />}
      label="Треугольники"
    />
    <FormControlLabel
      control={<Checkbox color="primary" checked={flipTriangles} onChange={({target}) => setFlipTriangles(target.checked)} />}
      label="Перевернуть треугольники"
    />
  </Toolbar>;


  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={create}><AddIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!getRow} onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Изменить продукцию">
        <IconButton disabled={!getRow} onClick={builder}><EditIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton onClick={del}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>

      <FromDXF obj={obj} getRow={getRow} methods={methods} rawSetSelectedRows={rawSetSelectedRows}/>

      <ClipBoard execute={load({flipFormula, triangles, flipTriangles})} adds={clipBoardAdds}/>

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
