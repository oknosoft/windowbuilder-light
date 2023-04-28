import React from 'react';
import {styled} from '@mui/material/styles';
import { useFocusRef } from 'react-data-grid';

export const CellExpand = styled('div')(() => ({
  float: 'right',
  display: 'table',
  blockSize: '100%',
  '& span': {
    display: 'table-cell',
    verticalAlign: 'middle',
    cursor: 'pointer',
  }
}));

export default function CellExpanderFormatter({isCellSelected, expanded, onCellExpand}) {
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onCellExpand();
    }
  }

  return (
    <CellExpand>
      <span onClick={onCellExpand} onKeyDown={handleKeyDown}>
        <span ref={ref} tabIndex={tabIndex}>
          {expanded ? '\u25BC' : '\u25B6'}
        </span>
      </span>
    </CellExpand>
  );
}
