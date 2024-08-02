import React from 'react';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter} from 'metadata-ui/DataField/Text';
import {tabularStyle} from '../../dataGrid';
import {useLoadingContext} from '../../../components/Metadata';
import ToolbarTabular from '../../aggregate/ToolbarTabular';
import ObjTabular from '../../aggregate/ObjTabular';
import ObjCuttingSvg from './ObjCuttingSvg';
import {CutsInBtns} from './OptimizeCut';

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

const record_kind = $p.enm.debit_credit_kinds.debit;
const stub = () => null;

export default function ObjCutsIn({tabRef, obj, setBackdrop}) {
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

  const [ext, setExt] = React.useState(null);
  const buttons = <CutsInBtns obj={obj} setBackdrop={setBackdrop} ext={ext} setExt={setExt}/>;

  return <div style={style}>
    <Resize handleWidth="6px" onResizeStop={resize}  onResizeWindow={resize}>
      <ResizeHorizon width={`${(style.width * 8/12).toFixed()}px`} minWidth="300px">
        {ext ?
          <div style={{height: style.height - 50}}>
            <ToolbarTabular clear={stub} create={stub} clone={stub} remove={stub} buttons={buttons}/>
            {ext}
          </div> :
          <ObjTabular
            tabRef={tabRef}
            tabular={obj.cuts}
            columns={columns}
            rootStyle={{height: style.height - 50}}
            selectedRowsChange={selectedRowsChange}
            selection={{record_kind}}
            buttons={buttons}
          />
        }
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(style.width * 4/12).toFixed()}px`} minWidth="200px">
        <ObjCuttingSvg row={row} height={style.height}/>
      </ResizeHorizon>
    </Resize>
  </div>;
}
