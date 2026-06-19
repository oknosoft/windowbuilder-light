import React from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import FindIcon from '@mui/icons-material/FindInPage';
import {HtmlTooltip} from '../../aggregate/App/styled';

export default function BtnOrigin(props) {
  return <>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Показать элемент технологического справочника">
      <IconButton onClick={props.handleOpen}><FindIcon /></IconButton>
    </HtmlTooltip>
  </>;
}
