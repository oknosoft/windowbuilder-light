import React from 'react';
import CellExpanderFormatter from './CellExpanderFormatter';
import Autocomplete from '../../../components/DataField/Autocomplete';
import {GlassesDetail} from './styled';
export default function ObjGlassesDetail({ row, isCellSelected, onRowChange }) {
  if (row.type === 'DETAIL') {
    return Details(row);
  }

  return (
    <CellExpanderFormatter
      expanded={row.expanded}
      isCellSelected={isCellSelected}
      onCellExpand={() => {
        onRowChange({ ...row, expanded: !row.expanded });
      }}
    />
  );
}

const options = [{ref: 1, name: 'Без обработки'}, {ref: 2, name: 'Фаска'}];
function Details(row) {
  return <>
    <Autocomplete
      options={options}
      value={options[0]}
      label="Кромка №1"
      title="Обработка кромки"
    />
    <Autocomplete
      options={options}
      value={options[0]}
      label="Кромка №2"
      title="Обработка кромки"
    />
    <Autocomplete
      options={options}
      value={options[0]}
      label="Кромка №3"
      title="Обработка кромки"
    />
    <Autocomplete
      options={options}
      value={options[0]}
      label="Кромка №4"
      title="Обработка кромки"
    />
    <br/>
    ...прочие параметры
  </>;
}
