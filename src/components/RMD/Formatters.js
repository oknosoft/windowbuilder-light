import React from 'react';

export function OrderFormatter(props) {
  const {calc_order} = props.row;
  return calc_order.number_doc;
}

export function PKFormatter(props) {
  const {calc_order} = props.row;
  return calc_order.number_doc;
}
