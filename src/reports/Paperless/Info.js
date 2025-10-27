import React from 'react';
import Typography from '@mui/material/Typography';
import {PlanDetales} from '../../documents/work_centers_task/PlanDetales';

export default function BarcodeInfo({paperless}) {
  const {presentation, barcode, specimen, characteristic, rows} = paperless;
  return <>
    <Typography variant="h5">{`${presentation} ${barcode}`}</Typography>
    <Typography variant="h6">{`Экземпляр ${specimen} из ${characteristic.calc_order_row.quantity}`}</Typography>
    <div>
      <PlanDetales rows={rows} compact/>
    </div>
  </>;
}

