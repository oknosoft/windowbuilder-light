import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddLayer from './AddLayer';

// style={{fontFamily: 'GOST type B'}}

export default function RootToolbar(props) {

  return <>
    <AddLayer {...props} />
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить изделие">
      <IconButton disabled><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </>;
}
