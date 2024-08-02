import React from 'react';
import CuttingReport1D from './CuttingReport1D';
import CuttingReport2D from './CuttingReport2D';

export default function CuttingReport(props) {
  return <>
    <CuttingReport1D {...props} />
    <CuttingReport2D {...props} />
  </>;
}
