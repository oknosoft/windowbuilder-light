import React from 'react';
import ObjTabular from './ObjTabular';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {DateCell, DateFormatter} from 'metadata-ui/DataField/Date';
import {RecordKindFormatter} from 'metadata-ui/DataField/RecordKindCell';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import RefCell from 'metadata-ui/DataField/RefCell';

const columns = [
  {key: "record_kind", name: "Движение", width: 120, renderCell: RecordKindFormatter},
  {key: "phase", name: "Фаза", width: 120, renderCell: PresentationFormatter, renderEditCell: RefCell},
  {key: "date", name: "Дата", width: 120, renderCell: DateFormatter},
  {key: "work_shift", name: "Смена", width: 120, renderCell: PresentationFormatter},
  {key: "work_center", name: "Рабочий центр", width: 180, renderCell: PresentationFormatter},
  {key: "obj", name: "Объект", renderCell: PresentationFormatter},
  {key: "stage", name: "Этап", renderCell: PresentationFormatter},
  {key: "calc_order", name: "Расчет", renderCell: PresentationFormatter},
  {key: "power", name: "Мощность", width: 120, renderEditCell: NumberCell, renderCell: NumberFormatter}
];

export default function ObjPlan({tabRef, obj}) {
  return <ObjTabular tabRef={tabRef} tabular={obj.set} columns={columns}/>;
}
