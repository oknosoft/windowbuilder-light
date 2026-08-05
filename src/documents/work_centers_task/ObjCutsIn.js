import React from 'react';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter} from 'metadata-ui/DataField/Text';
import RefCell from 'metadata-ui/DataField/RefCell';
import {tabularStyle} from '../../aggregate/AppLoad/dataGrid';
import {useLoadingContext} from '../../aggregate/Metadata';
import ObjTabular from '../../aggregate/FrmObj/ObjTabular';
import ObjCuttingSvg from './ObjCuttingSvg';
import {CutsInBtns} from './Cutting/OptimizeCut';

const record_kind = $p.enm.debit_credit_kinds.debit;

const stub = () => null;

function calcIndicator(row) {
  const {stick, _owner: {_owner}} = row;
  let indicator = 'cell_indicator cell_number';
  if(row.record_kind === record_kind) {
    if(_owner.cutting.find({stick})) {
      indicator += ' cell_checked';
    }
  }
  return indicator;
}

export function StickFormatter({row, column}) {
  const {stick, _owner, _manager} = row;

  const [indicator, setIndicator] = React.useState(React.useMemo(() => calcIndicator(row)), [row]);

  React.useEffect(() => {
    function update (curr, flds){
      if(curr === row && 'indicator' in flds) {
        setIndicator(calcIndicator(row));
      }
    }
    _manager?.on({update});
    return () => _manager?.off({update});
  }, [row]);

  return <div className={indicator} title={stick}>{stick}</div>;
}

export const columns = [
  {key: "stick", width: 77, name: "№ загот", tooltip: "№ листа (хлыста, заготовки)", renderCell: StickFormatter},
  //{key: "pair", width: 80, name: "№ пары", tooltip: "№ парной заготовки", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "nom", width: 240, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter, renderEditCell: RefCell},
  {key: "characteristic", width: 240, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter, renderEditCell: RefCell},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "x", width: 90, name: "X", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "y", width: 90, name: "Y", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "quantity", width: 100, name: "Количество", tooltip: "Количество в единицах хранения", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "cell", width: 100, name: "Ячейка", tooltip: "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)", renderCell: TextFormatter}
];


export default function ObjCutsIn({tabRef, obj, setBackdrop, selSel}) {
  const lc = useLoadingContext();
  const getStyle = () => {
    const style = Object.assign(tabularStyle(tabRef, lc), {position: 'relative'});
    style.height += 50;
    return style;
  };
  const [style, setStyle] = React.useState(getStyle());
  const [width2, setWidth2] = React.useState(style.width * 4/12);
  const resize = (what) => {
    const newStyle = getStyle();
    if(what?.type === "horizon") {
      setWidth2(what.resizeChilds[1].width);
    }
    if(newStyle.width !== style.width || newStyle.height !== style.height) {
      setStyle(newStyle);
    }
  };

  const [selected, setRow] = React.useState({row: null});
  const selectedRowsChange = (rows) => {
    setRow({row: rows.size ? obj.cuts.find({row: Array.from(rows)[0]}) : null, rows});
  };

  const [ext, setExt] = React.useState(null);
  const buttons = <CutsInBtns obj={obj} setBackdrop={setBackdrop} ext={ext} setExt={setExt} selected={selected} mode="cuts"/>;

  //<ToolbarTabular clear={stub} create={stub} clone={stub} remove={stub} buttons={buttons}/>
  return <div style={style}>
    <Resize handleWidth="6px" onResizeStop={resize}  onResizeWindow={resize}>
      <ResizeHorizon width={`${(style.width * 8/12).toFixed()}px`} minWidth="300px">
        {ext ?
          <div style={{height: style.height - 50}}>
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
            selSel={selSel}
          />
        }
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(width2).toFixed()}px`} minWidth="200px">
        <ObjCuttingSvg row={selected.row} height={style.height} width={width2}/>
      </ResizeHorizon>
    </Resize>
  </div>;
}
