import React from 'react';
import CellExpanderFormatter from './CellExpanderFormatter';
import GlassDetails from './GlassDetails';
import CompositeDetails from './CompositeDetails';

import {useSelectedContext} from './selectedContext';

export default function ObjGlassesDetail({ row, tabIndex, isCellEditable, onRowChange }) {

  const selected = useSelectedContext() === row.key;

  if (row.type === 'DETAIL') {
    const Component = row.row.inset.insert_type.is('glass') ? GlassDetails : CompositeDetails;
    return Component({row, selected});
  }

  return (
    <CellExpanderFormatter
      expanded={row.expanded}
      tabIndex={tabIndex}
      onCellExpand={() => onRowChange({ ...row, expanded: !row.expanded })}
    />
  );
}

