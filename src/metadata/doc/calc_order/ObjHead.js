import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '../../../components/DataField/Text';

export default function ObjHead({obj}) {
  return <Grid container spacing={2} ml={0} mr={0}>
    <Grid xs={12} lg={4}>
      <TextField label="Номер" value={obj.number_doc}/>
      <TextField label="Дата" value={moment(obj.date).format(moment._masks.date)}/>
      <TextField label="Организация" value={obj.organization?.presentation}/>
    </Grid>
    <Grid xs={12} lg={4}>
      <TextField label="Контрагент" value={obj.partner.presentation}/>
      <TextField label="Клиент дилера" value={obj.client_of_dealer}/>
      <TextField label="Адрес доставки" value={obj.shipping_address}/>
    </Grid>
    <Grid xs={12} lg={4}>
      <TextField label="Ответственный" value={obj.manager.presentation}/>
      <TextField label="Комментарий" value={obj.note}/>
      <TextField label="Сумма документа" value={obj.doc_amount}/>
    </Grid>
  </Grid>;
}
