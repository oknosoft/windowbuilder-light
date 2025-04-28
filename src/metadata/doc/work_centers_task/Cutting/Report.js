import React from 'react';
import CuttingReport1D from './Report1D';
import CuttingReport2D from './Report2D';

export default function CuttingReport(props) {
  return <>
    <CuttingReport1D {...props} />
    <CuttingReport2D {...props} />
  </>;
}
