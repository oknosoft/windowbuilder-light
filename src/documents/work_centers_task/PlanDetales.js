import React from 'react';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {DateCell, DateFormatter} from 'metadata-ui/DataField/Date';
import {RecordKindFormatter} from 'metadata-ui/DataField/RecordKindCell';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {DataGrid} from 'react-data-grid';

function RegisterFormatter({row}) {
  const [presentation, setPresentation] = React.useState('');
  React.useEffect(() => {
    const mgr = $p.md.mgr_by_class_name(row.register_type);
    const doc = mgr.get(row.register);
    (doc.is_new() ? doc.load() : Promise.resolve())
      .then(() => setPresentation(doc.presentation));
  }, [row.register]);
  return presentation;
}

const columns = [
  {key: "register", name: "Регистратор", width: 200, renderCell: RegisterFormatter},
  {key: "record_kind", name: "Движение", width: 100, renderCell: RecordKindFormatter},
  {key: "phase", name: "Фаза", width: 100, renderCell: PresentationFormatter, mgr: $p.enm.planning_phases},
  {key: "date", name: "Дата", width: 100, renderCell: DateFormatter},
  {key: "work_shift", name: "Смена", width: 120, renderCell: PresentationFormatter, mgr: $p.cat.work_shifts},
  {key: "work_center", name: "Рабочий центр", width: 180, renderCell: PresentationFormatter, mgr: $p.cat.work_centers},
  {key: "obj", name: "Объект", renderCell: PresentationFormatter, mgr: $p.cat.planning_keys},
  {key: "stage", name: "Этап", renderCell: PresentationFormatter, mgr: $p.cat.work_center_kinds},
  {key: "calc_order", name: "Расчет", renderCell: PresentationFormatter, mgr: $p.doc.calc_order},
  {key: "power", name: "Мощность", width: 120, renderCell: NumberFormatter}
];

function PlanDetales({rows}) {
  return <DataGrid
    rowKeyGetter={(row) => rows.indexOf(row)}
    columns={columns}
    rows={rows}
    className="fill-grid"
    rowHeight={33}
  />;
}

export default function planDetales(barcode) {
  const {adapters, ui} = $p;
  return adapters.pouch
    .fetch(`/adm/api/dates/keys?key=${barcode}`)
    .then(res => res.json())
    .then((rows) => {
      return ui.dialogs.alert({
        title: `Записи по ключу '${barcode}'`,
        Component: PlanDetales,
        props: {rows},
        initFullScreen: true,
        large: true,
      });
    })
    .then(ev => {
      if(ev) {
        throw new Error();
      }
    });
}
