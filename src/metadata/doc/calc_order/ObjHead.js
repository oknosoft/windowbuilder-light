import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from 'metadata-ui/DataField/Text';
import RefField from '../../../packages/ui/DataField/RefField';
import PartnerField from '../../../packages/ui/PartnerField';
import {NumberField} from '../../../packages/ui/DataField/Number';

export default function ObjHead({obj}) {
  return <Grid container spacing={2} ml={0} mr={0}>
    <Grid xs={12} lg={4}>
      <TextField label="Номер" value={obj.number_doc} enterTab/>
      <TextField label="Дата" value={moment(obj.date).format(moment._masks.date)} enterTab/>
      <RefField obj={obj} fld="organization" enterTab/>
      <PartnerField obj={obj} fld="partner" enterTab/>
    </Grid>
    <Grid xs={12} lg={4}>
      <RefField obj={obj} fld="contract" enterTab/>
      <RefField obj={obj} fld="department" enterTab/>
      <TextField obj={obj} fld="client_of_dealer" enterTab/>
      <TextField label="Адрес доставки" value={obj.shipping_address} enterTab/>
    </Grid>
    <Grid xs={12} lg={4}>
      <RefField obj={obj} fld="manager" enterTab/>
      <TextField obj={obj} fld="note" enterTab/>
      <NumberField obj={obj} fld="amount_internal" readOnly enterTab/>
    </Grid>
  </Grid>;
}
