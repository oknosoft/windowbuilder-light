import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '../../../packages/ui/DataField/Text';
import RefField from '../../../packages/ui/DataField/RefField';
import {NumberField} from '../../../packages/ui/DataField/Number';

export default function ObjHead({obj}) {
  return <Grid container spacing={2} ml={0} mr={0}>
    <Grid xs={12} lg={4}>
      <TextField label="Номер" value={obj.number_doc}/>
      <TextField label="Дата" value={moment(obj.date).format(moment._masks.date)}/>
      <RefField obj={obj} fld="organization" />
    </Grid>
    <Grid xs={12} lg={4}>
      <RefField obj={obj} fld="partner"/>
      <TextField obj={obj} fld="client_of_dealer"/>
      <TextField label="Адрес доставки" value={obj.shipping_address}/>
    </Grid>
    <Grid xs={12} lg={4}>
      <RefField obj={obj} fld="manager"/>
      <TextField obj={obj} fld="note"/>
      <NumberField obj={obj} fld="amount_internal" readOnly/>
    </Grid>
  </Grid>;
}
