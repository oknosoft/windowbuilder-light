import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import Divider from '@mui/material/Divider';
import SegmentIcon from '@mui/icons-material/Segment';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {useBackdropContext} from '../App';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {filter, query, setTgt} from './data';
import {run1D, run2D} from '../../metadata/doc/work_centers_task/OptimizeCut';
import CuttingReport from '../../metadata/doc/work_centers_task/CuttingReport';
import PostBtn from './TaskPost';

const stub = () => null;

export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState, ext, setExt}) {

  const {setBackdrop} = useBackdropContext();

  const {tgt} = rmd;
  const exclude = () => {
    const rm = [];
    for(const index of selectedRows) {
      rm.push(rmd.tgtrows.find(row => row.row === index));
    }
    for(const row of rm) {
      tgt.set.del(row);
    }
    setSelectedRows(new Set());
    filter({rmd, scheme, handleIfaceState});
  };

  const exec1D = () => {
    tgt.fill_by_keys();
    run1D(tgt, setBackdrop, setExt)()
      .then((res) => {
        console.log(res?.statuses?.length);
      });
  };

  const exec2D = () => {
    tgt.fill_by_keys({c2d: true});
    run2D(tgt, setBackdrop, setExt)();
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
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Оптимизировать раскрой профиля">
      <IconButton onClick={exec1D}><SegmentIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Оптимизировать раскрой 2D">
      <IconButton onClick={exec2D}><ViewQuiltIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Показать статистику раскроя">
      <IconButton onClick={report}><AssessmentOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <PostBtn obj={tgt} changeTask={changeTask}/>
  </Toolbar>;
}
