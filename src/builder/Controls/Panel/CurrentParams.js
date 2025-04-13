import React from 'react';
import FieldSet from '@oknosoft/ui/DataField/FieldSet';
import ParamField from '@oknosoft/ui/DataField/ParamField';

const names = new Map();
const grp_names = $p.cch.predefinedElmnts.find({synonym: 'sys_prm_grp_names'});
if(grp_names) {
  for(const row of grp_names.elmnts) {
    names.set(row.row, row.value);
  }
}

export default function CurrentParams({params}) {
  const res = [];
  for(const [grouping, prms] of params.list) {
    res.push(<FieldSet key={grouping} title={names.get(grouping) || 'Параметры'} defaultExpanded>
      {prms.map(param => {
        return <ParamField key={param.ref} obj={params.proxy} param={param}/>;
      })}
    </FieldSet>);
  }
  return res;
}
