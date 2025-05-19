import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddLayer from './AddLayer';

// style={{fontFamily: 'GOST type B'}}

export default function RootToolbar(props) {

  const {project} = props;
  const clear = () => {
    project.clear();
    project.redraw();
  };

  return <>
    <AddLayer {...props} />
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Очистить изделие">
      <IconButton disabled={!project} onClick={clear}><i className="fa fa-eraser" /></IconButton>
    </HtmlTooltip>
  </>;
}
