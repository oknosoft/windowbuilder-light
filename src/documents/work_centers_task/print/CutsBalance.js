import React from 'react';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {NumberFormatter} from 'metadata-ui/DataField/Number';
import {DataGrid} from 'react-data-grid';

const columns = [
  {key: "nom", name: "Материал", renderCell: PresentationFormatter},
  {key: "len", name: "Высота", width: 100, renderCell: NumberFormatter},
  {key: "width", name: "Ширина", width: 100, renderCell: NumberFormatter},
  {key: "qty", name: "Штук", width: 100, renderCell: NumberFormatter},
];

function CutsReport({rows}) {
  return <DataGrid
    rowKeyGetter={(row) => rows.indexOf(row)}
    columns={columns}
    rows={rows}
    className="fill-grid"
    style={{minWidth: 600}}
    rowHeight={33}
    // selectedRows={selectedRows}
    // onSelectedRowsChange={setSelectedRows}
    // onCellClick={onCellClick}
    //onCellDoubleClick={onCellDoubleClick}
  />;
}

export function materialSort(a, b) {
  if(a.nom.name > b.nom.name) {
    return 1;
  }
  if(b.nom.name > a.nom.name) {
    return -1;
  }
  return a.len * a.width - b.len * b.width;
}

export function CutsBalance(task, {adapters, ui, utils, cat}) {
  const noms = new Set();
  for(const {nom} of task.cutting) {
    noms.add(nom);
  }
  return adapters.pouch
    .fetch('/adm/api/pgsql/cuts', {
      method: 'POST',
      body: JSON.stringify({nom: Array.from(noms).map(v => v.ref)}),
    })
    .then(res => res.json())
    .then(({rows}) => {
      return ui.dialogs.alert({
        title: CutsBalance.title,
        Component: CutsReport,
        props: {
          rows: rows.map(({nom, len, width, qty}) => ({
            nom: cat.nom.get(nom),
            len: parseFloat(len),
            width: parseFloat(width),
            qty: parseFloat(qty),
          }))
            .sort(materialSort)
        },
        initFullScreen: true,
        large: true,
        timeout: 10e6,
      });
    });
}

CutsBalance.ref = '019da6c5-d795-76d7-8a31-0bfe17e8bf80';
CutsBalance.destination = 'doc.work_centers_task';
CutsBalance.title = 'Остатки обрези';
CutsBalance.jsx = false;
CutsBalance.allowModified = true;
