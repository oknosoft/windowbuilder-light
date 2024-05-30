import React from 'react';
import Stack from '@mui/material/Stack';
import Text from 'metadata-ui/DataField/Text';

const slot = {
  input: {
    min: '2024-01-01',
    max: '2024-12-31',
  },
};
const dateStyle={minWidth: 130};
const dateInputProps = {type: "date", label: {show: false}};
const labelProps = {style: {textAlign: 'center', top: -2}};

export default function Period({scheme, setRefresh}) {

  const onChange = $p.utils.debounce(setRefresh, 900);

  return <Stack direction="row" spacing={2}>
    <Text
      obj={scheme}
      fld="date_from"
      inputProps={dateInputProps}
      fullWidth={false}
      slotProps={slot}
      style={dateStyle}
      onInput={onChange}
    />
    <Text
      obj={scheme}
      fld="date_till"
      inputProps={dateInputProps}
      fullWidth={false}
      slotProps={slot}
      style={dateStyle}
      onInput={onChange}
    />
  </Stack>;
}
