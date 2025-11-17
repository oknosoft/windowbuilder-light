import React from 'react';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {PlanDetales} from '../../documents/work_centers_task/PlanDetales';
import Remake from './Remake';

export const Cell = styled('div')(({theme}) => ({
  height: 'calc(100% - 8px)',
  paddingTop: theme.spacing(),
}));

export default function BarcodeInfo({paperless, handleIfaceState, setBackdrop}) {
  const {presentation, barcode, specimen, characteristic, calc_order, rows} = paperless;
  return presentation ? <Cell>
    <Typography variant="h5">{`${presentation} ${barcode}`}</Typography>
    <Typography variant="h5">{calc_order?.client_of_dealer ? `${calc_order?.client_of_dealer} ${calc_order.partner.name}` : calc_order?.partner.name}</Typography>
    <Typography variant="h6">{`Экземпляр ${specimen} из ${characteristic?.calc_order_row.quantity}`}</Typography>
    <div>
      <PlanDetales rows={rows} compact/>
    </div>
    <Remake paperless={paperless} handleIfaceState={handleIfaceState} setBackdrop={setBackdrop}/>
  </Cell> : <Typography variant="h5">{`Ключ не найден: ${barcode}`}</Typography>;
}

