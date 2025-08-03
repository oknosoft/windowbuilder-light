import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from 'metadata-ui/DataField/Text';
import RefField from 'metadata-ui/DataField/RefField';
import PartnerField from 'metadata-ui/PartnerField';
import {NumberField} from 'metadata-ui/DataField/Number';
import FieldAddr from './DeliveryAddr/FieldAddr';
import ContractField from '../../cat/contracts/ContractField';

const {CatAbonents, current_user} = $p;
const userRestricted = !current_user.role_available('СогласованиеРасчетовЗаказов');

export default function ObjHead({obj, setBackdrop}) {
  const onChange = () => {
    setBackdrop(true);
    obj.recalc()
      .then(() => setBackdrop(false))
      .catch((err) => {
        setBackdrop(false);
        console.error(err);
      });
  };

  const restrict = userRestricted && (obj.branch instanceof CatAbonents) && !obj.branch.empty();

  return <Grid container spacing={1} ml={1} mr={1}>
    <Grid size={{xs: 12, lg: 4}}>
      <TextField label="Номер" value={obj.number_doc} enterTab/>
      <TextField label="Дата" value={moment(obj.date).format(moment._masks.date)} enterTab/>
      <RefField obj={obj} fld="organization" enterTab onChange={onChange}/>
      <PartnerField obj={obj} fld="partner" enterTab disabled={restrict}/>
    </Grid>
    <Grid size={{xs: 12, lg: 4}}>
      <ContractField obj={obj} organization={obj.organization} partner={obj.partner} enterTab onChange={onChange}/>
      <RefField obj={obj} fld="department" enterTab disabled={restrict}/>
      <TextField obj={obj} fld="client_of_dealer" enterTab/>
      <FieldAddr label="Адрес доставки" obj={obj} fld="shipping_address" enterTab/>
    </Grid>
    <Grid size={{xs: 12, lg: 4}}>
      <RefField obj={obj} fld="manager" enterTab/>
      <TextField obj={obj} fld="note" enterTab/>
      <NumberField obj={obj} fld="amount_internal" label={`Сумма ${obj.vat_consider ? 'с НДС' : 'без НДС'}`} readOnly enterTab/>
    </Grid>
  </Grid>;
}
