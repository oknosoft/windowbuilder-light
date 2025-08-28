import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from 'metadata-ui/App/Dialog';

export default function UnmodidiedDialog({confirmOpen, confirmClose, actText}) {
  const {resolve, saveFin, action} = confirmOpen;
  const withClose = action.includes('close');
  const onClose = () => {
    confirmClose();
    resolve(null);
  };
  const forceAction = () => {
    confirmClose();
    resolve(saveFin());
  };
  return <Dialog
    open
    onClose={onClose}
    actions={<>
      <Button autoFocus onClick={onClose}>{withClose ? 'Просто закрыть' : 'Ничего не делать'}</Button>
      <Button onClick={forceAction}>{`${actText} повторно`}</Button>
    </>}
    maxWidth="md"
    title="Документ не изменён">
    {`Подтвердите, что его требуется ${actText.toLowerCase()} повторно`}
  </Dialog>;
}

export function queryModidied({setConfirmOpen, saveFin, obj, action}) {
  if(obj._modified) {
    return saveFin();
  }
  return new Promise((resolve, reject) => {
    setConfirmOpen({resolve, saveFin, action});
  });
}
