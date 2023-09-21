import React from 'react';
import IconButton from '@mui/material/IconButton';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import {HtmlTooltip} from '../../../components/App/styled';

export default function Optimize2D({setBackdrop, obj}) {

  const run = () => Promise.resolve()
    .then(() => setBackdrop(true))
    .then(() => setTimeout(() => setBackdrop(false), 1000));

  return <HtmlTooltip title="Оптимизировать раскрой 2D">
    <IconButton onClick={run}><ViewQuiltIcon/></IconButton>
  </HtmlTooltip>;
}
