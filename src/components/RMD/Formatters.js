import React from 'react';
import Typography from '@mui/material/Typography';

export function OrderFormatter(props) {
  const {calc_order} = props.row;
  return `${calc_order.number_doc} ${calc_order.partner.name}`;
}

export function PKFormatter(props) {
  const {elm, type, specimen, obj, region, id} = props.row.obj;
  switch (type.valueOf()) {
    case 'product':
      //return `${obj.product.pad(2)}|${specimen.pad(2)}|Изделие|${obj.owner.name}|${id}`;
      return `${obj.product.pad(2)}|${specimen.pad(2)}|${obj.name}|${id}`;
  }
  return id.toString();
}

export function renderCheckbox({ onChange, ...props }) {
  function handleChange({target, nativeEvent}) {
    onChange(target.checked, nativeEvent.shiftKey);
  }

  return <input type="checkbox" {...props} onChange={handleChange} />;
}

export function renderSummaryDate({row}) {
  return <span style={{textDecoration: 'underline'}}>{
    row.id === 'total_top' ? 'В выделенных строках:' : 'Итого без выделенных:'
  }</span>;
}

export function renderSummaryPower({row}) {
  const v = row.power.toFixed(2);
  return <div style={{textAlign: 'right'}} title={v}>{v}</div>;
}

export function renderSummaryObj({row}) {
  const v = `Штук: ${row.count}, Площадь: ${row.area.toFixed(2)}`;
  return <div style={{display: 'flex'}}>
    <div>{`Штук: ${row.count}`}</div>
    <div style={{flex: 1}}/>
    <div>{`Площадь: ${row.area.toFixed(2)}`}</div>
  </div>;
}

export function renderSummaryTask({row}) {
  return <div style={{display: 'flex'}}>
    <div>{`q:${row.count}, s:${row.area.toFixed(2)}`}</div>
    <div style={{flex: 1}}/>
    <div>{row.power.toFixed(2)}</div>
  </div>;
}


export function colSpan({type}) {
  return type === 'SUMMARY' ? 2 : undefined;
}
