import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandIcon from '@mui/icons-material/Expand';
import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowUp from '@mui/icons-material/ArrowUpward';
import FlipCameraAndroid from '@mui/icons-material/FlipCameraAndroid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import {Toolbar, HtmlTooltip} from '../../../../components/App/styled';
import {useBackdropContext} from '../../../../components/App';
import {useSelectedContext} from '../selectedContext';
import {recalcRow} from './data';

const recalcCurrent = ({elmRow, setBackdrop}) => {
  return recalcRow({row: elmRow, setBackdrop, noSave: true})
    .catch(() => null)
    .then(() => {
      const {characteristic} = elmRow.row;
      characteristic._manager.emit('update', characteristic);
    });
};


export default function CompositeToolbar({elm, glRow, elmRow, setSelectedRows}) {

  const {setBackdrop} = useBackdropContext();
  const glob = useSelectedContext();
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
  const handleUp = () => {
    if(glRow.row > 1) {
      const {_owner} = glRow;
      glass_specification.swap(glRow, _owner.get(glRow.row - 2));
      setSelectedRows(new Set());
    }
  };
  const handleDown = () => {
    const rows = glass_specification.find_rows({elm: elm.elm});
    if(glRow.row < rows.length) {
      const {_owner} = glRow;
      glass_specification.swap(glRow, _owner.get(glRow.row));
      setSelectedRows(new Set());
    }
  };
  const handleReverse = () => {
    const rows = glass_specification.find_rows({elm: elm.elm})
      .map(({row, _row, ...other}) => other).reverse();
    glass_specification.clear({elm: elm.elm});
    for(const row of rows){
      glass_specification.add(row, true, null, true);
    }
    elm.project.register_change();
    setSelectedRows(new Set());
  };
  const handleCalck = () => {
    recalcCurrent({elmRow, setBackdrop})
      .then(() => setBackdrop(false));
  };
  const handleDistribute = async () => {
    const {characteristic} = elmRow.row;
    const patrs = characteristic.note.split('\xA0');
    const last = patrs.length && patrs[patrs.length - 1];
    if(last && last.startsWith('!') && last.endsWith('!')) {
      const rows = [];
      for(const row of glob.rows) {
        if(row.row !== elmRow.row && row.row.note.includes(last)) {
          rows.push(row);
        }
      }
      if(rows.length) {
        const drows = characteristic.glass_specification.find_rows({elm: elm.elm}).map(({row, _row, ...other}) => other);
        for(const elmRow of rows) {
          // замещаем формулу
          let {characteristic: cx, glassRow, editor} = elmRow.row;
          cx.glass_specification.clear({elm: glassRow.elm});
          for(const row of drows){
            row.elm = glassRow.elm;
            cx.glass_specification.add(row, true);
          }
          if(!editor) {
            await elmRow.row.createEditor();
            editor = elmRow.row.editor;
          }
          await new Promise((resolve) => {
            const {project} = editor;
            project.register_change(true, () => {
              resolve();
            });
            project.redraw();
          });
          // пересчитываем строку
          await recalcCurrent({elmRow, setBackdrop});
          cx._modified;
        }
        recalcCurrent({elmRow, setBackdrop})
          .then(() => setBackdrop(false))
          .then(() => characteristic.calc_order.save());
      }
      else {
        $p.ui.dialogs.alert({
          title: 'Распространить формулу',
          text: `Нет подходящих строк с формулой "${last.replace(/\!/g, '')}"`
        });
      }
    }
    else {
      $p.ui.dialogs.alert({
        title: 'Распространить формулу',
        text: 'Не указана исходная формула в текущей строке'
      });
    }
  };

  return <Toolbar disableGutters>
      <HtmlTooltip title="Добавить строку {Insert}">
        <IconButton onClick={add}><AddIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Добавить строку копированием текущей {F9}">
        <IconButton disabled={!glRow} onClick={clone}><CopyIcon/></IconButton>
      </HtmlTooltip>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
      <HtmlTooltip title="Удалить строку {Delete}">
        <IconButton disabled={!glRow} onClick={del}><DeleteOutlineIcon/></IconButton>
      </HtmlTooltip>

      <HtmlTooltip title="Очистить (Удалить все строки)">
        <IconButton onClick={clear}><DeleteForeverIcon/></IconButton>
      </HtmlTooltip>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Переместить вверх">
      <IconButton disabled={!glRow} onClick={handleUp}><ArrowUp/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Переместить вниз">
      <IconButton disabled={!glRow} onClick={handleDown}><ArrowDown/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Перевернуть состав">
      <IconButton onClick={handleReverse}><FlipCameraAndroid/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Распространить на строки с такой же формулой">
      <IconButton onClick={handleDistribute}><ExpandIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Перcчитать строку">
      <IconButton onClick={handleCalck}><CalculateIcon/></IconButton>
    </HtmlTooltip>


    </Toolbar>;
}
