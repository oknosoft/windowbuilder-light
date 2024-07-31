import React from 'react';
import Alert from '@oknosoft/ui/App/Alert';

export default function DialogsUI({ifaceState}) {
  const {alert} = ifaceState || {};
  return <>
    {alert?.open ? <Alert {...alert}/> : null}
  </>;
}
