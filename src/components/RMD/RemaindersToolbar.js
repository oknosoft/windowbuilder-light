import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {Toolbar, HtmlTooltip} from '../App/styled';
import RefField from '../../packages/ui/DataField/RefField';
import Text from '../../packages/ui/DataField/Text';
import {dp, query} from './data';

const slot = {
  input: {
    min: '2024-01-01',
    max: '2024-12-31',
  },
};
const style={minWidth: 200};
const labelProps = {style: {textAlign: 'center', top: -2}};

export default function RemaindersToolbar({rmd, scheme, handleIfaceState}) {

  return <Toolbar disableGutters>
    <Text
      key={scheme.ref + 'from'}
      obj={scheme}
      fld="date_from"
      label="Период"
      labelProps={labelProps}
      inputProps={{type: "date"}}
      fullWidth={false}
      slotProps={slot}
      style={style}
    />
    <Text
      key={scheme.ref + 'till'}
      obj={scheme}
      fld="date_till"
      label="по"
      labelProps={labelProps}
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
      label="Фаза"
      labelProps={labelProps}
    />
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Уточнить фильтр">
      <IconButton onClick={null}><FilterAltOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Освежить данные">
      <IconButton onClick={() => query({rmd, scheme, handleIfaceState})}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
