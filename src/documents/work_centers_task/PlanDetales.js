import React from 'react';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {DateCell, DateFormatter} from 'metadata-ui/DataField/Date';
import {RecordKindFormatter} from 'metadata-ui/DataField/RecordKindCell';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {DataGrid} from 'react-data-grid';
import {repartition} from './Repartition';

const {enm, cat, doc, md, adapters, ui, utils, DocScaning} = $p;

function RegisterFormatter({row}) {
  const [presentation, setPresentation] = React.useState('');
  React.useEffect(() => {
    const mgr = md.mgr_by_class_name(row.register_type);
    const doc = mgr.get(row.register);
    if(doc instanceof DocScaning) {
      setPresentation(`Скан ${utils.moment(row.period).format('DD.MM.YYYY HH:mm:ss')}`);
    }
    else {
      (doc.is_new() ? doc.load() : Promise.resolve())
        .then(() => setPresentation(doc.presentation));
    }
  }, [row.register]);
  return presentation;
}

function KeyFormatter({row}) {
  const key = cat.planning_keys.get(row.ref);
  const obj = cat.characteristics.get(row.obj);
  return `${obj.name} (${key.specimen.pad(2)}) ${key.id}`;
  // return `${obj.calc_order.number_doc}/${obj.product.pad(2)}/${key.specimen.pad(2)}/${key.id}`;
}

function OrderFormatter({row, column}) {
  const doc = column.mgr.get(row.calc_order);
  return `${doc.number_doc} от ${utils.moment(doc.date).format('DD.MM.YYYY')}`;
}

const columns = [
  {key: "register", name: "Регистратор", width: 220, renderCell: RegisterFormatter},
  //{key: "sign", name: "Движение", width: 100, renderCell: RecordKindFormatter},
  //{key: "phase", name: "Фаза", width: 100, renderCell: PresentationFormatter, mgr: enm.planning_phases},
  {key: "date", name: "Дата", width: 100, renderCell: DateFormatter},
  //{key: "work_shift", name: "Смена", width: 120, renderCell: PresentationFormatter, mgr: cat.work_shifts},
  {key: "work_center", name: "Рабочий центр", width: 180, renderCell: PresentationFormatter, mgr: [cat.work_centers, cat.delivery_areas]},
  {key: "ref", name: "Объект", renderCell: KeyFormatter},
  //{key: "stage", name: "Этап", renderCell: PresentationFormatter, mgr: cat.work_center_kinds},
  //{key: "calc_order", name: "Расчет", width: 220, renderCell: OrderFormatter, mgr: doc.calc_order},
  {key: "power", name: "Мощность", width: 100, renderCell: NumberFormatter}
];

const columnsCompact = columns
  .filter(v => v.key !== 'ref')
  .map(v => v.key == 'register' ? {key: v.key, name: v.name, renderCell: v.renderCell} : v);


export function PlanDetales({rows, compact}) {
  // const [selectedRows, setSelectedRows] = React.useState(new Set());
  // const onCellClick = ({row, column, selectCell}) => {
  //   const index = rows.indexOf(row);
  //   if(!selectedRows.size || Array.from(selectedRows)[0] !== index) {
  //     setSelectedRows(new Set([index]));
  //   }
  // };
  const onCellDoubleClick = async ({column, row, rowIdx, selectCell}, ev) => {
    const {planing_key, register, register_type} = row;
    if(register_type === 'doc.work_centers_task') {
      const obj = doc.work_centers_task.get(register);
      if(obj.is_new()) {
        await obj.load();
      }
      const setRow = obj.set.find({record_kind: -1, obj: cat.planning_keys.by_id(planing_key)});
      if(setRow) {
        ui.dialogs.alert({
          title: `Оформить переделку`,
          text: `Подтвердите возврат на переделку ключа '${planing_key}'`,
          timeout: 5000,
        })
          .then((err) => {
            if(!err) {
              const ev = doc.planning_event.create({basis: obj.valueOf()}, false, true);
              const correct = ev.set.add(setRow);
              correct.record_kind = 1;
              correct.date = new Date();
              correct.part = ev;
              return ev.save(true)
                .then(() => ui.dialogs.handleNavigate(`/doc/planning_event/${ev.ref}?modified=false`));
            }
          })
          .catch((err) => null);
      }
    }
    else {
      const mgr = md.mgr_by_class_name(register_type);
      return ui.dialogs.alert({
        title: `Действие по ключу '${planing_key}'`,
        text: `Не предусмотрено для регистратора с типом '${mgr.metadata().synonym}'`,
        timeout: 5000,
      });
    }
  };
  return <DataGrid
    rowKeyGetter={(row) => rows.indexOf(row)}
    columns={compact ? columnsCompact : columns}
    rows={rows}
    className="fill-grid"
    rowHeight={33}
    // selectedRows={selectedRows}
    // onSelectedRowsChange={setSelectedRows}
    // onCellClick={onCellClick}
    onCellDoubleClick={onCellDoubleClick}
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

