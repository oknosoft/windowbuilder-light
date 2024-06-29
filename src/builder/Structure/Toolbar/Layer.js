import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
import {useBuilderContext} from '../../Context';

// style={{fontFamily: 'GOST type B'}}

export default function LayerToolbar({project, layer, setContext}) {
  const addFlap = () => {
    //setContext({stamp: project.props.stamp, tool: editor.tool});
  };
  const removeFlap = () => {
    const {props} = project;
    const parent = layer.layer;
    parent?.activate();
    layer.remove();
    project.redraw();
    project.zoomFit();
    setContext({layer: parent || null, stamp: props.stamp});
  };
  return <Toolbar disableGutters>
    <HtmlTooltip title="Добавить створку">
      <IconButton onClick={addFlap}><i className="fa fa-file-o" /></IconButton>
    </HtmlTooltip>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить текуший слой">
      <IconButton onClick={removeFlap}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
