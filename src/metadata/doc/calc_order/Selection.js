import * as React from 'react';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/InputBase';

export default function CalcOrderSelection({scheme, setRefresh}) {

  return <div>
    <Stack direction="row" spacing={2}>
      <Input />
      <Input />
    </Stack>
  </div>;
}
