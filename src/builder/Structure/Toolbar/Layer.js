import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import AddchartOutlinedIcon from '@mui/icons-material/AddchartOutlined';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useBuilderContext} from '../../Context';

// style={{fontFamily: 'GOST type B'}}

export default function LayerToolbar({project, layer, setContext}) {
  const addRoot = () => {
    const layer= project.addLayer();
    project.redraw();
    setContext({stamp: project.props.stamp, layer, elm: null});
  };
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
    <HtmlTooltip title="Добавить слой рамы">
      <IconButton onClick={addRoot}><AddPhotoAlternateOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить слой створки">
      <IconButton onClick={addFlap}><LibraryAddOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить виртуальный слой">
      <IconButton disabled onClick={addFlap}><AddchartOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить вложенное изделие">
      <IconButton disabled onClick={addFlap}><AddHomeWorkOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить заполнение">
      <IconButton onClick={addFlap}><AddBoxOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить текуший слой">
      <IconButton onClick={removeFlap}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
