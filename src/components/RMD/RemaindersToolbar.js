import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import UTurnRightIcon from '@mui/icons-material/UTurnRight';
import Divider from '@mui/material/Divider';
import {Toolbar, HtmlTooltip} from '../App/styled';
import RefField from '../../packages/ui/DataField/RefField';
import Text from '../../packages/ui/DataField/Text';
import {dp, query, filter} from './data';

const slot = {
  input: {
    min: '2024-01-01',
    max: '2024-12-31',
  },
};
const style={minWidth: 200};
const labelProps = {style: {textAlign: 'center', top: -2}};

export default function RemaindersToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState}) {

  const include = () => {
    const {tgt} = rmd;
    for(const index of selectedRows) {
      const src = rmd.rows[index];
      const row = tgt.set.add(src);
      row.record_kind = -1;
      //row.phase = dp.phase;
    }
    setSelectedRows(new Set());
    filter({rmd, scheme, handleIfaceState});
  };

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
    <HtmlTooltip title="Освежить данные">
      <IconButton onClick={() => query({rmd, scheme, handleIfaceState})}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Уточнить фильтр">
      <IconButton onClick={null}><FilterAltOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Включить в задание">
      <IconButton disabled={!selectedRows.size} onClick={include}><UTurnRightIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
