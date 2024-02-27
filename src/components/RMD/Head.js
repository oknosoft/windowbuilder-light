import React from 'react';
import IconButton from '@mui/material/IconButton';
import {Toolbar, HtmlTooltip} from '../../components/App/styled';

export const title = 'РМД';

export function RmdHead() {
  return <>
    <HtmlTooltip title="Добавить строку {Insert}">
      <IconButton onClick={null}>++</IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить строку {Insert}">
      <IconButton onClick={null}>--</IconButton>
    </HtmlTooltip>
  </>;
}
