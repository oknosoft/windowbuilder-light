import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {tgt, filter} from './data';


export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState}) {

  const exclude = () => {
    for(const index of selectedRows) {
      tgt.set.del(rmd.tgtrows[index]);
    }
    setSelectedRows(new Set());
    filter({rmd, scheme, handleIfaceState});
  };

  return <Toolbar disableGutters>
    <HtmlTooltip title="Исключить из задания">
      <IconButton disabled={!selectedRows.size} onClick={exclude}><UTurnLeftIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Освежить данные">
      <IconButton disabled={true} onClick={null}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
