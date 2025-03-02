// @flow weak

import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function Window(props) {
  return <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12,3V21" style={{
      stroke: 'rgba(0, 0, 0, 0.3)',
    }}/>
    <path
      d="M6,3H18a1,1,0,0,1,1,1V21a0,0,0,0,1,0,0H5a0,0,0,0,1,0,0V4A1,1,0,0,1,6,3Z"
      style={{
        stroke: 'rgba(0, 0, 0, 0.54)',
        fill: 'none',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
  </SvgIcon>;
}
