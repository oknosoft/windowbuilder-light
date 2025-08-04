import React from 'react';
import {DataGrid} from 'react-data-grid';
import {Row as BaseRow, SelectColumn} from 'react-data-grid';
import Dialog from 'metadata-ui/App/Dialog';
import {NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';

const columns = [
    SelectColumn,
  {key: "nom", width: 280, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "qty", width: 90, name: "Штук", renderCell: NumberFormatter},
  {key: "s", width: 90, name: "Площадь", renderCell: NumberFormatter},
  {key: "power", width: 90, name: "Мощность", renderCell: NumberFormatter},
];

const rowKeyGetter = (row) => row.nom.ref;

function renderRow(key, props) {
  const style = props.row.qty < 4 ? {color: 'red'} : undefined;
  return <BaseRow key={key} {...props} style={style} />;
}

export default function RemaindersGroupSelect({groupSelectSetOpen, setSelectedRows, rows}) {

  const setClose = () => groupSelectSetOpen(false);
  const onOk = () => {
    setClose();
    const selectedRows = new Set();
    for(const src of rows) {
      const nom = src.obj.obj.imaterial;
      if(localSelectedRows.has(nom.ref)) {
        selectedRows.add(src.row);
      }
    }
    setSelectedRows(selectedRows);
  };
  const [localSelectedRows, localSetSelectedRows] = React.useState(new Set());
  const grouped = [];
  for(const src of rows) {
    const nom = src.obj.obj.imaterial;
    const row = grouped.find(v => v.nom === nom) || {nom, qty: 0, s: 0, power: 0};
    if(!grouped.includes(row)) {
      grouped.push(row);
    }
    row.qty +=1;
    row.s += src.obj.obj.s;
    row.power += src.power;
  }
  grouped.sort($p.utils.sort('qty'));
  for(const row of grouped) {
    row.s = row.s.round(2);
    row.power = row.power.round(1);
  }

  return <Dialog open onClose={setClose} onOk={onOk} maxWidth="lg" title="Выделить группы">
    <DataGrid
      columns={columns}
      rows={grouped}
      selectedRows={localSelectedRows}
      onSelectedRowsChange={localSetSelectedRows}
      rowKeyGetter={rowKeyGetter}
      renderers={{renderRow}}
    />
  </Dialog>
}
