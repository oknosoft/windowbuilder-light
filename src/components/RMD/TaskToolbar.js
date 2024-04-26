import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {filter} from './data';


export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState}) {

  const {tgt} = rmd;
  const exclude = () => {
    for(const index of selectedRows) {
      tgt.set.del(rmd.tgtrows[index]);
    }
    setSelectedRows(new Set());
    filter({rmd, scheme, handleIfaceState});
  };

  const cutting = () => {
    tgt.fill_by_keys({c2d: true});
  };

  return <Toolbar disableGutters>
    <HtmlTooltip title="Исключить из задания">
      <IconButton disabled={!selectedRows.size} onClick={exclude}><UTurnLeftIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Оценка раскроя">
      <IconButton disabled={!tgt.set.count()} onClick={cutting}><BalanceOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Освежить данные">
      <IconButton disabled={true} onClick={null}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
