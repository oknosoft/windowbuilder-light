import React from 'react';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {NumberCell, NumberFormatter} from '../../../packages/ui/DataField/Number';
import {PresentationFormatter} from '../../../packages/ui/DataField/RefField';
import {TextFormatter} from '../../../packages/ui/DataField/Text';
import {tabularStyle} from '../../dataGrid';
import {useLoadingContext} from '../../../components/Metadata';
import ObjTabular from './ObjTabular';
import ObjCuttingSvg from './ObjCuttingSvg';

export const columns = [
  {key: "stick", width: 80, name: "№ загот", tooltip: "№ листа (хлыста, заготовки)", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "pair", width: 80, name: "№ пары", tooltip: "№ парной заготовки", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "nom", width: 240, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "characteristic", width: 240, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "x", width: 90, name: "X", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "y", width: 90, name: "Y", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "quantity", width: 100, name: "Количество", tooltip: "Количество в единицах хранения", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "cell", width: 100, name: "Ячейка", tooltip: "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)", renderCell: TextFormatter}
];


export default function ObjCutsIn({tabRef, obj}) {
  const lc = useLoadingContext();
  const getStyle = () => {
    const style = Object.assign(tabularStyle(tabRef, lc), {position: 'relative'});
    style.height += 50;
    return style;
  };
  const [style, setStyle] = React.useState(getStyle());
  const resize = () => {
    const newStyle = getStyle();
    if(newStyle.width !== style.width || newStyle.height !== style.height) {
      setStyle(newStyle);
    }
  };

  const [row, setRow] = React.useState(null);
  const selectedRowsChange = (rows) => {
    if(rows.size) {
      setRow(obj.cuts.get(Array.from(rows)[0] - 1));
    }
    else {
      setRow(null);
    }
  };

  return <div style={style}>
    <Resize handleWidth="6px" onResizeStop={resize}  onResizeWindow={resize}>
      <ResizeHorizon width={`${(style.width * 8/12).toFixed()}px`} minWidth="300px">
        <ObjTabular
          tabRef={tabRef}
          tabular={obj.cuts}
          columns={columns}
          rootStyle={{height: style.height - 50}}
          selectedRowsChange={selectedRowsChange}
        />
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(style.width * 4/12).toFixed()}px`} minWidth="200px">
        <ObjCuttingSvg row={row} height={style.height}/>
      </ResizeHorizon>
    </Resize>
  </div>;
}
