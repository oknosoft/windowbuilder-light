import React from 'react';
import Box from '@mui/material/Box';
import QuickSelection from '../../metadata/cat/scheme_settings/Selection/Quick';

export default function RemaindersQuickFilter({obj}) {
  const rows = [];
  for(const row of obj.selection) {
    if(row.left_value !== 'phase') {
      rows.push(<QuickSelection key={row.row} row={row} />);
    }
  }
  return <Box sx={{p: 1}}>{rows}</Box>;
}
