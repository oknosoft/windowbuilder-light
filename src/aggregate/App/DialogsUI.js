import React from 'react';
import Alert from '@oknosoft/ui/App/Alert';
import Confirm from '@oknosoft/ui/App/Confirm';

export default function DialogsUI({ifaceState}) {
  const {alert, confirm} = ifaceState || {};
  return <>
    {alert?.open ? <Alert {...alert}/> : null}
    {confirm?.open ? <Confirm {...confirm}/> : null}
  </>;
}
