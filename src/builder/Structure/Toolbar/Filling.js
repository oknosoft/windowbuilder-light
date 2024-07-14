import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import AddLayer from './AddLayer';


export default function FillingToolbar({editor, project, layer, elm, setContext}) {

  const remove = () => {
    elm?.remove();
    project?.redraw();
  }

  return <Toolbar disableGutters>
    <AddLayer project={project} layer={layer} elm={elm} />
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить элемент">
      <IconButton onClick={remove}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
