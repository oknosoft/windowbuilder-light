import React from 'react';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter, TextCell} from 'metadata-ui/DataField/Text';
import {NumberFormatter, NumberCell} from 'metadata-ui/DataField/Number';
import {PathEditor, PathFormatter} from './FieldPath';
import ObjTabular from '../../../aggregate/ObjTabular';

const columns = [
  {key: "field", maxWidth: 160, name: "Поле", renderCell: PathFormatter, renderEditCell: PathEditor},
  {key: "caption", maxWidth: 160, name: "Заголовок", renderCell: TextFormatter, renderEditCell: TextCell},
  {key: "width", maxWidth: 160, name: "Ширина", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "tooltip", name: "Подсказка", renderCell: TextFormatter, renderEditCell: TextCell},
  {key: "ctrl_type", name: "Элемент", tooltip: "Тип элемента управления", renderCell: PresentationFormatter},
  {key: "formatter", name: "Формат", tooltip: "Функция форматирования", renderCell: PresentationFormatter},
  {key: "editor", name: "Редактор", tooltip: "Компонент редактирования", renderCell: PresentationFormatter},
];

export default function SchemeSettingsColumns({obj, tabRef}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.fields}
    columns={columns}
  />;
}
