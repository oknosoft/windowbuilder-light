import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {useBackdropContext} from '../App';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {filter} from './data';
import {run1D} from '../../metadata/doc/work_centers_task/OptimizeCut';


export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState}) {

  const {setBackdrop} = useBackdropContext();

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
    run1D(tgt, setBackdrop)()
      .then((res) => {
        console.log(res.statuses.length);
      });
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
