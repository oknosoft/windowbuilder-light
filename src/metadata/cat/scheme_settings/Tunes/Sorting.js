import React from 'react';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter, TextCell} from 'metadata-ui/DataField/Text';
import {NumberFormatter, NumberCell} from 'metadata-ui/DataField/Number';
import {PathEditor, PathFormatter} from './FieldPath';
import ObjTabular from '../../../aggregate/ObjTabular';

const columns = [
  {key: "field", maxWidth: 160, name: "Поле", renderCell: PathFormatter, renderEditCell: PathEditor},
];

export default function SchemeSettingsSorting({obj, tabRef}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.sorting}
    columns={columns}
  />;
}
