import React from 'react';
import RefCell from '../../../../packages/ui/DataField/RefCell';
import {sublist} from './RowProxy';

const options = sublist.filter(opt => {
  const thickness = opt.thickness();
  return thickness > 0 && thickness < 28;
});

export default function RegionInset(props) {
  props.options = options;
  return RefCell(props);
}
