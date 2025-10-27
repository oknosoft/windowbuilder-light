import React from 'react';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {PlanDetales} from '../../documents/work_centers_task/PlanDetales';

export const Cell = styled('div')(({theme}) => ({
  height: 'calc(100% - 8px)',
  paddingTop: theme.spacing(),
}));

export default function BarcodeInfo({paperless}) {
  const {presentation, barcode, specimen, characteristic, calc_order, rows} = paperless;
  return <Cell>
    <Typography variant="h5">{`${presentation} ${barcode}`}</Typography>
    <Typography variant="h5">{calc_order.client_of_dealer ? `${calc_order.client_of_dealer} ${calc_order.partner.name}` : calc_order.partner.name}</Typography>
    <Typography variant="h6">{`Экземпляр ${specimen} из ${characteristic.calc_order_row.quantity}`}</Typography>
    <div>
      <PlanDetales rows={rows} compact/>
    </div>
  </Cell>;
}

