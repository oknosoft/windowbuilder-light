import React from 'react';
import {Toolbar, HtmlTooltip} from '../App/styled';
import Input from '@mui/material/InputBase';
import RefField from '../../packages/ui/DataField/RefField';
import Text from '../../packages/ui/DataField/Text';
import {dp} from './data';

const slot = {
  input: {
    min: '2024-01-01',
    max: '2024-12-31',
  },
};
const style={minWidth: 200};

export default function RemaindersToolbar({scheme}) {

  return <Toolbar disableGutters>
    <Text
      key={scheme.ref + 'from'}
      obj={scheme}
      fld="date_from"
      label={'\xa0Период'}
      inputProps={{type: "date"}}
      fullWidth={false}
      slotProps={slot}
      style={style}
    />
    <Text
      key={scheme.ref + 'till'}
      obj={scheme}
      fld="date_till"
      label={'\xa0по'}
      inputProps={{type: "date"}}
      fullWidth={false}
      slotProps={slot}
      style={style}
    />
    <RefField
      key={scheme.ref + 'phase'}
      obj={dp}
      fld="phase"
      fullWidth={false}
      label={'\xa0\xa0Фаза'}
    />
  </Toolbar>;
}
