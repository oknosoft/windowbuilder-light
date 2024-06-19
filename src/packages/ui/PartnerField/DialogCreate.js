import React from 'react';
import Dialog from 'metadata-ui/App/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import RefField from 'metadata-ui/DataField/RefField';

export default function DialogCreate({raw, obj, fld, handleClose, handleSubmit}) {
  const curr = raw[0];
  return <Dialog
    open
    fullWidth
    maxWidth="md"
    onClose={handleClose}
    title="Контрагент по ИНН"
    actions={<>
      <Button onClick={handleClose}>Отмена</Button>
      <Button onClick={handleSubmit}>Создать</Button>
    </>}
  >
    <DialogContentText>{`Создать контрагента '${curr.value}'?`}</DialogContentText>
    <DialogContentText>{`ИНН: ${curr.data.inn}`}</DialogContentText>
    <DialogContentText>{`ОГРН: ${curr.data.ogrn} от ${new Date(1251676800000).toLocaleDateString(curr.data.ogrn_date)}`}</DialogContentText>
    <DialogContentText>{`Адрес: ${curr.data.address.unrestricted_value}`}</DialogContentText>
    {obj? <>
      <hr/>
      <DialogContentText>{`Уточните организацию для основного договора`}</DialogContentText>
      <RefField obj={obj} fld={fld || "organization"} />
    </> : null}
  </Dialog>;
}
