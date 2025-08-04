import React from 'react';
import ObjTabular from '../../aggregate/FrmObj/ObjTabular';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter} from 'metadata-ui/DataField/Text';
import {useLoadingContext} from '../../aggregate/Metadata';
import {tabularStyle} from '../../aggregate/AppLoad/dataGrid';
import TabularToolbar from '../../aggregate/Toolbars/TabularToolbar';
import ClipBoard from '../../aggregate/FrmObj/ClipBoard';
import OptimizeCut from './Cutting/OptimizeCut';

export const columns = [
  {key: "production", name: "Объект", width: 200, renderCell: PresentationFormatter},
  {key: "nom", width: 200, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "characteristic", width: 200, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "x", width: 90, name: "X", tooltip: "", renderCell: NumberFormatter},
  {key: "y", width: 90, name: "Y", tooltip: "", renderCell: NumberFormatter},
  {key: "rotated", width: 80, name: "Поворот", tooltip: "", renderCell: NumberFormatter},
  {key: "stick", width: 80, name: "№ загот", tooltip: "№ листа (хлыста, заготовки)", renderCell: NumberFormatter},
  {key: "pair", width: 80, name: "№ пары", tooltip: "№ парной заготовки", renderCell: NumberFormatter},
  {key: "part", width: 80, name: "Партия", tooltip: "Партия (такт, группа раскроя)", renderCell: NumberFormatter},
  {key: "cell", width: 100, name: "Ячейка", tooltip: "№ ячейки (откуда брать заготовку или куда помещать)", renderCell: TextFormatter}
];

const load = (obj) => {
  return function load(text) {
    for(const row of text.split('\n')) {
      const values = row.split('\t');
      let strings = 0;
      let numbers = 0;
      let newRow;
      for(const v of values) {
        if(v) {
          const n = parseFloat(v);
          if(!isNaN(n)) {
            if(!newRow) {
              newRow = obj.cutting.add();
            }
            if(numbers) {
              newRow.width = n;
            }
            else {
              newRow.len = n;
            }
            numbers++;
          }
        }
      }
    }
  };
};

const stub = () => null;

export default function ObjCutting({tabRef, obj, setBackdrop}) {

  const rootStyle = tabularStyle(tabRef, useLoadingContext());
  const [execute, selected, selectedRowsChange] = React.useMemo(() => {
    const selected = {};
    const selectedRowsChange = (rows) => {
      selected.rows = rows;
    };
    return [load(obj), selected, selectedRowsChange];
  }, [obj]);
  const [ext, setExt] = React.useState(null);
  const buttons = <>
    <ClipBoard execute={execute}/>
    <OptimizeCut obj={obj} setBackdrop={setBackdrop} ext={ext} setExt={setExt} selected={selected} mode="cutting"/>
  </>;

  // <ToolbarTabular clear={stub} create={stub} clone={stub} remove={stub} buttons={buttons}/>
  return ext ?
    <div style={rootStyle}>
      {ext}
    </div> :
    <ObjTabular
      rootStyle={rootStyle}
      tabular={obj.cutting}
      columns={columns}
      buttons={buttons}
      selectedRowsChange={selectedRowsChange}
    />;
}
