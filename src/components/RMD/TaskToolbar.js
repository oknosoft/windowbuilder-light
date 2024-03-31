import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {dp, query} from './data';


export default function TaskToolbar({rmd, scheme, handleIfaceState}) {

  return <Toolbar disableGutters>
    <HtmlTooltip title="Уточнить фильтр">
      <IconButton onClick={null}><FilterAltOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Освежить данные">
      <IconButton onClick={null}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
