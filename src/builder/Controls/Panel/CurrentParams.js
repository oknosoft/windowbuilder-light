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

export default function CurrentParams({params, flat, disabled}) {
  const res = [];
  for(const [grouping, prms] of params.list) {
    if(flat && !names.get(grouping)) {
      prms.forEach((param, index) => {
        res.push(<ParamField key={index} obj={params.proxy} param={param} disabled={disabled}/>);
      })
    }
    else {
      res.push(<FieldSet key={grouping || "emptyGroup"} title={names.get(grouping) || 'Параметры'} defaultExpanded>
        {prms.map((param, index) => {
          return <ParamField key={index} obj={params.proxy} param={param} disabled={disabled}/>;
        })}
      </FieldSet>);
    }
  }
  return res;
}
