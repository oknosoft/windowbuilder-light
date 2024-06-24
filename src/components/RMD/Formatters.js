import React from 'react';

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
