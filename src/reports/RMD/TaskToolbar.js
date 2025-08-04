import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import Divider from '@mui/material/Divider';
import SegmentIcon from '@mui/icons-material/Segment';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import {useBackdropContext} from '../../aggregate/App';
import {Toolbar, HtmlTooltip} from '../../aggregate/App/styled';
import {filter, query, setTgt} from './data';
import {run1D, run2D} from '../../documents/work_centers_task/Cutting/OptimizeCut';
import CuttingReport from '../../documents/work_centers_task/Cutting/Report';
import PostBtn from './TaskPost';
import MenuPrint from '../../aggregate/Toolbars/MenuPrint';

const stub = () => null;

export default function TaskToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState, ext, setExt}) {

  const {setBackdrop} = useBackdropContext();

  const {tgt} = rmd;
  const exclude = () => {
    if(tgt.posted) {
      return $p.ui.dialogs.alert({
        title: tgt.presentation,
        text: 'Нельзя редактировать проведённое задание',
        timeout: 10000,
      });
    }
    const rm = [];
    for(const index of selectedRows) {
      rm.push(rmd.tgtrows.find(row => row.row === index));
    }
    for(const row of rm) {
      tgt.set.del(row);
    }
    tgt.fill_by_keys({c2d: true});
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

  const changeTask = (ntgt) => {
    setSelectedRows(new Set());
    setTgt(handleIfaceState, rmd, ntgt);
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
    <HtmlTooltip title="Печать">
      <MenuPrint obj={tgt} variant="button" />
    </HtmlTooltip>
    <PostBtn obj={tgt} changeTask={changeTask} />
  </Toolbar>;
}
