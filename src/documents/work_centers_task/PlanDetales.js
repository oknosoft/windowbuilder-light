import React from 'react';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {DateCell, DateFormatter} from 'metadata-ui/DataField/Date';
import {RecordKindFormatter} from 'metadata-ui/DataField/RecordKindCell';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {DataGrid} from 'react-data-grid';

const {enm, cat, doc, md, adapters, ui, utils} = $p;

function RegisterFormatter({row}) {
  const [presentation, setPresentation] = React.useState('');
  React.useEffect(() => {
    const mgr = md.mgr_by_class_name(row.register_type);
    const doc = mgr.get(row.register);
    (doc.is_new() ? doc.load() : Promise.resolve())
      .then(() => setPresentation(doc.presentation));
  }, [row.register]);
  return presentation;
}

function KeyFormatter({row}) {
  const key = cat.planning_keys.get(row.ref);
  const obj = cat.characteristics.get(row.obj);
  return `${obj.name} ${key.id}`;
}

function OrderFormatter({row, column}) {
  const doc = column.mgr.get(row.calc_order);
  return `${doc.number_doc} от ${utils.moment(doc.date).format('YYYY-MM-DD')}`;
}

const columns = [
  {key: "register", name: "Регистратор", width: 200, renderCell: RegisterFormatter},
  {key: "sign", name: "Движение", width: 100, renderCell: RecordKindFormatter},
  {key: "phase", name: "Фаза", width: 100, renderCell: PresentationFormatter, mgr: enm.planning_phases},
  {key: "date", name: "Дата", width: 100, renderCell: DateFormatter},
  //{key: "work_shift", name: "Смена", width: 120, renderCell: PresentationFormatter, mgr: cat.work_shifts},
  //{key: "work_center", name: "Рабочий центр", width: 180, renderCell: PresentationFormatter, mgr: cat.work_centers},
  {key: "ref", name: "Объект", renderCell: KeyFormatter},
  //{key: "stage", name: "Этап", renderCell: PresentationFormatter, mgr: cat.work_center_kinds},
  {key: "calc_order", name: "Расчет", width: 200, renderCell: OrderFormatter, mgr: doc.calc_order},
  {key: "power", name: "Мощность", width: 120, renderCell: NumberFormatter}
];

export function PlanDetales({rows}) {
  return <DataGrid
    rowKeyGetter={(row) => rows.indexOf(row)}
    columns={columns}
    rows={rows}
    className="fill-grid"
    rowHeight={33}
  />;
}

export function planById(barcode) {
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
        timeout: 10e6,
      });
    })
    .then(ev => {
      if(ev) {
        throw new Error();
      }
    });
}

export function planByProd(product) {
  return adapters.pouch
    .fetch(`/adm/api/dates/keys?product=${product.ref}`)
    .then(res => res.json())
    .then((rows) => {
      return ui.dialogs.alert({
        title: `Записи по изделию '${product.toString()}'`,
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

