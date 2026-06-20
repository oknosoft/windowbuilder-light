import React from 'react';
import {NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
//import {TextFormatter} from 'metadata-ui/DataField/Text';
import Dialog from 'metadata-ui/App/Dialog';
import ObjTabular from '../../aggregate/FrmObj/ObjTabular';
import FrmOrigin from './FrmOrigin';
import BtnOrigin from './BtnOrigin';


function StageFormatter({row, column}) {
  const stage = row.stage.toString();
  const style = {
    color: `rgba(0, 0, 0, ${row.dop <= -4 ? 0.6 : 0.8})`,
    fontWeight: row.dop <= -4 ? 700 : 100,
  }
  return  <span style={style}>{stage}</span>;
}


const columns = [
  {key: "elm", width: 70, name: "Эл", renderCell: NumberFormatter},
  {key: "nom", width: 240, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "characteristic", width: 180, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "stage", width: 240, name: "Этап", tooltip: "", renderCell: StageFormatter},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в м", renderCell: NumberFormatter},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в м", renderCell: NumberFormatter},
  {key: "qty", width: 90, name: "Штук", renderCell: NumberFormatter},
  {key: "totqty", width: 100, name: "Колич", renderCell: NumberFormatter},
  {key: "totqty1", width: 100, name: "Колич+%", renderCell: NumberFormatter},
  {key: "price", width: 100, name: "Цена себест", renderCell: NumberFormatter},
  {key: "amount", width: 100, name: "∑ себест", renderCell: NumberFormatter},
  {key: "amount_marged", width: 100, name: "∑ с наценкой", renderCell: NumberFormatter},
];

export default function ObjSpecification({tabRef, obj}) {

  const [origin, setOrigin] = React.useState(null);
  const [selectedRow, setRow] = React.useState(null);

  const habdleClose = () => setOrigin(null);
  const handleOpen = () => {
    if(selectedRow) {
      setOrigin(selectedRow.origin);
    }
    else {
      $p.ui.dialogs.alert({title: 'Происхлождение строки', text: 'Не указана текущая строка'});
    }
  };
  const selectedRowsChange = (rows) => {
    setRow(rows.size ? obj.specification.get(Array.from(rows)[0] - 1) : null);
  };
  const hasOrigin = typeof origin === 'string';

  return <>
    <ObjTabular
      tabRef={tabRef}
      tabular={obj.specification}
      columns={columns}
      buttons={<BtnOrigin handleOpen={handleOpen}/>}
      selectedRowsChange={selectedRowsChange}
    />
    {(hasOrigin || origin) && <Dialog
      open
      noSpace
      onClose={habdleClose}
      onOk={habdleClose}
      maxWidth="lg"
      title={(hasOrigin && origin.startsWith('[')) ? 'Стек вызовов' : (origin.presentation || 'Ссылка оборвана')}
    >
      <FrmOrigin origin={origin} setOrigin={setOrigin}/>
    </Dialog>}
  </>;
}
