
import React from 'react';

export default function FieldCnnProps({elm}) {
  const {b, e} = elm;
  let node1;
  if(b.selected) {
    node1 = 'b';
  }
  else if(e.selected) {
    node1 = 'e';
  }
  if(node1) {
    const cnn_point = elm.cnn_point(node1);
    const params = new Set();
    if(cnn_point?.cnn && !cnn_point.cnn.empty()) {
      for(const row of cnn_point.cnn.selection_params) {
        row.origin.is('cnn') && params.add(row);
      }
      for(const row of cnn_point.cnn.sizes) {
        row.origin.is('cnn') && params.add(row);
      }
    }

  }
  return null;
}
