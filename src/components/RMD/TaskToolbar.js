import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {useBackdropContext} from '../App';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {filter, query, setTgt} from './data';
import {run1D} from '../../metadata/doc/work_centers_task/OptimizeCut';
import CuttingReport from '../../metadata/doc/work_centers_task/CuttingReport';
import PostBtn from './TaskPost';


export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState, ext, setExt}) {

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
    run1D(tgt, setBackdrop, setExt)()
      .then((res) => {
        console.log(res.statuses.length);
      });
  };

  const report = () => {
    if(ext) {
      setExt(null);
    }
    else {
      setExt(<CuttingReport obj={tgt} />);
    }
  };

  const changeTask = () => {
    const ntgt = tgt._manager.create({date: new Date()}, false, true);
    setSelectedRows(new Set());
    setTgt(handleIfaceState, rmd, ntgt);
    rmd.tgt = ntgt;
    query({rmd, scheme, handleIfaceState});
  };

  return <Toolbar disableGutters>
    <HtmlTooltip title="Исключить из задания">
      <IconButton disabled={!selectedRows.size} onClick={exclude}><UTurnLeftIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Оценка раскроя">
      <IconButton disabled={!tgt.set.count()} onClick={cutting}><BalanceOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <PostBtn obj={tgt} changeTask={changeTask}/>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Статистика раскроя">
      <IconButton onClick={report}><AssessmentOutlinedIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
