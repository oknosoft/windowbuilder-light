import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from 'metadata-ui/DataField/Text';
import RefField from 'metadata-ui/DataField/RefField';

export default function ObjHead({obj}) {
  return <Grid container spacing={2} ml={0} mr={0}>
    <Grid size={{xs: 12, lg: 4}}>
      <TextField label="Номер" value={obj.number_doc}/>
      <TextField label="Дата" value={moment(obj.date).format(moment._masks.date)}/>
    </Grid>
    <Grid size={{xs: 12, lg: 8}}>
      <RefField obj={obj} fld="basis" readOnly/>
      <TextField obj={obj} fld="note"/>
    </Grid>
  </Grid>;
}
