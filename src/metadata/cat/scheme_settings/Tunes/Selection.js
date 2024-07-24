import React from 'react';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import RefCell from 'metadata-ui/DataField/RefCell';
import {TypeEditor, TypeFormatter} from './FieldType';
import ObjTabular from '../../../aggregate/ObjTabular';

const columns = [
  {key: "left_value_type", maxWidth: 160, name: "Тип слева", renderCell: TypeFormatter, renderEditCell: TypeEditor},
  {key: "left_value", maxWidth: 200, name: "Значение слева", renderCell: PresentationFormatter, renderEditCell: RefCell},
  {key: "comparison_type", maxWidth: 160, name: "Вид сравнения", renderCell: PresentationFormatter, renderEditCell: RefCell},
  {key: "right_value_type", maxWidth: 160, name: "Тип справа", renderCell: TypeFormatter, renderEditCell: TypeEditor},
  {key: "right_value", name: "Значение справа", renderCell: PresentationFormatter, renderEditCell: RefCell},
];

export default function SchemeSettingsSelection({obj, tabRef}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.selection}
    columns={columns}
  />;
}
