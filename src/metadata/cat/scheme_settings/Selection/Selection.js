import React from 'react';
import RefInField from './RefInField';
import Period from './Period';

const placeholders = {
  obj_delivery_state: 'Статусы',
  department: 'Подразделения',
  partner: 'Контрагенты',
  manager: 'Менеджеры',
};

export default function Selection({scheme, setRefresh}) {
  const debounced = $p.utils.debounce(setRefresh, 800);
  const res = [];
  if(scheme.child_meta()?.parts?.[0] === 'doc') {
    res.push(<Period key="date" scheme={scheme} setRefresh={debounced} />);
  }
  for(const row of scheme.selection) {
    if(row.use && row.left_value_type === 'path') {
      res.push(row.comparison_type.is('in') ?
        <RefInField key={row.left_value} row={row} placeholder={placeholders[row.left_value]} setRefresh={debounced}/> :
        <div key={row.left_value}>{row.left_value}</div>
      );
    }
  }
  return <div style={{marginRight: 6}}>{res}</div>;
}
