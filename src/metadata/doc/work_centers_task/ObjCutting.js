import React from 'react';
import ObjTabular from './ObjTabular';
import {NumberCell, NumberFormatter} from '../../../packages/ui/DataField/Number';
import {PresentationFormatter} from '../../../packages/ui/DataField/RefField';
import {TextFormatter} from '../../../packages/ui/DataField/Text';
import ClipBoard from '../../_common/ClipBoard';
import Optimize2D from './Optimize2D';

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

export default function ObjCutting({tabRef, obj, setBackdrop}) {

  const execute = React.useMemo(() => load(obj), [obj]);

  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.cutting}
    columns={columns}
    buttons={<>
      <ClipBoard execute={execute}/>
      <Optimize2D obj={obj} setBackdrop={setBackdrop}/>
    </>}
  />;
}
